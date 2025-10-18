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
function getPathData(pathKey: string): { letter: string; hebrew: string; tarot: string; meaning: string } | null {
  const PATHS: Record<string, { letter: string; hebrew: string; tarot: string; meaning: string }> = {
    'Kether-Chokmah':   { letter: 'Aleph',   hebrew: 'א', tarot: 'The Fool',          meaning: 'Divine breath initiating wisdom' },
    'Kether-Binah':     { letter: 'Beth',    hebrew: 'ב', tarot: 'The Magician',       meaning: 'Structure emerging from source' },
    'Kether-Tiphereth': { letter: 'Gimel',   hebrew: 'ג', tarot: 'The High Priestess', meaning: 'Direct divine connection to heart' },
    'Chokmah-Binah':    { letter: 'Daleth',  hebrew: 'ד', tarot: 'The Empress',        meaning: 'Wisdom meets form' },

    // Zodiacal diagonals from the Supernals
    'Chokmah-Tiphereth': { letter: 'He',    hebrew: 'ה', tarot: 'The Emperor',         meaning: 'Cosmic wisdom manifests as order (Aries). This path balances the recognition of power within ones self to create what they want. When in shadow, there is unrecognition of ones power to do so, of a misuse to achieve gains, by yourself or those around you.' },
    'Chokmah-Chesed':    { letter: 'Vav',   hebrew: 'ו', tarot: 'The Hierophant',      meaning: 'Teaching grounds wisdom in grace (Taurus)' },
    'Binah-Tiphereth':   { letter: 'Zain',  hebrew: 'ז', tarot: 'The Lovers',          meaning: 'Understanding guides the heart (Gemini). This path provides recognition that there are multiple understandings and perspectives, and also brings in the reliance on intuition, allowing you to trust the flow of the universe. When in shadow, there is a rejection of intuition and a mistrust that the universe will provide.'},
    'Binah-Geburah':     { letter: 'Cheth', hebrew: 'ח', tarot: 'The Chariot',        meaning: 'Structure requires disciplined strength (Cancer). This path shows the need to create boundaries and processes in order to create focus and drive you want. Form creates the pressure that propels personal drive. If in shadow, it causes desire without direction or force.' },

    // Upper middle triad
    'Chesed-Geburah':    { letter: 'Teth',    hebrew: 'ט', tarot: 'Strength',           meaning: 'Mercy and severity in balance (Leo). This path represents the intelligence of the secret of all the activities of spiritual beings. It is the path where the angels of life and death tread, and also the pathway that introduces one to their other self. It is important to remember that you are a spiritual being, so it applies to you as well. In practical terms, when this path is illuminated it is possible to glimpse the extent of ones capabilities, both good and bad. You may come to recognize the lengths to which you will go to in a situation. It is something one realizes through trial and experience, not theory. If this pathway is shadowed, then you are cut off from recognizing such capabilities, and this recognition becomes an obstacle that must be overcome in your life.' },
    'Chesed-Tiphereth':  { letter: 'Yod',     hebrew: 'י', tarot: 'The Hermit',         meaning: 'Grace centering in beauty (Virgo). This path is the recognition one has of ideas and circumstances of hidden potential. It is the glimmer of wisdom that is greater than what is currently contained in a persons own self-limiting beliefs, and the realization that there may be more to life. When in shadow, self-limitations take hold and become the obstacle for their life.' },
    'Chesed-Netzach':    { letter: 'Kaph',    hebrew: 'כ', tarot: 'Wheel of Fortune',   meaning: 'Expansion into feeling (Jupiter)' },
    'Geburah-Tiphereth': { letter: 'Lamed',   hebrew: 'ל', tarot: 'Justice',            meaning: 'Severity balanced by beauty (Libra) bring the desire for justice in your life. However, to achieve justice, one must ask many questions, which can sometimes rock the boat. You may experience the balance between absolution or closure, and punishment. When in shadow, these are imbalanced by yourself, or others.'},
    'Geburah-Hod':       { letter: 'Mem',     hebrew: 'מ', tarot: 'The Hanged Man',     meaning: 'Discipline yields surrender to deeper insight (Water)' },

    // Central to Netzach/Hod/Yesod
    'Tiphereth-Netzach': { letter: 'Nun',    hebrew: 'נ', tarot: 'Death',            meaning: 'Heart opens to desire via transformation (Scorpio). This path shows that you and those around you are open to change, and the things that come with it. When in shadow, there is resistence, no matter the consequence.' },
    'Tiphereth-Yesod':   { letter: 'Samech', hebrew: 'ס', tarot: 'Temperance',       meaning: 'Truth supported and integrated below (Sagittarius)' },
    'Tiphereth-Hod':     { letter: 'Ayin',   hebrew: 'ע', tarot: 'The Devil',        meaning: 'Consciousness and intellect unite (Capricorn)' },

    // Netzach–Hod pillar + lower triad
    'Netzach-Hod':       { letter: 'Peh',    hebrew: 'פ', tarot: 'The Tower',          meaning: 'Truth shatters illusion (Mars)' },
    'Netzach-Yesod':     { letter: 'Tzaddi', hebrew: 'צ', tarot: 'The Star',          meaning: 'Emotion grounds in foundation (Aquarius). This path shows an awakening of the heart and a harmonizing of what you would like to be and see in the world, with what reality is around you.  When in shadow there is an inability to bring desire into a reality, or the ability to harmonize it in your life.' },
    'Netzach-Malkuth':   { letter: 'Qoph',   hebrew: 'ק', tarot: 'The Moon',          meaning: 'Desire becomes tangible through the imaginal (Pisces). With this path there is a recognition of the self-limitng beliefs one has and be open to experiences to help you overcome them. When in shadow, it can lead to conceit, as you don/t realize how you hold yourself back.' },
    'Hod-Yesod':         { letter: 'Resh',   hebrew: 'ר', tarot: 'The Sun',           meaning: 'Mind descends to unconscious; clarity vitalizes (Sun)' },
    'Hod-Malkuth':       { letter: 'Shin',   hebrew: 'ש', tarot: 'Judgement',         meaning: 'Thought crystallizes in action (Fire/Spirit)' },
    'Yesod-Malkuth':     { letter: 'Tau',    hebrew: 'ת', tarot: 'The World',         meaning: 'Foundation manifests in matter (Saturn/Earth)' },
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