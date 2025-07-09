import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
    });
  }

  try {
    const body = await req.json();
    const { question, cards } = body;

    if (!question || !Array.isArray(cards)) {
      return new Response(JSON.stringify({ error: 'Invalid request payload' }), {
        status: 400,
      });
    }

    const prompt = buildTarotPrompt(question, cards);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a wise and intuitive tarot reader. Interpret spreads using a kabbalistic framework in a spiritual but practical tone. Mention each card. Limit the interpretation to 200 words.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.85,
    });

    const interpretation = completion.choices[0]?.message?.content || 'No interpretation generated.';
    return new Response(JSON.stringify({ interpretation }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('OpenAI API error:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch interpretation' }), {
      status: 500,
    });
  }
}

function buildTarotPrompt(question: string, cards: any[]) {
  const intro = `A user asked the question: "${question}". You are a tarot reader. Interpret the spread using each card below:\n`;

  const cardInfo = cards
    .map(({ card, orientation }: any, index: number) => {
      const meaning = orientation === 'upright' ? card.uprightMeaning : card.reversedMeaning;
      return `Card ${index + 1}: ${card.name} (${orientation})\nMeaning: ${meaning}\nKeywords: ${card.keywords.join(
        ', '
      )}\nDescription: ${card.description}`;
    })
    .join('\n\n');

  const outro = `\n\nWrite a clear, poetic interpretation of the spread in 2–3 paragraphs, mentioning the cards and their symbolic message in the context of the question.`;

  return `${intro}\n\n${cardInfo}${outro}`;
}