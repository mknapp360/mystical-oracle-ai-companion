// lib/pathInterpretationEngine.ts
// Generates deep transit interpretations by combining path meanings with planet archetypes

import { TREE_PATHS } from './pathActivationCalculator';
import { PLANETARY_SEPHIROT } from './sephirotic-correspondences';

interface TransitInterpretation {
  pathName: string;
  hebrewLetter: string;
  tarotCard: string;
  transitingPlanet: string;
  currentTransitMeaning: string;
  guidancePoints: string[];
  shadowWarning: string;
}

// Planet archetypes for transit interpretation
const PLANET_ARCHETYPES: Record<string, {
  essence: string;
  transitEffect: string;
}> = {
  Sun: {
    essence: 'conscious identity and life force',
    transitEffect: 'illuminating and energizing'
  },
  Moon: {
    essence: 'emotional body and unconscious patterns',
    transitEffect: 'making felt and sensitizing'
  },
  Mercury: {
    essence: 'mental processes and communication',
    transitEffect: 'analyzing and articulating'
  },
  Venus: {
    essence: 'values, relationships, and beauty',
    transitEffect: 'attracting and harmonizing'
  },
  Mars: {
    essence: 'will, desire, and assertive action',
    transitEffect: 'activating and pushing forward'
  },
  Jupiter: {
    essence: 'expansion, wisdom, and opportunity',
    transitEffect: 'amplifying and blessing'
  },
  Saturn: {
    essence: 'structure, limitation, and mastery',
    transitEffect: 'testing and solidifying'
  },
  Uranus: {
    essence: 'revolution, awakening, and breakthrough',
    transitEffect: 'disrupting and liberating'
  },
  Neptune: {
    essence: 'dissolution, mysticism, and transcendence',
    transitEffect: 'dissolving boundaries and inspiring'
  },
  Pluto: {
    essence: 'transformation, power, and rebirth',
    transitEffect: 'purging and regenerating'
  }
};

// Extract shadow meaning from path description
function extractShadowMeaning(pathMeaning: string): string {
  const shadowMatch = pathMeaning.match(/when in shadow[,:]?\s*(.+?)(?:\.|$)/i);
  if (shadowMatch) {
    return shadowMatch[1].trim();
  }
  return 'limiting beliefs may obscure the path\'s gifts';
}

// Extract core path theme (first sentence before "When in shadow")
function extractCoreTheme(pathMeaning: string): string {
  const shadowIndex = pathMeaning.toLowerCase().indexOf('when in shadow');
  if (shadowIndex > -1) {
    return pathMeaning.substring(0, shadowIndex).trim();
  }
  return pathMeaning;
}

export function generateDeepTransitInterpretation(
  pathKey: string, // e.g. "Chesed-Tiphereth"
  transitPlanet: string,
  pathData: { letter: string; tarot: string; meaning: string }
): TransitInterpretation {
  
  const planet = PLANET_ARCHETYPES[transitPlanet];
  const coreTheme = extractCoreTheme(pathData.meaning);
  const shadowMeaning = extractShadowMeaning(pathData.meaning);
  
  // Build the current transit meaning
  const currentTransitMeaning = `Your ${planet.essence} is ${planet.transitEffect} this path. ${coreTheme}. The ${transitPlanet} ${planet.transitEffect.split(' ')[0]}s what your heart already knows but your limiting beliefs have kept in shadow.`;
  
  // Generate guidance points based on planet + path combo
  const guidancePoints = generateGuidancePoints(transitPlanet, pathKey, coreTheme);
  
  // Shadow warning
  const shadowWarning = `Shadow Alert: If ${transitPlanet.toLowerCase()}'s energy feels blocked or heavy, ${shadowMeaning}.`;
  
  return {
    pathName: `${pathKey} (${pathData.letter}/${pathData.tarot})`,
    hebrewLetter: pathData.letter,
    tarotCard: pathData.tarot,
    transitingPlanet: transitPlanet,
    currentTransitMeaning,
    guidancePoints,
    shadowWarning
  };
}

function generateGuidancePoints(
  planet: string,
  pathKey: string,
  coreTheme: string
): string[] {
  const baseGuidance: Record<string, string[]> = {
    Moon: [
      'Trust emotional hunches that point toward "something more"',
      'Notice where feelings of care/service reveal untapped potential',
      'Allow your emotional body to recognize hidden possibilities'
    ],
    Sun: [
      'Consciously embody the path\'s wisdom today',
      'Let your identity express through this sacred connection',
      'Shine light on what has been obscured'
    ],
    Mercury: [
      'Think about and articulate the path\'s teaching',
      'Communicate insights that emerge from this connection',
      'Write, speak, or share what you\'re discovering'
    ],
    Venus: [
      'Find beauty in what this path reveals',
      'Value the relationships that embody this energy',
      'Create something that honors this sacred flow'
    ],
    Mars: [
      'Take action aligned with this path\'s direction',
      'Assert your will through this channel',
      'Move forward with the courage this path provides'
    ],
    Jupiter: [
      'Expand into the abundance this path offers',
      'Teach others what you\'re learning here',
      'Trust the blessings flowing through this connection'
    ],
    Saturn: [
      'Build lasting structures from this path\'s wisdom',
      'Commit to the discipline this channel requires',
      'Master the lessons being presented'
    ],
    Uranus: [
      'Break old patterns that no longer serve this path',
      'Welcome sudden insights and breakthroughs',
      'Revolutionize your understanding of this connection'
    ],
    Neptune: [
      'Surrender to the mystical current flowing here',
      'Dissolve boundaries that limit this path\'s expression',
      'Trust the spiritual guidance coming through'
    ],
    Pluto: [
      'Allow deep transformation of what this path represents',
      'Release what must die for the new to emerge',
      'Embrace the power of regeneration here'
    ]
  };
  
  return baseGuidance[planet] || [
    'Stay present to this path\'s activation',
    'Notice what emerges through this connection',
    'Work consciously with this sacred flow'
  ];
}

// Usage example for PathwayEmanationsDisplay
export function generateAllTransitInterpretations(
  activePlanets: Record<string, { sign: string; sephirah: string; house: string; world: string }>
): TransitInterpretation[] {
  const interpretations: TransitInterpretation[] = [];
  
  // For each planet, find which path it's activating via its sign
  Object.entries(activePlanets).forEach(([planet, data]) => {
    const sign = data.sign;
    
    // Find the path this zodiac sign activates
    const pathKey = findPathKeyForSign(sign);
    if (!pathKey) return;
    
    // You'll need to import TREE_PATHS from your actual pathActivationCalculator
    // For now, we'll create a lookup here
    const pathData = getPathData(pathKey);
    if (!pathData) return;
    
    const interpretation = generateDeepTransitInterpretation(
      pathKey,
      planet,
      pathData
    );
    
    interpretations.push(interpretation);
  });
  
  return interpretations;
}

// Temporary lookup - replace with actual import from pathActivationCalculator
function getPathData(pathKey: string): { letter: string; tarot: string; meaning: string } | null {
  const PATHS: Record<string, { letter: string; tarot: string; meaning: string }> = {
    'Chesed-Tiphereth': { 
      letter: 'Yod', 
      tarot: 'The Hermit', 
      meaning: 'Grace centering in beauty (Virgo). This path is the recognition one has of ideas and circumstances of hidden potential. It is the glimmer of wisdom that is greater than what is currently contained in a persons own self-limiting beliefs, and the realization that there may be more to life. When in shadow, self-limitations take hold and become the obstacle for their life.' 
    },
    // Add other paths as needed
  };
  
  return PATHS[pathKey] || null;
}

// Helper to map zodiac sign to Tree path
function findPathKeyForSign(sign: string): string | null {
  const SIGN_TO_PATH: Record<string, string> = {
    'Aries': 'Chokmah-Tiphereth',
    'Taurus': 'Chokmah-Chesed',
    'Gemini': 'Binah-Tiphereth',
    'Cancer': 'Binah-Geburah',
    'Leo': 'Chesed-Geburah',
    'Virgo': 'Chesed-Tiphereth',
    'Libra': 'Geburah-Tiphereth',
    'Scorpio': 'Tiphereth-Netzach',
    'Sagittarius': 'Tiphereth-Yesod',
    'Capricorn': 'Tiphereth-Hod',
    'Aquarius': 'Netzach-Yesod',
    'Pisces': 'Netzach-Malkuth'
  };
  
  return SIGN_TO_PATH[sign] || null;
}