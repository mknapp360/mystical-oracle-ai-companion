// src/lib/pathActivationCalculator.ts
// Calculate which paths on the Tree of Life are activated by natal aspects

import { type PlanetaryAspect } from './aspect-calculator';
import { PLANETARY_SEPHIROT } from './sephirotic-correspondences';
import { type BirthChartData, type PlanetaryPosition } from './birthChartService';

export interface PathActivation {
  sephirah1: string;
  sephirah2: string;
  planets: [string, string];
  aspectType: string;
  quality: 'harmonious' | 'challenging' | 'neutral';
  illumination: 'full' | 'partial' | 'shadow';
  orb: number;
  hebrewLetter?: string;
  tarotCard?: string;
  meaning: string;
}

export interface AspectPattern {
  type: 'grand_trine' | 't_square' | 'grand_cross' | 'stellium' | 'yod' | 'mystic_rectangle';
  planets: string[];
  description: string;
  sephirot: string[];
  guidance: string;
}

export interface RetrogradeTheme {
  planet: string;
  sephirah: string;
  sign: string;
  house: string;
  theme: string;
  guidance: string;
}

// Map Tree of Life paths to Hebrew letters and Tarot
const TREE_PATHS: Record<string, { letter: string; tarot: string; meaning: string }> = {
  'Kether-Chokmah': { letter: 'Aleph', tarot: 'The Fool', meaning: 'Divine breath initiating wisdom' },
  'Kether-Binah': { letter: 'Beth', tarot: 'The Magician', meaning: 'Structure emerging from source' },
  'Kether-Tiphereth': { letter: 'Gimel', tarot: 'The High Priestess', meaning: 'Direct divine connection to heart' },
  'Chokmah-Binah': { letter: 'Daleth', tarot: 'The Empress', meaning: 'Wisdom meets form' },
  'Chokmah-Tiphereth': { letter: 'Vav', tarot: 'The Hierophant', meaning: 'Teaching flows from wisdom' },
  'Chokmah-Chesed': { letter: 'He', tarot: 'The Emperor', meaning: 'Cosmic wisdom manifests as mercy' },
  'Binah-Tiphereth': { letter: 'Zain', tarot: 'The Lovers', meaning: 'Understanding guides the heart' },
  'Binah-Geburah': { letter: 'Cheth', tarot: 'The Chariot', meaning: 'Structure requires discipline' },
  'Chesed-Tiphereth': { letter: 'Yod', tarot: 'The Hermit', meaning: 'Grace centering in beauty' },
  'Chesed-Netzach': { letter: 'Kaph', tarot: 'Wheel of Fortune', meaning: 'Expansion into feeling' },
  'Geburah-Tiphereth': { letter: 'Lamed', tarot: 'Justice', meaning: 'Severity balanced by beauty' },
  'Geburah-Hod': { letter: 'Nun', tarot: 'Death', meaning: 'Discipline of thought' },
  'Tiphereth-Netzach': { letter: 'Samech', tarot: 'Temperance', meaning: 'Heart opens to desire' },
  'Tiphereth-Hod': { letter: 'Ayin', tarot: 'The Devil', meaning: 'Consciousness and intellect unite' },
  'Tiphereth-Yesod': { letter: 'Peh', tarot: 'The Tower', meaning: 'Truth shatters illusion' },
  'Netzach-Yesod': { letter: 'Tzaddi', tarot: 'The Star', meaning: 'Emotion grounds in foundation' },
  'Hod-Yesod': { letter: 'Qoph', tarot: 'The Moon', meaning: 'Mind descends to unconscious' },
  'Yesod-Malkuth': { letter: 'Tau', tarot: 'The World', meaning: 'Foundation manifests in matter' },
  'Netzach-Malkuth': { letter: 'Resh', tarot: 'The Sun', meaning: 'Desire becomes tangible' },
  'Hod-Malkuth': { letter: 'Shin', tarot: 'Judgement', meaning: 'Thought crystallizes in action' },
};

// Get path key (order doesn't matter)
function getPathKey(seph1: string, seph2: string): string {
  const sorted = [seph1, seph2].sort();
  return `${sorted[0]}-${sorted[1]}`;
}

/**
 * Calculate all path activations from natal aspects
 */
export function calculatePathActivations(
  natalAspects: PlanetaryAspect[]
): PathActivation[] {
  const paths: PathActivation[] = [];

  natalAspects.forEach(aspect => {
    const pathKey = getPathKey(aspect.sephirah1, aspect.sephirah2);
    const pathData = TREE_PATHS[pathKey];

    if (!pathData) return;

    paths.push({
      sephirah1: aspect.sephirah1,
      sephirah2: aspect.sephirah2,
      planets: [aspect.planet1, aspect.planet2],
      aspectType: aspect.type,
      quality: aspect.quality,
      illumination: aspect.pathIllumination,
      orb: aspect.orb,
      hebrewLetter: pathData.letter,
      tarotCard: pathData.tarot,
      meaning: pathData.meaning,
    });
  });

  // Sort by illumination (full > partial > shadow) then by orb tightness
  return paths.sort((a, b) => {
    const illumOrder = { full: 0, partial: 1, shadow: 2 };
    if (illumOrder[a.illumination] !== illumOrder[b.illumination]) {
      return illumOrder[a.illumination] - illumOrder[b.illumination];
    }
    return a.orb - b.orb;
  });
}

/**
 * Identify retrograde themes
 */
export function identifyRetrogradeThemes(
  birthChart: BirthChartData
): RetrogradeTheme[] {
  if (!birthChart.planetary_positions) return [];

  const themes: RetrogradeTheme[] = [];
  const retrogradeGuidance: Record<string, { theme: string; guidance: string }> = {
    Mercury: {
      theme: 'Internal Processing & Review',
      guidance: 'Your mind naturally reviews, refines, and processes internally before expressing. Trust your need to think things through deeply.'
    },
    Venus: {
      theme: 'Inner Worth & Self-Love',
      guidance: 'Your values and sense of beauty are cultivated from within. You teach others about authentic self-worth through your journey.'
    },
    Mars: {
      theme: 'Internalized Action & Willpower',
      guidance: 'Your drive works through strategy and careful planning. Anger or passion may need conscious expression rather than impulsive action.'
    },
    Jupiter: {
      theme: 'Philosophical Introspection',
      guidance: 'Growth comes through inner expansion and personal meaning-making. Your wisdom is cultivated through reflection.'
    },
    Saturn: {
      theme: 'Internal Structure & Authority',
      guidance: 'You build authority from within, creating your own rules. Mastery comes through patient self-discipline.'
    },
    Uranus: {
      theme: 'Revolutionary Inner Vision',
      guidance: 'Your rebellion and innovation operate on deep levels. You transform from the inside out, changing paradigms through inner work.'
    },
    Neptune: {
      theme: 'Mystical Withdrawal',
      guidance: 'Your spirituality is deeply personal. Boundaries dissolve inward, creating space for profound inner connection with the divine.'
    },
    Pluto: {
      theme: 'Alchemical Self-Transformation',
      guidance: 'Your power transforms you first. Deep psychological work and shadow integration are your paths to empowerment.'
    }
  };

  Object.entries(birthChart.planetary_positions).forEach(([planet, pos]) => {
    if (pos.isRetrograde && retrogradeGuidance[planet]) {
      const sephirah = PLANETARY_SEPHIROT[planet]?.name || 'Unknown';
      const planetData = birthChart.natal_planets[planet];
      
      themes.push({
        planet,
        sephirah,
        sign: planetData.sign,
        house: planetData.house,
        theme: retrogradeGuidance[planet].theme,
        guidance: retrogradeGuidance[planet].guidance
      });
    }
  });

  return themes;
}

/**
 * Detect major aspect patterns
 */
export function detectAspectPatterns(
  natalAspects: PlanetaryAspect[],
  birthChart: BirthChartData
): AspectPattern[] {
  const patterns: AspectPattern[] = [];

  // Helper: Get all planets in a sign
  const planetsBySign: Record<string, string[]> = {};
  Object.entries(birthChart.natal_planets).forEach(([planet, data]) => {
    if (!planetsBySign[data.sign]) planetsBySign[data.sign] = [];
    planetsBySign[data.sign].push(planet);
  });

  // Detect Stelliums (3+ planets in same sign)
  Object.entries(planetsBySign).forEach(([sign, planets]) => {
    if (planets.length >= 3) {
      const sephirot = planets.map(p => PLANETARY_SEPHIROT[p]?.name).filter(Boolean);
      patterns.push({
        type: 'stellium',
        planets,
        description: `${planets.length} planets concentrated in ${sign}`,
        sephirot,
        guidance: `Intense focus in ${sign}. This stellium creates a powerful energetic vortex where multiple aspects of self merge. The themes of ${sign} are central to your life purpose.`
      });
    }
  });

  // Detect Grand Trines (3 planets in trine, forming triangle)
  const trines = natalAspects.filter(a => a.type === 'trine');
  const trineGroups = findTrianglePatterns(trines);
  
  trineGroups.forEach(group => {
    const sephirot = group.map(p => PLANETARY_SEPHIROT[p]?.name).filter(Boolean);
    patterns.push({
      type: 'grand_trine',
      planets: group,
      description: `Grand Trine: ${group.join(', ')}`,
      sephirot,
      guidance: 'Effortless flow of energy between these three areas. This is a gift that may need conscious activation to avoid complacency. Your natural talents lie here.'
    });
  });

  // Detect T-Squares (opposition with both planets square to a third)
  const oppositions = natalAspects.filter(a => a.type === 'opposition');
  const squares = natalAspects.filter(a => a.type === 'square');
  
  oppositions.forEach(opp => {
    squares.forEach(sq1 => {
      squares.forEach(sq2 => {
        if (sq1 !== sq2 &&
            (sq1.planet1 === opp.planet1 || sq1.planet2 === opp.planet1) &&
            (sq2.planet1 === opp.planet2 || sq2.planet2 === opp.planet2) &&
            (sq1.planet1 === sq2.planet1 || sq1.planet1 === sq2.planet2 || 
             sq1.planet2 === sq2.planet1 || sq1.planet2 === sq2.planet2)) {
          
          const apex = sq1.planet1 === sq2.planet1 || sq1.planet1 === sq2.planet2 
            ? sq1.planet1 : sq1.planet2;
          const planets = [opp.planet1, opp.planet2, apex];
          const sephirot = planets.map(p => PLANETARY_SEPHIROT[p]?.name).filter(Boolean);
          
          // Check if already added
          if (!patterns.some(p => p.type === 't_square' && 
              p.planets.sort().join() === planets.sort().join())) {
            patterns.push({
              type: 't_square',
              planets,
              description: `T-Square: ${planets.join(', ')} (apex: ${apex})`,
              sephirot,
              guidance: `Dynamic tension creates growth. The ${apex} is your point of release - where you must take conscious action to resolve the opposition. This pattern drives achievement.`
            });
          }
        }
      });
    });
  });

  // Detect Grand Cross (2 oppositions forming a cross)
  for (let i = 0; i < oppositions.length; i++) {
    for (let j = i + 1; j < oppositions.length; j++) {
      const opp1 = oppositions[i];
      const opp2 = oppositions[j];
      
      // Check if all 4 planets are in square to each other
      const planets = [opp1.planet1, opp1.planet2, opp2.planet1, opp2.planet2];
      const uniquePlanets = [...new Set(planets)];
      
      if (uniquePlanets.length === 4) {
        const allSquared = uniquePlanets.every(p1 => 
          uniquePlanets.every(p2 => 
            p1 === p2 || 
            natalAspects.some(a => 
              (a.planet1 === p1 && a.planet2 === p2 && (a.type === 'square' || a.type === 'opposition')) ||
              (a.planet1 === p2 && a.planet2 === p1 && (a.type === 'square' || a.type === 'opposition'))
            )
          )
        );
        
        if (allSquared) {
          const sephirot = uniquePlanets.map(p => PLANETARY_SEPHIROT[p]?.name).filter(Boolean);
          patterns.push({
            type: 'grand_cross',
            planets: uniquePlanets,
            description: `Grand Cross: ${uniquePlanets.join(', ')}`,
            sephirot,
            guidance: 'Powerful tension in four directions demands integration. You are here to master balancing opposing forces. This configuration builds extraordinary strength through challenge.'
          });
        }
      }
    }
  }

  return patterns;
}

// Helper function to find triangle patterns (Grand Trines)
function findTrianglePatterns(trines: PlanetaryAspect[]): string[][] {
  const triangles: string[][] = [];
  
  for (let i = 0; i < trines.length; i++) {
    for (let j = i + 1; j < trines.length; j++) {
      for (let k = j + 1; k < trines.length; k++) {
        const t1 = trines[i];
        const t2 = trines[j];
        const t3 = trines[k];
        
        const planets = new Set([
          t1.planet1, t1.planet2,
          t2.planet1, t2.planet2,
          t3.planet1, t3.planet2
        ]);
        
        if (planets.size === 3) {
          triangles.push(Array.from(planets));
        }
      }
    }
  }
  
  return triangles;
}

/**
 * Get summary statistics
 */
export function getPathActivationSummary(paths: PathActivation[]) {
  return {
    total: paths.length,
    fullyIlluminated: paths.filter(p => p.illumination === 'full').length,
    partiallyIlluminated: paths.filter(p => p.illumination === 'partial').length,
    shadowPaths: paths.filter(p => p.illumination === 'shadow').length,
    harmonious: paths.filter(p => p.quality === 'harmonious').length,
    challenging: paths.filter(p => p.quality === 'challenging').length,
    neutral: paths.filter(p => p.quality === 'neutral').length,
  };
}