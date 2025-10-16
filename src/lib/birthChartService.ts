// src/lib/birthChartService.ts
// COMPLETE UPDATED INTERFACE with planetary_positions

import { supabase } from './supabaseClient';
import { type PlanetaryAspect } from './aspect-calculator';

export interface PlanetaryPosition {
  absoluteDegree: number;        // 0-360 degrees around the zodiac
  eclipticLongitude: number;     // Same as absolute degree
  eclipticLatitude: number;      // Degrees north/south of ecliptic
  distanceAU: number;            // Distance from Earth in AU
  sign: string;                  // Zodiac sign
  degreeInSign: number;          // Degree within the sign (0-30)
  house: string;                 // Natal house (e.g., "House 7")
  isRetrograde: boolean;         // Retrograde status
  geocentricPosition: {          // Raw 3D coordinates
    x: number;
    y: number;
    z: number;
  };
}

export interface BirthChartData {
  id?: string;
  user_id?: string;
  birth_date_time: string;
  birth_city: string;
  birth_country: string;
  birth_latitude: number;
  birth_longitude: number;
  birth_timezone: string;
  natal_planets: Record<string, { sign: string; degree_in_sign: number; house: string }>;
  natal_aspects?: PlanetaryAspect[];
  planetary_positions?: Record<string, PlanetaryPosition>;  // ← ADD THIS
  ascendant_sign: string;
  ascendant_degree: number;
  midheaven_sign: string;
  midheaven_degree: number;
  house_cusps: number[];
  created_at?: string;
  updated_at?: string;
}

export interface TransitReadingData {
  id?: string;
  user_id?: string;
  birth_chart_id: string;
  transit_date: string;
  transit_planets: Record<string, any>;
  transit_aspects: any[];
  personalized_message: {
    title: string;
    personalizedOpening: string;
    keyTransits: string[];
    soulWork: string;
  };
  created_at?: string;
}

// Get user's birth chart
export async function getUserBirthChart(userId: string): Promise<BirthChartData | null> {
  try {
    const { data, error } = await supabase
      .from('birth_charts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching birth chart:', error);
    throw error;
  }
}

// Save or update birth chart
export async function saveBirthChart(chartData: BirthChartData): Promise<BirthChartData> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to save birth chart');
    }

    const existingChart = await getUserBirthChart(user.id);

    if (existingChart) {
      // UPDATE existing chart
      const { data, error } = await supabase
        .from('birth_charts')
        .update({
          birth_date_time: chartData.birth_date_time,
          birth_city: chartData.birth_city,
          birth_country: chartData.birth_country,
          birth_latitude: chartData.birth_latitude,
          birth_longitude: chartData.birth_longitude,
          birth_timezone: chartData.birth_timezone,
          natal_planets: chartData.natal_planets,
          natal_aspects: chartData.natal_aspects || [],
          planetary_positions: chartData.planetary_positions || {},  // ← ADD THIS
          ascendant_sign: chartData.ascendant_sign,
          ascendant_degree: chartData.ascendant_degree,
          midheaven_sign: chartData.midheaven_sign,
          midheaven_degree: chartData.midheaven_degree,
          house_cusps: chartData.house_cusps,
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // INSERT new chart
      const { data, error } = await supabase
        .from('birth_charts')
        .insert({
          user_id: user.id,
          birth_date_time: chartData.birth_date_time,
          birth_city: chartData.birth_city,
          birth_country: chartData.birth_country,
          birth_latitude: chartData.birth_latitude,
          birth_longitude: chartData.birth_longitude,
          birth_timezone: chartData.birth_timezone,
          natal_planets: chartData.natal_planets,
          natal_aspects: chartData.natal_aspects || [],
          planetary_positions: chartData.planetary_positions || {},  // ← ADD THIS
          ascendant_sign: chartData.ascendant_sign,
          ascendant_degree: chartData.ascendant_degree,
          midheaven_sign: chartData.midheaven_sign,
          midheaven_degree: chartData.midheaven_degree,
          house_cusps: chartData.house_cusps,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving birth chart:', error);
    throw error;
  }
}

// Delete birth chart
export async function deleteBirthChart(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('birth_charts')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting birth chart:', error);
    throw error;
  }
}

// Helper: Get planetary position by name
export function getPlanetPosition(
  birthChart: BirthChartData, 
  planetName: string
): PlanetaryPosition | null {
  return birthChart.planetary_positions?.[planetName] || null;
}

// Helper: Get all retrograde planets
export function getRetrogradePlanets(birthChart: BirthChartData): string[] {
  if (!birthChart.planetary_positions) return [];
  
  return Object.entries(birthChart.planetary_positions)
    .filter(([_, pos]) => pos.isRetrograde)
    .map(([name, _]) => name);
}

// Helper: Calculate angular distance between two planets
export function getAngularDistance(
  birthChart: BirthChartData,
  planet1: string,
  planet2: string
): number | null {
  const pos1 = birthChart.planetary_positions?.[planet1];
  const pos2 = birthChart.planetary_positions?.[planet2];
  
  if (!pos1 || !pos2) return null;
  
  let diff = Math.abs(pos1.absoluteDegree - pos2.absoluteDegree);
  if (diff > 180) diff = 360 - diff;
  
  return diff;
}