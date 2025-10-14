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
    synthesis: `${planetSephirah.name} (${planet}) expressing through the path of ${signPath.letterName} (${sign}) in the realm of ${houseManifest.manifestationArea}`
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