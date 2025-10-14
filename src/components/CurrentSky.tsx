import React, { useEffect, useState } from "react";
import * as Astronomy from 'astronomy-engine';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, MapPin, AlertCircle, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import the Sephirotic correspondences
import { 
  PLANETARY_SEPHIROT, 
  ZODIAC_PATHS, 
  HOUSE_SEPHIROT,
  generateKabbalisticReading,
  synthesizeInfluence,
  calculateWorldActivation,
  determineWorld,
  FOUR_WORLDS,
  type World
} from '@/lib/sephirotic-correspondences';

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

const KabbalisticCurrentSky: React.FC = () => {
  const [data, setData] = useState<CurrentSkyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [locationName, setLocationName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("astronomical");

  // [All the calculation functions from your original CurrentSky.tsx]
  // Copy these exactly: eclipticToZodiac, calculateAscendant, calculateMidheaven, 
  // calculateHouseCusps, calculateHouse, getMoonPhase, calculateSkyData, etc.

  const eclipticToZodiac = (longitude: number): { sign: string; degree: number } => {
    const normalizedLon = ((longitude % 360) + 360) % 360;
    const signIndex = Math.floor(normalizedLon / 30);
    const degree = normalizedLon % 30;
    return { sign: ZODIAC_SIGNS[signIndex], degree: degree };
  };

  const calculateAscendant = (lat: number, lon: number, date: Date): number => {
    const time = Astronomy.MakeTime(date);
    const gast = Astronomy.SiderealTime(time);
    const lst = (gast + lon / 15.0) % 24.0;
    const lstDegrees = lst * 15.0;
    const latRad = (lat * Math.PI) / 180;
    const lstRad = (lstDegrees * Math.PI) / 180;
    const ascRad = Math.atan2(Math.cos(lstRad), -(Math.sin(lstRad) * Math.cos(latRad)));
    let ascDegrees = (ascRad * 180) / Math.PI;
    ascDegrees = ((ascDegrees % 360) + 360) % 360;
    return ascDegrees;
  };

  const calculateMidheaven = (date: Date, lon: number): number => {
    const time = Astronomy.MakeTime(date);
    const gast = Astronomy.SiderealTime(time);
    const lst = (gast + lon / 15.0) % 24.0;
    const mc = (lst * 15.0) % 360;
    return mc;
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

  const calculateSkyData = (lat: number, lon: number, location: string) => {
    try {
      const observer = new Astronomy.Observer(lat, lon, 0);
      const now = new Date();

      const ascendant = calculateAscendant(lat, lon, now);
      const mc = calculateMidheaven(now, lon);
      const houseCusps = calculateHouseCusps(ascendant, mc, lat);

      const sunVector = Astronomy.GeoVector(Astronomy.Body.Sun, now, false);
      const sunEcliptic = Astronomy.Ecliptic(sunVector);
      const sunZodiac = eclipticToZodiac(sunEcliptic.elon);

      const moonVector = Astronomy.GeoVector(Astronomy.Body.Moon, now, true);
      const moonEcliptic = Astronomy.Ecliptic(moonVector);
      const moonZodiac = eclipticToZodiac(moonEcliptic.elon);
      const moonIllumination = Astronomy.Illumination(Astronomy.Body.Moon, now);

      const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, now, 1, 0);
      const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, now, 1, 0);

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

      planets['Sun'] = {
        sign: sunZodiac.sign,
        degree_in_sign: sunZodiac.degree,
        house: calculateHouse(sunEcliptic.elon, houseCusps)
      };

      planets['Moon'] = {
        sign: moonZodiac.sign,
        degree_in_sign: moonZodiac.degree,
        house: calculateHouse(moonEcliptic.elon, houseCusps)
      };

      planetBodies.forEach(body => {
        try {
          const geoVector = Astronomy.GeoVector(body, now, true);
          const ecliptic = Astronomy.Ecliptic(geoVector);
          const zodiac = eclipticToZodiac(ecliptic.elon);
          const planetName = Astronomy.Body[body];

          planets[planetName] = {
            sign: zodiac.sign,
            degree_in_sign: zodiac.degree,
            house: calculateHouse(ecliptic.elon, houseCusps)
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
      calculateSkyData(lat, lon, location);
    } catch (err) {
      console.error("Location fetch error:", err);
      const location = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
      setLocationName(location);
      calculateSkyData(lat, lon, location);
    }
  };

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

  const handleRefresh = () => {
    requestLocation();
  };

  useEffect(() => {
    requestLocation();
  }, []);

  if (loading) {
    return (
      <div className="p-4 border rounded-xl shadow-lg bg-card max-w-2xl mx-auto mt-6">
        <Skeleton className="h-6 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-6" />
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-6">
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

  if (!data) return null;

  // Generate Kabbalistic interpretation
  const kabbalisticReading = generateKabbalisticReading(data);

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <Card className="border-border shadow-lg bg-card relative">
        <Button
          onClick={handleRefresh}
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>

        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-xl text-center font-semibold text-black">
              Current Sky
            </CardTitle>
          </div>
          <h3 className="text-lg text-center font-medium text-black">{data.location}</h3>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="astronomical">Astronomical</TabsTrigger>
              <TabsTrigger value="kabbalistic">
                <Sparkles className="w-4 h-4 mr-2" />
                Kabbalistic
              </TabsTrigger>
            </TabsList>

            <TabsContent value="astronomical" className="space-y-4">
              <div className="space-y-2">
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

              <div>
                <h3 className="text-lg font-semibold mb-2 text-black">Planets</h3>
                <ul className="grid grid-cols-2 gap-2 text-sm text-black">
                  {Object.entries(data.planets).map(([planet, details]) => (
                    <li key={planet} className="p-2 bg-muted/50 rounded-md">
                      <strong className="capitalize">{planet}:</strong> {details.sign} {Math.round(details.degree_in_sign)}° ({details.house})
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="kabbalistic" className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm text-center text-purple-900 dark:text-purple-100 font-medium">
                  {kabbalisticReading.treeActivation}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-black">Active Sephiroth</h3>
                {kabbalisticReading.sephirotDetails.map(({ planet, sephirah, sign, house }) => {
                  // Import the data object to get actual planet positions
                  const planetData = data?.planets[planet];
                  if (!planetData) return null;
                  
                  const contextualInfluence = synthesizeInfluence(planet, planetData.sign, planetData.house);
                  
                  return (
                    <Card key={planet} className="border-l-4" style={{ borderLeftColor: sephirah.color }}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-black">{planet}</span>
                              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                                {sephirah.name} {sephirah.hebrew}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              <em>{sephirah.meaning}</em> - {sephirah.archetype}
                            </p>
                            <p className="text-sm text-black leading-relaxed">
                              {contextualInfluence}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Through <strong>{planetData.sign}</strong> in <strong>{planetData.house}</strong>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  💫 This reading shows which spheres of the Tree of Life are activated in the current cosmic moment
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Calculated at {new Date().toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KabbalisticCurrentSky;