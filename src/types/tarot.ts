
export interface TarotCard {
  id: string;
  name: string;
  suit?: 'cups' | 'wands' | 'swords' | 'pentacles';
  type: 'major' | 'minor';
  number?: number;
  uprightMeaning: string;
  reversedMeaning: string;
  keywords: string[];
  description: string;
  imageUrl: string;
}

export type ReadingSpread = 'single' | 'three-card' | 'celtic-cross';

export interface Reading {
  id: string;
  cards: TarotCard[];
  spread: ReadingSpread;
  question?: string;
  timestamp: Date;
}
