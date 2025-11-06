// src/components/NatalSignatureReport.tsx
// FIXED: Properly imports formatBirthDateTime from shared utility

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { FOUR_WORLDS, PLANETARY_SEPHIROT } from '@/lib/sephirotic-correspondences';
import { formatBirthDateTime } from '@/lib/dateFormatters';
import type { BirthChartData } from '@/lib/birthChartService';

interface ReportProps {
  birthChart: BirthChartData;
  signature: {
    worldPercentages: Record<string, number>;
    dominantWorld: string;
    planetaryDetails: Array<{
      planet: string;
      sephirah: string;
      sign: string;
      degree: string;
      element: string;
      primaryWorld: string;
    }>;
    pillarCount: { Left: number; Right: number; Middle: number };
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
  const { formattedDate, formattedTimeWithZone } = formatBirthDateTime(
    birthChart.birth_date_time,
    birthChart.birth_timezone
  );

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
    .sort(([,a], [,b]) => parseFloat(String(b)) - parseFloat(String(a)))[1];

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
            {formattedDate} | {formattedTimeWithZone}  
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400">
            {birthChart.birth_city}, {birthChart.birth_country}
          </p>
        </div>

        {/* Four Worlds Activation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-purple-800 dark:text-purple-200 flex items-center gap-2">
            Four Worlds Distribution
          </h2>
          <div className="space-y-3">
            {Object.entries(worldPercentages).map(([world, percentage]) => {
              const worldInfo = FOUR_WORLDS[world as keyof typeof FOUR_WORLDS];
              return (
                <div key={world} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{worldInfo.name} ({worldInfo.hebrew})</div>
                    <div className="text-xs text-muted-foreground">{worldInfo.description}</div>
                  </div>
                  <div className="text-lg font-bold" style={{ color: worldInfo.color }}>
                    {Math.round(Number(percentage))}%
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
            <p className="text-sm">
              <strong>Dominant World:</strong> {dominantWorldData.name} ({dominantWorldData.hebrew}) at {Math.round(Number(worldPercentages[signature.dominantWorld]))}% — {dominantWorldData.description}
            </p>
            {secondWorld && (
              <p className="text-sm mt-2">
                <strong>Secondary Influence:</strong> {FOUR_WORLDS[secondWorld[0] as keyof typeof FOUR_WORLDS].name} at {Math.round(Number(secondWorld[1]))}%
              </p>
            )}
          </div>
        </section>

        {/* Planetary Placements */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-purple-800 dark:text-purple-200">
            Planetary Sephirotic Placements
          </h2>
          <div className="space-y-2">
            {signature.planetaryDetails.map((detail) => (
              <div key={detail.planet} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-semibold w-20">{detail.planet}</span>
                  <span className="text-muted-foreground">{detail.sign} {detail.degree}°</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{detail.sephirah}</span>
                  <span className="text-xs px-2 py-1 rounded bg-purple-100 dark:bg-purple-900">
                    {detail.primaryWorld}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pillar Balance */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif text-purple-800 dark:text-purple-200">
            Tree of Life Pillar Balance
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{signature.pillarCount.Left}</div>
              <div className="text-sm font-medium mt-1">Left Pillar</div>
              <div className="text-xs text-muted-foreground mt-1">Severity • Structure</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{signature.pillarCount.Middle}</div>
              <div className="text-sm font-medium mt-1">Middle Pillar</div>
              <div className="text-xs text-muted-foreground mt-1">Balance • Integration</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{signature.pillarCount.Right}</div>
              <div className="text-sm font-medium mt-1">Right Pillar</div>
              <div className="text-xs text-muted-foreground mt-1">Mercy • Expansion</div>
            </div>
          </div>
        </section>

        {/* Path Activations */}
        {pathActivations.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-purple-800 dark:text-purple-200">
              Activated Pathways
            </h2>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Full Illumination: {fullyIlluminated.length} • 
                Partial: {partiallyIlluminated.length} • 
                Shadow: {shadowPaths.length}
              </div>
            </div>
          </section>
        )}

        {/* Retrograde Themes */}
        {retrogradeThemes.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-purple-800 dark:text-purple-200">
              Retrograde Themes
            </h2>
            <div className="space-y-2">
              {retrogradeThemes.map((theme, idx) => (
                <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-medium">{theme.planet}</div>
                  <div className="text-sm text-muted-foreground">{theme.theme}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Closing */}
        <section className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
          <div className="space-y-3 text-center">
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