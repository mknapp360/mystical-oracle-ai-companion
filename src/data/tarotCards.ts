
import { TarotCard } from '../types/tarot';

export const majorArcana: TarotCard[] = [
  {
    id: 'fool',
    name: 'The Fool',
    type: 'major',
    number: 0,
    uprightMeaning: 'New beginnings, innocence, spontaneity, free spirit, taking a leap of faith',
    reversedMeaning: 'Recklessness, taken advantage of, inconsideration, lack of direction',
    keywords: ['new beginnings', 'innocence', 'adventure', 'potential'],
    description: 'The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner\'s luck, improvisation and believing in the universe.',
    imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards//fool.jpg'
  },
  {
    id: 'magician',
    name: 'The Magician',
    type: 'major',
    number: 1,
    uprightMeaning: 'Manifestation, resourcefulness, power, inspired action, willpower',
    reversedMeaning: 'Manipulation, poor planning, untapped talents, lack of focus',
    keywords: ['manifestation', 'willpower', 'desire', 'creation'],
    description: 'The Magician represents manifestation, resourcefulness, inspired action, and having the power to create your reality through focused will.',
    imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards//magician.jpg'
  },
  {
    id: 'high-priestess',
    name: 'The High Priestess',
    type: 'major',
    number: 2,
    uprightMeaning: 'Intuition, sacred knowledge, divine feminine, subconscious mind',
    reversedMeaning: 'Secrets, disconnected from intuition, withdrawal, silence',
    keywords: ['intuition', 'mystery', 'subconscious', 'inner wisdom'],
    description: 'The High Priestess represents intuition, sacred knowledge, divine feminine energy, and trusting your inner voice.',
    imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards//high-priestess.jpg'
  },
  {
    id: 'empress',
    name: 'The Empress',
    type: 'major',
    number: 3,
    uprightMeaning: 'Femininity, beauty, nature, nurturing, abundance, creativity',
    reversedMeaning: 'Creative block, dependence on others, lack of growth',
    keywords: ['abundance', 'nurturing', 'fertility', 'creativity'],
    description: 'The Empress represents femininity, beauty, nature, nurturing, and the abundance that comes from connecting with the natural world.',
    imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards//empress.jpg'
  },
  {
    id: 'emperor',
    name: 'The Emperor',
    type: 'major',
    number: 4,
    uprightMeaning: 'Authority, establishment, structure, father figure, leadership',
    reversedMeaning: 'Tyranny, rigidity, coldness, lack of discipline',
    keywords: ['authority', 'structure', 'control', 'leadership'],
    description: 'The Emperor represents authority, establishment, structure, and the need for order and discipline in your life.',
    imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards//emperor.jpg'
  },
  {
    id: 'hierophant',
    name: 'The Hierophant',
    type: 'major',
    number: 5,
    uprightMeaning: 'Spiritual wisdom, religious beliefs, conformity, tradition, institutions',
    reversedMeaning: 'Personal beliefs, freedom, challenging the status quo',
    keywords: ['tradition', 'conformity', 'morality', 'ethics'],
    description: 'The Hierophant represents spiritual wisdom, religious beliefs, tradition, and the importance of social approval.',
    imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards//hierophant.jpg'
  },

  {
  id: 'lovers',
  name: 'The Lovers',
  type: 'major',
  number: 6,
  uprightMeaning: 'Love, harmony, relationships, values alignment, choices',
  reversedMeaning: 'Disharmony, imbalance, conflict, misalignment of values',
  keywords: ['love', 'harmony', 'union', 'choices'],
  description: 'The Lovers represent conscious connections, meaningful relationships, and alignment with one’s deepest values.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/lovers.jpg'
},
{
  id: 'chariot',
  name: 'The Chariot',
  type: 'major',
  number: 7,
  uprightMeaning: 'Control, willpower, success, action, determination',
  reversedMeaning: 'Lack of control, aggression, opposition, being pulled in different directions',
  keywords: ['willpower', 'control', 'victory', 'direction'],
  description: 'The Chariot represents determination, focus, and the drive to overcome obstacles through discipline and self-control.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/chariot.jpg'
},
{
  id: 'strength',
  name: 'Strength',
  type: 'major',
  number: 8,
  uprightMeaning: 'Courage, inner strength, compassion, patience',
  reversedMeaning: 'Self-doubt, weakness, insecurity, lack of control',
  keywords: ['courage', 'compassion', 'endurance', 'inner strength'],
  description: 'Strength represents the quiet power of resilience, gentle courage, and emotional mastery.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/strength.jpg'
},
{
  id: 'hermit',
  name: 'The Hermit',
  type: 'major',
  number: 9,
  uprightMeaning: 'Soul-searching, introspection, inner guidance, solitude',
  reversedMeaning: 'Isolation, loneliness, withdrawal, fear of being alone',
  keywords: ['solitude', 'introspection', 'wisdom', 'guidance'],
  description: 'The Hermit represents turning inward for clarity, embracing solitude, and seeking the light of inner truth.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/hermit.jpg'
},
{
  id: 'wheel-of-fortune',
  name: 'Wheel of Fortune',
  type: 'major',
  number: 10,
  uprightMeaning: 'Luck, destiny, change, cycles, turning points',
  reversedMeaning: 'Bad luck, resistance to change, breaking cycles',
  keywords: ['fate', 'cycles', 'destiny', 'change'],
  description: 'The Wheel of Fortune represents the cyclical nature of life, unexpected changes, and moments of destiny.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/wheel-of-fortune.jpg'
},
{
  id: 'justice',
  name: 'Justice',
  type: 'major',
  number: 11,
  uprightMeaning: 'Fairness, truth, law, cause and effect, accountability',
  reversedMeaning: 'Injustice, dishonesty, lack of accountability',
  keywords: ['justice', 'truth', 'balance', 'accountability'],
  description: 'Justice represents fairness, clarity of judgment, and alignment with ethical truth.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/justice.jpg'
},
{
  id: 'hanged-man',
  name: 'The Hanged Man',
  type: 'major',
  number: 12,
  uprightMeaning: 'Pause, surrender, letting go, new perspective',
  reversedMeaning: 'Resistance, indecision, stalling, fear of sacrifice',
  keywords: ['surrender', 'pause', 'insight', 'detachment'],
  description: 'The Hanged Man represents surrendering control, embracing a new perspective, and spiritual stillness.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/hanged-man.jpg'
},
{
  id: 'death',
  name: 'Death',
  type: 'major',
  number: 13,
  uprightMeaning: 'Endings, transformation, transition, letting go',
  reversedMeaning: 'Resistance to change, fear of endings, stagnation',
  keywords: ['transformation', 'endings', 'rebirth', 'release'],
  description: 'Death represents necessary endings and the transformation that follows — the gateway to rebirth.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/death.jpg'
},
{
  id: 'temperance',
  name: 'Temperance',
  type: 'major',
  number: 14,
  uprightMeaning: 'Balance, harmony, moderation, patience, healing',
  reversedMeaning: 'Imbalance, excess, lack of perspective, disharmony',
  keywords: ['moderation', 'balance', 'alchemy', 'healing'],
  description: 'Temperance represents finding the middle path, blending opposites, and achieving inner peace.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/temperance.jpg'
},
{
  id: 'devil',
  name: 'The Devil',
  type: 'major',
  number: 15,
  uprightMeaning: 'Attachment, addiction, materialism, shadow self',
  reversedMeaning: 'Freedom, release, breaking chains, reclaiming power',
  keywords: ['bondage', 'temptation', 'obsession', 'shadow'],
  description: 'The Devil represents bondage to the material or emotional, a confrontation with the shadow self, and the call to liberate your soul.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/devil.jpg'
},
{
  id: 'tower',
  name: 'The Tower',
  type: 'major',
  number: 16,
  uprightMeaning: 'Sudden change, upheaval, chaos, awakening',
  reversedMeaning: 'Fear of change, disaster avoided, delayed catastrophe',
  keywords: ['upheaval', 'destruction', 'awakening', 'truth'],
  description: 'The Tower represents necessary destruction that leads to clarity — a cosmic shake-up that breaks illusions.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/tower.jpg'
},
{
  id: 'star',
  name: 'The Star',
  type: 'major',
  number: 17,
  uprightMeaning: 'Hope, inspiration, renewal, spirituality, blessings',
  reversedMeaning: 'Despair, lack of faith, disconnection, spiritual drought',
  keywords: ['hope', 'guidance', 'renewal', 'faith'],
  description: 'The Star represents divine hope, inspiration from the cosmos, and spiritual renewal after the storm.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/star.jpg'
},
{
  id: 'moon',
  name: 'The Moon',
  type: 'major',
  number: 18,
  uprightMeaning: 'Illusion, intuition, dreams, subconscious, mystery',
  reversedMeaning: 'Clarity, repressed emotion, unveiling truth',
  keywords: ['intuition', 'dreams', 'uncertainty', 'mystery'],
  description: 'The Moon represents illusion and the deep subconscious — a call to trust intuition in the darkness.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/moon.jpg'
},
{
  id: 'sun',
  name: 'The Sun',
  type: 'major',
  number: 19,
  uprightMeaning: 'Joy, success, vitality, positivity, warmth',
  reversedMeaning: 'Sadness, delay, pessimism, partial success',
  keywords: ['joy', 'vitality', 'clarity', 'celebration'],
  description: 'The Sun represents radiant joy, clarity of purpose, and the life-affirming power of light.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/sun.jpg'
},
{
  id: 'judgement',
  name: 'Judgement',
  type: 'major',
  number: 20,
  uprightMeaning: 'Judgment, rebirth, inner calling, absolution',
  reversedMeaning: 'Self-doubt, inner critic, fear of change, avoidance',
  keywords: ['awakening', 'rebirth', 'truth', 'reckoning'],
  description: 'Judgement represents a moment of awakening, a call to rise to your purpose, and the integration of your past self.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/judgement.jpg'
},
{
  id: 'world',
  name: 'The World',
  type: 'major',
  number: 21,
  uprightMeaning: 'Completion, fulfillment, accomplishment, integration',
  reversedMeaning: 'Unfinished business, lack of closure, delay in success',
  keywords: ['completion', 'wholeness', 'integration', 'celebration'],
  description: 'The World represents the culmination of a journey, mastery, and the integration of all life lessons into a new wholeness.',
  imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards/world.jpg'
}

];

export const wands: TarotCard[] = [
  {
    id: 'ace-of-wands',
    name: 'Ace of Wands',
    type: 'minor',
    suit: 'wands',
    number: 1,
    uprightMeaning: 'Inspiration, new opportunities, growth, potential',
    reversedMeaning: 'Delays, lack of motivation, weighed down',
    keywords: ['potential', 'creativity', 'initiative'],
    description: 'The Ace of Wands symbolizes new beginnings, creative spark, and the passionate pursuit of goals.',
    imageUrl: 'https://swiopqkhkmogbatmfrgo.supabase.co/storage/v1/object/public/tarot-cards//ace-of-wands.jpg',
  },
  // Add more cards here...
];

export const allCards = [
  ...majorArcana,
  ...wands,
  // ...cups,
  // ...swords,
  // ...pentacles,
];
