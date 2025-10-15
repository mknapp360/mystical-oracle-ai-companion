import { ZODIAC_PATHS, PLANETARY_SEPHIROT } from './sephirotic-correspondences';

/**
 * Generate dynamic pathway interpretation based on which planet is activating it
 * Formula: Traditional Path Meaning + Planet's Energy = Current Emanation
 */

interface PathwayInterpretation {
  pathName: string;
  hebrewLetter: string;
  traditionalMeaning: string;
  currentEmanation: string;
  practicalGuidance: string;
}

// Planet archetypes - how each planet "colors" the energy flowing through a path
const PLANET_ARCHETYPES = {
  Sun: {
    essence: 'conscious awareness',
    verb: 'illuminates',
    quality: 'willful and radiant',
    guidance: 'Consciously direct your will through'
  },
  Moon: {
    essence: 'intuitive feeling',
    verb: 'flows through',
    quality: 'emotional and receptive',
    guidance: 'Trust your feelings about'
  },
  Mercury: {
    essence: 'mental agility',
    verb: 'communicates through',
    quality: 'intellectual and quick',
    guidance: 'Think and speak about'
  },
  Venus: {
    essence: 'magnetic attraction',
    verb: 'draws beauty through',
    quality: 'harmonious and desiring',
    guidance: 'Find pleasure and value in'
  },
  Mars: {
    essence: 'assertive action',
    verb: 'drives through',
    quality: 'forceful and decisive',
    guidance: 'Take bold action on'
  },
  Jupiter: {
    essence: 'expansive grace',
    verb: 'blesses through',
    quality: 'generous and abundant',
    guidance: 'Expand and grow through'
  },
  Saturn: {
    essence: 'structured discipline',
    verb: 'crystallizes through',
    quality: 'wise and restrictive',
    guidance: 'Build lasting form around'
  },
  Uranus: {
    essence: 'revolutionary insight',
    verb: 'awakens through',
    quality: 'sudden and liberating',
    guidance: 'Break free and innovate through'
  },
  Neptune: {
    essence: 'mystical dissolution',
    verb: 'dreams through',
    quality: 'transcendent and boundless',
    guidance: 'Surrender to the divine in'
  },
  Pluto: {
    essence: 'transformative power',
    verb: 'transforms through',
    quality: 'intense and regenerative',
    guidance: 'Embrace the death-rebirth cycle in'
  }
};

// Deep interpretations for each planet in each zodiac sign's path
const PATHWAY_EMANATIONS: Record<string, Record<string, string>> = {
  // ARIES PATH - Heh (The Window) - Chokmah to Tiphereth
  Aries: {
    Sun: 'Your conscious self peers through the divine window, seeing truth with pristine clarity. This is a time to witness your authentic nature without filters.',
    Moon: 'Emotional intuition opens the window between wisdom and heart. Your feelings carry prophetic vision - what you sense emotionally is divinely true.',
    Mercury: 'Mental perception sharpens through the window of revelation. Thoughts become vehicles for divine sight - trust your sudden insights.',
    Venus: 'Desire reveals divine beauty through the window. What attracts you now is pointing toward higher wisdom seeking to enter your heart.',
    Mars: 'Willpower looks through the cosmic window with warrior clarity. Your drive to act is aligned with divine vision - thrust forward boldly.',
    Jupiter: 'Expansive vision flows through the window, magnifying truth. Your optimism and faith are channels for authentic cosmic wisdom.',
    Saturn: 'Mature wisdom crystallizes through the window with patient clarity. Time teaches you to see what is truly real - let go of illusions.',
    Uranus: 'Revolutionary insight shatters the window, revealing unprecedented truth. Sudden awakenings break through - your consciousness is being upgraded.',
    Neptune: 'Mystical vision dissolves the window entirely - wisdom and heart merge. Boundaries between knowing and being disappear in divine union.',
    Pluto: 'Transformative sight penetrates through the window to hidden depths. What you see now will change you forever - embrace the revelation.'
  },

  // TAURUS PATH - Vav (The Nail) - Chokmah to Chesed
  Taurus: {
    Sun: 'Your conscious will drives the nail of manifestation, anchoring divine wisdom into merciful form. You embody spiritual truth through tangible presence.',
    Moon: 'Emotional security hammers the nail home - feelings ground wisdom into grace. Your need for stability serves the divine plan.',
    Mercury: 'Practical thinking connects wisdom to mercy like a nail joins wood. Your thoughts make abstract truth concrete and useful.',
    Venus: 'Beauty and pleasure nail wisdom into graceful form. What you love and value becomes the vehicle for divine abundance.',
    Mars: 'Determined action drives the nail with force - wisdom manifests through persistent effort. Your willpower builds lasting spiritual structures.',
    Jupiter: 'Generous expansion nails cosmic wisdom into merciful abundance. Your faith materializes blessings - prosperity flows from higher knowing.',
    Saturn: 'Patient discipline hammers the nail slowly but surely. Time and structure manifest wisdom as enduring grace - build to last.',
    Uranus: 'Sudden innovation breaks the old nail and forges a new one. Revolutionary wisdom demands new forms of mercy - shake up the status quo.',
    Neptune: 'Mystical flow dissolves the nail into liquid grace. Wisdom becomes mercy through surrender - let divine love permeate everything.',
    Pluto: 'Transformative power drives the nail through death into rebirth. Wisdom and mercy merge through profound change - destruction precedes creation.'
  },

  // GEMINI PATH - Zayin (The Sword) - Binah to Tiphereth
  Gemini: {
    Sun: 'Conscious awareness wields the sword of discrimination, cutting understanding into heart-centered truth. Your choices define your authentic self.',
    Moon: 'Emotional wisdom holds the sword gently but firmly. Feelings guide necessary boundaries - what you sense emotionally must be honored or severed.',
    Mercury: 'Mental clarity sharpens the sword to razor precision. Your mind cuts through confusion - think clearly and choose wisely.',
    Venus: 'Love wields the sword with beauty and grace. Discernment in relationships - choose what aligns with your heart, release what doesn\'t.',
    Mars: 'Willpower swings the sword with decisive force. Act on your understanding - cut away what no longer serves your authentic path.',
    Jupiter: 'Wisdom wields the sword generously, cutting away excess to reveal abundance. Understanding expands through wise choices.',
    Saturn: 'Mature judgment holds the sword with grave responsibility. Time-tested understanding guides difficult but necessary severances.',
    Uranus: 'Revolutionary insight wields the sword unexpectedly, cutting through old understanding. Sudden clarity demands radical choices.',
    Neptune: 'Mystical awareness dissolves the sword - understanding merges with compassion. Discrimination becomes acceptance through divine love.',
    Pluto: 'Transformative power forges the sword in depths - understanding emerges from shadow work. Cut away pretense to reveal authentic core.'
  },

  // CANCER PATH - Cheth (The Fence) - Binah to Geburah
  Cancer: {
    Sun: 'Conscious self builds the sacred fence, protecting understanding with strength. Your identity requires healthy boundaries.',
    Moon: 'Emotional safety erects the fence of protection. Your feelings know what must be kept in and what kept out - trust them.',
    Mercury: 'Mental boundaries define the fence clearly. Think about what protects your inner understanding - communicate your limits.',
    Venus: 'Love builds the fence with nurturing care. Healthy boundaries in relationships protect the sacred feminine within.',
    Mars: 'Assertive power defends the fence with warrior energy. Your strength establishes necessary protection - guard what matters.',
    Jupiter: 'Generous boundaries expand the fence to include more. Understanding grows through protected space for grace and wisdom.',
    Saturn: 'Mature structure makes the fence enduring and real. Time-tested boundaries protect deep understanding from violation.',
    Uranus: 'Revolutionary change tears down old fences and builds new ones suddenly. Understanding requires new forms of protection now.',
    Neptune: 'Mystical dissolution makes the fence permeable - boundaries become membranes. Understanding merges with strength through compassion.',
    Pluto: 'Transformative power rebuilds the fence from the depths. Your boundaries must die and be reborn - protect your emerging self.'
  },

  // LEO PATH - Teth (The Serpent) - Chesed to Geburah
  Leo: {
    Sun: 'Conscious vital force activates the serpent power between mercy and strength. Your will integrates opposites through creative fire.',
    Moon: 'Emotional passion awakens the serpent - feelings carry kundalini force. Your heart holds both grace and power in sacred balance.',
    Mercury: 'Mental creativity coils the serpent around paradox. Your thoughts dance between expansion and contraction with agile intelligence.',
    Venus: 'Desire ignites the serpent\'s primal life force. What you love reconciles mercy with strength - passion serves both.',
    Mars: 'Assertive power channels the serpent\'s raw energy. Your will balances generosity with necessary force - wield both.',
    Jupiter: 'Generous expansion feeds the serpent with abundance. Grace flows with appropriate boundaries - blessing includes discernment.',
    Saturn: 'Mature wisdom tames the serpent through discipline. The life force becomes sustainable through structure balancing yes and no.',
    Uranus: 'Revolutionary awakening jolts the serpent alive suddenly. Breakthrough energy integrates opposites in unexpected ways.',
    Neptune: 'Mystical flow allows the serpent to move freely. Life force becomes spiritual current - mercy and strength dissolve into love.',
    Pluto: 'Transformative power awakens the serpent from the root. Primal energy erupts between giving and taking - death-rebirth cycles intensify.'
  },

  // VIRGO PATH - Yod (The Hand) - Chesed to Tiphereth
  Virgo: {
    Sun: 'Conscious will becomes the hand of divine service, channeling grace into heartfelt work. Your identity expresses through practical love.',
    Moon: 'Emotional wisdom guides the hand of caring service. Your feelings know how to help - nurture through practical action.',
    Mercury: 'Mental precision makes the hand skillful and useful. Your thoughts organize grace into efficient service - analyze to serve better.',
    Venus: 'Love makes the hand gentle and beautiful in service. What you create with care channels divine mercy into tangible form.',
    Mars: 'Assertive action drives the hand to work diligently. Your effort manifests grace through disciplined productivity - serve with strength.',
    Jupiter: 'Generous spirit opens the hand wide in giving. Abundance flows through acts of service - your help expands others\' blessings.',
    Saturn: 'Mature responsibility makes the hand reliable and steady. Time-tested service channels enduring grace - commit to practical love.',
    Uranus: 'Revolutionary service breaks the old mold - the hand works in new ways. Innovative methods channel grace into unexpected forms.',
    Neptune: 'Mystical devotion dissolves the boundary between server and served. The hand acts as divine love itself - merge through service.',
    Pluto: 'Transformative work empowers the hand with regenerative force. Deep healing service channels grace into profound change.'
  },

  // LIBRA PATH - Lamed (The Ox Goad) - Geburah to Tiphereth
  Libra: {
    Sun: 'Conscious awareness learns through balanced experience, goading the self toward heart truth. Your identity develops through just encounters.',
    Moon: 'Emotional intelligence learns from relationship. The goad teaches through feelings in partnership - grow through what you feel with others.',
    Mercury: 'Mental balance weighs all perspectives fairly. The goad teaches through dialogue and comparison - learn from every viewpoint.',
    Venus: 'Relational harmony learns through beauty and connection. The goad teaches through love - relationships refine your heart.',
    Mars: 'Assertive will learns through direct confrontation. The goad teaches through challenge - conflicts reveal authentic self.',
    Jupiter: 'Generous wisdom learns through gracious interaction. The goad teaches through blessing others - grow by giving.',
    Saturn: 'Mature judgment learns through long-term commitment. The goad teaches through time and responsibility in relationship.',
    Uranus: 'Revolutionary insight learns through sudden reversals. The goad teaches through unexpected partnerships - breakthrough via other.',
    Neptune: 'Mystical union learns through dissolution of self and other. The goad teaches through surrender - merge in divine relationship.',
    Pluto: 'Transformative power learns through deep bonding. The goad teaches through intensity in relationship - die and be reborn through other.'
  },

  // SCORPIO PATH - Nun (The Fish) - Tiphereth to Netzach
  Scorpio: {
    Sun: 'Conscious self dives into the depths like a fish swimming in darkness. Your identity transforms through emotional intensity.',
    Moon: 'Emotional depths plunge into unconscious waters. The fish swims through feeling\'s abyss - trust the dark journey.',
    Mercury: 'Mental penetration dives beneath surface thoughts. The fish explores hidden meanings - investigate the unseen.',
    Venus: 'Desire descends into passionate depths. The fish seeks beauty in darkness - love transforms through intensity.',
    Mars: 'Assertive power plunges into the fight or regeneration. The fish becomes predator or prey - transform through crisis.',
    Jupiter: 'Generous faith trusts the deep dive. The fish swims in oceanic grace - abundance emerges from depths.',
    Saturn: 'Mature wisdom accepts necessary death and transformation. The fish completes its cycle - endings birth beginnings.',
    Uranus: 'Revolutionary change erupts from the depths suddenly. The fish leaps from water - transformation through breakthrough.',
    Neptune: 'Mystical dissolution becomes the ocean itself. The fish disappears into infinite waters - death is transcendence.',
    Pluto: 'Transformative power IS the fish in its element. Deep regeneration through total metamorphosis - embrace the underworld journey.'
  },

  // SAGITTARIUS PATH - Samekh (The Prop) - Tiphereth to Yesod
  Sagittarius: {
    Sun: 'Conscious self receives divine support on its journey. Your identity is upheld by higher truth - you are held.',
    Moon: 'Emotional foundation feels cosmic support. Your feelings are propped up by divine providence - trust you are sustained.',
    Mercury: 'Mental optimism rests on the prop of higher understanding. Your thoughts are supported by truth - think boldly.',
    Venus: 'Desire is upheld by divine grace. What you want is supported by blessing - your longings are valid and held.',
    Mars: 'Assertive will acts with divine backing. Your efforts are propped up by cosmic forces - move forward with confidence.',
    Jupiter: 'Generous expansion IS the prop itself. Your faith supports and is supported - abundance upholds abundance.',
    Saturn: 'Mature structure provides lasting support. Time-tested foundations prop up the essential - lean on what endures.',
    Uranus: 'Revolutionary change is itself supported by cosmic intelligence. The prop shifts suddenly - trust the new support.',
    Neptune: 'Mystical trust knows divine support is always present. The prop is invisible grace - surrender to being held.',
    Pluto: 'Transformative power provides support through crisis. The prop holds during death-rebirth - you will not fall.'
  },

  // CAPRICORN PATH - Ayin (The Eye) - Tiphereth to Hod
  Capricorn: {
    Sun: 'Conscious awareness manifests through earthly sight. Your identity expresses in material form - embody your vision.',
    Moon: 'Emotional reality grounds into practical form. The eye sees what can be built - feelings become tangible.',
    Mercury: 'Mental planning manifests as concrete strategy. The eye sees the path to material success - think practically.',
    Venus: 'Desire crystallizes into valued form. The eye sees beauty in structure - love what you build.',
    Mars: 'Assertive will achieves through disciplined effort. The eye focuses on the summit - climb with determination.',
    Jupiter: 'Generous expansion builds lasting abundance. The eye sees material blessing as spiritual - prosper with purpose.',
    Saturn: 'Mature wisdom IS the eye of manifestation. Time and effort make vision real - mastery through patience.',
    Uranus: 'Revolutionary change disrupts old structures. The eye sees new forms of success - innovate materially.',
    Neptune: 'Mystical vision sees through material illusion. The eye perceives spirit in matter - dissolve separation.',
    Pluto: 'Transformative power rebuilds from the foundation. The eye witnesses death and rebirth of form - regenerate structures.'
  },

  // AQUARIUS PATH - Tzaddi (The Fish Hook) - Netzach to Yesod
  Aquarius: {
    Sun: 'Conscious self is caught by divine intelligence. Your identity hooks into collective awakening - serve the future.',
    Moon: 'Emotional attunement catches collective frequencies. The hook pulls you toward humanitarian feeling - commune with all.',
    Mercury: 'Mental brilliance catches innovative ideas. The hook snags breakthrough thoughts from the aether - think ahead.',
    Venus: 'Desire connects to universal love. The hook catches transpersonal affection - love the collective.',
    Mars: 'Assertive will acts for collective liberation. The hook catches the energy of revolution - fight for freedom.',
    Jupiter: 'Generous vision expands community blessing. The hook catches collective abundance - prosper together.',
    Saturn: 'Mature wisdom structures collective progress. The hook catches sustainable reform - build the new world slowly.',
    Uranus: 'Revolutionary awakening IS the fish hook itself. Sudden collective shift catches everyone - ride the lightning.',
    Neptune: 'Mystical unity catches oceanic consciousness. The hook dissolves into infinite connection - merge with All.',
    Pluto: 'Transformative power catches collective shadow. The hook drags up what society has repressed - transform culture.'
  },

  // PISCES PATH - Qoph (The Back of the Head) - Netzach to Malkuth
  Pisces: {
    Sun: 'Conscious self surrenders to dreams manifesting. Your identity dissolves into the creative unconscious becoming real.',
    Moon: 'Emotional dreamscape flows into physical form. The back of the head holds visions birthing - feel the imaginal become actual.',
    Mercury: 'Mental intuition receives from the unconscious. The back of the head whispers truths your rational mind can\'t grasp.',
    Venus: 'Desire reaches into dream and illusion. The back of the head holds what you long for beyond reason - trust mystical attraction.',
    Mars: 'Assertive will acts from unconscious impulse. The back of the head drives instinctive action - move without knowing why.',
    Jupiter: 'Generous faith trusts infinite possibility. The back of the head knows all can be real - believe in miracles.',
    Saturn: 'Mature wisdom accepts the limits of dreams. The back of the head must integrate with reality - ground the mystical.',
    Uranus: 'Revolutionary breakthrough erupts from unconscious. The back of the head sparks sudden awakenings - channel divine disruption.',
    Neptune: 'Mystical dissolution IS the back of the head. Dreams, reality, self, other all merge - live in the infinite.',
    Pluto: 'Transformative power dredges the unconscious depths. The back of the head holds what must be made real through crisis.'
  }
};

/**
 * Main function: Generate complete pathway interpretation
 */
export function generatePathwayInterpretation(
  planet: string,
  sign: string
): PathwayInterpretation | null {
  const pathInfo = ZODIAC_PATHS[sign];
  const planetInfo = PLANETARY_SEPHIROT[planet];
  const planetArchetype = PLANET_ARCHETYPES[planet as keyof typeof PLANET_ARCHETYPES];
  
  if (!pathInfo || !planetInfo || !planetArchetype) {
    return null;
  }

  const emanation = PATHWAY_EMANATIONS[sign]?.[planet] || 
    `${planetInfo.name}'s ${planetArchetype.essence} ${planetArchetype.verb} ${pathInfo.meaning.toLowerCase()}.`;

  const practicalGuidance = `${planetArchetype.guidance} ${pathInfo.meaning.toLowerCase()} - from ${pathInfo.connects[0]} to ${pathInfo.connects[1]}.`;

  return {
    pathName: `${sign} - ${pathInfo.letterName}`,
    hebrewLetter: pathInfo.hebrewLetter,
    traditionalMeaning: pathInfo.meaning,
    currentEmanation: emanation,
    practicalGuidance: practicalGuidance
  };
}

/**
 * Generate interpretations for all currently active pathways
 */
export function generateAllActivePathwayInterpretations(
  activePlanets: Record<string, { sign: string; sephirah: string }>
): PathwayInterpretation[] {
  const interpretations: PathwayInterpretation[] = [];
  
  Object.entries(activePlanets).forEach(([planet, data]) => {
    const interpretation = generatePathwayInterpretation(planet, data.sign);
    if (interpretation) {
      interpretations.push(interpretation);
    }
  });

  return interpretations;
}