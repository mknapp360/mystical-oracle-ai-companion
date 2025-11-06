// src/pages/EnergeticSignaturePage.tsx
// FIXED: Completed useEffect hook and proper data loading

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Calendar, MapPin, Flame, Droplet, Wind, Mountain } from 'lucide-react';
import { PLANETARY_SEPHIROT, ZODIAC_PATHS, FOUR_WORLDS, determineWorld } from '@/lib/sephirotic-correspondences';
import { getUserBirthChart, type BirthChartData } from '@/lib/birthChartService';
import { BirthChartForm } from '@/components/BirthChartForm';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  calculatePathActivations, 
  identifyRetrogradeThemes, 
  detectAspectPatterns 
} from '@/lib/pathActivationCalculator';
import { 
  PathActivationSection, 
  RetrogradeThemesSection, 
  AspectPatternsSection 
} from '@/components/PathActivationDisplay';
import { NatalTreeVisualization } from '@/components/NatalTreeVisualization';
import { NatalSignatureReport } from '@/components/NatalSignatureReport';
import { formatBirthDateTime } from '@/lib/dateFormatters';


interface PlanetaryDetail {
  planet: string;
  sephirah: string;
  sign: string;
  degree: string;
  element: string;
  primaryWorld: string;
}

interface EnergeticSignature {
  worldPercentages: Record<string, number>;
  dominantWorld: string;
  pillarCount: { Left: number; Middle: number; Right: number };
  elementalBalance: Record<string, number>;
  planetaryDetails: PlanetaryDetail[];
}

const getPillar = (sephirahName: string): string => {
  const leftPillar = ['Binah', 'Geburah', 'Hod'];
  const rightPillar = ['Chokmah', 'Chesed', 'Netzach'];
  const middlePillar = ['Kether', 'Tiphereth', 'Yesod', 'Malkuth', 'Daath'];
  
  if (leftPillar.includes(sephirahName)) return 'Left';
  if (rightPillar.includes(sephirahName)) return 'Right';
  if (middlePillar.includes(sephirahName)) return 'Middle';
  return 'Middle';
};

const worldIcons = {
  Atziluth: <Flame className="w-4 h-4" />,
  Briah: <Wind className="w-4 h-4" />,
  Yetzirah: <Droplet className="w-4 h-4" />,
  Assiah: <Mountain className="w-4 h-4" />
};

const worldColors = {
  Atziluth: 'from-red-500 to-orange-500',
  Briah: 'from-blue-400 to-blue-600',
  Yetzirah: 'from-yellow-400 to-yellow-600',
  Assiah: 'from-green-600 to-green-800'
};

const EnergeticSignaturePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [birthChart, setBirthChart] = useState<BirthChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
        
        if (data.user) {
          // FIXED: Complete the getUserBirthChart call with user ID
          const chart = await getUserBirthChart(data.user.id);
          setBirthChart(chart);
        }
      } catch (error) {
        console.error('Error fetching user or birth chart:', error);
      } finally {
        // FIXED: Always set loading to false
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Calculate energetic signature from birth chart
  const calculateSignature = (chart: BirthChartData): EnergeticSignature => {
    const worldCounts: Record<string, number> = { Atziluth: 0, Briah: 0, Yetzirah: 0, Assiah: 0 };
    const pillarCounts = { Left: 0, Middle: 0, Right: 0 };
    const elementCounts: Record<string, number> = { Fire: 0, Water: 0, Air: 0, Earth: 0 };
    const planetaryDetails: PlanetaryDetail[] = [];

    Object.entries(chart.natal_planets).forEach(([planet, data]) => {
      const sephirahMapping = PLANETARY_SEPHIROT[planet];
      if (!sephirahMapping) return;
      
      const sephirahName = sephirahMapping.name;
      const pillar = getPillar(sephirahName);
      pillarCounts[pillar as keyof typeof pillarCounts]++;

      // determineWorld returns { primary, influences, strength }
      // It needs 3 parameters: planet, sign, house
      const worldData = determineWorld(planet, data.sign, data.house);
      const primaryWorld = worldData.primary;
      worldCounts[primaryWorld]++;

      const element = ['Aries', 'Leo', 'Sagittarius'].includes(data.sign) ? 'Fire' :
                     ['Cancer', 'Scorpio', 'Pisces'].includes(data.sign) ? 'Water' :
                     ['Gemini', 'Libra', 'Aquarius'].includes(data.sign) ? 'Air' : 'Earth';
      elementCounts[element]++;

      planetaryDetails.push({
        planet,
        sephirah: sephirahName,
        sign: data.sign,
        degree: data.degree_in_sign.toFixed(1),
        element,
        primaryWorld
      });
    });

    const totalPlanets = Object.values(worldCounts).reduce((a, b) => a + b, 0);
    const worldPercentages: Record<string, number> = {};
    Object.entries(worldCounts).forEach(([world, count]) => {
      worldPercentages[world] = (count / totalPlanets) * 100;
    });

    const dominantWorld = Object.entries(worldPercentages)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];

    return {
      worldPercentages,
      dominantWorld,
      pillarCount: pillarCounts,
      elementalBalance: elementCounts,
      planetaryDetails
    };
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Show birth chart form if no chart exists
  if (!birthChart) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Energetic Signature</h1>
          <p className="text-muted-foreground">
            Enter your birth details to discover your unique Kabbalistic blueprint
          </p>
        </div>
        <BirthChartForm 
          userId={user.id}
          onSave={(chart) => setBirthChart(chart)}
          existingChart={undefined}
        />
      </div>
    );
  }

  // Calculate all derived data
  const signature = calculateSignature(birthChart);
  const pathActivations = calculatePathActivations(birthChart.natal_aspects || []);
  const retrogradeThemes = identifyRetrogradeThemes(birthChart);
  const aspectPatterns = detectAspectPatterns(
    birthChart.natal_aspects || [],
    birthChart
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold">Your Energetic Signature</h1>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(birthChart.birth_date_time).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{birthChart.birth_location}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tree">Tree of Life</TabsTrigger>
          <TabsTrigger value="patterns">Life Patterns</TabsTrigger>
          <TabsTrigger value="report">Full Report</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Four Worlds Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Four Worlds Distribution
                {signature.dominantWorld && (
                  <span className="text-sm font-normal text-muted-foreground">
                    • Dominant: {signature.dominantWorld}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* World Percentage Bars */}
              <div className="space-y-3">
                {Object.entries(signature.worldPercentages).map(([world, percentage]) => {
                  const worldInfo = FOUR_WORLDS[world as keyof typeof FOUR_WORLDS];
                  return (
                    <div key={world} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-black flex items-center gap-2">
                          {worldIcons[world as keyof typeof worldIcons]}
                          {worldInfo.name} {worldInfo.hebrew}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(Number(percentage))}%
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

              {/* Planetary Details */}
              <div className="space-y-2 mt-6">
                <h4 className="font-semibold text-sm mb-3">Planetary Placements</h4>
                {signature.planetaryDetails.map((detail) => (
                  <div key={detail.planet} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold w-20">{detail.planet}</div>
                      <div className="text-muted-foreground">{detail.sign} {detail.degree}°</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div><span className="font-medium">{detail.sephirah}</span></div>
                      <div className={`px-2 py-1 rounded text-xs bg-gradient-to-r ${
                        worldColors[detail.primaryWorld as keyof typeof worldColors]
                      } text-white`}>
                        {detail.primaryWorld}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pillar Balance */}
          <Card>
            <CardHeader>
              <CardTitle>Pillar Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(signature.pillarCount).map(([pillar, count]) => (
                  <div key={pillar} className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{count}</div>
                    <div className="text-sm font-medium mt-1">{pillar}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {pillar === 'Left' && 'Severity'}
                      {pillar === 'Right' && 'Mercy'}
                      {pillar === 'Middle' && 'Balance'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm space-y-2">
                {signature.pillarCount.Middle >= 4 && (
                  <p>🎯 <strong>Middle Pillar:</strong> Natural integrator—soul work involves bridging polarities.</p>
                )}
                {signature.pillarCount.Left > signature.pillarCount.Right + 1 && (
                  <p>⚖️ <strong>Left Emphasis:</strong> Structure & discipline. Builder archetype.</p>
                )}
                {signature.pillarCount.Right > signature.pillarCount.Left + 1 && (
                  <p>💫 <strong>Right Emphasis:</strong> Grace & expansion. Visionary archetype.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tree of Life Tab */}
        <TabsContent value="tree" className="mt-6">
          <NatalTreeVisualization 
            birthChart={birthChart} 
            pathActivations={pathActivations} 
          />
          
          {/* Path Activation Details */}
          {pathActivations.length > 0 && (
            <div className="mt-6">
              <PathActivationSection paths={pathActivations} />
            </div>
          )}
        </TabsContent>

        {/* Life Patterns Tab */}
        <TabsContent value="patterns" className="space-y-6 mt-6">
          {/* Aspect Patterns */}
          {aspectPatterns.length > 0 && (
            <AspectPatternsSection patterns={aspectPatterns} />
          )}

          {/* Retrograde Themes */}
          <RetrogradeThemesSection themes={retrogradeThemes} />
        </TabsContent>

        {/* Report Tab */}
        <TabsContent value="report" className="mt-6">
          <NatalSignatureReport
            birthChart={birthChart}
            signature={signature}
            pathActivations={pathActivations}
            retrogradeThemes={retrogradeThemes}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnergeticSignaturePage;