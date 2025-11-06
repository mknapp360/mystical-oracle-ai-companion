// src/lib/birthChartService.ts
// FIXED: Single source of truth for BirthChartData interface

import { supabase } from './supabaseClient';
import { type PlanetaryAspect } from './aspect-calculator';

export interface PlanetaryPosition {
  absoluteDegree: number;
  eclipticLongitude: number;
  eclipticLatitude: number;
  distanceAU: number;
  sign: string;
  degreeInSign: number;
  house: string;
  isRetrograde: boolean;
  geocentricPosition: {
    x: number;
    y: number;
    z: number;
  };
}

// PRODUCTION-READY: Matches database schema exactly
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
  planetary_positions?: Record<string, PlanetaryPosition>;
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
          planetary_positions: chartData.planetary_positions || {},
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
          planetary_positions: chartData.planetary_positions || {},
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

// Save transit reading to history
export async function saveTransitReading(readingData: TransitReadingData): Promise<TransitReadingData> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to save transit reading');
    }

    const { data, error } = await supabase
      .from('transit_readings')
      .insert({
        user_id: user.id,
        birth_chart_id: readingData.birth_chart_id,
        transit_date: readingData.transit_date,
        transit_planets: readingData.transit_planets,
        transit_aspects: readingData.transit_aspects,
        personalized_message: readingData.personalized_message,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving transit reading:', error);
    throw error;
  }
}