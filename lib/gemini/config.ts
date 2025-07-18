import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;
let geminiModel: any = null;

function initializeGemini() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }
  return geminiModel;
}

export async function generateChatResponse(messages: Array<{ role: string; content: string }>) {
  const model = initializeGemini();
  const chat = model.startChat({
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
  const model = initializeGemini();
  const prompt = `Based on this gift advisor message: "${lastMessage}"

Generate 7 quick response suggestions that a user might want to say next. These should be natural follow-up questions or clarifications about gifts. Return ONLY a JSON array of strings.

Examples:
- "What about for someone who loves reading?"
- "Something under ₹2000 would be perfect"
- "Do you have traditional options?"
- "What's the budget range?"
- "Sports enthusiast"
- "Tech fan" 
- "What about for kids?"



Make them specific to the context of the last message.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    const suggestions = JSON.parse(text);
    return Array.isArray(suggestions) ? suggestions.slice(0, 4) : [];
  } catch (error) {
    console.error('Failed to parse quick answers:', error);
    return [
      "Tell me more about the recipient",
      "What's your budget?", 
      "Any specific interests?",
      "When do you need it?"
    ];
  }
}

export async function* streamGenerativeResponse(prompt: string) {
  const model = initializeGemini();
  const result = await model.generateContentStream(prompt);
  
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    if (chunkText) {
      yield chunkText;
    }
  }
} 