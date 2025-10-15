import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Calendar, MapPin, Flame, Droplet, Wind, Mountain } from 'lucide-react';
import { PLANETARY_SEPHIROT, ZODIAC_PATHS, FOUR_WORLDS, determineWorld } from '@/lib/sephirotic-correspondences';
import { getUserBirthChart, type BirthChartData } from '@/lib/birthChartService';
import { BirthChartForm } from '@/components/BirthChartForm';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

interface PlanetaryDetail {
  planet: string;
  sephirah: string;
  sign: string;
  degree: string;
  element: string;
  primaryWorld: string;
}

// Helper to determine pillar based on sephirah name
const getPillar = (sephirahName: string): string => {
  const leftPillar = ['Binah', 'Geburah', 'Hod'];
  const rightPillar = ['Chokmah', 'Chesed', 'Netzach'];
  const middlePillar = ['Kether', 'Tiphereth', 'Yesod', 'Malkuth', 'Daath'];
  
  if (leftPillar.includes(sephirahName)) return 'Left';
  if (rightPillar.includes(sephirahName)) return 'Right';
  if (middlePillar.includes(sephirahName)) return 'Middle';
  return 'Middle';
};

const EnergeticSignaturePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [birthChart, setBirthChart] = useState<BirthChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      
      if (data.user) {
        const chart = await getUserBirthChart(data.user.id);
        setBirthChart(chart);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const calculateSignature = (chart: BirthChartData) => {
    const activeSephirot = new Set<string>();
    const worldScores = { Atziluth: 0, Briah: 0, Yetzirah: 0, Assiah: 0 };
    const planetaryDetails: PlanetaryDetail[] = [];
    const pillarCount = { Left: 0, Right: 0, Middle: 0 };

    Object.entries(chart.natal_planets).forEach(([planet, data]) => {
      const sephirah = PLANETARY_SEPHIROT[planet];
      const path = ZODIAC_PATHS[data.sign];
      
      if (!sephirah) return;

      const worlds = determineWorld(planet, data.sign, data.house);
      activeSephirot.add(sephirah.name);
      
      worldScores[worlds.primary] += 3;
      worldScores[worlds.influences[0]] += 2;

      const pillar = getPillar(sephirah.name);
      pillarCount[pillar as 'Left' | 'Right' | 'Middle']++;

      planetaryDetails.push({
        planet,
        sephirah: sephirah.name,
        sign: data.sign,
        degree: data.degree_in_sign.toFixed(1),
        element: path?.hebrewLetter ? getSignElement(data.sign) : 'unknown',
        primaryWorld: worlds.primary
      });
    });

    const totalScore = Object.values(worldScores).reduce((a, b) => a + b, 0);
    const worldPercentages = Object.fromEntries(
      Object.entries(worldScores).map(([world, score]) => [
        world,
        ((score / totalScore) * 100).toFixed(1)
      ])
    );

    const dominantWorld = Object.entries(worldScores).sort((a, b) => b[1] - a[1])[0][0];
    const spread = Math.max(...Object.values(worldScores)) - Math.min(...Object.values(worldScores));
    const isBalanced = spread <= (totalScore * 0.15);

    return {
      activeSephirot: Array.from(activeSephirot),
      worldPercentages,
      dominantWorld,
      planetaryDetails,
      pillarCount,
      isBalanced
    };
  };

  const getSignElement = (sign: string): string => {
    const fireSigns = ['Aries', 'Leo', 'Sagittarius'];
    const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];
    const airSigns = ['Gemini', 'Libra', 'Aquarius'];
    const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];
    
    if (fireSigns.includes(sign)) return 'Fire';
    if (waterSigns.includes(sign)) return 'Water';
    if (airSigns.includes(sign)) return 'Air';
    if (earthSigns.includes(sign)) return 'Earth';
    return 'Air';
  };

  const worldIcons = {
    Atziluth: <Flame className="w-5 h-5 text-white" />,
    Briah: <Wind className="w-5 h-5 text-white" />,
    Yetzirah: <Droplet className="w-5 h-5 text-white" />,
    Assiah: <Mountain className="w-5 h-5 text-white" />
  };

  const worldColors = {
    Atziluth: 'from-amber-500 to-orange-600',
    Briah: 'from-sky-400 to-blue-500',
    Yetzirah: 'from-purple-400 to-indigo-500',
    Assiah: 'from-emerald-600 to-green-700'
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pb-24 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 pb-24">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please sign in to view your natal energetic signature.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!birthChart) {
    return (
      <div className="container mx-auto px-4 py-8 pb-24">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-7 h-7 text-purple-600" />
              Natal Energetic Signature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Enter your birth information to calculate your natal energetic signature.
            </p>
            <BirthChartForm 
              userId={user.id}
              onSave={(chart) => setBirthChart(chart)} 
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const signature = calculateSignature(birthChart);
  const birthDate = new Date(birthChart.birth_date_time);
  const formattedDate = birthDate.toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  const formattedTime = birthDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', minute: '2-digit' 
  });

  return (
    <div className="container mx-auto px-4 py-8 pb-24 space-y-6">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-7 h-7 text-purple-600" />
            Natal Energetic Signature
          </CardTitle>
          <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formattedDate} at {formattedTime}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {birthChart.birth_city}, {birthChart.birth_country}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Four Worlds Activation</CardTitle>
          {signature.isBalanced && (
            <p className="text-sm text-muted-foreground mt-2">
              ⚖️ <strong>Quaternary Balance:</strong> All worlds nearly equal—balanced access to all levels.
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(signature.worldPercentages).map(([world, percentage]) => {
            const pct = parseFloat(percentage);
            const isDominant = world === signature.dominantWorld;
            
            return (
              <div key={world} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${worldColors[world as keyof typeof worldColors]}`}>
                      {worldIcons[world as keyof typeof worldIcons]}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {world}
                        {isDominant && !signature.isBalanced && (
                          <span className="text-xs bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded-full">
                            Dominant
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {FOUR_WORLDS[world as keyof typeof FOUR_WORLDS].meaning}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{percentage}%</div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${worldColors[world as keyof typeof worldColors]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}

          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <h4 className="font-semibold mb-2">
              {signature.isBalanced ? 'Balanced World Access' : `${signature.dominantWorld} - Primary Mode`}
            </h4>
            <p className="text-sm text-muted-foreground">
              {signature.isBalanced 
                ? 'Nearly equal access to all four worlds. Move fluidly between archetypal vision, conceptual thought, emotional formation, and physical manifestation.'
                : `${FOUR_WORLDS[signature.dominantWorld as keyof typeof FOUR_WORLDS].description}`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tree of Life Activation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-sm text-muted-foreground mb-2">
              <strong>{signature.activeSephirot.length} of 10</strong> sephirot illuminated
            </div>
            {signature.activeSephirot.length === 10 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg text-sm">
                ✨ <strong>Full Tree:</strong> All spheres receiving planetary influx. Gift is synthesis.
              </div>
            )}
          </div>

          <div className="space-y-2">
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

      <Card>
        <CardHeader>
          <CardTitle>Guidance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <h5 className="font-semibold mb-2 text-sm">Strengths</h5>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• {signature.activeSephirot.length === 10 ? 'Full Tree access' : 'Multi-sephirot activation'}</li>
                <li>• {parseFloat(signature.worldPercentages.Assiah) > 20 ? 'Strong grounding' : 'Visionary orientation'}</li>
                <li>• {signature.isBalanced ? 'Balanced worlds' : `${signature.dominantWorld} mastery`}</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h5 className="font-semibold mb-2 text-sm">Growth Areas</h5>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• {parseFloat(signature.worldPercentages.Assiah) < 15 ? 'Develop grounding' : 'Balance vision with structure'}</li>
                <li>• {signature.pillarCount.Left > signature.pillarCount.Right + 2 ? 'Allow flow' : signature.pillarCount.Right > signature.pillarCount.Left + 2 ? 'Build structure' : 'Maintain balance'}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergeticSignaturePage;