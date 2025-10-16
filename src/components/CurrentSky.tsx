import React, { useEffect, useState, useMemo } from "react";
import * as Astronomy from 'astronomy-engine';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, MapPin, AlertCircle, Sun, Moon, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TreeOfLifeVisualization } from '@/components/TreeOfLifeVisualization';
import { PathwayEmanationsDisplay } from './PathwayEmanationsDisplay';
import { DivineMessageDisplay } from '@/components/ShefaDisplay';
import { generateDivineMessageFromSky } from '@/lib/shefa-calculator';
import { BirthChartForm } from './BirthChartForm';
import { PersonalizedTransitDisplay } from './PersonalizedTransitDisplay';
import { getUserBirthChart, saveTransitReading, type BirthChartData } from '@/lib/birthChartService';
import { calculateTransitAspects, generatePersonalizedTransitMessage } from '@/lib/transit-calculator';
import { supabase } from '@/lib/supabaseClient';

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

// Generate guidance text based on top emanations
const generateGuidance = (emanations: Record<World, number>): { text: string; worlds: [World, number][] } => {
  const sorted = (Object.entries(emanations) as [World, number][])
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2);
  
  const [top] = sorted;
  const topWorld = top[0];
  
  const guidance = {
    Atziluth: "Ideal for vision-setting, meditation, and connecting with your highest purpose.",
    Briah: "Perfect for planning, strategizing, and letting divine intelligence flow through thought.",
    Yetzirah: "Best time to honor emotions, create art, and let feelings guide your actions.",
    Assiah: "Optimal for concrete action, building tangible results, and physical manifestation."
  };
  
  return {
    text: guidance[topWorld],
    worlds: sorted
  };
};

const KabbalisticCurrentSky: React.FC = () => {
  const [data, setData] = useState<CurrentSkyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [locationName, setLocationName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("current");
  const [user, setUser] = useState<any>(null);
  const [birthChart, setBirthChart] = useState<BirthChartData | null>(null);
  const [loadingChart, setLoadingChart] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setError("Location request timed out. Using default location.");
      setLocationName("Default Location");
      calculateSkyData(51.5074, -0.1278, "London, England");
      setLoading(false);
    }, GEOLOCATION_TIMEOUT);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const geoData = await response.json();
          const location = geoData.address?.city || geoData.address?.town || geoData.address?.village || "Unknown Location";
          setLocationName(location);
          calculateSkyData(latitude, longitude, location);
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setLocationName("Unknown Location");
          calculateSkyData(latitude, longitude, "Unknown Location");
        }

        setLoading(false);
      },
      (err) => {
        clearTimeout(timeoutId);
        console.error("Geolocation error:", err);
        setError(`Location error: ${err.message}. Using default location.`);
        setLocationName("Default Location");
        calculateSkyData(51.5074, -0.1278, "London, England");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: GEOLOCATION_TIMEOUT - 1000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    handleRefresh();

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        const chart = await getUserBirthChart(session.user.id);
        setBirthChart(chart);
      }
      setLoadingChart(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const chart = await getUserBirthChart(session.user.id);
        setBirthChart(chart);
      } else {
        setBirthChart(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const kabbalisticReading = useMemo(() => {
    if (!data) return null;
    return generateKabbalisticReading(data);
  }, [data]);

  const worldActivation = useMemo(() => {
    if (!data) return null;
    return calculateWorldActivation(data);
  }, [data]);

  const divineMessage = useMemo(() => {
    if (!data || !kabbalisticReading || !worldActivation) return null;
    return generateDivineMessageFromSky(data, kabbalisticReading, worldActivation);
  }, [data, kabbalisticReading, worldActivation]);

  const treeData = useMemo(() => {
    if (!data) return {};
    const tree: any = {};
    Object.entries(data.planets).forEach(([planet, planetData]) => {
      const sephirah = PLANETARY_SEPHIROT[planet];
      const worldData = determineWorld(planet, planetData.sign, planetData.house);
      if (sephirah) {
        tree[planet] = {
          sign: planetData.sign,
          house: planetData.house,
          sephirah: sephirah.name,
          world: worldData.primary
        };
      }
    });
    return tree;
  }, [data]);

  const transitReading = useMemo(() => {
    if (!data || !birthChart || !worldActivation) return null;
    
    try {
      const transitAspects = calculateTransitAspects(data.planets, birthChart.natal_planets);
      const personalizedMessage = generatePersonalizedTransitMessage(
        transitAspects, 
        worldActivation.dominantWorld
      );
      
      saveTransitReading({
        birth_chart_id: birthChart.id!,
        transit_date: new Date().toISOString(),
        transit_planets: data.planets,
        transit_aspects: transitAspects,
        personalized_message: personalizedMessage
      }).catch(err => console.error('Error saving transit reading:', err));

      return {
        aspects: transitAspects,
        message: personalizedMessage,
        natalInfo: {
          sunSign: birthChart.natal_planets.Sun.sign,
          risingSign: birthChart.ascendant_sign,
          moonSign: birthChart.natal_planets.Moon.sign
        }
      };
    } catch (error) {
      console.error('Error calculating transits:', error);
      return null;
    }
  }, [data, birthChart, worldActivation]);

  const guidanceInfo = useMemo(() => {
    if (!worldActivation) return null;
    return generateGuidance(worldActivation.worldPercentages);
  }, [worldActivation]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const worldColors: Record<World, string> = {
    Atziluth: '#FFD700',
    Briah: '#87CEEB', 
    Yetzirah: '#9370DB',
    Assiah: '#8B4513'
  };

  // Sky arc calculations
  const getSkyArcData = () => {
    if (!data) return null;
    
    const sunrise = new Date(data.sun_moon.sunrise);
    const sunset = new Date(data.sun_moon.sunset);
    const now = new Date();
    
    const totalDayMinutes = (sunset.getTime() - sunrise.getTime()) / (1000 * 60);
    const elapsedMinutes = (now.getTime() - sunrise.getTime()) / (1000 * 60);
    const dayProgress = Math.max(0, Math.min(1, elapsedMinutes / totalDayMinutes));
    
    const isDaytime = now >= sunrise && now <= sunset;
    
    const arcRadius = 140;
    const centerX = 180;
    const baseY = 160;
    
    const angle = Math.PI - (dayProgress * Math.PI);
    const iconX = centerX + arcRadius * Math.cos(angle);
    const iconY = baseY - arcRadius * Math.sin(angle);
    
    return {
      sunrise,
      sunset,
      isDaytime,
      iconX,
      iconY,
      arcRadius,
      centerX,
      baseY
    };
  };

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

  if (!data || !kabbalisticReading || !worldActivation || !divineMessage || !guidanceInfo) return null;

  const skyArc = getSkyArcData();
  if (!skyArc) return null;

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <Card className="border-border shadow-lg bg-card relative">
        <Button
          onClick={handleRefresh}
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 z-10"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mx-6 mt-4">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="astronomical">Astronomical</TabsTrigger>
            <TabsTrigger value="kabbalistic">Kabbalistic</TabsTrigger>
            <TabsTrigger value="tree">Tree of Life</TabsTrigger>
            <TabsTrigger value="pathways">Pathways</TabsTrigger>
            <TabsTrigger value="message">Message</TabsTrigger>
            {/* Uncomment to enable personal tab */}
            {/* <TabsTrigger value="personal">Personal {!user && '🔒'}</TabsTrigger> */}
          </TabsList>

          {/* NEW CURRENT TAB - Main View */}
          <TabsContent value="current" className="mt-0">
            <div className="w-full bg-gradient-to-b from-slate-50 to-white">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold text-center text-slate-800">
                    Current Sky
                  </h2>
                </div>
                <p className="text-sm text-center text-slate-600">
                  {data.location}
                </p>
              </div>
              
              {/* Sky Arc Visualization */}
              <div className="relative px-4 py-6">
                <svg 
                  viewBox="0 0 360 180" 
                  className="w-full h-auto"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}
                >
                  <defs>
                    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={skyArc.isDaytime ? "#87CEEB" : "#1a1a2e"} />
                      <stop offset="100%" stopColor={skyArc.isDaytime ? "#f0f4f8" : "#16213e"} />
                    </linearGradient>
                    
                    <pattern id="clouds" x="0" y="0" width="100" height="60" patternUnits="userSpaceOnUse">
                      <ellipse cx="20" cy="30" rx="25" ry="15" fill="rgba(255,255,255,0.3)" />
                      <ellipse cx="60" cy="25" rx="30" ry="18" fill="rgba(255,255,255,0.25)" />
                      <ellipse cx="85" cy="35" rx="20" ry="12" fill="rgba(255,255,255,0.2)" />
                    </pattern>
                  </defs>
                  
                  <rect x="0" y="0" width="360" height="180" fill="url(#skyGradient)" />
                  <rect x="0" y="0" width="360" height="120" fill="url(#clouds)" opacity="0.6" />
                  
                  <path
                    d={`M 20 ${skyArc.baseY} Q ${skyArc.centerX} ${skyArc.baseY - skyArc.arcRadius - 20} ${360 - 20} ${skyArc.baseY}`}
                    stroke={skyArc.isDaytime ? "#FDB813" : "#C0C0C0"}
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  
                  <g transform={`translate(20, ${skyArc.baseY})`}>
                    <circle r="4" fill="#FDB813" />
                    <text 
                      y="20" 
                      textAnchor="start" 
                      className="text-xs fill-slate-700 font-medium"
                    >
                      {formatTime(data.sun_moon.sunrise)}
                    </text>
                  </g>
                  
                  <g transform={`translate(${360 - 20}, ${skyArc.baseY})`}>
                    <circle r="4" fill="#FF6B35" />
                    <text 
                      y="20" 
                      textAnchor="end" 
                      className="text-xs fill-slate-700 font-medium"
                    >
                      {formatTime(data.sun_moon.sunset)}
                    </text>
                  </g>
                  
                  <g transform={`translate(${skyArc.iconX}, ${skyArc.iconY})`}>
                    {skyArc.isDaytime ? (
                      <image 
                        href="/sun.png"
                        x="-30"
                        y="-30"
                        width="60"
                        height="60"
                        style={{ filter: 'drop-shadow(0 0 12px rgba(253, 184, 19, 0.5))' }}
                      />
                    ) : (
                      <image 
                        href="/clouds.png"
                        x="-35"
                        y="-20"
                        width="70"
                        height="40"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(100, 100, 120, 0.3))' }}
                      />
                    )}
                  </g>
                </svg>
              </div>
              
              {/* Data Tables - Two Column Layout */}
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Planets Table */}
                  <div 
                    className="bg-white rounded-lg border border-slate-200 overflow-hidden cursor-pointer transition-all hover:shadow-md"
                    onClick={() => setActiveTab('astronomical')}
                  >
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                      <h3 className="text-sm font-semibold text-slate-700">Current Planets</h3>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                    
                    <div className="px-4 py-3 space-y-2">
                      {Object.entries(data.planets).slice(0, 4).map(([planet, planetData]) => (
                        <div key={planet} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-slate-700">{planet}</span>
                          <span className="text-slate-600">{planetData.sign} {Math.round(planetData.degree_in_sign)}°</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="px-4 pb-3 text-xs text-slate-500 border-t border-slate-100 pt-3">
                      Tap to view full astronomical details →
                    </div>
                  </div>
                  
                  {/* Emanations Table */}
                  <div 
                    className="bg-white rounded-lg border border-slate-200 overflow-hidden cursor-pointer transition-all hover:shadow-md"
                    onClick={() => setActiveTab('kabbalistic')}
                  >
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                      <h3 className="text-sm font-semibold text-slate-700">Current Emanation</h3>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                    
                    <div className="px-4 py-3 space-y-2">
                      {guidanceInfo.worlds.map(([world, percent]) => (
                        <div key={world} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: worldColors[world] }}
                            />
                            <span className="font-medium text-slate-700">{world}</span>
                          </div>
                          <span className="text-slate-600 font-semibold">{Math.round(percent)}%</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="px-4 pb-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {guidanceInfo.text}
                    </div>
                    
                    <div className="px-4 pb-3 text-xs text-slate-500">
                      Tap to view full kabbalistic reading →
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ASTRONOMICAL TAB */}
          <TabsContent value="astronomical" className="space-y-4 p-6">
            <CardHeader className="px-0">
              <CardTitle className="text-xl text-center font-semibold text-black">
                Astronomical Data
              </CardTitle>
            </CardHeader>

            <div className="space-y-2">
              <p className="text-black">
                <strong>Moon Phase:</strong> {data.sun_moon.moon_phase}
              </p>
              <p className="text-black">
                <strong>Sunrise:</strong> {formatTime(data.sun_moon.sunrise)}
              </p>
              <p className="text-black">
                <strong>Sunset:</strong> {formatTime(data.sun_moon.sunset)}
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

          {/* KABBALISTIC TAB */}
          <TabsContent value="kabbalistic" className="space-y-4 p-6">
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="text-center text-lg font-serif">
                  The Four Worlds Today
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-center text-purple-900 dark:text-purple-100">
                  {worldActivation.interpretation}
                </p>
                
                <div className="space-y-2">
                  {(Object.entries(worldActivation.worldPercentages) as [World, number][])
                    .sort((a, b) => b[1] - a[1])
                    .map(([world, percentage]) => {
                      const worldInfo = FOUR_WORLDS[world];
                      return (
                        <div key={world} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-black">
                              {worldInfo.name} {worldInfo.hebrew}
                            </span>
                            <span className="text-muted-foreground">
                              {Math.round(percentage)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-500"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: worldInfo.color
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-black">
                Sephirotic Activations
              </h3>
              {kabbalisticReading.sephirotDetails.map((detail: any) => {
                const planetData = data.planets[detail.planet];
                const worldData = determineWorld(detail.planet, planetData.sign, planetData.house);
                const primaryWorld = FOUR_WORLDS[worldData.primary];
                const sephirah = detail.sephirah;
                const contextualInfluence = synthesizeInfluence(
                  detail.planet,
                  planetData.sign,
                  planetData.house
                );

                return (
                  <Card key={detail.planet} className="border-2 border-primary/20">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-lg text-primary">
                            {detail.planet} → {sephirah.name}
                          </h4>
                          <span 
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ 
                              backgroundColor: `${primaryWorld.color}20`,
                              color: primaryWorld.color,
                              border: `1px solid ${primaryWorld.color}`
                            }}
                          >
                            {primaryWorld.name} {primaryWorld.hebrew}
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
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-1 italic">
                        Manifesting in {primaryWorld.realm.toLowerCase()}
                      </p>
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

          {/* TREE TAB */}
          <TabsContent value="tree" className="space-y-4 p-6">
            <TreeOfLifeVisualization activePlanets={treeData} />
          </TabsContent>

          <TabsContent value="pathways" className="space-y-4 p-6">
            <PathwayEmanationsDisplay activePlanets={treeData} />
          </TabsContent>

          {/* MESSAGE TAB */}
          <TabsContent value="message" className="space-y-4 p-6">
            <DivineMessageDisplay message={divineMessage} />
          </TabsContent>

          {/* PERSONAL TAB - Uncomment to enable */}
          {/* <TabsContent value="personal" className="space-y-4 p-6">
            {!user ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <p className="text-lg">🔒 Personalized Readings</p>
                    <p className="text-sm text-gray-600">
                      Create an account to access your personalized Shefa readings based on your birth chart.
                    </p>
                    <Button onClick={() => {}}>
                      Sign Up / Log In
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : !birthChart ? (
              <Card>
                <CardContent className="pt-6">
                  <BirthChartForm userId={user.id} onSave={(chart) => setBirthChart(chart)} />
                </CardContent>
              </Card>
            ) : transitReading ? (
              <PersonalizedTransitDisplay 
                transitMessage={transitReading.message}
                natalInfo={transitReading.natalInfo}
                aspects={transitReading.aspects}
              />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center">Loading personalized reading...</p>
                </CardContent>
              </Card>
            )}
          </TabsContent> */}
        </Tabs>
      </Card>
    </div>
  );
};

export default KabbalisticCurrentSky;