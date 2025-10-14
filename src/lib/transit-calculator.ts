// src/lib/transit-calculator.ts

import { calculateAspect, type PlanetaryAspect, ASPECT_DEFINITIONS } from './aspect-calculator';
import { PLANETARY_SEPHIROT } from './sephirotic-correspondences';

export interface TransitAspect {
  transitPlanet: string;
  natalPlanet: string;
  aspectType: string;
  orb: number;
  transitSephirah: string;
  natalSephirah: string;
  meaning: string;
  intensity: 'strong' | 'moderate' | 'weak';
}

// Calculate aspects between transiting planets and natal planets
export function calculateTransitAspects(
  transitPlanets: Record<string, { sign: string; degree_in_sign: number; house: string }>,
  natalPlanets: Record<string, { sign: string; degree_in_sign: number; house: string }>
): TransitAspect[] {
  const aspects: TransitAspect[] = [];

  // For each transiting planet
  Object.entries(transitPlanets).forEach(([transitPlanet, transitData]) => {
    const transitSephirah = PLANETARY_SEPHIROT[transitPlanet]?.name;
    if (!transitSephirah) return;

    // Check aspects to each natal planet
    Object.entries(natalPlanets).forEach(([natalPlanet, natalData]) => {
      const natalSephirah = PLANETARY_SEPHIROT[natalPlanet]?.name;
      if (!natalSephirah) return;

      const aspect = calculateAspect(
        transitPlanet,
        transitData,
        natalPlanet,
        natalData,
        transitSephirah,
        natalSephirah
      );

      if (aspect) {
        // Determine intensity based on orb tightness
        let intensity: 'strong' | 'moderate' | 'weak';
        const orbPercentage = aspect.orb / ASPECT_DEFINITIONS[aspect.type].orb;
        
        if (orbPercentage < 0.3) intensity = 'strong';
        else if (orbPercentage < 0.6) intensity = 'moderate';
        else intensity = 'weak';

        aspects.push({
          transitPlanet,
          natalPlanet,
          aspectType: aspect.type,
          orb: aspect.orb,
          transitSephirah,
          natalSephirah,
          meaning: generateTransitMeaning(transitPlanet, natalPlanet, aspect.type),
          intensity
        });
      }
    });
  });

  // Sort by intensity and orb
  return aspects.sort((a, b) => {
    const intensityOrder = { strong: 0, moderate: 1, weak: 2 };
    if (intensityOrder[a.intensity] !== intensityOrder[b.intensity]) {
      return intensityOrder[a.intensity] - intensityOrder[b.intensity];
    }
    return a.orb - b.orb;
  });
}

// Generate meaningful interpretation for transit aspects
function generateTransitMeaning(transitPlanet: string, natalPlanet: string, aspectType: string): string {
  const meanings: Record<string, Record<string, string>> = {
    conjunction: {
      'Sun-Sun': 'Solar return energy - a year of new beginnings and self-renewal',
      'Moon-Moon': 'Lunar return - emotional cycles complete and renew',
      'Saturn-Sun': 'Saturn return to natal Sun - taking responsibility for your identity',
      'Jupiter-Jupiter': 'Jupiter return - expansion and blessing cycle completes',
      'Saturn-Saturn': 'Saturn return - the great maturation, reaping what you\'ve sown',
    },
    opposition: {
      'Sun-Moon': 'Full Moon energy in your chart - illumination of inner/outer balance',
      'Saturn-Sun': 'Saturn opposes your natal Sun - testing your foundations',
      'Mars-Mars': 'Mars opposition - confronting your will and desires',
    },
    trine: {
      'Jupiter-Sun': 'Jupiter trines your Sun - blessings flow to your core identity',
      'Venus-Venus': 'Venus trine - harmonious relationships and pleasure',
      'Sun-Moon': 'Emotional and conscious self flow in harmony',
    },
    square: {
      'Saturn-Sun': 'Saturn squares your Sun - friction creates growth in identity',
      'Mars-Mars': 'Mars square - dynamic tension in how you assert yourself',
      'Pluto-Sun': 'Pluto squares your Sun - deep transformation of self',
    },
    sextile: {
      'Jupiter-Venus': 'Jupiter sextiles Venus - opportunities for love and abundance',
      'Mercury-Mercury': 'Mental connections and communication opportunities',
      'Sun-Mars': 'Opportunities to assert yourself with confidence',
    }
  };

  const key = `${transitPlanet}-${natalPlanet}`;
  if (meanings[aspectType] && meanings[aspectType][key]) {
    return meanings[aspectType][key];
  }

  // Fallback generic meaning
  const aspectDef = ASPECT_DEFINITIONS[aspectType as keyof typeof ASPECT_DEFINITIONS];
  return `Transit ${transitPlanet} ${aspectDef?.symbol} Natal ${natalPlanet}: ${aspectDef?.meaning}`;
}

// Generate personalized divine message based on transits
export function generatePersonalizedTransitMessage(
  transitAspects: TransitAspect[],
  dominantWorld: string
): {
  title: string;
  personalizedOpening: string;
  keyTransits: string[];
  soulWork: string;
} {
  const strongAspects = transitAspects.filter(a => a.intensity === 'strong').slice(0, 3);
  
  let title = 'Your Personal Sky Today';
  if (strongAspects.length > 2) {
    title = 'A Day of Powerful Transits - Major Shifts Underway';
  } else if (strongAspects.some(a => a.aspectType === 'conjunction')) {
    title = 'Cosmic Alignment - Transits Meet Your Natal Sky';
  }

  let personalizedOpening = '';
  if (strongAspects.length === 0) {
    personalizedOpening = 'Today\'s transits flow gently across your natal chart. This is a time for integration and rest, allowing recent shifts to settle into your soul\'s architecture.';
  } else {
    const aspectTypes = strongAspects.map(a => a.aspectType);
    const hasReturns = strongAspects.some(a => a.transitPlanet === a.natalPlanet);
    
    if (hasReturns) {
      personalizedOpening = 'A planetary return is activating your chart today - a cosmic completion and new beginning. The universe invites you to honor the cycles you\'ve completed and consciously step into the next spiral.';
    } else if (aspectTypes.includes('opposition')) {
      personalizedOpening = 'The cosmos presents you with a mirror today - transiting planets oppose points in your natal chart, illuminating what needs balance and integration. This is sacred tension that births wisdom.';
    } else if (aspectTypes.includes('trine')) {
      personalizedOpening = 'Grace flows through your natal chart today. Transiting planets form harmonious angles to your birth positions, opening channels of blessing and effortless manifestation.';
    } else {
      personalizedOpening = 'The celestial bodies transit across sensitive points in your natal chart, activating your soul\'s blueprint. Pay attention to what arises - the universe speaks your personal language today.';
    }
  }

  const keyTransits = strongAspects.map(a => 
    `**${a.transitPlanet} ${ASPECT_DEFINITIONS[a.aspectType as keyof typeof ASPECT_DEFINITIONS]?.symbol} Natal ${a.natalPlanet}** (${a.transitSephirah}↔${a.natalSephirah}): ${a.meaning}`
  );

  let soulWork = 'Today, your personal work is to ';
  if (strongAspects.some(a => a.aspectType === 'square')) {
    soulWork += 'embrace the creative friction in your chart. Where you feel resistance between transits and your natal positions, lean in with consciousness - this is where your growth lives.';
  } else if (strongAspects.some(a => a.aspectType === 'trine' || a.aspectType === 'sextile')) {
    soulWork += 'receive the blessings flowing through your natal chart. Allow grace to work through you without effort or forcing. Trust the harmonious alignments.';
  } else if (strongAspects.some(a => a.transitPlanet === a.natalPlanet)) {
    soulWork += 'honor the completion of a cosmic cycle. Reflect on the journey this planet has taken you on, and consciously set intentions for the next spiral.';
  } else {
    soulWork += 'stay present to how the current sky touches your birth blueprint. Notice what activates, what awakens, what asks to be seen.';
  }

  return {
    title,
    personalizedOpening,
    keyTransits,
    soulWork
  };
}

// Calculate which natal houses are being transited
export function getActiveNatalHouses(
  transitPlanets: Record<string, { sign: string; degree_in_sign: number; house: string }>,
  natalPlanets: Record<string, { sign: string; degree_in_sign: number; house: string }>
): string[] {
  const activeHouses = new Set<string>();
  
  Object.values(transitPlanets).forEach(planet => {
    activeHouses.add(planet.house);
  });

  return Array.from(activeHouses).sort((a, b) => {
    const numA = parseInt(a.replace('House ', ''));
    const numB = parseInt(b.replace('House ', ''));
    return numA - numB;
  });
}