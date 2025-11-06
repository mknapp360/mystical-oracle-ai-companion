// src/lib/getTreeInsightV2.ts
// Updated utility for Euclid-formatted Tree of Life insights

import { ReactNode } from "react";

export interface EuclidResponse {
  structure_note?: string;
  graph_summary: {
    sephiroth: Array<{
      name: string;
      state: 'connected' | 'stranded';
    }>;
    paths: Array<{
      letter: string;
      from: string;
      to: string;
      state: 'connected' | 'to_unlit' | 'isolated';
    }>;
    connected_component: {
      sephiroth: string[];
      paths: string[];
    };
  };
  symbolic_reading: string;
  final_interpretation: string;
  divine_key: {
    sum_overall: {
      total: number;
      digit_root: number;
      meaning: string;
    };
    sum_connected: {
      total: number;
      digit_root: number;
      meaning: string;
    };
    working?: {
      overall: {
        letters: Array<{ token: string; value: number }>;
        sephiroth: Array<{ token: string; value: number }>;
      };
      connected: {
        letters: Array<{ token: string; value: number }>;
        sephiroth: Array<{ token: string; value: number }>;
      };
    };
  };
}

export interface TreeInsightResponseV2 {
  insight: ReactNode;
  final_interpretation: string;

  treeState: {
    sephiroth: Array<{
      planets: any;
      name: string;
      isIlluminated: boolean;
      isStranded: boolean;
    }>;
    pathways: Array<{
      name: string;                        // e.g., "Hod ↔ Netzach" or similar
      hebrewLetter?: string;               // e.g., "Nun"
      sephirah1: string;                   // "Hod"
      sephirah2: string;                   // "Netzach"
      illuminationType: 'full' | 'partial' | 'shadow';
      isFullyConnected: boolean;
      planets?: string[];                  // for "{path.planets?.join(' ' + path.aspectType + ' ')}"
      aspectType?: string;                 // e.g., "trine", "square"
    }>;
  };

  full_response: EuclidResponse;
  divine_utterance: any;
}

/**
 * Get Euclid's interpretation of the Tree of Life configuration
 * Returns the final_interpretation (for Active Pathways section) plus full response
 */
export async function getTreeInsightV2(
  activePlanets: Record<string, { sign: string; house: string; sephirah: string; world: string }>,
  pathActivations: Array<{
    sephirah1: string;
    sephirah2: string;
    planets: [string, string];
    aspectType: string;
    illumination: 'full' | 'partial' | 'shadow';
    hebrewLetter?: string;
  }>
): Promise<TreeInsightResponseV2> {
  try {
    const response = await fetch('/api/tree-insight-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activePlanets,
        pathActivations,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting tree insight:', error);
    throw error;
  }
}

/**
 * Generate the divine utterance format without calling the API
 * Useful for debugging or displaying the structure
 */
export function generateDivineUtteranceJSON(
  activePlanets: Record<string, { sign: string; house: string; sephirah: string; world: string }>,
  pathActivations: Array<{
    sephirah1: string;
    sephirah2: string;
    planets: [string, string];
    aspectType: string;
    illumination: 'full' | 'partial' | 'shadow';
    hebrewLetter?: string;
  }>
) {
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

  const illuminatedSephiroth = new Set<string>();
  Object.values(activePlanets).forEach((planet) => {
    illuminatedSephiroth.add(planet.sephirah);
  });

  const illuminatedList = allSephiroth.filter((s) => illuminatedSephiroth.has(s));
  const unlitList = allSephiroth.filter((s) => !illuminatedSephiroth.has(s));

  const illuminatedPaths = pathActivations.map((path) => {
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

  const today = new Date().toISOString().split('T')[0];

  return {
    utterance_date: today,
    graph: {
      illuminated_sephiroth: illuminatedList,
      unlit_sephiroth: unlitList,
      illuminated_paths: illuminatedPaths,
    },
    options: {
      mode: 'explicit' as const,
      gematria_method: 'mispar_hechrechi' as const,
      include_working: true,
      include_structure_note: true,
    },
  };
}

/**
 * Calculate summary statistics from Euclid's response
 */
export function calculateEuclidStats(response: EuclidResponse) {
  return {
    totalSephiroth: response.graph_summary.sephiroth.length,
    connectedSephiroth: response.graph_summary.sephiroth.filter((s) => s.state === 'connected').length,
    strandedSephiroth: response.graph_summary.sephiroth.filter((s) => s.state === 'stranded').length,
    totalPaths: response.graph_summary.paths.length,
    connectedPaths: response.graph_summary.paths.filter((p) => p.state === 'connected').length,
    toUnlitPaths: response.graph_summary.paths.filter((p) => p.state === 'to_unlit').length,
    isolatedPaths: response.graph_summary.paths.filter((p) => p.state === 'isolated').length,
    componentSize: response.graph_summary.connected_component.sephiroth.length,
    overallSum: response.divine_key.sum_overall.total,
    connectedSum: response.divine_key.sum_connected.total,
    overallRoot: response.divine_key.sum_overall.digit_root,
    connectedRoot: response.divine_key.sum_connected.digit_root,
  };
}