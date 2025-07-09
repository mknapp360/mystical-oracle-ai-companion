
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
