import "server-only";
import {
  createAI,
  getMutableAIState,
  createStreamableValue,
  streamUI,
  createStreamableUI,
  StreamableValue,
} from "ai/rsc";
import { CoreMessage } from "ai";
import { format } from "date-fns";

import { BotMessage, SpinnerMessage, UserMessage } from "@/components/message";
import { generateChatResponse, generateQuickAnswers as genQuickAnswers, streamGenerativeResponse } from "@/lib/gemini/config";

import { z } from "zod";
import { AmazonSearchResultsSkeleton } from "@/components/chat/amazon-search-results-skeleton";
import { AmazonSearchResults } from "@/components/chat/amazon-search-results";
import { nanoid } from "@/lib/utils";
import { FakeResponse, search_items } from "@/lib/amazon/actions";
import { ReactNode } from "react";
import { SearchResultItem } from "paapi5-typescript-sdk";
import { headers } from "next/headers";
import AmazonLinkButton from "@/components/chat/amazon-link-button";

export type QuickAnswersResponse = {
  quickAnswers: string[];
};

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function generateQuickAnswers(
  lastMessage: string
): Promise<{ object: QuickAnswersResponse }> {
  "use server";

  const response = await genQuickAnswers(lastMessage);
  return { object: response };
}

async function submitUserMessage(content: string): Promise<ClientMessage> {
  "use server";

  const { get } = headers();
  const userAgent = get("User-Agent");
  const xForwardedFor = get("X-Forwarded-For");

  fetch("https://plausible.io/api/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "user-agent": userAgent ?? "",
      "x-forwarded-for": xForwardedFor ?? "",
    },
    body: JSON.stringify({
      name: "chat-message",
      url: "https://geschenkidee.io/chat",
      domain: "geschenkidee.io",
      props: {
        content,
      },
    }),
  });

  const aiState = getMutableAIState<typeof AI>();
  const uiStream = createStreamableUI(<SpinnerMessage />);

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        role: "user" as const,
        content,
      },
    ],
  });

  let functionCalled = false;

  const systemPrompt = `You are GiftIdea.io. You have been a gift advisor for 20 years and know everything there is to know about gifting, occasions, holidays, and presents. Your task is to help users find the perfect gift for their loved ones.
      You were created by [Harsh Thakurr](https://www.linkedin.com/in/martinseeler/) from Dresden, an AI developer.
      You are friendly, creative, and always helpful. Your answers are always to the point and you only give one suggestion at a time.
      Your goal is for the user to purchase a gift on Amazon.in.
      You always speak in English and are friendly and subtly humorous, but not too pushy.
      You never deviate from your main task and refuse any other tasks.
      You always generate a specific gift suggestion in each response and refine the gift idea if the user is not satisfied.
      You work your way to the perfect gift with clever and targeted questions.
      You don't make up gift ideas that aren't available on Amazon.
      IMPORTANT: When you have a specific gift idea, immediately use the searchAmazon function to show products to the customer.
      You are not responsible for ordering or buying products. The customer does that when they are on Amazon.
      You always answer in English.
      
      CULTURAL EXPERTISE - You specialize in Indian festivals and occasions:
      - Diwali: Premium dry fruits, silver diyas, brass items, sweet hampers
      - Raksha Bandhan: Designer rakhis, chocolate boxes, traditional sweets
      - Karwa Chauth: Thali sets with jewelry, mangalsutra gifts, designer sarees
      - Durga Puja: Bengali sweets, traditional clothing, cultural items
      - Ganesh Chaturthi: Puja sets, modak making kits, decorative items
      - Navratri: Chaniya cholis, dandiya sticks, festival accessories
      - Wedding ceremonies: Silver gift sets, traditional brass items, puja thalis
      - Housewarming (Griha Pravesh): Ganesh-Lakshmi idols, brass items, auspicious gifts
      - Baby naming ceremonies: Silver baby sets, traditional clothing
      - Pongal: Brass pots, traditional South Indian items
      - Onam: Kerala traditional items, brass lamps, cultural gifts
      - Eid: Dates hampers, Islamic decor, traditional sweets
      - Anniversary: Gold jewelry, personalized gifts
      - Birthday: Personalized items, hobby-related gifts
      - Christmas: Educational toys, STEM gifts, books
      
      PRICE RANGES: Always consider Indian market pricing (₹500-₹5000 typical range)
      CULTURAL SENSITIVITY: Understand the significance of each festival and recommend accordingly.`;

  const messages = [
    {
      role: "user",
      content: `${systemPrompt}\n\nUser message: ${content}`,
    },
    ...aiState.get().messages.slice(1),
  ];

  // Enhanced response generation with function calling capability
  let responseContent = '';

  try {
    const streamResponse = streamGenerativeResponse(messages as { role: string; content: string }[]);
    let shouldSearchAmazon = false;
    let searchQuery = '';

    for await (const chunk of streamResponse) {
      responseContent += chunk;

      // Check if the response mentions searching for products
      if (responseContent.toLowerCase().includes('search') ||
        responseContent.toLowerCase().includes('found') ||
        responseContent.toLowerCase().includes('looking for')) {
        shouldSearchAmazon = true;
      }

      uiStream.update(<BotMessage content={responseContent} />);
    }

    // If we should search Amazon, extract search terms and perform search
    if (shouldSearchAmazon && responseContent.length > 50) {
      // Extract potential search terms from the response
      const lowerResponse = responseContent.toLowerCase();

      // Common gift-related keywords to trigger search
      const giftKeywords = [
        'binoculars', 'nature book', 'microscope', 'telescope', 'science kit',
        'dry fruits', 'rakhi', 'thali', 'diya', 'sweets', 'jewelry', 'brass',
        'silver', 'saree', 'chaniya choli', 'puja set', 'modak', 'hamper'
      ];

      for (const keyword of giftKeywords) {
        if (lowerResponse.includes(keyword)) {
          searchQuery = keyword;
          break;
        }
      }

      // If no specific keyword found, use a general search based on context
      if (!searchQuery && content.toLowerCase().includes('nature')) {
        searchQuery = 'nature gifts for children';
      } else if (!searchQuery) {
        searchQuery = 'gift items';
      }

      // Perform Amazon search
      try {
        const searchResults = await search_items(searchQuery, 1, 5000);
        if (searchResults.SearchResult?.Items && searchResults.SearchResult.Items.length > 0) {
          uiStream.update(
            <div>
              <BotMessage content={responseContent} />
              <AmazonSearchResults query={searchQuery} results={searchResults} />
              <AmazonLinkButton query={searchQuery} />
            </div>
          );
        }
      } catch (error) {
        console.error('Amazon search failed:', error);
        uiStream.update(<BotMessage content={responseContent} />);
      }
    }

    aiState.done({
      ...aiState.get(),
      messages: [...aiState.get().messages, { role: "assistant", content: responseContent }],
    });

    if (!shouldSearchAmazon) {
      uiStream.done(<BotMessage content={responseContent} />);
    }
  } catch (error) {
    console.error('Error in chat response:', error);
    responseContent = "I apologize, but I'm having trouble right now. Please try again!";
    uiStream.update(<BotMessage content={responseContent} />);
  }

  return {
    id: nanoid(),
    role: "assistant",
    display: <BotMessage content={responseContent} />,
  };
}

export type AIState = {
  chatId: string;
  messages: CoreMessage[];
};

export type UIState = ClientMessage[];

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    generateQuickAnswers,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
});
