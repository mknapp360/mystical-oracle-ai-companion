// src/components/TreeInsightDisplay.tsx
// Component to display AI insights about the Tree of Life configuration

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { getTreeInsight, generateTreeStateJSON, type TreeInsightResponse } from '@/lib/getTreeInsight';

interface TreeInsightDisplayProps {
  activePlanets: Record<string, { sign: string; house: string; sephirah: string; world: string }>;
  pathActivations: Array<{
    sephirah1: string;
    sephirah2: string;
    planets: [string, string];
    aspectType: string;
    illumination: 'full' | 'partial' | 'shadow';
    hebrewLetter?: string;
  }>;
}

export const TreeInsightDisplay: React.FC<TreeInsightDisplayProps> = ({
  activePlanets,
  pathActivations
}) => {
  const [userQuestion, setUserQuestion] = useState('');
  const [insight, setInsight] = useState<TreeInsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRawJSON, setShowRawJSON] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGetInsight = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getTreeInsight(
        activePlanets,
        pathActivations,
        userQuestion || undefined
      );
      setInsight(result);
    } catch (err) {
      console.error('Failed to get tree insight:', err);
      setError('Failed to connect to the mystical realm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (insight) {
      const jsonString = JSON.stringify(insight.treeState, null, 2);
      navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate summary stats
  const stats = insight ? {
    illuminatedSephiroth: insight.treeState.sephiroth.filter(s => s.isIlluminated).length,
    strandedSephiroth: insight.treeState.sephiroth.filter(s => s.isStranded).length,
    activePathways: insight.treeState.pathways.length,
    fullyConnectedPaths: insight.treeState.pathways.filter(p => p.isFullyConnected).length,
  } : null;

  return (
    <div className="space-y-4">
      {/* Question Input */}
      <Card className="border-border bg-card backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-serif text-center flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Tree of Life Insight
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ask a question about your spiritual configuration... (optional)"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            className="bg-input border-border min-h-[80px]"
          />
          
          <Button 
            onClick={handleGetInsight}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Consulting the Tree...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get Divine Insight
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-yellow-700">{stats.illuminatedSephiroth}</div>
              <div className="text-xs text-yellow-600 mt-1">Illuminated Sephiroth</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-red-700">{stats.strandedSephiroth}</div>
              <div className="text-xs text-red-600 mt-1">Stranded Spheres</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-700">{stats.activePathways}</div>
              <div className="text-xs text-purple-600 mt-1">Active Pathways</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-700">{stats.fullyConnectedPaths}</div>
              <div className="text-xs text-green-600 mt-1">Fully Connected</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Insight */}
      {insight && (
        <Card className="border-border bg-gradient-to-br from-purple-50 to-indigo-50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-4 text-purple-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Divine Interpretation
            </h3>
            <div className="prose prose-purple max-w-none leading-relaxed whitespace-pre-wrap text-gray-800">
              {insight.insight}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Raw JSON Display (Optional) */}
      {insight && (
        <Card className="border-border bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-mono">Tree State Data</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRawJSON(!showRawJSON)}
                >
                  {showRawJSON ? 'Hide' : 'Show'} JSON
                </Button>
                {showRawJSON && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          {showRawJSON && (
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                {JSON.stringify(insight.treeState, null, 2)}
              </pre>
            </CardContent>
          )}
        </Card>
      )}

      {/* Detailed Breakdown */}
      {insight && showRawJSON && (
        <>
          {/* Illuminated Sephiroth List */}
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm">Illuminated Sephiroth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {insight.treeState.sephiroth
                  .filter(s => s.isIlluminated)
                  .map(seph => (
                    <div 
                      key={seph.name} 
                      className={`p-3 rounded-lg ${
                        seph.isStranded 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-green-50 border border-green-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{seph.name}</span>
                        {seph.isStranded && (
                          <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                            Stranded
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Planets: {seph.planets.join(', ')}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Pathways List */}
          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm">Active Pathways</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {insight.treeState.pathways.map((path, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg ${
                      path.illuminationType === 'full'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : path.illuminationType === 'partial'
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">
                        {path.hebrewLetter} • {path.name}
                      </span>
                      <div className="flex gap-2">
                        <span className="text-xs bg-white px-2 py-1 rounded border">
                          {path.illuminationType}
                        </span>
                        {path.isFullyConnected && (
                          <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                            Fully Connected
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      {path.planets?.join(' ' + path.aspectType + ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};