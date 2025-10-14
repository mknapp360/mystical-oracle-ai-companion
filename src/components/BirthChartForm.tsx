// src/components/BirthChartForm.tsx

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

export const BirthChartForm: React.FC<BirthChartFormProps> = ({ onSave, existingChart, userId }) => {
  // Initialize form with existing chart data if available
  const [formData, setFormData] = useState({
    birthDate: existingChart?.birth_date_time ? new Date(existingChart.birth_date_time).toISOString().split('T')[0] : '',
    birthTime: existingChart?.birth_date_time ? new Date(existingChart.birth_date_time).toISOString().split('T')[1].slice(0, 5) : '',
    latitude: existingChart?.birth_latitude ? existingChart.birth_latitude.toString() : '',
    longitude: existingChart?.birth_longitude ? existingChart.birth_longitude.toString() : '',
    city: existingChart?.birth_city || '',
    country: existingChart?.birth_country || '',
    timezone: existingChart?.birth_timezone || 'UTC'
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
      // Use a geocoding service (you'll need to add an API key)
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
      // Combine date and time
      const birthDateTime = new Date(`${formData.birthDate}T${formData.birthTime}:00`);
      const lat = parseFloat(formData.latitude as any);
      const lon = parseFloat(formData.longitude as any);

      // Calculate planetary positions at birth
      const observer = new Astronomy.Observer(lat, lon, 0);
      
      // Calculate Ascendant
      const time = Astronomy.MakeTime(birthDateTime);
      const gast = Astronomy.SiderealTime(time);
      const lst = (gast + lon / 15.0) % 24.0;
      const lstDegrees = lst * 15.0;
      const latRad = (lat * Math.PI) / 180;
      const lstRad = (lstDegrees * Math.PI) / 180;
      const ascRad = Math.atan2(Math.cos(lstRad), -(Math.sin(lstRad) * Math.cos(latRad)));
      let ascDegrees = (ascRad * 180) / Math.PI;
      ascDegrees = ((ascDegrees % 360) + 360) % 360;

      // Calculate Midheaven
      const mc = (lst * 15.0) % 360;

      // Calculate house cusps (simplified Placidus)
      const houseCusps = calculateHouseCusps(ascDegrees, mc, lat);

      // Calculate natal planets
      const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
      const natalPlanets: any = {};

      planets.forEach(planetName => {
        try {
          const body = (Astronomy.Body as any)[planetName];
          const geoVector = Astronomy.GeoVector(body, birthDateTime, true);
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

      // Get Ascendant sign
      const ascendantSign = eclipticToZodiac(ascDegrees);
      const midheavenSign = eclipticToZodiac(mc);

      const chartData: BirthChartData = {
        birth_date_time: birthDateTime.toISOString(),
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

      // Save to Supabase
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

  // Helper functions (same as CurrentSky)
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

        {/* Birth Date */}
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

        {/* Birth Time */}
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

        {/* Birth Location */}
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
              placeholder="e.g., New York"
              className="flex-1 px-3 py-2 border rounded-md"
              required
            />
            <Button onClick={handleLocationSearch} variant="outline">
              Search
            </Button>
          </div>
        </div>

        {/* Coordinates (auto-filled or manual) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
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
              required
            />
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label className="text-sm font-medium mb-2 block">Timezone</label>
          <select
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern (US)</option>
            <option value="America/Chicago">Central (US)</option>
            <option value="America/Denver">Mountain (US)</option>
            <option value="America/Los_Angeles">Pacific (US)</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
            {/* Add more timezones as needed */}
          </select>
        </div>

        {/* Submit Button */}
        <Button
          onClick={calculateBirthChart}
          disabled={calculating || saving}
          className="w-full"
        >
          <Save className="w-4 h-4 mr-2" />
          {calculating ? 'Calculating...' : saving ? 'Saving...' : existingChart ? 'Update Chart' : 'Calculate & Save'}
        </Button>

        {existingChart && (
          <p className="text-xs text-gray-500 text-center">
            Chart created: {new Date(existingChart.created_at!).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};