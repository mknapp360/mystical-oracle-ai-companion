// src/lib/aspect-calculator.ts

export type AspectType = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx';
export type AspectQuality = 'harmonious' | 'challenging' | 'neutral';

export interface AspectDefinition {
  type: AspectType;
  angle: number;
  orb: number;
  quality: AspectQuality;
  symbol: string;
  meaning: string;
  kabbalisticEffect: string;
}

export interface PlanetaryAspect {
  planet1: string;
  planet2: string;
  type: AspectType;
  quality: AspectQuality;
  angle: number;
  actualAngle: number;
  orb: number;
  symbol: string;
  meaning: string;
  sephirah1: string;
  sephirah2: string;
  pathIllumination: 'full' | 'partial' | 'shadow';
}

// Traditional aspect definitions
export const ASPECT_DEFINITIONS: Record<AspectType, AspectDefinition> = {
  conjunction: {
    type: 'conjunction',
    angle: 0,
    orb: 8,
    quality: 'neutral',
    symbol: '☌',
    meaning: 'Fusion of energies',
    kabbalisticEffect: 'Two planetary forces merge into one unified expression in a single Sephirah'
  },
  opposition: {
    type: 'opposition',
    angle: 180,
    orb: 8,
    quality: 'challenging',
    symbol: '☍',
    meaning: 'Polarization requiring balance',
    kabbalisticEffect: 'Opposite Sephirot mirror each other, creating tension that demands conscious integration'
  },
  trine: {
    type: 'trine',
    angle: 120,
    orb: 8,
    quality: 'harmonious',
    symbol: '△',
    meaning: 'Effortless flow of energy',
    kabbalisticEffect: 'Divine grace flows freely between Sephirot, illuminating the path with golden light'
  },
  square: {
    type: 'square',
    angle: 90,
    orb: 7,
    quality: 'challenging',
    symbol: '□',
    meaning: 'Dynamic tension and growth',
    kabbalisticEffect: 'Creative friction between Sephirot generates spiritual heat, requiring conscious work'
  },
  sextile: {
    type: 'sextile',
    angle: 60,
    orb: 6,
    quality: 'harmonious',
    symbol: '⚹',
    meaning: 'Opportunity for connection',
    kabbalisticEffect: 'Supportive bridge between Sephirot, opportunities waiting to be activated'
  },
  quincunx: {
    type: 'quincunx',
    angle: 150,
    orb: 3,
    quality: 'challenging',
    symbol: '⚻',
    meaning: 'Adjustment and adaptation needed',
    kabbalisticEffect: 'Sephirot speak different languages, requiring translation and conscious bridging'
  }
};

// Calculate absolute degree position in zodiac (0-360)
export function calculateAbsoluteDegree(sign: string, degreeInSign: number): number {
  const signOrder = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const signIndex = signOrder.indexOf(sign);
  if (signIndex === -1) return 0;
  
  return (signIndex * 30) + degreeInSign;
}

// Calculate the shortest angular distance between two points on a circle
function calculateAngularDistance(deg1: number, deg2: number): number {
  let diff = Math.abs(deg1 - deg2);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

// Check if an aspect exists between two planets
export function calculateAspect(
  planet1: string,
  planet1Data: { sign: string; degree_in_sign: number },
  planet2: string,
  planet2Data: { sign: string; degree_in_sign: number },
  sephirah1: string,
  sephirah2: string
): PlanetaryAspect | null {
  
  const abs1 = calculateAbsoluteDegree(planet1Data.sign, planet1Data.degree_in_sign);
  const abs2 = calculateAbsoluteDegree(planet2Data.sign, planet2Data.degree_in_sign);
  
  const actualAngle = calculateAngularDistance(abs1, abs2);
  
  // Check each aspect type
  for (const aspectDef of Object.values(ASPECT_DEFINITIONS)) {
    const diff = Math.abs(actualAngle - aspectDef.angle);
    
    if (diff <= aspectDef.orb) {
      // Determine path illumination strength based on orb tightness
      let pathIllumination: 'full' | 'partial' | 'shadow';
      const orbPercentage = diff / aspectDef.orb;
      
      if (aspectDef.quality === 'harmonious') {
        pathIllumination = orbPercentage < 0.5 ? 'full' : 'partial';
      } else if (aspectDef.quality === 'challenging') {
        pathIllumination = 'shadow';
      } else {
        // Neutral (conjunction)
        pathIllumination = orbPercentage < 0.3 ? 'full' : 'partial';
      }
      
      return {
        planet1,
        planet2,
        type: aspectDef.type,
        quality: aspectDef.quality,
        angle: aspectDef.angle,
        actualAngle,
        orb: diff,
        symbol: aspectDef.symbol,
        meaning: aspectDef.meaning,
        sephirah1,
        sephirah2,
        pathIllumination
      };
    }
  }
  
  return null;
}

// Calculate all aspects in a chart
export function calculateAllAspects(
  planetsData: Record<string, { sign: string; degree_in_sign: number }>,
  planetToSephirah: Record<string, string>
): PlanetaryAspect[] {
  const aspects: PlanetaryAspect[] = [];
  const planetNames = Object.keys(planetsData);
  
  // Check each pair of planets
  for (let i = 0; i < planetNames.length; i++) {
    for (let j = i + 1; j < planetNames.length; j++) {
      const planet1 = planetNames[i];
      const planet2 = planetNames[j];
      
      const sephirah1 = planetToSephirah[planet1];
      const sephirah2 = planetToSephirah[planet2];
      
      if (!sephirah1 || !sephirah2) continue;
      
      const aspect = calculateAspect(
        planet1,
        planetsData[planet1],
        planet2,
        planetsData[planet2],
        sephirah1,
        sephirah2
      );
      
      if (aspect) {
        aspects.push(aspect);
      }
    }
  }
  
  // Sort by orb tightness (tighter aspects first)
  return aspects.sort((a, b) => a.orb - b.orb);
}

// Poetic descriptions for illuminated Sephirot
const ILLUMINATED_DESCRIPTIONS: Record<string, string[]> = {
  Kether: [
    'The Crown blazes with divine unity, bathed in celestial light',
    'Pure consciousness radiates from the highest point',
    'The source of all flows freely, unobstructed'
  ],
  Chokmah: [
    'Wisdom overflows from multiple streams of grace',
    'Raw creative potential bursts forth like spring water',
    'The Father principle expands with blessed generosity'
  ],
  Binah: [
    'Understanding receives abundant cosmic support',
    'The Divine Mother shapes reality with ease and wisdom',
    'Form crystallizes beautifully under harmonious influence'
  ],
  Chesed: [
    'Mercy pours forth like a river of blessing',
    'Grace upon grace builds infinite expansion',
    'Jupiter\'s benevolence multiplies through harmonious channels'
  ],
  Geburah: [
    'Strength flows with righteous power, clarified and true',
    'Holy boundaries form with grace and precision',
    'The sacred "No" speaks clearly without resistance'
  ],
  Tiphereth: [
    'The Heart Center shines like the sun in splendor',
    'Beauty harmonizes all forces with radiant integration',
    'Christ consciousness illuminates the center of the Tree'
  ],
  Netzach: [
    'Victory dances with joy, passion flows unimpeded',
    'The realm of feeling and instinct blessed with ease',
    'Venus sings through channels of harmonious desire'
  ],
  Hod: [
    'Splendor articulates truth with crystalline clarity',
    'The mind perceives patterns illuminated by grace',
    'Mercury\'s quicksilver flows through blessed pathways'
  ],
  Yesod: [
    'Foundation channels cosmic streams with perfect reception',
    'The astral blueprint glows with lunar luminosity',
    'Dreams and visions arrive easily from the upper worlds'
  ],
  Malkuth: [
    'The Kingdom manifests effortlessly, spirit becomes matter',
    'Earth receives heaven\'s blessing with open arms',
    'The physical world pulses with sacred vitality'
  ],
  Daath: [
    'The Hidden Sphere reveals mysteries across the abyss',
    'Knowledge flows freely between conscious and unconscious',
    'The gateway stands open, illuminated and accessible'
  ]
};

// Shadow work descriptions for Sephirot
const SHADOW_DESCRIPTIONS: Record<string, string[]> = {
  Kether: [
    'Unity consciousness requires effort to access today',
    'The Crown calls for deep meditation to penetrate the veil'
  ],
  Chokmah: [
    'Wisdom meets resistance, creativity requires conscious cultivation',
    'The spark of "what could be" needs protection and focus'
  ],
  Binah: [
    'Understanding faces limitation, form feels restrictive',
    'The Mother principle demands patience with necessary constraints'
  ],
  Chesed: [
    'Generosity meets boundaries, mercy requires discernment',
    'Expansion faces necessary contraction for growth'
  ],
  Geburah: [
    'Strength battles excess force, power needs tempering',
    'The sword requires wisdom to wield without harm'
  ],
  Tiphereth: [
    'The Heart Center holds tension between opposites',
    'Beauty seeks integration of warring energies within'
  ],
  Netzach: [
    'Passion faces obstruction, desire meets resistance',
    'Victory requires persistence through emotional challenge'
  ],
  Hod: [
    'The mind tangles with complexity, analysis creates paralysis',
    'Clarity demands release of overthinking and mental rigidity'
  ],
  Yesod: [
    'Foundation shakes, subconscious patterns surface for healing',
    'The astral realm presents shadows requiring conscious light'
  ],
  Malkuth: [
    'Manifestation struggles, the material world resists flow',
    'Earthly matters demand attention to blockages and delays'
  ],
  Daath: [
    'The abyss feels wider, knowledge comes through difficult passage',
    'Conscious integration of shadow material challenges the psyche'
  ]
};

// Determine if a Sephirah is illuminated or in shadow based on aspects
export function determineSephirahState(
  sephirah: string,
  aspects: PlanetaryAspect[]
): {
  state: 'illuminated' | 'shadow' | 'neutral';
  harmonious: number;
  challenging: number;
  description: string;
} {
  
  const relatedAspects = aspects.filter(
    a => a.sephirah1 === sephirah || a.sephirah2 === sephirah
  );
  
  if (relatedAspects.length === 0) {
    return {
      state: 'neutral',
      harmonious: 0,
      challenging: 0,
      description: 'Standing in potential, awaiting activation'
    };
  }
  
  let harmoniousCount = 0;
  let challengingCount = 0;
  
  for (const aspect of relatedAspects) {
    if (aspect.quality === 'harmonious') {
      harmoniousCount++;
    } else if (aspect.quality === 'challenging') {
      challengingCount++;
    }
  }
  
  const totalWeight = harmoniousCount - challengingCount;
  
  let state: 'illuminated' | 'shadow' | 'neutral';
  let description: string;
  
  if (totalWeight > 0) {
    state = 'illuminated';
    // Select description based on sephirah and count
    const descriptions = ILLUMINATED_DESCRIPTIONS[sephirah] || [];
    if (harmoniousCount >= 3 && descriptions[0]) {
      description = descriptions[0];
    } else if (harmoniousCount === 2 && descriptions[1]) {
      description = descriptions[1];
    } else if (descriptions[2]) {
      description = descriptions[2];
    } else {
      description = 'Blessed with supportive energy, flow comes naturally';
    }
  } else if (totalWeight < 0) {
    state = 'shadow';
    // Select description based on sephirah and count
    const descriptions = SHADOW_DESCRIPTIONS[sephirah] || [];
    if (challengingCount >= 2 && descriptions[0]) {
      description = descriptions[0];
    } else if (descriptions[1]) {
      description = descriptions[1];
    } else {
      description = 'In creative tension, conscious work transforms challenge into strength';
    }
  } else {
    state = 'neutral';
    description = 'Balanced between light and shadow, holding the middle way';
  }
  
  return {
    state,
    harmonious: harmoniousCount,
    challenging: challengingCount,
    description
  };
}

// Generate aspect interpretation for the divine message
export function generateAspectGuidance(aspects: PlanetaryAspect[]): {
  illuminatedPaths: string[];
  shadowPaths: string[];
  summary: string;
} {
  const harmonious = aspects.filter(a => a.quality === 'harmonious');
  const challenging = aspects.filter(a => a.quality === 'challenging');
  
  const illuminatedPaths = harmonious.slice(0, 3).map(a => {
    const aspectDef = ASPECT_DEFINITIONS[a.type];
    return `${a.planet1} ${a.symbol} ${a.planet2} (${a.sephirah1}↔${a.sephirah2}): ${aspectDef.kabbalisticEffect}`;
  });
  
  const shadowPaths = challenging.slice(0, 3).map(a => {
    const aspectDef = ASPECT_DEFINITIONS[a.type];
    return `${a.planet1} ${a.symbol} ${a.planet2} (${a.sephirah1}↔${a.sephirah2}): ${aspectDef.kabbalisticEffect}`;
  });
  
  let summary = '';
  
  if (harmonious.length > challenging.length) {
    summary = `Today's sky flows with grace—${harmonious.length} harmonious aspect${harmonious.length > 1 ? 's' : ''} illuminate the Tree. The Shefa cascades easily through these blessed channels.`;
  } else if (challenging.length > harmonious.length) {
    summary = `Today requires conscious spiritual work—${challenging.length} challenging aspect${challenging.length > 1 ? 's' : ''} create friction on the Tree. This tension is the forge of transformation.`;
  } else {
    summary = `Today holds perfect balance—${harmonious.length} harmonious and ${challenging.length} challenging aspects. Walk the middle pillar with awareness.`;
  }
  
  if (challenging.length > 0) {
    summary += ' Remember: shadow work is holy work. Where you feel resistance, there lies your greatest growth.';
  }
  
  return {
    illuminatedPaths,
    shadowPaths,
    summary
  };
}