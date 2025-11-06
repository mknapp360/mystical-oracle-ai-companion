// src/components/ActivePathwaysInsight.tsx
// Component to display Euclid's interpretation in the Active Pathways section

import React, { useState, useEffect } from 'react';
import { getTreeInsightV2, type EuclidResponse } from '@/lib/getTreeInsightV2';
import { Loader2 } from 'lucide-react';

interface ActivePathwaysInsightProps {
  activePlanets: Record<string, { sign: string; house: string; sephirah: string; world: string }>;
  pathActivations: Array<{
    sephirah1: string;
    sephirah2: string;
    planets: [string, string];
    aspectType: string;
    illumination: 'full' | 'partial' | 'shadow';
    hebrewLetter?: string;
  }>;
  autoLoad?: boolean; // If true, loads automatically on mount
}

export const ActivePathwaysInsight: React.FC<ActivePathwaysInsightProps> = ({
  activePlanets,
  pathActivations,
  autoLoad = false,
}) => {
  const [interpretation, setInterpretation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autoLoad) {
      loadInterpretation();
    }
  }, [autoLoad, activePlanets, pathActivations]);

  const loadInterpretation = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getTreeInsightV2(activePlanets, pathActivations);
      setInterpretation(result.final_interpretation);
    } catch (err) {
      console.error('Failed to load interpretation:', err);
      setError('Unable to load pathway interpretation.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Consulting Euclid...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!interpretation) {
    return (
      <button
        onClick={loadInterpretation}
        className="text-sm text-blue-600 hover:underline"
      >
        Tap to view full pathway emanations →
      </button>
    );
  }

  return (
    <div className="text-sm leading-relaxed text-gray-700">
      {interpretation}
    </div>
  );
};

// Alternative: Inline version that matches your existing UI exactly
export const ActivePathwaysText: React.FC<{
  activePlanets: any;
  pathActivations: any;
}> = ({ activePlanets, pathActivations }) => {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getTreeInsightV2(activePlanets, pathActivations);
        setText(result.final_interpretation);
      } catch (err) {
        console.error('Failed to load:', err);
        setText('Conscious self dives into the depths like a fish swimming in darkness...');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activePlanets, pathActivations]);

  if (loading) {
    return (
      <div className="text-sm text-gray-600 italic">
        Loading pathway interpretation...
      </div>
    );
  }

  return <>{text}</>;
};

// Full version with expandable details
export const ActivePathwaysInsightExpanded: React.FC<ActivePathwaysInsightProps> = ({
  activePlanets,
  pathActivations,
}) => {
  const [fullResponse, setFullResponse] = useState<EuclidResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const loadInsight = async () => {
    setLoading(true);
    try {
      const result = await getTreeInsightV2(activePlanets, pathActivations);
      setFullResponse(result.full_response);
    } catch (err) {
      console.error('Failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsight();
  }, [activePlanets, pathActivations]);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
        <div className="animate-pulse bg-gray-200 h-4 w-2/3 rounded"></div>
      </div>
    );
  }

  if (!fullResponse) {
    return (
      <div className="text-sm text-gray-500">
        Unable to load pathway interpretation.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main interpretation - matches your existing style */}
      <div className="text-sm leading-relaxed text-gray-700">
        {fullResponse.final_interpretation}
      </div>

      {/* Expandable details button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-xs text-gray-500 hover:text-gray-700"
      >
        {showDetails ? 'Hide' : 'Tap to view full pathway emanations →'}
      </button>

      {/* Expanded details */}
      {showDetails && (
        <div className="space-y-4 pt-3 border-t border-gray-200">
          {/* Symbolic Reading */}
          <div>
            <h4 className="text-xs font-semibold text-gray-600 mb-1">Symbolic Reading</h4>
            <p className="text-sm text-gray-700 italic whitespace-pre-line">
              {fullResponse.symbolic_reading}
            </p>
          </div>

          {/* Divine Key */}
          <div>
            <h4 className="text-xs font-semibold text-gray-600 mb-2">Divine Key</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50 p-3 rounded">
                <div className="text-xs text-purple-600 font-semibold mb-1">Overall Sum</div>
                <div className="text-2xl font-bold text-purple-700">
                  {fullResponse.divine_key.sum_overall.total}
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  Root: {fullResponse.divine_key.sum_overall.digit_root}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {fullResponse.divine_key.sum_overall.meaning}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded">
                <div className="text-xs text-blue-600 font-semibold mb-1">Connected Sum</div>
                <div className="text-2xl font-bold text-blue-700">
                  {fullResponse.divine_key.sum_connected.total}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Root: {fullResponse.divine_key.sum_connected.digit_root}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {fullResponse.divine_key.sum_connected.meaning}
                </div>
              </div>
            </div>
          </div>

          {/* Connected Component */}
          <div>
            <h4 className="text-xs font-semibold text-gray-600 mb-1">Connected Component</h4>
            <div className="text-xs text-gray-700">
              <div className="mb-1">
                <span className="font-semibold">Sephiroth:</span>{' '}
                {fullResponse.graph_summary.connected_component.sephiroth.join(', ')}
              </div>
              <div>
                <span className="font-semibold">Paths:</span>{' '}
                {fullResponse.graph_summary.connected_component.paths.join(', ')}
              </div>
            </div>
          </div>

          {/* Graph Summary */}
          <div>
            <h4 className="text-xs font-semibold text-gray-600 mb-1">Graph State</h4>
            <div className="space-y-1">
              {fullResponse.graph_summary.sephiroth.map((seph, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      seph.state === 'connected' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                  <span className="font-semibold">{seph.name}</span>
                  <span className="text-gray-500">({seph.state})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};