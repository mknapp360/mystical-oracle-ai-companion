// src/lib/sephirotic-correspondences.ts

export interface Sephirah {
  name: string;
  hebrew: string;
  meaning: string;
  archetype: string;
  color: string;
  world: 'Atziluth' | 'Briah' | 'Yetzirah' | 'Assiah';
}

export interface PlanetarySephirah extends Sephirah {
  planet: string;
  influence: string;
}

// Traditional Planetary-Sephirotic Correspondences
// Based on Sefer Yetzirah, Zohar, and Hermetic Qabalah
export const PLANETARY_SEPHIROT: Record<string, PlanetarySephirah> = {
  Sun: {
    name: 'Tiphereth',
    hebrew: 'תִּפְאֶרֶת',
    meaning: 'Beauty / Harmony',
    archetype: 'The Heart Center',
    planet: 'Sun',
    influence: 'Consciousness, balance, integration of opposites, the authentic self',
    color: '#FFD700',
    world: 'Yetzirah'
  },
  Moon: {
    name: 'Yesod',
    hebrew: 'יְסוֹד',
    meaning: 'Foundation',
    archetype: 'The Subconscious Gateway',
    planet: 'Moon',
    influence: 'Dreams, intuition, emotional patterns, connection to the collective unconscious',
    color: '#9370DB',
    world: 'Yetzirah'
  },
  Mercury: {
    name: 'Hod',
    hebrew: 'הוֹד',
    meaning: 'Splendor / Glory',
    archetype: 'Intellect & Communication',
    planet: 'Mercury',
    influence: 'Rational mind, language, analysis, intellectual understanding, magic',
    color: '#FF8C00',
    world: 'Yetzirah'
  },
  Venus: {
    name: 'Netzach',
    hebrew: 'נֶצַח',
    meaning: 'Victory / Eternity',
    archetype: 'Emotion & Desire',
    planet: 'Venus',
    influence: 'Love, art, beauty, instinct, victory through persistence',
    color: '#32CD32',
    world: 'Yetzirah'
  },
  Mars: {
    name: 'Geburah',
    hebrew: 'גְּבוּרָה',
    meaning: 'Strength / Severity',
    archetype: 'Divine Power',
    planet: 'Mars',
    influence: 'Will, discipline, boundaries, destruction of the old, courageous action',
    color: '#DC143C',
    world: 'Briah'
  },
  Jupiter: {
    name: 'Chesed',
    hebrew: 'חֶסֶד',
    meaning: 'Mercy / Loving-kindness',
    archetype: 'Divine Grace',
    planet: 'Jupiter',
    influence: 'Expansion, generosity, abundance, wisdom, spiritual growth',
    color: '#4169E1',
    world: 'Briah'
  },
  Saturn: {
    name: 'Binah',
    hebrew: 'בִּינָה',
    meaning: 'Understanding',
    archetype: 'The Divine Mother',
    planet: 'Saturn',
    influence: 'Form, structure, limitation, maturity, deep wisdom through experience',
    color: '#000000',
    world: 'Briah'
  },
  Uranus: {
    name: 'Chokmah',
    hebrew: 'חָכְמָה',
    meaning: 'Wisdom',
    archetype: 'The Divine Father',
    planet: 'Uranus',
    influence: 'Revolution, inspiration, breakthrough, cosmic consciousness, pure potential',
    color: '#C0C0C0',
    world: 'Atziluth'
  },
  Neptune: {
    name: 'Kether',
    hebrew: 'כֶּתֶר',
    meaning: 'Crown',
    archetype: 'The Divine Unity',
    planet: 'Neptune',
    influence: 'Transcendence, dissolution of ego, mystical union, divine inspiration',
    color: '#FFFFFF',
    world: 'Atziluth'
  },
  Pluto: {
    name: 'Daath',
    hebrew: 'דַּעַת',
    meaning: 'Knowledge',
    archetype: 'The Hidden Sephirah',
    planet: 'Pluto',
    influence: 'Transformation, shadow work, death and rebirth, occult knowledge',
    color: '#4B0082',
    world: 'Yetzirah'
  }
};

// Zodiac Sign to Hebrew Letter & Path Correspondences
export const ZODIAC_PATHS: Record<string, {
  hebrewLetter: string;
  letterName: string;
  pathNumber: number;
  connects: [string, string];
  meaning: string;
}> = {
  Aries: {
    hebrewLetter: 'ה',
    letterName: 'Heh',
    pathNumber: 15,
    connects: ['Chokmah', 'Tiphereth'],
    meaning: 'The Window - Divine sight and vision'
  },
  Taurus: {
    hebrewLetter: 'ו',
    letterName: 'Vav',
    pathNumber: 16,
    connects: ['Chokmah', 'Chesed'],
    meaning: 'The Nail - Connection and manifestation'
  },
  Gemini: {
    hebrewLetter: 'ז',
    letterName: 'Zayin',
    pathNumber: 17,
    connects: ['Binah', 'Tiphereth'],
    meaning: 'The Sword - Discrimination and choice'
  },
  Cancer: {
    hebrewLetter: 'ח',
    letterName: 'Cheth',
    pathNumber: 18,
    connects: ['Binah', 'Geburah'],
    meaning: 'The Fence - Protection and boundaries'
  },
  Leo: {
    hebrewLetter: 'ט',
    letterName: 'Teth',
    pathNumber: 19,
    connects: ['Chesed', 'Geburah'],
    meaning: 'The Serpent - Primal life force'
  },
  Virgo: {
    hebrewLetter: 'י',
    letterName: 'Yod',
    pathNumber: 20,
    connects: ['Chesed', 'Tiphereth'],
    meaning: 'The Hand - Divine action and service'
  },
  Libra: {
    hebrewLetter: 'ל',
    letterName: 'Lamed',
    pathNumber: 22,
    connects: ['Geburah', 'Tiphereth'],
    meaning: 'The Ox Goad - Justice and balance'
  },
  Scorpio: {
    hebrewLetter: 'נ',
    letterName: 'Nun',
    pathNumber: 24,
    connects: ['Tiphereth', 'Netzach'],
    meaning: 'The Fish - Death, transformation, regeneration'
  },
  Sagittarius: {
    hebrewLetter: 'ס',
    letterName: 'Samekh',
    pathNumber: 25,
    connects: ['Tiphereth', 'Yesod'],
    meaning: 'The Prop - Divine support and temperance'
  },
  Capricorn: {
    hebrewLetter: 'ע',
    letterName: 'Ayin',
    pathNumber: 26,
    connects: ['Tiphereth', 'Hod'],
    meaning: 'The Eye - Material manifestation'
  },
  Aquarius: {
    hebrewLetter: 'צ',
    letterName: 'Tzaddi',
    pathNumber: 28,
    connects: ['Netzach', 'Yesod'],
    meaning: 'The Fish Hook - Meditation and insight'
  },
  Pisces: {
    hebrewLetter: 'ק',
    letterName: 'Qoph',
    pathNumber: 29,
    connects: ['Netzach', 'Malkuth'],
    meaning: 'The Back of the Head - Dreams and illusion'
  }
};

// House to Sephirotic Manifestation
export const HOUSE_SEPHIROT: Record<string, {
  primarySephirah: string;
  manifestationArea: string;
  kabbalisticMeaning: string;
}> = {
  'House 1': {
    primarySephirah: 'Malkuth',
    manifestationArea: 'Physical presence & identity',
    kabbalisticMeaning: 'The Kingdom - Your embodied self in the material world'
  },
  'House 2': {
    primarySephirah: 'Yesod',
    manifestationArea: 'Resources & values',
    kabbalisticMeaning: 'Foundation - What supports and sustains you'
  },
  'House 3': {
    primarySephirah: 'Hod',
    manifestationArea: 'Communication & learning',
    kabbalisticMeaning: 'Splendor - The mental realm and intellectual exchange'
  },
  'House 4': {
    primarySephirah: 'Binah',
    manifestationArea: 'Home & roots',
    kabbalisticMeaning: 'Understanding - The foundation of your inner world'
  },
  'House 5': {
    primarySephirah: 'Tiphereth',
    manifestationArea: 'Creativity & self-expression',
    kabbalisticMeaning: 'Beauty - The heart\'s creative overflow'
  },
  'House 6': {
    primarySephirah: 'Netzach',
    manifestationArea: 'Service & daily work',
    kabbalisticMeaning: 'Victory - Persistence in daily practice'
  },
  'House 7': {
    primarySephirah: 'Chesed',
    manifestationArea: 'Relationships & partnerships',
    kabbalisticMeaning: 'Mercy - Grace in relationship with others'
  },
  'House 8': {
    primarySephirah: 'Geburah',
    manifestationArea: 'Transformation & shared resources',
    kabbalisticMeaning: 'Strength - Power through deep change'
  },
  'House 9': {
    primarySephirah: 'Chokmah',
    manifestationArea: 'Philosophy & expansion',
    kabbalisticMeaning: 'Wisdom - Higher knowledge and vision'
  },
  'House 10': {
    primarySephirah: 'Kether',
    manifestationArea: 'Career & public life',
    kabbalisticMeaning: 'Crown - Your highest calling manifested'
  },
  'House 11': {
    primarySephirah: 'Daath',
    manifestationArea: 'Community & aspirations',
    kabbalisticMeaning: 'Knowledge - Collective consciousness and hidden connections'
  },
  'House 12': {
    primarySephirah: 'Malkuth',
    manifestationArea: 'Unconscious & spirituality',
    kabbalisticMeaning: 'Kingdom - The hidden realm before manifestation'
  }
};

// Synthesize contextual interpretation based on planet, sign, and house
export const synthesizeInfluence = (planet: string, sign: string, house: string): string => {
  const planetSephirah = PLANETARY_SEPHIROT[planet];
  const signPath = ZODIAC_PATHS[sign];
  const houseManifest = HOUSE_SEPHIROT[house];

  if (!planetSephirah || !signPath || !houseManifest) {
    return planetSephirah?.influence || '';
  }

  // Create contextual interpretation by combining all three elements
  const templates: Record<string, (s: PlanetarySephirah, z: typeof signPath, h: typeof houseManifest) => string> = {
    Sun: (s, z, h) => `${s.name}'s radiant consciousness expresses through ${z.meaning.toLowerCase()}, bringing ${z.letterName}'s quality of clarity to ${h.manifestationArea.toLowerCase()}`,
    
    Moon: (s, z, h) => `${s.name}'s intuitive foundation flows through ${z.meaning.toLowerCase()}, channeling ${z.letterName}'s emotional wisdom into ${h.manifestationArea.toLowerCase()}`,
    
    Mercury: (s, z, h) => `${s.name}'s intellectual splendor communicates through ${z.meaning.toLowerCase()}, applying ${z.letterName}'s mental acuity to ${h.manifestationArea.toLowerCase()}`,
    
    Venus: (s, z, h) => `${s.name}'s eternal victory manifests through ${z.meaning.toLowerCase()}, bringing ${z.letterName}'s beauty and desire to ${h.manifestationArea.toLowerCase()}`,
    
    Mars: (s, z, h) => `${s.name}'s divine strength acts through ${z.meaning.toLowerCase()}, directing ${z.letterName}'s willpower toward ${h.manifestationArea.toLowerCase()}`,
    
    Jupiter: (s, z, h) => `${s.name}'s boundless mercy expands through ${z.meaning.toLowerCase()}, showering ${z.letterName}'s grace upon ${h.manifestationArea.toLowerCase()}`,
    
    Saturn: (s, z, h) => `${s.name}'s profound understanding structures through ${z.meaning.toLowerCase()}, applying ${z.letterName}'s discipline to ${h.manifestationArea.toLowerCase()}`,
    
    Uranus: (s, z, h) => `${s.name}'s cosmic wisdom revolutionizes through ${z.meaning.toLowerCase()}, awakening ${z.letterName}'s breakthrough potential in ${h.manifestationArea.toLowerCase()}`,
    
    Neptune: (s, z, h) => `${s.name}'s transcendent unity dissolves through ${z.meaning.toLowerCase()}, infusing ${z.letterName}'s mystical essence into ${h.manifestationArea.toLowerCase()}`,
    
    Pluto: (s, z, h) => `${s.name}'s hidden knowledge transforms through ${z.meaning.toLowerCase()}, revealing ${z.letterName}'s deep power within ${h.manifestationArea.toLowerCase()}`
  };

  const templateFn = templates[planet];
  if (templateFn) {
    return templateFn(planetSephirah, signPath, houseManifest);
  }

  // Fallback
  return `${planetSephirah.name}'s energy expresses through ${sign} in ${house}`;
};

// Helper function to get Sephirotic interpretation
export const getSephiroticInfluence = (planet: string, sign: string, house: string) => {
  const planetSephirah = PLANETARY_SEPHIROT[planet];
  const signPath = ZODIAC_PATHS[sign];
  const houseManifest = HOUSE_SEPHIROT[house];

  if (!planetSephirah || !signPath || !houseManifest) {
    return null;
  }

  return {
    sephirah: planetSephirah,
    path: signPath,
    manifestation: houseManifest,
    synthesis: synthesizeInfluence(planet, sign, house)
  };
};

// Four Worlds Framework
export type World = 'Atziluth' | 'Briah' | 'Yetzirah' | 'Assiah';

export interface WorldDescription {
  name: World;
  hebrew: string;
  meaning: string;
  realm: string;
  description: string;
  color: string;
}

export const FOUR_WORLDS: Record<World, WorldDescription> = {
  Atziluth: {
    name: 'Atziluth',
    hebrew: 'אֲצִילוּת',
    meaning: 'Emanation / Nearness',
    realm: 'Divine / Archetypal',
    description: 'The world of pure spiritual essence, divine will, and archetypal fire. Where intention exists before form.',
    color: '#FFD700' // Gold
  },
  Briah: {
    name: 'Briah',
    hebrew: 'בְּרִיאָה',
    meaning: 'Creation',
    realm: 'Archangelic / Mental',
    description: 'The world of intellect, ideas, and pure thought. Where divine concepts take their first mental form.',
    color: '#87CEEB' // Sky blue
  },
  Yetzirah: {
    name: 'Yetzirah',
    hebrew: 'יְצִירָה',
    meaning: 'Formation',
    realm: 'Angelic / Emotional',
    description: 'The world of emotions, images, and astral forms. Where thoughts become feelings and psychic structures.',
    color: '#9370DB' // Purple
  },
  Assiah: {
    name: 'Assiah',
    hebrew: 'עֲשִׂיָּה',
    meaning: 'Action / Making',
    realm: 'Material / Physical',
    description: 'The world of physical manifestation and concrete action. Where energy becomes matter and deed.',
    color: '#8B4513' // Earth brown
  }
};

// Elemental correspondences to worlds
const ELEMENT_TO_WORLD: Record<string, World> = {
  Fire: 'Atziluth',    // Pure spiritual will
  Water: 'Briah',      // Mental/emotional flow
  Air: 'Yetzirah',     // Formation and movement
  Earth: 'Assiah'      // Physical manifestation
};

// Get element for zodiac sign
export const getSignElement = (sign: string): string => {
  const fireSigns = ['Aries', 'Leo', 'Sagittarius'];
  const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];
  const airSigns = ['Gemini', 'Libra', 'Aquarius'];
  const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];
  
  if (fireSigns.includes(sign)) return 'Fire';
  if (waterSigns.includes(sign)) return 'Water';
  if (airSigns.includes(sign)) return 'Air';
  if (earthSigns.includes(sign)) return 'Earth';
  return 'Air'; // default
};

// Determine which world a planetary position activates
export const determineWorld = (
  planet: string, 
  sign: string, 
  house: string
): { primary: World; influences: World[]; strength: number } => {
  const houseNumber = parseInt(house.replace('House ', ''));
  const element = getSignElement(sign);
  
  // Weight system: each factor contributes points
  const worldScores: Record<World, number> = {
    Atziluth: 0,
    Briah: 0,
    Yetzirah: 0,
    Assiah: 0
  };

  // 1. PLANETARY NATURE (strongest weight = 3 points)
  const planetaryWorld: Record<string, World> = {
    Neptune: 'Atziluth',   // Pure transcendence
    Uranus: 'Atziluth',    // Revolutionary spirit
    Pluto: 'Atziluth',     // Deep transformation
    Saturn: 'Briah',       // Structured thought
    Jupiter: 'Briah',      // Expansive wisdom
    Mars: 'Yetzirah',      // Emotional/astral will
    Venus: 'Yetzirah',     // Desire and feeling
    Mercury: 'Yetzirah',   // Mental formation
    Sun: 'Yetzirah',       // Conscious ego
    Moon: 'Assiah'         // Physical/emotional body
  };
  
  if (planetaryWorld[planet]) {
    worldScores[planetaryWorld[planet]] += 3;
  }

  // 2. ELEMENTAL NATURE (medium weight = 2 points)
  const elementWorld = ELEMENT_TO_WORLD[element];
  if (elementWorld) {
    worldScores[elementWorld] += 2;
  }

  // 3. HOUSE PLACEMENT (light weight = 1 point)
  if (houseNumber >= 1 && houseNumber <= 3) worldScores.Assiah += 1;
  if (houseNumber >= 4 && houseNumber <= 6) worldScores.Yetzirah += 1;
  if (houseNumber >= 7 && houseNumber <= 9) worldScores.Briah += 1;
  if (houseNumber >= 10 && houseNumber <= 12) worldScores.Atziluth += 1;

  // Find primary world (highest score)
  const sortedWorlds = (Object.entries(worldScores) as [World, number][])
    .sort((a, b) => b[1] - a[1]);
  
  const primaryWorld = sortedWorlds[0][0];
  const primaryStrength = sortedWorlds[0][1];
  
  // Secondary influences (any world with score > 0)
  const influences = sortedWorlds
    .filter(([_, score]) => score > 0)
    .map(([world, _]) => world);

  return {
    primary: primaryWorld,
    influences,
    strength: primaryStrength / 6 // Normalize to 0-1 (max possible = 6)
  };
};

// Calculate overall world activation for current sky
export const calculateWorldActivation = (skyData: any): {
  worldScores: Record<World, number>;
  dominantWorld: World;
  worldPercentages: Record<World, number>;
  interpretation: string;
} => {
  const worldScores: Record<World, number> = {
    Atziluth: 0,
    Briah: 0,
    Yetzirah: 0,
    Assiah: 0
  };

  let totalStrength = 0;

  // Analyze each planet
  Object.entries(skyData.planets).forEach(([planet, data]: [string, any]) => {
    const worldData = determineWorld(planet, data.sign, data.house);
    worldScores[worldData.primary] += worldData.strength;
    totalStrength += worldData.strength;
  });

  // Calculate percentages
  const worldPercentages: Record<World, number> = {
    Atziluth: (worldScores.Atziluth / totalStrength) * 100,
    Briah: (worldScores.Briah / totalStrength) * 100,
    Yetzirah: (worldScores.Yetzirah / totalStrength) * 100,
    Assiah: (worldScores.Assiah / totalStrength) * 100
  };

  // Find dominant world
  const dominantWorld = (Object.entries(worldScores) as [World, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  // Generate interpretation
  const worldDesc = FOUR_WORLDS[dominantWorld];
  const percentage = Math.round(worldPercentages[dominantWorld]);
  
  const interpretation = `The ${worldDesc.name} (${worldDesc.hebrew}) is most illuminated today at ${percentage}%, emphasizing ${worldDesc.realm.toLowerCase()} energies. ${worldDesc.description}`;

  return {
    worldScores,
    dominantWorld,
    worldPercentages,
    interpretation
  };
};

// Generate daily Kabbalistic interpretation
export const generateKabbalisticReading = (skyData: any) => {
  const activeSephirot = new Set<string>();
  const influences: string[] = [];
  const sephirotDetails: Array<{planet: string; sephirah: PlanetarySephirah; sign: string; house: string}> = [];

  // Analyze each planet's position
  Object.entries(skyData.planets).forEach(([planet, data]: [string, any]) => {
    const sephirah = PLANETARY_SEPHIROT[planet];
    if (sephirah) {
      activeSephirot.add(sephirah.name);
      sephirotDetails.push({ planet, sephirah, sign: data.sign, house: data.house });
      
      const influence = getSephiroticInfluence(planet, data.sign, data.house);
      if (influence) {
        influences.push(
          `**${planet} in ${sephirah.name}:** ${sephirah.influence} is expressing through ${data.sign}, activating ${influence.manifestation.kabbalisticMeaning}.`
        );
      }
    }
  });

  // Get the most prominent sephirot based on traditional hierarchy
  const hierarchyOrder = ['Kether', 'Chokmah', 'Binah', 'Chesed', 'Geburah', 'Tiphereth', 'Netzach', 'Hod', 'Yesod', 'Malkuth', 'Daath'];
  const orderedSephirot = sephirotDetails.sort((a, b) => {
    return hierarchyOrder.indexOf(a.sephirah.name) - hierarchyOrder.indexOf(b.sephirah.name);
  });

  return {
    activeSephirot: Array.from(activeSephirot),
    primaryInfluences: influences.slice(0, 3), // Top 3 most significant
    treeActivation: `Today, ${activeSephirot.size} spheres of the Tree of Life are actively illuminated.`,
    sephirotDetails: orderedSephirot
  };
};