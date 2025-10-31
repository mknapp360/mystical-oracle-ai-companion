import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const config = {
  runtime: 'edge',
};

interface PathwayInfo {
  letter: string;
  from: string;
  to: string;
  status: 'connected' | 'to_unlit' | 'isolated';
}

interface DivineUtterance {
  utterance_date: string;
  graph: {
    illuminated_sephiroth: string[];
    unlit_sephiroth: string[];
    illuminated_paths: PathwayInfo[];
  };
  options: {
    mode: 'explicit' | 'infer_connections';
    gematria_method: 'mispar_hechrechi';
    include_working: boolean;
    include_structure_note: boolean;
  };
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
    });
  }

  try {
    const body = await req.json();
    const { activePlanets, pathActivations } = body;

    if (!activePlanets || !pathActivations) {
      return new Response(JSON.stringify({ error: 'Invalid request payload' }), {
        status: 400,
      });
    }

    // Generate the divine utterance in the required format
    const divineUtterance = generateDivineUtterance(activePlanets, pathActivations);

    // Build the Euclid prompt
    const prompt = JSON.stringify(divineUtterance, null, 2);

    // Send to OpenAI with the Euclid system prompt
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: EUCLID_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.85,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    const euclidResponse = JSON.parse(responseText);

    // Extract the final_interpretation for the Active Pathways section
    const finalInterpretation = euclidResponse.final_interpretation || 'No interpretation generated.';

    return new Response(
      JSON.stringify({
        final_interpretation: finalInterpretation,
        full_response: euclidResponse,
        divine_utterance: divineUtterance,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('OpenAI API error:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch divine interpretation' }), {
      status: 500,
    });
  }
}

const EUCLID_SYSTEM_PROMPT = `You are Euclid, a Kabbalistic interpreter.
Input: Either (A) an ordered list of tokens (Hebrew path letters + Sephiroth) with options, or (B) a graph object giving illuminated sephiroth, unlit sephiroth, and illuminated paths (with endpoints and status). If mode=infer_connections, infer edges from the Golden Dawn map:
- Cheth: Binah–Geburah
- Zain: Binah–Tiphereth
- Lamed: Geburah–Tiphereth
- Nun: Netzach–Tiphereth
- Tzaddi: Netzach–Yesod
- Samech: Yesod–Tiphereth
- Qoph: Netzach–Malkuth
(Use these unless explicit paths are provided.)

Tasks:
1) Build a connection-aware model:
   - Mark each illuminated Sephirah as "connected" if it has ≥1 illuminated edge to another illuminated Sephirah; otherwise "stranded".
   - For each illuminated path, mark:
       "connected" if both endpoints illuminated,
       "to_unlit" if one endpoint unlit,
       "isolated" if neither endpoint illuminated.
   - Compute the largest connected subgraph of illuminated nodes and edges ("connected_component").

2) Produce:
   a) "symbolic_reading": 4–8 poetic lines reflecting BOTH illumination and (dis)connection.
   b) "final_interpretation": 2–4 practical sentences describing what to do now (repair channels, ground, ritual steps, etc.).
   c) "divine_key":
        - "sum_overall": gematria sum of ALL illuminated tokens (letters + illuminated sephiroth), regardless of connection.
        - "sum_connected": gematria sum of ONLY tokens inside the largest connected_component (exclude stranded nodes and edges leading to unlit nodes).
        - For each sum, include digit_root (digital sum to 1–9) and a brief meaning keyed to that root.
        - If include_working=true, list per-token values used in each sum.

Assumptions:
- Letter values (mispar_hechrechi): Aleph=1, Beth=2, Gimel=3, Daleth=4, He=5, Vav=6, Zain=7, Cheth=8, Teth=9, Yod=10, Kaph=20, Lamed=30, Mem=40, Nun=50, Samech=60, Ayin=70, Peh=80, Tzaddi=90, Qoph=100, Resh=200, Shin=300, Tav=400.
- Sephiroth values: Kether=620, Chokmah=73, Binah=67, Chesed=72, Geburah=216, Tiphereth=1081, Netzach=148, Hod=15, Yesod=80, Malkuth=496, Daath=474.
- Only include sephiroth marked illuminated; do not include unlit sephiroth in any sum.

Output strictly as JSON:
{
  "structure_note": string?,  // present if include_structure_note=true
  "graph_summary": {
    "sephiroth": [{ "name": string, "state": "connected" | "stranded" }],
    "paths": [{ "letter": string, "from": string, "to": string, "state": "connected" | "to_unlit" | "isolated" }],
    "connected_component": {
      "sephiroth": string[],
      "paths": string[]  // list of path letters included (repeat letters if multiple instances)
    }
  },
  "symbolic_reading": string,
  "final_interpretation": string,
  "divine_key": {
    "sum_overall": { "total": number, "digit_root": number, "meaning": string },
    "sum_connected": { "total": number, "digit_root": number, "meaning": string },
    "working"?: {
      "overall": { "letters": [{ "token": string, "value": number }], "sephiroth": [{ "token": string, "value": number }] },
      "connected": { "letters": [{ "token": string, "value": number }], "sephiroth": [{ "token": string, "value": number }] }
    }
  }
}`;

function generateDivineUtterance(
  activePlanets: Record<string, { sign: string; house: string; sephirah: string; world: string }>,
  pathActivations: Array<{
    sephirah1: string;
    sephirah2: string;
    planets: [string, string];
    aspectType: string;
    illumination: 'full' | 'partial' | 'shadow';
    hebrewLetter?: string;
  }>
): DivineUtterance {
  // All possible Sephiroth
  const allSephiroth = [
    'Kether',
    'Chokmah',
    'Binah',
    'Daath',
    'Chesed',
    'Geburah',
    'Tiphereth',
    'Netzach',
    'Hod',
    'Yesod',
    'Malkuth',
  ];

  // Determine which Sephiroth are illuminated
  const illuminatedSephiroth = new Set<string>();
  Object.values(activePlanets).forEach((planet) => {
    illuminatedSephiroth.add(planet.sephirah);
  });

  const illuminatedList = allSephiroth.filter((s) => illuminatedSephiroth.has(s));
  const unlitList = allSephiroth.filter((s) => !illuminatedSephiroth.has(s));

  // Build the illuminated paths in the required format
  const illuminatedPaths: PathwayInfo[] = pathActivations.map((path) => {
    const fromIlluminated = illuminatedSephiroth.has(path.sephirah1);
    const toIlluminated = illuminatedSephiroth.has(path.sephirah2);

    let status: 'connected' | 'to_unlit' | 'isolated';
    if (fromIlluminated && toIlluminated) {
      status = 'connected';
    } else if (fromIlluminated || toIlluminated) {
      status = 'to_unlit';
    } else {
      status = 'isolated';
    }

    return {
      letter: path.hebrewLetter || 'Unknown',
      from: path.sephirah1,
      to: path.sephirah2,
      status,
    };
  });

  // Generate today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return {
    utterance_date: today,
    graph: {
      illuminated_sephiroth: illuminatedList,
      unlit_sephiroth: unlitList,
      illuminated_paths: illuminatedPaths,
    },
    options: {
      mode: 'explicit',
      gematria_method: 'mispar_hechrechi',
      include_working: true,
      include_structure_note: true,
    },
  };
}