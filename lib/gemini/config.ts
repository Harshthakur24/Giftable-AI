import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateChatResponse(messages: Array<{ role: string; content: string }>) {
  const chat = geminiModel.startChat({
    history: messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
    },
  });

  const result = await chat.sendMessage(messages[messages.length - 1].content);
  const response = await result.response;
  return response.text();
}

export async function generateQuickAnswers(lastMessage: string) {
  const prompt = `Based on this gift advisor message: "${lastMessage}"

Generate 4 quick response suggestions that a user might want to say next. These should be natural follow-up questions or clarifications about gifts. Return ONLY a JSON array of strings.

Examples of good quick responses:
- "What's the budget range?"
- "Sports enthusiast"
- "Tech fan" 
- "Something traditional"
- "Show me more options"
- "What about for kids?"

Return format: ["Option 1", "Option 2", "Option 3", "Option 4"]`;
  
  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();
  
  try {
    // Remove any markdown formatting if present
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    const answers = JSON.parse(jsonStr);
    return { quickAnswers: Array.isArray(answers) ? answers.slice(0, 4) : [] };
  } catch (e) {
    console.error('Failed to parse quick answers:', e);
    // Fallback quick answers based on context
    const fallbackAnswers = [
      "What's my budget?",
      "Show me more options",
      "Something traditional",
      "Any other suggestions?"
    ];
    return { quickAnswers: fallbackAnswers };
  }
}

export async function* streamGenerativeResponse(messages: Array<{ role: string; content: string }>) {
  const chat = geminiModel.startChat({
    history: messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
    },
  });

  const result = await chat.sendMessageStream(messages[messages.length - 1].content);
  
  for await (const chunk of result.stream) {
    yield chunk.text();
  }
} 