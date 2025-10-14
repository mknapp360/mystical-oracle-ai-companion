// src/lib/shefa-calculator.ts

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
}

// Synthesize the complete divine message from the pattern
export function synthesizeDivineMessage(pattern: DivinePattern): DivineMessage {
  const { activeSephirot, activePaths, dominantWorld, worldPercentages, planetaryPlacements, aspects, sephirotStates } = pattern;
  
  // Determine the primary flow pattern
  const primaryFlow = analyzePrimaryFlow(planetaryPlacements);
  
  // Identify key path connections
  const keyPaths = identifyKeyPaths(activePaths, activeSephirot);
  
  // Generate aspect guidance
  const aspectInfo = generateAspectGuidance(aspects);
  
  // Generate message sections
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
    closingBlessing
  };
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
    Yetzirah: 'The realm of formation and emotion is dominant today. Feelings are the bridge between spirit and matter.',
    Assiah: 'The realm of action and manifestation is dominant today. The divine seeks embodiment through physical reality.'
  };
  
  return `Today, the ${worldDesc.name} (${worldDesc.hebrew}) illuminates ${percentage}% of the cosmic pattern. ${worldDescriptions[world]} The Tree of Life pulses with energy as the Shefa—the divine overflow—cascades through specific channels of expression.`;
}

function generateShefaFlow(flow: ReturnType<typeof analyzePrimaryFlow>, sephirot: string[]): string {
  const flowDescriptions: Record<string, string> = {
    Kether: 'The Crown radiates pure unity consciousness, the undifferentiated source of all',
    Chokmah: 'Wisdom streams forth as raw creative potential, the divine spark of "what could be"',
    Binah: 'Understanding receives and shapes, giving form to infinite possibility',
    Chesed: 'Mercy expands outward with boundless grace and generosity',
    Geburah: 'Strength contracts inward with holy discrimination and boundaries',
    Tiphereth: 'Beauty harmonizes all opposites in the sacred heart center',
    Netzach: 'Victory persists through instinct, passion, and endurance',
    Hod: 'Splendor analyzes and articulates through mind and word',
    Yesod: 'Foundation channels all energies into the astral blueprint',
    Malkuth: 'Kingdom grounds everything into tangible earthly form',
    Daath: 'Knowledge reveals hidden connections across the abyss'
  };
  
  const activeDescriptions = sephirot
    .slice(0, 3)
    .map(s => flowDescriptions[s] || '')
    .filter(Boolean);
  
  return `The divine flow descends from ${flow.topSephirah}, centering in ${flow.centralSephirah}. ${activeDescriptions.join('. ')}. This creates a pattern of ${flow.theme}, inviting you to align with this cosmic current.`;
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
  
  return `Spheres bathed in divine light: ${illuminated.join('; ')}. These are your greatest gifts today—channels of grace and effortless flow.`;
}

function generateShadowWork(states: Map<string, ReturnType<typeof determineSephirahState>>, aspects: PlanetaryAspect[]): string {
  const shadows: string[] = [];
  
  states.forEach((state, sephirah) => {
    if (state.state === 'shadow') {
      shadows.push(`${sephirah}: ${state.description}`);
    }
  });
  
  if (shadows.length === 0) {
    return 'No spheres require deep shadow work today. Rest in this blessing of clarity.';
  }
  
  const challengingAspects = aspects.filter(a => a.quality === 'challenging').slice(0, 2);
  const aspectDetails = challengingAspects.map(a => 
    `${a.planet1} ${a.symbol} ${a.planet2} (${a.sephirah1}↔${a.sephirah2})`
  ).join(', ');
  
  return `Spheres calling for integration: ${shadows.join('; ')}. The challenging aspects (${aspectDetails}) create friction that is the forge of spiritual gold. Where you feel resistance, lean in with compassion and consciousness.`;
}

function generateWorldManifestation(world: World, percentages: Record<World, number>): string {
  const worldDesc = FOUR_WORLDS[world];
  const secondWorld = (Object.entries(percentages) as [World, number][])
    .sort((a, b) => b[1] - a[1])[1];
  
  const manifestationGuidance: Record<World, string> = {
    Atziluth: 'This is a day for visioning, meditation, and connecting with your highest purpose. The spiritual realm is very close—set intentions that align with your soul\'s calling.',
    Briah: 'This is a day for thinking, planning, and intellectual clarity. Ideas have power now—journal, strategize, and allow divine intelligence to flow through your mind.',
    Yetzirah: 'This is a day for feeling, creating, and artistic expression. Honor your emotions as messengers from the divine. Creative work channels the Shefa directly.',
    Assiah: 'This is a day for doing, building, and physical action. The spiritual wants to become tangible—take concrete steps toward your visions.'
  };
  
  const secondWorldDesc = FOUR_WORLDS[secondWorld[0]];
  
  return `${manifestationGuidance[world]} While ${worldDesc.realm} dominates, ${Math.round(secondWorld[1])}% flows through ${secondWorldDesc.name}, suggesting a bridge between ${worldDesc.realm.toLowerCase()} and ${secondWorldDesc.realm.toLowerCase()}. Work at this intersection for maximum alignment.`;
}

function generatePracticalWisdom(
  flow: ReturnType<typeof analyzePrimaryFlow>, 
  world: World,
  paths: ReturnType<typeof identifyKeyPaths>,
  aspectInfo: ReturnType<typeof generateAspectGuidance>
): string {
  const practices: Record<World, string[]> = {
    Atziluth: [
      'Spend time in silent meditation or contemplative prayer',
      'Ask: "What is the highest expression of my soul today?"',
      'Work with symbols, archetypal images, or sacred art'
    ],
    Briah: [
      'Journal your insights and revelations',
      'Study wisdom teachings or engage in meaningful dialogue',
      'Create mental models or frameworks for spiritual understanding'
    ],
    Yetzirah: [
      'Express yourself through art, music, or movement',
      'Process emotions consciously through feeling practices',
      'Work with visualization, active imagination, or dreamwork'
    ],
    Assiah: [
      'Take concrete action on a spiritual intention',
      'Engage in ritual, ceremony, or embodied practice',
      'Build or create something tangible that serves others'
    ]
  };
  
  const selectedPractices = practices[world].slice(0, 2);
  
  const sephirahPractice = flow.centralSephirah === 'Tiphereth' 
    ? 'Center yourself in your heart—let all decisions flow from this sacred place.'
    : `Honor ${flow.centralSephirah} by aligning with its quality today.`;
  
  let aspectPractice = '';
  if (aspectInfo.shadowPaths.length > 0) {
    aspectPractice = ' For shadow work, practice conscious integration: name the tension, breathe into the discomfort, ask what gift it brings.';
  } else if (aspectInfo.illuminatedPaths.length > 0) {
    aspectPractice = ' With harmonious aspects supporting you, trust the flow and let things unfold naturally.';
  }
  
  return `Practical ways to align with today's pattern: ${selectedPractices.join('; ')}. ${sephirahPractice}${aspectPractice}`;
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

// Main function to generate the complete message from sky data
export function generateDivineMessageFromSky(skyData: any, kabbalisticReading: any, worldActivation: any): DivineMessage {
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
  
  // Build the pattern
  const pattern: DivinePattern = {
    activeSephirot: kabbalisticReading.activeSephirot,
    activePaths: Object.entries(skyData.planets)
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
      .filter(Boolean) as any,
    dominantWorld: worldActivation.dominantWorld,
    worldPercentages: worldActivation.worldPercentages,
    planetaryPlacements: kabbalisticReading.sephirotDetails.map((detail: any) => {
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
    }),
    aspects,
    sephirotStates
  };

  return synthesizeDivineMessage(pattern);
}