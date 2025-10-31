// src/lib/sephiroth-pathway-diagnostics.ts
// Advanced Kabbalistic diagnostics for Tree of Life energy flow patterns
// Identifies stranded sephiroth and ungrounded pathways

import { ZODIAC_PATHS, PLANETARY_SEPHIROT } from './sephirotic-correspondences';

export interface StrandedSephirah {
  name: string;
  planet: string;
  hasIncomingPaths: boolean;
  hasOutgoingPaths: boolean;
  isolationType: 'complete' | 'no-incoming' | 'no-outgoing' | 'connected';
  spiritualDiagnosis: string;
  integrationGuidance: string;
}

export interface UngroundedPathway {
  fromSephirah: string;
  toSephirah: string;
  inactiveSephirah: string;
  zodiacSign: string;
  hebrewLetter: string;
  pathMeaning: string;
  blockageType: 'source-active-destination-inactive' | 'source-inactive-destination-active';
  spiritualDiagnosis: string;
  manifestationGuidance: string;
}

export interface PathwayDiagnostics {
  strandedSephiroth: StrandedSephirah[];
  ungroundedPathways: UngroundedPathway[];
  hasIsolatedEnergy: boolean;
  hasBlockedManifestation: boolean;
  overallPattern: string;
  spiritualWork: string;
}

/**
 * Analyze the Tree of Life for stranded sephiroth (active but disconnected)
 * and ungrounded pathways (flowing to inactive sephiroth)
 */
export function analyzeSephirothPathways(
  activeSephirot: string[],
  activePaths: Array<{ sign: string; letter: string; meaning: string; connects: [string, string] }>,
  planetaryPlacements: Array<{ planet: string; sephirah: string }>
): PathwayDiagnostics {
  
  const strandedSephiroth: StrandedSephirah[] = [];
  const ungroundedPathways: UngroundedPathway[] = [];
  
  // Build a map of which sephiroth have planets
  const activeSephirotSet = new Set(activeSephirot);
  const sephirahToPlanet = new Map<string, string>();
  planetaryPlacements.forEach(placement => {
    sephirahToPlanet.set(placement.sephirah, placement.planet);
  });
  
  // Build a map of active path connections
  const activePathConnections = new Map<string, Set<string>>();
  activePaths.forEach(path => {
    const [from, to] = path.connects;
    
    // Add bidirectional connections
    if (!activePathConnections.has(from)) {
      activePathConnections.set(from, new Set());
    }
    if (!activePathConnections.has(to)) {
      activePathConnections.set(to, new Set());
    }
    activePathConnections.get(from)!.add(to);
    activePathConnections.get(to)!.add(from);
  });
  
  // DIAGNOSTIC 1: Find stranded sephiroth (active but no connected pathways)
  activeSephirot.forEach(sephirah => {
    const connectedSephirot = activePathConnections.get(sephirah);
    const hasConnections = connectedSephirot && connectedSephirot.size > 0;
    
    // Check if any connected paths lead to OTHER active sephiroth
    const hasActiveConnections = hasConnections && 
      Array.from(connectedSephirot).some(connected => activeSephirotSet.has(connected));
    
    if (!hasActiveConnections) {
      const planet = sephirahToPlanet.get(sephirah) || 'Unknown';
      
      strandedSephiroth.push({
        name: sephirah,
        planet,
        hasIncomingPaths: false,
        hasOutgoingPaths: false,
        isolationType: 'complete',
        ...getDiagnosisForStrandedSephirah(sephirah, planet)
      });
    }
  });
  
  // DIAGNOSTIC 2: Find ungrounded pathways (active paths to inactive sephiroth)
  activePaths.forEach(path => {
    const [from, to] = path.connects;
    const fromActive = activeSephirotSet.has(from);
    const toActive = activeSephirotSet.has(to);
    
    // Case 1: Source is active, destination is NOT
    if (fromActive && !toActive) {
      const zodiacPath = ZODIAC_PATHS[path.sign];
      ungroundedPathways.push({
        fromSephirah: from,
        toSephirah: to,
        inactiveSephirah: to,
        zodiacSign: path.sign,
        hebrewLetter: zodiacPath?.hebrewLetter || path.letter,
        pathMeaning: path.meaning,
        blockageType: 'source-active-destination-inactive',
        ...getDiagnosisForUngroundedPath(from, to, path.sign, 'destination-blocked')
      });
    }
    
    // Case 2: Destination is active, source is NOT
    if (!fromActive && toActive) {
      const zodiacPath = ZODIAC_PATHS[path.sign];
      ungroundedPathways.push({
        fromSephirah: from,
        toSephirah: to,
        inactiveSephirah: from,
        zodiacSign: path.sign,
        hebrewLetter: zodiacPath?.hebrewLetter || path.letter,
        pathMeaning: path.meaning,
        blockageType: 'source-inactive-destination-active',
        ...getDiagnosisForUngroundedPath(from, to, path.sign, 'source-blocked')
      });
    }
  });
  
  // Generate overall pattern and spiritual work
  const hasIsolatedEnergy = strandedSephiroth.length > 0;
  const hasBlockedManifestation = ungroundedPathways.length > 0;
  const overallPattern = generateOverallPattern(strandedSephiroth, ungroundedPathways);
  const spiritualWork = generateSpiritualWork(strandedSephiroth, ungroundedPathways);
  
  return {
    strandedSephiroth,
    ungroundedPathways,
    hasIsolatedEnergy,
    hasBlockedManifestation,
    overallPattern,
    spiritualWork
  };
}

/**
 * Generate diagnosis for a stranded (isolated) sephirah
 */
function getDiagnosisForStrandedSephirah(
  sephirah: string, 
  planet: string
): { spiritualDiagnosis: string; integrationGuidance: string } {
  
  const diagnoses: Record<string, { diagnosis: string; guidance: string }> = {
    Kether: {
      diagnosis: `${planet} in Kether operates in complete isolation—pure divine consciousness disconnected from the rest of the Tree. You have access to transcendent awareness but it exists apart from your embodied life.`,
      guidance: 'Consciously bridge the gap between your highest spiritual insights and daily reality. Practice bringing mystical awareness into ordinary moments. Create rituals that connect the transcendent to the tangible.'
    },
    Chokmah: {
      diagnosis: `${planet} in Chokmah is an isolated fountain of wisdom—raw creative potential that isn't flowing through the Tree. You have brilliant insights and revolutionary ideas that remain ungrounded.`,
      guidance: 'Channel your cosmic wisdom into structured form. Write down your insights, share your visions with others, and create systems to capture fleeting inspirations. Connect divine wisdom to practical application.'
    },
    Binah: {
      diagnosis: `${planet} in Binah represents isolated understanding—deep comprehension that hasn't integrated with the heart or descended into manifestation. Your wisdom is self-contained.`,
      guidance: 'Share your understanding with others. Let your deep knowledge inform your relationships and creative expression. Practice teaching what you know, which creates pathways for energy to flow outward.'
    },
    Chesed: {
      diagnosis: `${planet} in Chesed is mercy and grace operating in isolation—abundance that cannot find channels to express. You have generosity and expansion that feels blocked or contained.`,
      guidance: 'Create deliberate channels for giving. Establish regular practices of generosity, mentoring, or blessing others. Your Chesed energy needs active outlets to flow through the Tree.'
    },
    Geburah: {
      diagnosis: `${planet} in Geburah is isolated strength and discipline—power and boundaries that aren't integrated with the rest of your being. Your capacity for discernment operates separately from heart or action.`,
      guidance: 'Integrate your strength with compassion (connect to Chesed) and authentic self-expression (connect to Tiphereth). Use your discipline to support your whole Tree, not just one sphere.'
    },
    Tiphereth: {
      diagnosis: `${planet} in Tiphereth is an isolated heart center—your authentic self and consciousness exist in their own sphere, disconnected from mind, emotion, or manifestation. You know who you are but cannot express it.`,
      guidance: 'This is a critical blockage requiring conscious work. Practice expressing your authentic self through creativity, relationships, and physical action. Bridge your heart to mind (Hod), emotions (Netzach), and body (Malkuth).'
    },
    Netzach: {
      diagnosis: `${planet} in Netzach represents isolated desire and emotion—feelings and creative impulses that aren't connected to conscious direction or grounding. Your passions operate independently.`,
      guidance: 'Connect your desires to your heart center (Tiphereth) through conscious awareness. Ground your emotions through body practices. Let your feelings inform your thinking (connect to Hod) and manifest (connect to Malkuth).'
    },
    Hod: {
      diagnosis: `${planet} in Hod is an isolated mind—intellectual activity, analysis, and communication happening in a bubble separate from emotion, intuition, or manifestation. Your thoughts don't connect to the rest of you.`,
      guidance: 'Integrate thinking with feeling. Practice embodied cognition—notice how thoughts feel in your body. Connect ideas to desires (Netzach) and bring mental clarity into your authentic self (Tiphereth). Ground thoughts into action.'
    },
    Yesod: {
      diagnosis: `${planet} in Yesod is an isolated foundation—your subconscious, dreams, and intuitive patterns operate separately from conscious awareness and physical manifestation. Inner knowing remains hidden.`,
      guidance: 'Bring unconscious material into consciousness through dreamwork, journaling, and therapy. Create bridges between your inner world and outer expression. Let intuition inform action.'
    },
    Malkuth: {
      diagnosis: `${planet} in Malkuth is isolated physicality—your body and material reality are disconnected from higher consciousness, emotion, or mental understanding. You exist in matter without spirit informing it.`,
      guidance: 'This is rare but significant. Practice embodied spirituality—yoga, tai chi, conscious movement. Recognize your body as sacred vessel. Connect physical sensations to emotions, thoughts, and spirit.'
    },
    Daath: {
      diagnosis: `${planet} in Daath (the hidden sephirah) operates in profound isolation—knowledge that exists in the abyss, transformation happening in the void. This is shadow work territory.`,
      guidance: 'Honor the mystery. Daath represents the dissolution point where the known dissolves into the unknown. Practice sitting with uncertainty. Shadow work and deep introspection will help integrate this energy.'
    }
  };
  
  const info = diagnoses[sephirah] || {
    diagnosis: `${planet} in ${sephirah} is operating in isolation from the rest of the Tree.`,
    guidance: 'Work consciously to create connections between this sphere and others through intentional practice.'
  };
  
  return {
    spiritualDiagnosis: info.diagnosis,
    integrationGuidance: info.guidance
  };
}

/**
 * Generate diagnosis for an ungrounded pathway
 */
function getDiagnosisForUngroundedPath(
  from: string,
  to: string,
  sign: string,
  blockageDirection: 'destination-blocked' | 'source-blocked'
): { spiritualDiagnosis: string; manifestationGuidance: string } {
  
  const pathInfo = ZODIAC_PATHS[sign];
  const pathName = pathInfo ? `${pathInfo.letterName} (${pathInfo.hebrewLetter})` : sign;
  const pathMeaning = pathInfo?.meaning || '';
  
  if (blockageDirection === 'destination-blocked') {
    // Energy trying to flow FROM active sephirah TO inactive one
    return {
      spiritualDiagnosis: `The pathway ${pathName} is illuminated from ${from} toward ${to}, but ${to} has no planetary presence to receive this energy. ${pathMeaning}. Energy is flowing but cannot ground or manifest—like lightning seeking earth but finding no conductor.`,
      manifestationGuidance: `Your spiritual work: Create conscious vessels to receive what's trying to descend. ${to} represents an area of life that needs activation. ${getManifestationGuidanceForSephirah(to)} Without this work, the energy flowing through ${sign} will remain ungrounded, leading to frustration and unrealized potential.`
    };
  } else {
    // Energy needs to flow FROM inactive sephirah TO active one but can't originate
    return {
      spiritualDiagnosis: `The pathway ${pathName} connects ${from} to ${to}, but ${from} has no planetary presence to send energy through this channel. ${to} is active and receptive, but the source sphere is dark. This represents blocked influx—like a river dam with nothing flowing into the reservoir.`,
      manifestationGuidance: `Your spiritual work: Activate the source sphere ${from} through conscious practice. ${getActivationGuidanceForSephirah(from)} Until ${from} is awakened, ${to} cannot receive the full blessing that wants to flow through the ${sign} pathway.`
    };
  }
}

/**
 * Get specific manifestation guidance for receiving energy into an inactive sephirah
 */
function getManifestationGuidanceForSephirah(sephirah: string): string {
  const guidance: Record<string, string> = {
    Kether: 'Connect to pure consciousness through meditation and contemplative practice.',
    Chokmah: 'Open to creative inspiration and revolutionary wisdom through brainstorming and visioning.',
    Binah: 'Develop structured understanding through study, reflection, and building mental frameworks.',
    Chesed: 'Create channels for abundance and mercy through generosity, blessing others, and expanding your worldview.',
    Geburah: 'Establish boundaries and exercise discernment through saying no, cutting away excess, and focused discipline.',
    Tiphereth: 'Cultivate authentic self-expression through creative work, heart-centered practices, and conscious living.',
    Netzach: 'Activate desire and emotion through artistic expression, relationship, and allowing yourself to want.',
    Hod: 'Engage the mind through study, communication, writing, and intellectual pursuits.',
    Yesod: 'Ground into the unconscious through dreamwork, imagination, and connecting to cyclical patterns.',
    Malkuth: 'Manifest in physical reality through embodied action, material creation, and grounding practices.',
    Daath: 'Embrace shadow work, face the unknown, and allow transformation through the void.'
  };
  
  return guidance[sephirah] || 'Work to activate this sphere through conscious intention and practice.';
}

/**
 * Get specific activation guidance for awakening an inactive source sephirah
 */
function getActivationGuidanceForSephirah(sephirah: string): string {
  const guidance: Record<string, string> = {
    Kether: 'Awaken divine consciousness through deep meditation, mystical practices, and ego dissolution.',
    Chokmah: 'Activate wisdom through embracing inspiration, studying sacred texts, and opening to cosmic intelligence.',
    Binah: 'Develop understanding through contemplation, patience, and allowing structures of meaning to form.',
    Chesed: 'Open the flow of mercy through practicing generosity, gratitude, and expansive thinking.',
    Geburah: 'Strengthen discipline through setting boundaries, exercising will, and pruning what no longer serves.',
    Tiphereth: 'Activate your heart center through authenticity, creativity, and integrating all aspects of self.',
    Netzach: 'Awaken desire through art, relationship, perseverance, and honoring your feelings.',
    Hod: 'Engage the intellect through learning, communication, analysis, and sharing knowledge.',
    Yesod: 'Connect to the foundation through dreamwork, unconscious exploration, and honoring cycles.',
    Malkuth: 'Ground into physicality through embodiment, material creation, and conscious presence in your body.',
    Daath: 'Enter the abyss through shadow work, facing fears, and allowing dissolution of known structures.'
  };
  
  return guidance[sephirah] || 'Consciously activate this sphere through focused spiritual practice.';
}

/**
 * Generate overall pattern description
 */
function generateOverallPattern(
  strandedSephiroth: StrandedSephirah[],
  ungroundedPathways: UngroundedPathway[]
): string {
  if (strandedSephiroth.length === 0 && ungroundedPathways.length === 0) {
    return 'Your Tree of Life shows healthy integration—all active sephiroth have connecting pathways, and all illuminated paths connect active spheres. Energy flows freely through your spiritual architecture.';
  }
  
  const patterns: string[] = [];
  
  if (strandedSephiroth.length > 0) {
    const names = strandedSephiroth.map(s => s.name).join(', ');
    patterns.push(`${strandedSephiroth.length} sphere(s) are operating in isolation (${names}), indicating areas of your being that need conscious integration`);
  }
  
  if (ungroundedPathways.length > 0) {
    const destBlocked = ungroundedPathways.filter(p => p.blockageType === 'source-active-destination-inactive').length;
    const sourceBlocked = ungroundedPathways.filter(p => p.blockageType === 'source-inactive-destination-active').length;
    
    if (destBlocked > 0) {
      patterns.push(`${destBlocked} pathway(s) are flowing toward inactive spheres—energy seeking manifestation but finding no vessel`);
    }
    if (sourceBlocked > 0) {
      patterns.push(`${sourceBlocked} pathway(s) originate from inactive spheres—potential blessings that cannot flow due to dormant source`);
    }
  }
  
  return patterns.join('; ') + '.';
}

/**
 * Generate consolidated spiritual work guidance
 */
function generateSpiritualWork(
  strandedSephiroth: StrandedSephirah[],
  ungroundedPathways: UngroundedPathway[]
): string {
  if (strandedSephiroth.length === 0 && ungroundedPathways.length === 0) {
    return 'Your primary work is to maintain the integration you have achieved and deepen the flow through existing pathways.';
  }
  
  const work: string[] = [];
  
  if (strandedSephiroth.length > 0) {
    work.push('**Integration Work**: Consciously create bridges from isolated spheres to the rest of your Tree. Each stranded sephirah represents energy operating in a bubble—your work is to burst that bubble and let the energy flow.');
  }
  
  if (ungroundedPathways.length > 0) {
    const destBlocked = ungroundedPathways.filter(p => p.blockageType === 'source-active-destination-inactive');
    const sourceBlocked = ungroundedPathways.filter(p => p.blockageType === 'source-inactive-destination-active');
    
    if (destBlocked.length > 0) {
      work.push('**Manifestation Work**: Energy is trying to descend but finding no receiving vessel. Create conscious structures, practices, and commitments that allow ungrounded energy to land in your life.');
    }
    
    if (sourceBlocked.length > 0) {
      work.push('**Activation Work**: Dormant spheres need awakening so energy can flow from them. Identify which areas of life you\'ve neglected and deliberately engage them through practice.');
    }
  }
  
  return work.join(' ');
}