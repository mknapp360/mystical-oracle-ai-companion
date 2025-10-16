// src/components/BirthChartForm.tsx
// PRODUCTION-READY VERSION WITH CORRECTED ASCENDANT CALCULATION

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, MapPin, Clock, Save, Sparkles, CheckCircle } from 'lucide-react';
import * as Astronomy from 'astronomy-engine';
import { saveBirthChart, type BirthChartData } from '@/lib/birthChartService';
import { calculateAllAspects, calculateAbsoluteDegree, type PlanetaryAspect } from '@/lib/aspect-calculator';
import { PLANETARY_SEPHIROT } from '@/lib/sephirotic-correspondences';

interface BirthChartFormProps {
  onSave: (chartData: BirthChartData) => void;
  existingChart?: BirthChartData;
  userId: string;
}

// Timezone offsets (hours from UTC)
const TIMEZONE_OFFSETS: Record<string, number> = {
  'EST': -5, 'EDT': -4, 'CST': -6, 'CDT': -5,
  'MST': -7, 'MDT': -6, 'PST': -8, 'PDT': -7,
  'UTC': 0, 'GMT': 0,
};

/**
 * CRITICAL FIX: Determine if date is in DST for US timezones
 */
function isDST(month: number, day: number, year: number): boolean {
  // More accurate DST calculation for US
  // DST starts 2nd Sunday in March, ends 1st Sunday in November
  
  if (month < 2 || month > 10) return false; // Jan, Feb, Dec = no DST
  if (month > 2 && month < 10) return true;  // Apr-Oct = DST
  
  // For March and November, need to check the specific date
  // Simplified: assume DST for March 10+ and November 1-6
  if (month === 2) return day >= 10; // March
  if (month === 10) return day <= 6;  // November
  
  return false;
}

/**
 * CRITICAL FIX: Parse date/time components and create UTC date
 * This avoids browser timezone interpretation issues
 */
function parseLocalDateTime(dateStr: string, timeStr: string, timezone: string): Date {
  // Parse components
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  // Normalize timezone strings
  let normalizedTz = timezone;
  
  // Convert IANA timezone names to abbreviations
  if (timezone.includes('America/New_York')) {
    normalizedTz = isDST(month - 1, day, year) ? 'EDT' : 'EST';
  } else if (timezone.includes('America/Chicago')) {
    normalizedTz = isDST(month - 1, day, year) ? 'CDT' : 'CST';
  } else if (timezone.includes('America/Denver')) {
    normalizedTz = isDST(month - 1, day, year) ? 'MDT' : 'MST';
  } else if (timezone.includes('America/Los_Angeles')) {
    normalizedTz = isDST(month - 1, day, year) ? 'PDT' : 'PST';
  }
  
  // Determine timezone offset
  let offset: number;
  if (normalizedTz.includes('E')) {
    offset = isDST(month - 1, day, year) ? -4 : -5; // Eastern
  } else if (normalizedTz.includes('C')) {
    offset = isDST(month - 1, day, year) ? -5 : -6; // Central
  } else if (normalizedTz.includes('M')) {
    offset = isDST(month - 1, day, year) ? -6 : -7; // Mountain
  } else if (normalizedTz.includes('P')) {
    offset = isDST(month - 1, day, year) ? -7 : -8; // Pacific
  } else {
    offset = TIMEZONE_OFFSETS[normalizedTz] || 0;
  }
  
  console.log('Timezone conversion:', {
    input: timezone,
    normalized: normalizedTz,
    offset: offset,
    isDST: isDST(month - 1, day, year)
  });
  
  // Create UTC date directly using Date.UTC()
  // This avoids browser timezone interpretation
  const utcMs = Date.UTC(year, month - 1, day, hours, minutes, 0);
  
  // Adjust for the timezone offset
  const adjustedMs = utcMs - (offset * 60 * 60 * 1000);
  
  return new Date(adjustedMs);
}

/**
 * CRITICAL FIX: Proper ascendant calculation
 */
function calculateAscendantCorrected(
  utcDateTime: Date,
  latitude: number,
  longitude: number
): { ascendant: number; mc: number; lst: number } {
  
  // Calculate Julian Date
  const jd = (utcDateTime.getTime() / 86400000) + 2440587.5;
  
  // Calculate GMST
  const T = (jd - 2451545.0) / 36525.0;
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 
               0.000387933 * T * T - (T * T * T) / 38710000.0;
  const gmstNormalized = ((gmst % 360) + 360) % 360;
  
  // Calculate LST
  const lst = (gmstNormalized + longitude) % 360;
  const mc = lst;
  
  // Calculate Ascendant with proper obliquity
  const OBLIQUITY = 23.4397;
  const oblRad = (OBLIQUITY * Math.PI) / 180;
  const latRad = (latitude * Math.PI) / 180;
  const ramcRad = (lst * Math.PI) / 180;
  
  const numerator = Math.cos(ramcRad);
  const denominator = -Math.sin(ramcRad) * Math.cos(oblRad) - 
                      Math.tan(latRad) * Math.sin(oblRad);
  
  let ascendant = Math.atan2(numerator, denominator) * (180 / Math.PI);
  ascendant = ((ascendant % 360) + 360) % 360;
  
  return { ascendant, mc, lst };
}

/**
 * Convert UTC datetime from database back to local time for form display
 */
function utcToLocalDateTime(utcDateStr: string, timezone: string): { date: string; time: string } {
  const utcDate = new Date(utcDateStr);
  const [year, month, day] = utcDateStr.split('T')[0].split('-').map(Number);
  const utcTime = utcDateStr.split('T')[1];
  const [hours, minutes] = utcTime.split(':').map(Number);
  
  // Determine timezone offset
  let offset: number;
  if (timezone.includes('E')) {
    offset = isDST(month - 1, day, year) ? -4 : -5;
  } else if (timezone.includes('C')) {
    offset = isDST(month - 1, day, year) ? -5 : -6;
  } else if (timezone.includes('M')) {
    offset = isDST(month - 1, day, year) ? -6 : -7;
  } else if (timezone.includes('P')) {
    offset = isDST(month - 1, day, year) ? -7 : -8;
  } else {
    offset = TIMEZONE_OFFSETS[timezone] || 0;
  }
  
  // Convert UTC to local by adding offset
  const localMs = utcDate.getTime() + (offset * 60 * 60 * 1000);
  const localDate = new Date(localMs);
  
  const localDateStr = localDate.toISOString().split('T')[0];
  const localTimeStr = localDate.toISOString().split('T')[1].slice(0, 5);
  
  return { date: localDateStr, time: localTimeStr };
}

export const BirthChartForm: React.FC<BirthChartFormProps> = ({ onSave, existingChart, userId }) => {
  // Convert existing chart UTC time back to local time for display
  const initDateTime = existingChart?.birth_date_time && existingChart?.birth_timezone
    ? utcToLocalDateTime(existingChart.birth_date_time, existingChart.birth_timezone)
    : { date: '', time: '' };
  
  // Normalize timezone from database (convert IANA to abbreviation)
  let initialTimezone = 'EDT';
  if (existingChart?.birth_timezone) {
    if (existingChart.birth_timezone.includes('America/New_York')) {
      // Check the birth date to determine if DST was in effect
      const [year, month, day] = (existingChart.birth_date_time || '').split('T')[0].split('-').map(Number);
      initialTimezone = isDST(month - 1, day, year) ? 'EDT' : 'EST';
    } else if (existingChart.birth_timezone.includes('America/Chicago')) {
      const [year, month, day] = (existingChart.birth_date_time || '').split('T')[0].split('-').map(Number);
      initialTimezone = isDST(month - 1, day, year) ? 'CDT' : 'CST';
    } else {
      initialTimezone = existingChart.birth_timezone;
    }
  }
  
  const [formData, setFormData] = useState({
    birthDate: initDateTime.date,
    birthTime: initDateTime.time,
    latitude: existingChart?.birth_latitude ? existingChart.birth_latitude.toString() : '',
    longitude: existingChart?.birth_longitude ? existingChart.birth_longitude.toString() : '',
    city: existingChart?.birth_city || '',
    country: existingChart?.birth_country || '',
    timezone: initialTimezone
  });

  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLocationSearch = async () => {
    if (!formData.city) {
      setError('Please enter a city name');
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(formData.city)}&format=json&limit=1`
      );
      const data = await response.json();
      
      if (data && data[0]) {
        setFormData(prev => ({
          ...prev,
          latitude: data[0].lat.toString(),
          longitude: data[0].lon.toString(),
          city: data[0].display_name.split(',')[0],
          country: data[0].display_name.split(',').pop()?.trim() || ''
        }));
        setError(null);
      } else {
        setError('City not found. Please try again.');
      }
    } catch (err) {
      setError('Failed to fetch location. Please enter coordinates manually.');
    }
  };

  const calculateBirthChart = async () => {
    console.log('=== CALCULATE BIRTH CHART CLICKED ===');
    console.log('Form data:', formData);
    
    if (!formData.birthDate || !formData.birthTime || !formData.latitude || !formData.longitude) {
      setError('Please fill in all required fields');
      console.error('Missing required fields');
      return;
    }

    setCalculating(true);
    setSaving(false);
    setError(null);
    setSuccess(false);

    try {
      const lat = parseFloat(formData.latitude);
      const lon = parseFloat(formData.longitude);

      // CRITICAL FIX: Parse datetime without browser timezone interference
      const utcDateTime = parseLocalDateTime(
        formData.birthDate,
        formData.birthTime,
        formData.timezone
      );

      console.log('Calculating chart for:', {
        date: formData.birthDate,
        time: formData.birthTime,
        timezone: formData.timezone,
        utcDateTime: utcDateTime.toISOString(),
        lat, lon
      });

      // Calculate ascendant and MC
      const { ascendant: ascDegrees, mc } = calculateAscendantCorrected(
        utcDateTime,
        lat,
        lon
      );

      console.log('Calculated:', {
        ascendant: ascDegrees.toFixed(2),
        mc: mc.toFixed(2)
      });

      // Calculate house cusps
      const houseCusps = calculateHouseCusps(ascDegrees, mc, lat);

      // Calculate natal planets using UTC time
      const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
      const natalPlanets: any = {};
      const planetaryPositions: any = {};

      console.log('Calculating natal aspects...');
      const planetToSephirah: Record<string, string> = {};
      Object.keys(natalPlanets).forEach(planetName => {
        const sephirah = PLANETARY_SEPHIROT[planetName];
        if (sephirah) {
          planetToSephirah[planetName] = sephirah.name;
        }
      });

      const natalAspects = calculateAllAspects(natalPlanets, planetToSephirah);

      console.log('Natal aspects calculated:', {
        totalAspects: natalAspects.length,
        byType: {
          conjunction: natalAspects.filter(a => a.type === 'conjunction').length,
          opposition: natalAspects.filter(a => a.type === 'opposition').length,
          trine: natalAspects.filter(a => a.type === 'trine').length,
          square: natalAspects.filter(a => a.type === 'square').length,
          sextile: natalAspects.filter(a => a.type === 'sextile').length,
          quincunx: natalAspects.filter(a => a.type === 'quincunx').length,
        },
        tightestAspect: natalAspects[0] ? 
          `${natalAspects[0].planet1} ${natalAspects[0].symbol} ${natalAspects[0].planet2} (${natalAspects[0].orb.toFixed(2)}°)` 
          : 'none'
      });

      // Log retrograde planets
      const retrogradePlanets = Object.entries(planetaryPositions)
        .filter(([_, data]: [string, any]) => data.isRetrograde)
        .map(([name, _]) => name);
      if (retrogradePlanets.length > 0) {
        console.log('Retrograde planets:', retrogradePlanets.join(', '));
      }
      
      planets.forEach(planetName => {
        try {
          const body = (Astronomy.Body as any)[planetName];
          const geoVector = Astronomy.GeoVector(body, utcDateTime, true);
          const ecliptic = Astronomy.Ecliptic(geoVector);
          const zodiac = eclipticToZodiac(ecliptic.elon);
          
          // Calculate absolute degree (0-360)
          const absoluteDegree = calculateAbsoluteDegree(zodiac.sign, zodiac.degree);
          
          // Check if planet is retrograde (for outer planets)
          let isRetrograde = false;
          if (['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(planetName)) {
            // Simple retrograde check: compare position 1 day before and after
            const dayBefore = new Date(utcDateTime.getTime() - 86400000);
            const dayAfter = new Date(utcDateTime.getTime() + 86400000);
            
            const vecBefore = Astronomy.GeoVector(body, dayBefore, true);
            const vecAfter = Astronomy.GeoVector(body, dayAfter, true);
            
            const eclBefore = Astronomy.Ecliptic(vecBefore);
            const eclAfter = Astronomy.Ecliptic(vecAfter);
            
            // If longitude decreased, planet is retrograde
            isRetrograde = eclAfter.elon < eclBefore.elon;
          }
          
          // Store in natal_planets format (for existing compatibility)
          natalPlanets[planetName] = {
            sign: zodiac.sign,
            degree_in_sign: zodiac.degree,
            house: calculateHouse(ecliptic.elon, houseCusps)
          };
          
          // Store complete astronomical data in planetary_positions
          planetaryPositions[planetName] = {
            absoluteDegree: absoluteDegree,
            eclipticLongitude: ecliptic.elon,
            eclipticLatitude: ecliptic.elat,
            distanceAU: Math.sqrt(geoVector.x * geoVector.x + geoVector.y * geoVector.y + geoVector.z * geoVector.z),
            sign: zodiac.sign,
            degreeInSign: zodiac.degree,
            house: calculateHouse(ecliptic.elon, houseCusps),
            isRetrograde: isRetrograde,
            // Store the raw vector for future advanced calculations
            geocentricPosition: {
              x: geoVector.x,
              y: geoVector.y,
              z: geoVector.z
            }
          };
          
          console.log(`${planetName}: ${zodiac.sign} ${zodiac.degree.toFixed(2)}° (${absoluteDegree.toFixed(2)}°) ${isRetrograde ? '℞' : ''}`);
          
        } catch (err) {
          console.error(`Error calculating ${planetName}:`, err);
        }
      });
      const ascendantSign = eclipticToZodiac(ascDegrees);
      const midheavenSign = eclipticToZodiac(mc);

      console.log('Final signs:', {
        ascendant: `${ascendantSign.sign} ${ascendantSign.degree.toFixed(2)}°`,
        mc: `${midheavenSign.sign} ${midheavenSign.degree.toFixed(2)}°`
      });

      const chartData: BirthChartData = {
        birth_date_time: utcDateTime.toISOString(),
        birth_city: formData.city,
        birth_country: formData.country,
        birth_latitude: lat,
        birth_longitude: lon,
        birth_timezone: formData.timezone,
        natal_planets: natalPlanets,
        natal_aspects: natalAspects,
        planetary_positions: planetaryPositions,
        ascendant_sign: ascendantSign.sign,
        ascendant_degree: ascendantSign.degree,
        midheaven_sign: midheavenSign.sign,
        midheaven_degree: midheavenSign.degree,
        house_cusps: houseCusps,
      };

      setSaving(true);
      console.log('Attempting to save chart data:', {
        ascendant_sign: chartData.ascendant_sign,
        ascendant_degree: chartData.ascendant_degree,
        birth_date_time: chartData.birth_date_time,
        birth_timezone: chartData.birth_timezone
      });
      
      const savedChart = await saveBirthChart(chartData);
      
      console.log('Chart saved successfully! Returned data:', {
        ascendant_sign: savedChart.ascendant_sign,
        ascendant_degree: savedChart.ascendant_degree,
        id: savedChart.id
      });
      
      onSave(savedChart);
      setSuccess(true);
      setCalculating(false);
      setSaving(false);
    } catch (err: any) {
      console.error('Birth chart calculation error:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint
      });
      setError(`Failed to save: ${err.message || 'Unknown error'}`);
      setCalculating(false);
      setSaving(false);
    }
  };

  const eclipticToZodiac = (longitude: number): { sign: string; degree: number } => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const normalizedLon = ((longitude % 360) + 360) % 360;
    const signIndex = Math.floor(normalizedLon / 30);
    const degree = normalizedLon % 30;
    return { sign: signs[signIndex], degree: degree };
  };

  const calculateHouseCusps = (ascendant: number, mc: number, lat: number): number[] => {
    const cusps = new Array(12);
    cusps[0] = ascendant;
    cusps[9] = mc;
    cusps[6] = (ascendant + 180) % 360;
    cusps[3] = (mc + 180) % 360;
    
    for (let i = 11; i <= 12; i++) {
      const fraction = (i - 9) / 3;
      const diff = ((ascendant - mc + 360) % 360);
      cusps[i - 1] = (mc + diff * fraction) % 360;
    }
    
    for (let i = 2; i <= 3; i++) {
      const fraction = (i - 1) / 3;
      const diff = ((cusps[3] - ascendant + 360) % 360);
      cusps[i - 1] = (ascendant + diff * fraction) % 360;
    }
    
    for (let i = 5; i <= 6; i++) {
      const fraction = (i - 4) / 3;
      const diff = ((cusps[6] - cusps[3] + 360) % 360);
      cusps[i - 1] = (cusps[3] + diff * fraction) % 360;
    }
    
    for (let i = 8; i <= 9; i++) {
      const fraction = (i - 7) / 3;
      const diff = ((mc - cusps[6] + 360) % 360);
      cusps[i - 1] = (cusps[6] + diff * fraction) % 360;
    }
    
    return cusps;
  };

  const calculateHouse = (planetLon: number, houseCusps: number[]): string => {
    const normalizedLon = ((planetLon % 360) + 360) % 360;
    
    for (let i = 0; i < 12; i++) {
      const currentCusp = houseCusps[i];
      const nextCusp = houseCusps[(i + 1) % 12];
      
      if (nextCusp > currentCusp) {
        if (normalizedLon >= currentCusp && normalizedLon < nextCusp) {
          return `House ${i + 1}`;
        }
      } else {
        if (normalizedLon >= currentCusp || normalizedLon < nextCusp) {
          return `House ${i + 1}`;
        }
      }
    }
    
    return 'House 1';
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          {existingChart ? 'Update Birth Chart' : 'Create Your Birth Chart'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Birth chart saved successfully! Your personalized readings are now available.
            </AlertDescription>
          </Alert>
        )}

        {existingChart && (
          <Alert>
            <AlertDescription className="text-sm">
              <strong>Note:</strong> If your chart was calculated before the recent timezone fix, 
              please verify your birth information and recalculate to ensure accuracy.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Calendar className="w-4 h-4" />
            Birth Date
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Clock className="w-4 h-4" />
            Birth Time (local time)
          </label>
          <input
            type="time"
            value={formData.birthTime}
            onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <MapPin className="w-4 h-4" />
            Birth City
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-md"
              placeholder="e.g., Plattsburgh"
              required
            />
            <Button onClick={handleLocationSearch} variant="outline" type="button">
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g., 44.6995"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g., -73.4529"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Timezone</label>
          <select
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="EDT">Eastern Daylight Time (EDT)</option>
            <option value="EST">Eastern Standard Time (EST)</option>
            <option value="CDT">Central Daylight Time (CDT)</option>
            <option value="CST">Central Standard Time (CST)</option>
            <option value="MDT">Mountain Daylight Time (MDT)</option>
            <option value="MST">Mountain Standard Time (MST)</option>
            <option value="PDT">Pacific Daylight Time (PDT)</option>
            <option value="PST">Pacific Standard Time (PST)</option>
            <option value="UTC">UTC</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Select the timezone that was in effect at your birth location on your birth date
          </p>
        </div>

        <Button
          onClick={calculateBirthChart}
          disabled={calculating || saving}
          className="w-full"
        >
          {calculating ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Calculating...
            </>
          ) : saving ? (
            <>
              <Save className="w-4 h-4 mr-2 animate-pulse" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {existingChart ? 'Update Chart' : 'Calculate & Save Chart'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};