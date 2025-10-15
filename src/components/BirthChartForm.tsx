// src/components/BirthChartForm.tsx
// PRODUCTION-READY VERSION WITH CORRECTED ASCENDANT CALCULATION

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, MapPin, Clock, Save, Sparkles, CheckCircle } from 'lucide-react';
import * as Astronomy from 'astronomy-engine';
import { saveBirthChart, type BirthChartData } from '@/lib/birthChartService';

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
function isDST(date: Date): boolean {
  const month = date.getMonth();
  // Simplified: March (2) through October (10)
  return month >= 2 && month <= 10;
}

/**
 * CRITICAL FIX: Convert local time to UTC
 */
function localToUTC(localDate: Date, timezoneString: string): Date {
  let offset: number;
  
  if (timezoneString.includes('E')) {
    offset = isDST(localDate) ? -4 : -5; // Eastern
  } else if (timezoneString.includes('C')) {
    offset = isDST(localDate) ? -5 : -6; // Central
  } else if (timezoneString.includes('M')) {
    offset = isDST(localDate) ? -6 : -7; // Mountain
  } else if (timezoneString.includes('P')) {
    offset = isDST(localDate) ? -7 : -8; // Pacific
  } else {
    offset = TIMEZONE_OFFSETS[timezoneString] || 0;
  }
  
  const utcTime = localDate.getTime() - (offset * 60 * 60 * 1000);
  return new Date(utcTime);
}

/**
 * CRITICAL FIX: Proper ascendant calculation with timezone handling
 */
function calculateAscendantCorrected(
  localDateTime: Date,
  latitude: number,
  longitude: number,
  timezone: string
): { ascendant: number; mc: number; lst: number } {
  
  // Convert to UTC
  const utcDateTime = localToUTC(localDateTime, timezone);
  
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

export const BirthChartForm: React.FC<BirthChartFormProps> = ({ onSave, existingChart, userId }) => {
  const [formData, setFormData] = useState({
    birthDate: existingChart?.birth_date_time ? new Date(existingChart.birth_date_time).toISOString().split('T')[0] : '',
    birthTime: existingChart?.birth_date_time ? new Date(existingChart.birth_date_time).toISOString().split('T')[1].slice(0, 5) : '',
    latitude: existingChart?.birth_latitude ? existingChart.birth_latitude.toString() : '',
    longitude: existingChart?.birth_longitude ? existingChart.birth_longitude.toString() : '',
    city: existingChart?.birth_city || '',
    country: existingChart?.birth_country || '',
    timezone: existingChart?.birth_timezone || 'EDT'
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
    if (!formData.birthDate || !formData.birthTime || !formData.latitude || !formData.longitude) {
      setError('Please fill in all required fields');
      return;
    }

    setCalculating(true);
    setSaving(false);
    setError(null);
    setSuccess(false);

    try {
      const localDateTime = new Date(`${formData.birthDate}T${formData.birthTime}:00`);
      const lat = parseFloat(formData.latitude);
      const lon = parseFloat(formData.longitude);

      console.log('Calculating chart for:', {
        localTime: localDateTime.toISOString(),
        lat, lon,
        timezone: formData.timezone
      });

      // CORRECTED: Use proper timezone-aware calculation
      const { ascendant: ascDegrees, mc } = calculateAscendantCorrected(
        localDateTime,
        lat,
        lon,
        formData.timezone
      );

      console.log('Calculated:', {
        ascendant: ascDegrees,
        mc: mc
      });

      // Calculate house cusps
      const houseCusps = calculateHouseCusps(ascDegrees, mc, lat);

      // Calculate natal planets using UTC time
      const utcDateTime = localToUTC(localDateTime, formData.timezone);
      const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
      const natalPlanets: any = {};

      planets.forEach(planetName => {
        try {
          const body = (Astronomy.Body as any)[planetName];
          const geoVector = Astronomy.GeoVector(body, utcDateTime, true);
          const ecliptic = Astronomy.Ecliptic(geoVector);
          const zodiac = eclipticToZodiac(ecliptic.elon);
          
          natalPlanets[planetName] = {
            sign: zodiac.sign,
            degree_in_sign: zodiac.degree,
            house: calculateHouse(ecliptic.elon, houseCusps)
          };
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
        ascendant_sign: ascendantSign.sign,
        ascendant_degree: ascendantSign.degree,
        midheaven_sign: midheavenSign.sign,
        midheaven_degree: midheavenSign.degree,
        house_cusps: houseCusps,
      };

      setSaving(true);
      const savedChart = await saveBirthChart(chartData);
      
      onSave(savedChart);
      setSuccess(true);
      setCalculating(false);
      setSaving(false);
    } catch (err) {
      console.error('Birth chart calculation error:', err);
      setError('Failed to calculate or save birth chart. Please check your inputs.');
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