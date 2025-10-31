// src/lib/shefa-calculator-enhanced.ts
// Enhanced version that includes stranded sephiroth and ungrounded pathway diagnostics

import { 
  PLANETARY_SEPHIROT, 
  ZODIAC_PATHS, 
  FOUR_WORLDS, 
  type World,
  type PlanetarySephirah 
} from './sephirotic-correspondences';

import {
  calculateAllAspects,
  determineSephirahState,
  generateAspectGuidance,
  type PlanetaryAspect
} from './aspect-calculator';

import { determineWorld } from './sephirotic-correspondences';

import {
  analyzeSephirothPathways,
  type PathwayDiagnostics,
  type StrandedSephirah,
  type UngroundedPathway
} from './sephiroth-pathway-diagnostics';

interface DivinePattern {
  activeSephirot: string[];
  activePaths: Array<{ sign: string; letter: string; meaning: string; connects: [string, string] }>;
  dominantWorld: World;
  worldPercentages: Record<World, number>;
  planetaryPlacements: Array<{
    planet: string;
    sephirah: string;
    sign: string;
    house: string;
    world: World;
  }>;
  aspects: PlanetaryAspect[];
  sephirotStates: Map<string, ReturnType<typeof determineSephirahState>>;
  pathwayDiagnostics?: PathwayDiagnostics; // NEW!
}

export interface DivineMessage {
  title: string;
  opening: string;
  shefaFlow: string;
  pathwayGuidance: string;
  aspectGuidance: string;
  illuminatedSpheres: string;
  shadowWork: string;
  worldManifestation: string;
  practicalWisdom: string;
  closingBlessing: string;
  // NEW SECTIONS:
  isolatedEnergy?: string;        // Guidance for stranded sephiroth
  ungroundedManifestations?: string; // Guidance for blocked pathways
  integrationWork?: string;       // Consolidated spiritual work
}

// Synthesize the complete divine message from the pattern
export function synthesizeDivineMessage(pattern: DivinePattern): DivineMessage {
  const { 
    activeSephirot, 
    activePaths, 
    dominantWorld, 
    worldPercentages, 
    planetaryPlacements, 
    aspects, 
    sephirotStates,
    pathwayDiagnostics 
  } = pattern;
  
  // Determine the primary flow pattern
  const primaryFlow = analyzePrimaryFlow(planetaryPlacements);
  
  // Identify key path connections
  const keyPaths = identifyKeyPaths(activePaths, activeSephirot);
  
  // Generate aspect guidance
  const aspectInfo = generateAspectGuidance(aspects);
  
  // Generate standard message sections
  const title = generateTitle(dominantWorld, primaryFlow);
  const opening = generateOpening(dominantWorld, worldPercentages);
  const shefaFlow = generateShefaFlow(primaryFlow, activeSephirot);
  const pathwayGuidance = generatePathwayGuidance(keyPaths);
  const aspectGuidance = aspectInfo.summary;
  const illuminatedSpheres = generateIlluminatedSpheres(sephirotStates);
  const shadowWork = generateShadowWork(sephirotStates, aspects);
  const worldManifestation = generateWorldManifestation(dominantWorld, worldPercentages);
  const practicalWisdom = generatePracticalWisdom(primaryFlow, dominantWorld, keyPaths, aspectInfo);
  const closingBlessing = generateClosingBlessing(dominantWorld);
  
  // Generate NEW diagnostic sections if diagnostics are available
  let isolatedEnergy: string | undefined;
  let ungroundedManifestations: string | undefined;
  let integrationWork: string | undefined;
  
  if (pathwayDiagnostics) {
    isolatedEnergy = generateIsolatedEnergyGuidance(pathwayDiagnostics.strandedSephiroth);
    ungroundedManifestations = generateUngroundedPathwayGuidance(pathwayDiagnostics.ungroundedPathways);
    integrationWork = pathwayDiagnostics.spiritualWork;
  }

  return {
    title,
    opening,
    shefaFlow,
    pathwayGuidance,
    aspectGuidance,
    illuminatedSpheres,
    shadowWork,
    worldManifestation,
    practicalWisdom,
    closingBlessing,
    isolatedEnergy,
    ungroundedManifestations,
    integrationWork
  };
}

// NEW: Generate guidance for stranded sephiroth
function generateIsolatedEnergyGuidance(strandedSephiroth: StrandedSephirah[]): string {
  if (strandedSephiroth.length === 0) {
    return 'All active spheres are connected through illuminated pathways—your Tree shows healthy integration. Energy flows freely between activated centers.';
  }
  
  const guidanceSegments = strandedSephiroth.map(sephirah => {
    return `**${sephirah.name} (${sephirah.planet})**: ${sephirah.spiritualDiagnosis}\n\n*Integration Practice*: ${sephirah.integrationGuidance}`;
  });
  
  const intro = strandedSephiroth.length === 1
    ? 'One sphere operates in isolation today, requiring conscious integration:'
    : `${strandedSephiroth.length} spheres operate in isolation today, each requiring conscious integration:`;
  
  return `${intro}\n\n${guidanceSegments.join('\n\n---\n\n')}`;
}

// NEW: Generate guidance for ungrounded pathways
function generateUngroundedPathwayGuidance(ungroundedPathways: UngroundedPathway[]): string {
  if (ungroundedPathways.length === 0) {
    return 'All illuminated pathways connect active spheres—energy flows to where it can be received. Your Tree shows mature circulation patterns.';
  }
  
  const guidanceSegments = ungroundedPathways.map(pathway => {
    const arrow = pathway.blockageType === 'source-active-destination-inactive' ? '→' : '←';
    return `**${pathway.fromSephirah} ${arrow} ${pathway.toSephirah}** (${pathway.zodiacSign} / ${pathway.hebrewLetter})\n${pathway.pathMeaning}\n\n${pathway.spiritualDiagnosis}\n\n*Your Work*: ${pathway.manifestationGuidance}`;
  });
  
  const intro = ungroundedPathways.length === 1
    ? 'One pathway is illuminated but cannot complete its flow—energy is blocked from manifesting:'
    : `${ungroundedPathways.length} pathways are illuminated but cannot complete their flow:`;
  
  return `${intro}\n\n${guidanceSegments.join('\n\n---\n\n')}`;
}

// Analyze the primary flow pattern through the Tree
function analyzePrimaryFlow(placements: DivinePattern['planetaryPlacements']): {
  topSephirah: string;
  centralSephirah: string;
  theme: string;
} {
  const hierarchy = ['Kether', 'Chokmah', 'Binah', 'Chesed', 'Geburah', 'Tiphereth', 'Netzach', 'Hod', 'Yesod', 'Malkuth', 'Daath'];
  const activeSephirahNames = placements.map(p => p.sephirah);
  
  const topSephirah = hierarchy.find(s => activeSephirahNames.includes(s)) || 'Tiphereth';
  const centralSephirah = activeSephirahNames.includes('Tiphereth') ? 'Tiphereth' : topSephirah;
  
  let theme = 'integration and balance';
  if (activeSephirahNames.includes('Kether')) theme = 'divine union and transcendence';
  else if (activeSephirahNames.includes('Chokmah') && activeSephirahNames.includes('Binah')) theme = 'wisdom through polarity';
  else if (activeSephirahNames.includes('Chesed') || activeSephirahNames.includes('Geburah')) theme = 'power through mercy and strength';
  else if (activeSephirahNames.includes('Netzach') || activeSephirahNames.includes('Hod')) theme = 'victory through thought and feeling';
  else if (activeSephirahNames.includes('Yesod')) theme = 'foundation and manifestation';
  
  return { topSephirah, centralSephirah, theme };
}

function identifyKeyPaths(
  paths: DivinePattern['activePaths'], 
  activeSephirot: string[]
): Array<{ letter: string; sign: string; meaning: string; from: string; to: string }> {
  return paths
    .filter(path => 
      activeSephirot.includes(path.connects[0]) && 
      activeSephirot.includes(path.connects[1])
    )
    .slice(0, 3)
    .map(path => ({
      letter: path.letter,
      sign: path.sign,
      meaning: path.meaning,
      from: path.connects[0],
      to: path.connects[1]
    }));
}

function generateTitle(world: World, flow: ReturnType<typeof analyzePrimaryFlow>): string {
  const worldDesc = FOUR_WORLDS[world];
  return `The Shefa Flows Through ${worldDesc.realm}: ${flow.theme}`;
}

function generateOpening(world: World, percentages: Record<World, number>): string {
  const worldDesc = FOUR_WORLDS[world];
  const percentage = Math.round(percentages[world]);
  
  const worldDescriptions: Record<World, string> = {
    Atziluth: 'The most exalted realm of pure spirit is dominant today. Divine archetypes are seeking to birth themselves through you.',
    Briah: 'The realm of thought and creation is dominant today. Ideas from the highest mind are forming and crystallizing.',
    Yetzirah: 'The realm of emotion and formation is dominant today. Feelings and images are shaping your reality.',
    Assiah: 'The realm of physical action is dominant today. Divine energy is grounding into material manifestation.'
  };
  
  return `${worldDescriptions[world]} ${Math.round(percentage)}% of today's celestial influx flows through ${worldDesc.hebrew}, inviting you to engage with ${worldDesc.realm.toLowerCase()} consciousness.`;
}

function generateShefaFlow(
  flow: ReturnType<typeof analyzePrimaryFlow>,
  activeSephirot: string[]
): string {
  const activeDescriptions = activeSephirot.map(name => {
    const sephirahData = Object.values(PLANETARY_SEPHIROT).find(s => s.name === name);
    return sephirahData ? `${name} (${sephirahData.meaning})` : name;
  });
  
  return `The divine influx (Shefa) descends from ${flow.topSephirah}, flowing through ${activeDescriptions.join(', ')}. This creates a pattern of ${flow.theme}, inviting you to align with this cosmic current.`;
}

function generatePathwayGuidance(paths: ReturnType<typeof identifyKeyPaths>): string {
  if (paths.length === 0) {
    return 'The paths between spheres shimmer with potential, waiting for conscious engagement.';
  }
  
  const hebrewMeanings: Record<string, string> = {
    Aleph: 'the breath of creation, teaching unity in multiplicity',
    Beth: 'the vessel of containment, building sacred structures',
    Gimel: 'the bridge of giving, connecting higher to lower',
    Daleth: 'the door of receptivity, opening to divine nourishment',
    Heh: 'the window of revelation, seeing with divine eyes',
    Vav: 'the nail of connection, joining heaven to earth',
    Zayin: 'the sword of discernment, cutting through illusion',
    Cheth: 'the fence of protection, creating holy boundaries',
    Teth: 'the serpent of transformation, kundalini rising',
    Yod: 'the hand of manifestation, divine action through you',
    Kaph: 'the palm of receptivity, holding divine gifts',
    Lamed: 'the ox-goad of learning, teaching through experience',
    Mem: 'the waters of consciousness, flowing and adapting',
    Nun: 'the fish of faith, swimming in unseen depths',
    Samekh: 'the prop of support, divine assistance available',
    Ayin: 'the eye of witness, seeing from higher perspective',
    Peh: 'the mouth of expression, speaking truth into being',
    Tzaddi: 'the fish-hook of insight, catching spiritual understanding',
    Qoph: 'the back of the head, intuition and dreamwork',
    Resh: 'the head of intellect, illuminating consciousness',
    Shin: 'the tooth of transformation, holy fire refining',
    Tav: 'the cross of manifestation, sealing intention into form'
  };
  
  const pathGuidance = paths.map(path => {
    const meaning = hebrewMeanings[path.letter] || path.meaning.toLowerCase();
    return `The path of ${path.letter} (${path.sign}) connects ${path.from} to ${path.to}, activating ${meaning}`;
  }).join('. ');
  
  return `Sacred pathways illuminate the Tree today. ${pathGuidance}. Walk these paths consciously—they are invitations to specific spiritual work.`;
}

function generateIlluminatedSpheres(states: Map<string, ReturnType<typeof determineSephirahState>>): string {
  const illuminated: string[] = [];
  
  states.forEach((state, sephirah) => {
    if (state.state === 'illuminated') {
      illuminated.push(`${sephirah}: ${state.description}`);
    }
  });
  
  if (illuminated.length === 0) {
    return 'All spheres rest in balance today, neither fully illuminated nor in shadow.';
  }
  
  return `Spheres bathed in divine light: ${illuminated.join('; ')}.`;
}

function generateShadowWork(
  states: Map<string, ReturnType<typeof determineSephirahState>>,
  aspects: PlanetaryAspect[]
): string {
  const shadowed: string[] = [];
  
  states.forEach((state, sephirah) => {
    if (state.state === 'shadow') {
      shadowed.push(`${sephirah}: ${state.description}`);
    }
  });
  
  const challengingAspects = aspects.filter(a => a.quality === 'challenging');
  
  if (shadowed.length === 0 && challengingAspects.length === 0) {
    return 'The Tree faces minimal shadow today—a time of grace and ease. Use this gift wisely.';
  }
  
  const shadowGuidance = shadowed.length > 0
    ? `Spheres in shadow: ${shadowed.join('; ')}. `
    : '';
  
  const aspectDetails = challengingAspects.length > 0
    ? `${challengingAspects.length} challenging aspect(s) create friction that, when worked with consciously, becomes the grist for transformation. `
    : '';
  
  return `${shadowGuidance}${aspectDetails}Remember: shadow is not evil but rather unconscious potential awaiting integration.`;
}

function generateWorldManifestation(world: World, percentages: Record<World, number>): string {
  const worldDesc = FOUR_WORLDS[world];
  const otherWorlds = (Object.keys(FOUR_WORLDS) as World[]).filter(w => w !== world);
  const secondWorld = otherWorlds.reduce((a, b) => percentages[a] > percentages[b] ? a : b);
  const secondPercentage = Math.round(percentages[secondWorld]);
  
  return `With ${worldDesc.name} dominant, manifestation occurs primarily through ${worldDesc.realm.toLowerCase()}. ${FOUR_WORLDS[secondWorld].name} contributes ${secondPercentage}%, adding ${FOUR_WORLDS[secondWorld].realm.toLowerCase()} coloring. Work with both frequencies for optimal results.`;
}

function generatePracticalWisdom(
  flow: ReturnType<typeof analyzePrimaryFlow>,
  world: World,
  paths: ReturnType<typeof identifyKeyPaths>,
  aspectInfo: ReturnType<typeof generateAspectGuidance>
): string {
  const worldPractices: Record<World, string[]> = {
    Atziluth: ['Meditate on divine names', 'Contemplate eternal truths', 'Practice pure presence'],
    Briah: ['Journal insights', 'Study sacred texts', 'Engage in creative ideation'],
    Yetzirah: ['Express emotions through art', 'Practice breathwork', 'Engage in visualization'],
    Assiah: ['Take physical action', 'Create tangible offerings', 'Move your body consciously']
  };
  
  const selectedPractices = worldPractices[world].slice(0, 2);
  
  const sephirahPractice = flow.centralSephirah === 'Tiphereth'
    ? ' Center yourself in your heart before acting.'
    : '';
  
  // Use shadowPaths or illuminatedPaths arrays instead of keyAspects
  const aspectPractice = aspectInfo.shadowPaths && aspectInfo.shadowPaths.length > 0
    ? ' Work consciously with the challenging aspects to transform tension into growth.'
    : aspectInfo.illuminatedPaths && aspectInfo.illuminatedPaths.length > 0
    ? ' Allow the harmonious aspects to support your flow today.'
    : '';
  
  return `Practical ways to align with today's pattern: ${selectedPractices.join('; ')}.${sephirahPractice}${aspectPractice}`;
}

function generateClosingBlessing(world: World): string {
  const blessings: Record<World, string> = {
    Atziluth: 'May you rest in the eternal presence of the Divine today. Baruch HaShem.',
    Briah: 'May your mind be illuminated with holy wisdom today. Baruch HaShem.',
    Yetzirah: 'May your heart overflow with sacred feeling today. Baruch HaShem.',
    Assiah: 'May your hands become vessels of divine action today. Baruch HaShem.'
  };
  
  return `The Tree of Life is alive within you—these cosmic patterns reflect your own inner landscape. ${blessings[world]} Remember: you are not separate from this flow. You ARE the Shefa expressing itself in this moment, in this place. Walk consciously through the day as a living blessing. ✨`;
}

// Main function to generate the complete message from sky data with FULL DIAGNOSTICS
export function generateDivineMessageFromSky(
  skyData: any, 
  kabbalisticReading: any, 
  worldActivation: any
): DivineMessage {
  // Calculate aspects
  const planetToSephirah: Record<string, string> = {};
  kabbalisticReading.sephirotDetails.forEach((detail: any) => {
    planetToSephirah[detail.planet] = detail.sephirah.name;
  });
  
  const aspects = calculateAllAspects(skyData.planets, planetToSephirah);
  
  // Determine Sephirah states based on aspects
  const sephirotStates = new Map<string, ReturnType<typeof determineSephirahState>>();
  const allSephirot = new Set(Object.values(planetToSephirah));
  
  allSephirot.forEach(sephirah => {
    sephirotStates.set(sephirah, determineSephirahState(sephirah, aspects));
  });
  
  // Build planetary placements
  const planetaryPlacements = kabbalisticReading.sephirotDetails.map((detail: any) => {
    const planetData = skyData.planets[detail.planet];
    const worldData = determineWorld(
      detail.planet, 
      planetData.sign, 
      planetData.house
    );
    return {
      planet: detail.planet,
      sephirah: detail.sephirah.name,
      sign: planetData.sign,
      house: planetData.house,
      world: worldData.primary
    };
  });
  
  // Build active paths
  const activePaths = Object.entries(skyData.planets)
    .map(([planet, data]: [string, any]) => {
      const pathInfo = ZODIAC_PATHS[data.sign];
      if (!pathInfo) return null;
      return {
        sign: data.sign,
        letter: pathInfo.letterName,
        meaning: pathInfo.meaning,
        connects: pathInfo.connects
      };
    })
    .filter(Boolean) as any;
  
  // NEW: Run pathway diagnostics
  const pathwayDiagnostics = analyzeSephirothPathways(
    kabbalisticReading.activeSephirot,
    activePaths,
    planetaryPlacements
  );
  
  // Build the complete pattern
  const pattern: DivinePattern = {
    activeSephirot: kabbalisticReading.activeSephirot,
    activePaths,
    dominantWorld: worldActivation.dominantWorld,
    worldPercentages: worldActivation.worldPercentages,
    planetaryPlacements,
    aspects,
    sephirotStates,
    pathwayDiagnostics // Include diagnostics
  };

  return synthesizeDivineMessage(pattern);
}