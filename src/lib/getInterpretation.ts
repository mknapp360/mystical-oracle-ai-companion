import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // 🔑 add to .env
  dangerouslyAllowBrowser: true, // ⚠️ this exposes your key to users — only for testing!
});

export async function getTarotInterpretation(question: string, cards: any[]) {
  const prompt = buildTarotPrompt(question, cards);

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a wise and intuitive tarot reader. Interpret spreads using traditional and poetic symbolism.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.85,
  });

  return response.choices[0]?.message?.content || '';
}

function buildTarotPrompt(question: string, cards: any[]) {
  const intro = `A user asked the question: "${question}". You are a tarot reader. Interpret the spread using each card below:\n`;

  const cardInfo = cards
    .map(({ card, orientation }: any, index: number) => {
      const meaning = orientation === 'upright' ? card.uprightMeaning : card.reversedMeaning;
      return `Card ${index + 1}: ${card.name} (${orientation})\nMeaning: ${meaning}\nKeywords: ${card.keywords.join(', ')}\nDescription: ${card.description}`;
    })
    .join('\n\n');

  const outro = `\n\nWrite a clear, poetic interpretation of the spread in 2–3 paragraphs, mentioning the cards and their symbolic message in context of the question.`;

  return `${intro}\n\n${cardInfo}${outro}`;
}