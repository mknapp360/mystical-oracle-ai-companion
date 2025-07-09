import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY in env');
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  const { question, cards } = req.body;

  if (!question || !Array.isArray(cards)) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }

  const prompt = buildTarotPrompt(question, cards);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a wise and intuitive tarot reader...',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const interpretation = completion.choices?.[0]?.message?.content || 'No interpretation returned.';
    res.status(200).json({ interpretation });
  } catch (err: any) {
    console.error('OpenAI error:', err?.message || err);
    res.status(500).json({ error: 'OpenAI failed to return interpretation' });
  }
}

function buildTarotPrompt(question: string, cards: any[]) {
  const intro = `A user asked the question: "${question}". You are a tarot reader. Interpret the spread using each card below:\n`;

  const cardInfo = cards
    .map(({ card, orientation }: any, index: number) => {
      const meaning = orientation === 'upright' ? card.uprightMeaning : card.reversedMeaning;
      return `Card ${index + 1}: ${card.name} (${orientation})\nMeaning: ${meaning}\nKeywords: ${card.keywords.join(', ')}\nDescription: ${card.description}`;
    })
    .join('\n\n');

  const outro = `\n\nWrite a clear, poetic interpretation of the spread in 2–3 paragraphs, mentioning the cards and their symbolic message in the context of the question.`;

  return `${intro}\n\n${cardInfo}${outro}`;
}