import React, { useEffect, useState } from "react";
import * as Astronomy from 'astronomy-engine';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, MapPin, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlanetData {
  sign: string;
  degree_in_sign: number;
  house: string;
}

interface CurrentSkyData {
  location: string;
  sun_moon: {
    sunrise: string;
    sunset: string;
    moon_phase: string;
  };
  planets: {
    [key: string]: PlanetData;
  };
}

const GEOLOCATION_TIMEOUT = 10000;
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 
  'Leo', 'Virgo', 'Libra', 'Scorpio', 
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const CurrentSky: React.FC = () => {
  const [data, setData] = useState<CurrentSkyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [locationName, setLocationName] = useState<string>("");

  // Convert ecliptic longitude to zodiac sign and degree
  const eclipticToZodiac = (longitude: number): { sign: string; degree: number } => {
    // Normalize longitude to 0-360
    const normalizedLon = ((longitude % 360) + 360) % 360;
    
    // Each sign is 30 degrees
    const signIndex = Math.floor(normalizedLon / 30);
    const degree = normalizedLon % 30;
    
    return {
      sign: ZODIAC_SIGNS[signIndex],
      degree: degree
    };
  };

  // Calculate house for a planet (simplified Placidus-like system)
  const calculateHouse = (planetLon: number, ascendantLon: number): string => {
    // Simplified house calculation - each house is ~30 degrees from ascendant
    let houseDegree = ((planetLon - ascendantLon + 360) % 360);
    let house = Math.floor(houseDegree / 30) + 1;
    
    if (house > 12) house = 1;
    
    return `House ${house}`;
  };

  // Get moon phase name
  const getMoonPhase = (illumination: number): string => {
    if (illumination < 0.05) return 'New Moon';
    if (illumination < 0.25) return 'Waxing Crescent';
    if (illumination < 0.35) return 'First Quarter';
    if (illumination < 0.65) return 'Waxing Gibbous';
    if (illumination < 0.75) return 'Full Moon';
    if (illumination < 0.85) return 'Waning Gibbous';
    if (illumination < 0.95) return 'Last Quarter';
    return 'Waning Crescent';
  };

  // Calculate planetary positions
  const calculateSkyData = (lat: number, lon: number, location: string) => {
    try {
      const observer = new Astronomy.Observer(lat, lon, 0);
      const now = new Date();

      // Calculate Sun position for ascendant approximation
      const sunVector = Astronomy.GeoVector(Astronomy.Body.Sun, now, false);
      const sunEcliptic = Astronomy.Ecliptic(sunVector);
      const sunZodiac = eclipticToZodiac(sunEcliptic.elon);

      // Calculate Moon
      const moonVector = Astronomy.GeoVector(Astronomy.Body.Moon, now, true);
      const moonEcliptic = Astronomy.Ecliptic(moonVector);
      const moonZodiac = eclipticToZodiac(moonEcliptic.elon);
      const moonIllumination = Astronomy.Illumination(Astronomy.Body.Moon, now);

      // Calculate rise/set times
      const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, now, 1, 0);
      const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, now, 1, 0);

      // Use sun's position as rough ascendant (this is simplified)
      const ascendantLon = sunEcliptic.elon;

      // Calculate all planets
      const planetBodies = [
        Astronomy.Body.Mercury,
        Astronomy.Body.Venus,
        Astronomy.Body.Mars,
        Astronomy.Body.Jupiter,
        Astronomy.Body.Saturn,
        Astronomy.Body.Uranus,
        Astronomy.Body.Neptune,
        Astronomy.Body.Pluto
      ];
      const planets: { [key: string]: PlanetData } = {};

      // Add Sun
      planets['Sun'] = {
        sign: sunZodiac.sign,
        degree_in_sign: sunZodiac.degree,
        house: calculateHouse(sunEcliptic.elon, ascendantLon)
      };

      // Add Moon
      planets['Moon'] = {
        sign: moonZodiac.sign,
        degree_in_sign: moonZodiac.degree,
        house: calculateHouse(moonEcliptic.elon, ascendantLon)
      };

      // Calculate other planets
      planetBodies.forEach(body => {
        try {
          const geoVector = Astronomy.GeoVector(body, now, true);
          const ecliptic = Astronomy.Ecliptic(geoVector);
          const zodiac = eclipticToZodiac(ecliptic.elon);

          // Get planet name from body enum
          const planetName = Astronomy.Body[body];

          planets[planetName] = {
            sign: zodiac.sign,
            degree_in_sign: zodiac.degree,
            house: calculateHouse(ecliptic.elon, ascendantLon)
          };
        } catch (err) {
          console.error(`Error calculating planet:`, err);
        }
      });

      const skyData: CurrentSkyData = {
        location: location,
        sun_moon: {
          sunrise: sunrise?.date?.toISOString() || new Date().toISOString(),
          sunset: sunset?.date?.toISOString() || new Date().toISOString(),
          moon_phase: getMoonPhase(moonIllumination.phase_fraction)
        },
        planets
      };

      setData(skyData);
      setError(null);
    } catch (err) {
      console.error("Sky calculation error:", err);
      setError("Failed to calculate planetary positions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Extract location name
  const extractLocationName = (geocodeResponse: any): string => {
    const { address } = geocodeResponse;
    if (!address) return geocodeResponse.display_name;

    const locality = address.city || address.town || address.village || 
                     address.hamlet || address.suburb;
    const region = address.state || address.county || address.region;
    const country = address.country;

    const parts = [locality, region].filter(Boolean);
    
    if (parts.length < 2 && country) {
      parts.push(country);
    }
    
    return parts.join(', ') || geocodeResponse.display_name;
  };

  // Fetch location name from coordinates
  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        {
          headers: {
            'User-Agent': 'TarotPathwork/1.0',
          }
        }
      );
      
      if (!res.ok) {
        throw new Error('Geocoding failed');
      }
      
      const json = await res.json();
      const location = extractLocationName(json);
      setLocationName(location);
      
      // Calculate sky data with location
      calculateSkyData(lat, lon, location);
    } catch (err) {
      console.error("Location fetch error:", err);
      // Use coordinates as fallback
      const location = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
      setLocationName(location);
      calculateSkyData(lat, lon, location);
    }
  };

  // Check geolocation permission
  const checkLocationPermission = async (): Promise<boolean> => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        return result.state !== 'denied';
      } catch {
        return true;
      }
    }
    return true;
  };

  // Request geolocation
  const requestLocation = async () => {
    setLoading(true);
    setError(null);

    const canRequest = await checkLocationPermission();
    if (!canRequest) {
      setError("Location access is blocked. Please enable it in your browser settings.");
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchLocationName(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Location access denied.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please allow location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please try again.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: GEOLOCATION_TIMEOUT,
        maximumAge: 300000,
      }
    );
  };

  // Manual refresh
  const handleRefresh = () => {
    requestLocation();
  };

  // Initial load
  useEffect(() => {
    requestLocation();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-4 border rounded-xl shadow-lg bg-card max-w-xl mx-auto mt-6">
        <Skeleton className="h-6 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-6" />
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-5 w-1/3 mb-2" />
        <div className="grid grid-cols-2 gap-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              onClick={handleRefresh} 
              size="sm" 
              variant="outline"
              className="ml-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // No data fallback
  if (!data) return null;

  return (
    <div className="p-4 border rounded-xl shadow-lg bg-card max-w-xl mx-auto mt-6 relative">
      {/* Refresh button */}
      <Button
        onClick={handleRefresh}
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2"
        disabled={loading}
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      </Button>

      <div className="flex items-center justify-center gap-2 mb-2">
        <MapPin className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl text-center font-semibold text-black">Current Sky</h2>
      </div>
      
      <h3 className="text-lg text-center font-medium mb-4 text-black">{data.location}</h3>

      <div className="space-y-2 mb-4">
        <p className="text-black">
          <strong>Moon Phase:</strong> {data.sun_moon.moon_phase}
        </p>
        <p className="text-black">
          <strong>Sunrise:</strong> {new Date(data.sun_moon.sunrise).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
        <p className="text-black">
          <strong>Sunset:</strong> {new Date(data.sun_moon.sunset).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-black">Planets</h3>
        <ul className="grid grid-cols-2 gap-2 mt-2 text-sm text-black">
          {Object.entries(data.planets).map(([planet, details]) => (
            <li key={planet} className="p-2 bg-muted/50 rounded-md">
              <strong className="capitalize">{planet}:</strong> {details.sign} {Math.round(details.degree_in_sign)}° ({details.house})
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Calculated at {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
};

export default CurrentSky;