import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { FOUR_WORLDS, PLANETARY_SEPHIROT } from '@/lib/sephirotic-correspondences';
import type { BirthChartData } from '@/lib/birthChartService';

interface ReportProps {
  birthChart: BirthChartData;
  signature: {
    worldPercentages: Record<string, string>;
    dominantWorld: string;
    activeSephirot: string[];
    planetaryDetails: Array<{
      planet: string;
      sephirah: string;
      sign: string;
      degree: string;
      element: string;
      primaryWorld: string;
    }>;
    pillarCount: { Left: number; Right: number; Middle: number };
    isBalanced: boolean;
  };
  pathActivations: any[];
  retrogradeThemes: any[];
}

export const NatalSignatureReport: React.FC<ReportProps> = ({
  birthChart,
  signature,
  pathActivations,
  retrogradeThemes
}) => {
  const birthDate = new Date(birthChart.birth_date_time);
  const formattedDate = birthDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = birthDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  // Get dominant world details
  const dominantWorldData = FOUR_WORLDS[signature.dominantWorld as keyof typeof FOUR_WORLDS];
  const worldPercentages = signature.worldPercentages;

  // Calculate second highest world
  const secondWorld = Object.entries(worldPercentages)
    .sort(([,a], [,b]) => parseFloat(b) - parseFloat(a))[1];

  // Path categorization
  const fullyIlluminated = pathActivations.filter(p => p.illumination === 'full');
  const partiallyIlluminated = pathActivations.filter(p => p.illumination === 'partial');
  const shadowPaths = pathActivations.filter(p => p.illumination === 'shadow');

  return (
    <div className="space-y-6">
      {/* Action Buttons - Hidden in Print */}
      <div className="flex gap-2 justify-end print:hidden">
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleDownloadPDF} size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Report Content */}
      <div className="report-content space-y-8 p-8 bg-white dark:bg-gray-900 print:p-0">
        
        {/* Header */}
        <div className="text-center space-y-2 border-b pb-6">
          <h1 className="text-3xl font-serif text-purple-900 dark:text-purple-100">
            Natal Energetic Signature
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {formattedDate} | {formattedTime}
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400">
            {birthChart.birth_city}, {birthChart.birth_country}
          </p>
        </div>

        {/* Four Worlds Activation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-purple-800 dark:text-purple-200 flex items-center gap-2">
            ✨ FOUR WORLDS ACTIVATION
          </h2>
          
          <div className="space-y-3">
            {Object.entries(worldPercentages).map(([world, percentage]) => {
              const worldInfo = FOUR_WORLDS[world as keyof typeof FOUR_WORLDS];
              const pct = Math.round(parseFloat(percentage));
              return (
                <div key={world} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {worldInfo.name} ({worldInfo.meaning}):
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all"
                      style={{ 
                        width: `${pct}%`,
                        backgroundColor: worldInfo.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg space-y-3">
            <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              🌟 Dominant World: {dominantWorldData.name.toUpperCase()} ({dominantWorldData.realm})
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You were born when the {dominantWorldData.realm} was most active. Your native 
              consciousness operates in the realm of {dominantWorldData.description.toLowerCase()}
            </p>
            {secondWorld && parseFloat(secondWorld[1]) > 25 && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                However, {FOUR_WORLDS[secondWorld[0] as keyof typeof FOUR_WORLDS].name} ({Math.round(parseFloat(secondWorld[1]))}%) 
                is nearly equal—you're balanced between {dominantWorldData.realm.toLowerCase()} and{' '}
                {FOUR_WORLDS[secondWorld[0] as keyof typeof FOUR_WORLDS].realm.toLowerCase()}. 
                You have access to both realms and can bridge between them.
              </p>
            )}
          </div>
        </section>

        {/* Tree of Life Activation */}
        <section className="space-y-4 page-break-before">
          <h2 className="text-2xl font-serif text-purple-800 dark:text-purple-200 flex items-center gap-2">
            🌳 TREE OF LIFE ACTIVATION
          </h2>
          
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-purple-50 dark:from-yellow-900/20 dark:to-purple-900/20 rounded-lg">
            <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              All {signature.activeSephirot.length} Sephirot Illuminated!
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              {signature.activeSephirot.length === 10 
                ? "Every sphere on the Tree was receiving planetary influx at your birth. You have potential access to the ENTIRE TREE—no sphere is naturally dark or blocked in your blueprint."
                : `${signature.activeSephirot.length} of the 10 Sephirot are activated in your chart, showing your natural areas of strength and focus.`
              }
            </p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">Planetary-Sephirotic Correspondences</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left p-2">Planet</th>
                    <th className="text-left p-2">Sign</th>
                    <th className="text-left p-2">Degree</th>
                    <th className="text-left p-2">Sephirah</th>
                    <th className="text-left p-2">Pillar</th>
                    <th className="text-left p-2">World</th>
                  </tr>
                </thead>
                <tbody>
                  {signature.planetaryDetails.map((detail) => (
                    <tr key={detail.planet} className="border-b border-gray-200">
                      <td className="p-2 font-medium">{detail.planet}</td>
                      <td className="p-2">{detail.sign}</td>
                      <td className="p-2">{detail.degree}°</td>
                      <td className="p-2">{detail.sephirah}</td>
                      <td className="p-2">{getPillar(detail.sephirah)}</td>
                      <td className="p-2">{detail.primaryWorld}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pillar Balance */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
              {signature.pillarCount.Middle >= 3 ? '⚖️' : '🔱'} Pillar Distribution
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Left (Severity)</p>
                <p className="text-2xl font-bold">{signature.pillarCount.Left}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Middle (Balance)</p>
                <p className="text-2xl font-bold">{signature.pillarCount.Middle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Right (Mercy)</p>
                <p className="text-2xl font-bold">{signature.pillarCount.Right}</p>
              </div>
            </div>
            {signature.pillarCount.Middle >= 3 && (
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                ⚖️ <strong>Middle Pillar Concentration:</strong> You're a natural integrator and balancer. 
                Your soul's work involves bridging heaven and earth, spirit and matter, conscious and unconscious.
              </p>
            )}
          </div>
        </section>

        {/* Key Patterns & Pathways */}
        <section className="space-y-4 page-break-before">
          <h2 className="text-2xl font-serif text-purple-800 dark:text-purple-200 flex items-center gap-2">
            ⚡ KEY PATTERNS & PATHWAYS
          </h2>

          {fullyIlluminated.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">
                ✨ Fully Illuminated Paths (Your Natural Strengths)
              </h3>
              {fullyIlluminated.map((path, i) => (
                <div key={i} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="font-medium">
                    {path.sephirah1} → {path.sephirah2}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {path.planets[0]} {path.aspectType} {path.planets[1]} ({path.orb.toFixed(1)}° orb)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {path.hebrewLetter} • {path.tarotCard} • {path.meaning}
                  </p>
                </div>
              ))}
            </div>
          )}

          {partiallyIlluminated.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                💫 Partially Illuminated Paths (Developing Strengths)
              </h3>
              {partiallyIlluminated.map((path, i) => (
                <div key={i} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-medium">
                    {path.sephirah1} → {path.sephirah2}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {path.planets[0]} {path.aspectType} {path.planets[1]} ({path.orb.toFixed(1)}° orb)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {path.hebrewLetter} • {path.tarotCard} • {path.meaning}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Shadow Work */}
        <section className="space-y-4 page-break-before">
          <h2 className="text-2xl font-serif text-purple-800 dark:text-purple-200 flex items-center gap-2">
            🌑 SHADOW WORK & DEVELOPMENTAL AREAS
          </h2>

          {shadowPaths.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                ⚠️ Shadow Paths (Growth Through Tension)
              </h3>
              {shadowPaths.map((path, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-gray-400">
                  <p className="font-medium">
                    {path.sephirah1} → {path.sephirah2}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {path.planets[0]} {path.aspectType} {path.planets[1]} • This path requires conscious work to illuminate
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {path.hebrewLetter} • {path.tarotCard}
                  </p>
                </div>
              ))}
              <p className="mt-3 text-gray-700 dark:text-gray-300 italic">
                These challenging aspects create friction that is the forge of spiritual gold. 
                Where you feel resistance, lean in with compassion and consciousness.
              </p>
            </div>
          )}

          {/* Low World Warning */}
          {parseFloat(worldPercentages.Assiah) < 15 && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-400">
              <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-2">
                ⚠️ Low Assiah (Physical World): {Math.round(parseFloat(worldPercentages.Assiah))}%
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Your primary challenge is <strong>GROUNDING</strong>. With so much activity in the higher worlds, 
                you may struggle to actually DO things or finish projects. The vision is clear, the feeling is strong, 
                but the hands need to move.
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                <strong>Malkuth work is essential:</strong> Embodiment practices, daily physical discipline, 
                completing tangible projects.
              </p>
            </div>
          )}

          {signature.isBalanced && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">⚖️ Perfect Pillar Balance</h3>
              <p className="text-gray-700 dark:text-gray-300">
                This perfect equilibrium can create analysis paralysis. You see all sides so clearly you 
                may struggle to commit to action. Practice decisive movement even when you can see multiple valid paths.
              </p>
            </div>
          )}
        </section>

        {/* Retrograde Themes */}
        {retrogradeThemes.length > 0 && (
          <section className="space-y-4 page-break-before">
            <h2 className="text-2xl font-serif text-purple-800 dark:text-purple-200 flex items-center gap-2">
              ℞ RETROGRADE THEMES
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Retrograde planets indicate areas where energy turns inward, creating depth and reflection.
            </p>
            {retrogradeThemes.map((theme, i) => (
              <div key={i} className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <p className="font-semibold text-indigo-900 dark:text-indigo-200">
                  {theme.planet} ℞ in {theme.sign} ({theme.sephirah})
                </p>
                <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mt-1">
                  {theme.theme}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {theme.guidance}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Energetic Synthesis */}
        <section className="space-y-4 page-break-before">
          <h2 className="text-2xl font-serif text-purple-800 dark:text-purple-200 flex items-center gap-2">
            🔮 ENERGETIC SYNTHESIS
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              You are a bridge-builder between worlds—equally at home in vision and formation, 
              but needing to consciously develop your physical presence.
            </p>
            {signature.activeSephirot.length === 10 && (
              <p>
                With all 10 sephirot activated, you're here to experience the <strong>FULL TREE</strong>—not to 
                specialize in one faculty, but to consciously integrate all divine attributes. Your gift is 
                synthesis; your challenge is not getting lost in the vastness.
              </p>
            )}
          </div>
        </section>

        {/* Practical Guidance */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-purple-800 dark:text-purple-200 flex items-center gap-2">
            🔑 PRACTICAL GUIDANCE
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            {parseFloat(worldPercentages.Assiah) < 15 && (
              <li className="flex gap-2">
                <span>🌍</span>
                <span>Ground daily: Walk barefoot, work with your hands, finish one small thing</span>
              </li>
            )}
            <li className="flex gap-2">
              <span>💫</span>
              <span>Trust your connection to the {dominantWorldData.name}: {dominantWorldData.description}</span>
            </li>
            <li className="flex gap-2">
              <span>⚖️</span>
              <span>Bridge worlds through balance: Your heart is the integration point</span>
            </li>
            <li className="flex gap-2">
              <span>🔥</span>
              <span>Honor both the shadow and light: Where you feel resistance, there lies growth</span>
            </li>
          </ul>
        </section>

        {/* Soul Signature */}
        <section className="space-y-4 border-t pt-6 mt-8">
          <h2 className="text-2xl font-serif text-purple-800 dark:text-purple-200 flex items-center gap-2">
            ✨ SOUL SIGNATURE
          </h2>
          <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg space-y-3">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This natal energetic signature suggests a soul incarnated to master the art of conscious 
              creation—translating vision into form through feeling, then into matter through disciplined action.
            </p>
            <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              You are a weaver of worlds.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The Tree of Life is alive within you—these cosmic patterns reflect your inner landscape. 
              Walk consciously through life as a living bridge between the archetypal and the actual, 
              the imaginal and the material, the eternal and the temporal.
            </p>
            <p className="text-center text-purple-800 dark:text-purple-200 font-semibold mt-4">
              Baruch HaShem. ✨🌳✨
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t pt-4 mt-8">
          <p>
            This reading contextualizes your natal chart through the Kabbalistic Tree of Life, 
            showing the quality of divine influx flowing through your birth geometry.
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .page-break-before {
            page-break-before: always;
          }
          .report-content {
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
};

// Helper function
function getPillar(sephirahName: string): string {
  const leftPillar = ['Binah', 'Geburah', 'Hod'];
  const rightPillar = ['Chokmah', 'Chesed', 'Netzach'];
  const middlePillar = ['Kether', 'Tiphereth', 'Yesod', 'Malkuth', 'Daath'];
  
  if (leftPillar.includes(sephirahName)) return 'Left';
  if (rightPillar.includes(sephirahName)) return 'Right';
  if (middlePillar.includes(sephirahName)) return 'Middle';
  return 'Middle';
}