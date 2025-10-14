// src/types/birth-chart.ts

export interface BirthChartData {
  userId: string;
  birthDateTime: string; // ISO 8601 format
  birthLocation: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
    timezone: string;
  };
  natalPlanets: {
    Sun: { sign: string; degree_in_sign: number; house: string };
    Moon: { sign: string; degree_in_sign: number; house: string };
    Mercury: { sign: string; degree_in_sign: number; house: string };
    Venus: { sign: string; degree_in_sign: number; house: string };
    Mars: { sign: string; degree_in_sign: number; house: string };
    Jupiter: { sign: string; degree_in_sign: number; house: string };
    Saturn: { sign: string; degree_in_sign: number; house: string };
    Uranus: { sign: string; degree_in_sign: number; house: string };
    Neptune: { sign: string; degree_in_sign: number; house: string };
    Pluto: { sign: string; degree_in_sign: number; house: string };
  };
  ascendant: {
    sign: string;
    degree: number;
  };
  midheaven: {
    sign: string;
    degree: number;
  };
  houseCusps: number[]; // 12 house cusps in degrees
  createdAt: string;
  updatedAt: string;
}

export interface TransitReading {
  transitDate: string;
  transitPlanets: Record<string, { sign: string; degree_in_sign: number; house: string }>;
  natalPlanets: BirthChartData['natalPlanets'];
  transitToNatalAspects: TransitAspect[];
  personalizedMessage: string;
}

export interface TransitAspect {
  transitPlanet: string;
  natalPlanet: string;
  aspectType: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx';
  orb: number;
  transitSephirah: string;
  natalSephirah: string;
  meaning: string;
}