import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Zodiac {
  sign: string;
  degrees: number;
  minutes: number;
  decimal: number;
}

interface PlanetData {
  zodiac: Zodiac;
  longitude: number;
}

interface AstroData {
  planets: { [key: string]: PlanetData };
  ascendant: { degrees: number; zodiac: Zodiac } | null;
  midheaven: { degrees: number; zodiac: Zodiac } | null;
  houses: { house: number; cusp: number; zodiac: Zodiac }[];
}

const SkyCard: React.FC = () => {
  const [data, setData] = useState<AstroData | null>(null);
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'https://tarotpathwork-personal-oracle.vercel.app'; // Replace with your Vercel URL

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const res = await axios.get<AstroData>(`${apiBaseUrl}/api/current-planets`, {
          params: {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          }
        });
        setData(res.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });
  }, [apiBaseUrl]);

  if (!data) return <div>Loading chart...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Current Sky Chart</h2>
      <div className="w-full flex justify-center items-center">
        {/* TODO: Replace with an actual wheel rendering */}
        <svg width="300" height="300" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="140" fill="#f9f9f9" stroke="#ccc" strokeWidth="2" />
          {data.planets &&
            Object.entries(data.planets).map(([name, planet]) => {
              const angle = (planet.longitude * Math.PI) / 180;
              const x = 150 + 120 * Math.cos(angle - Math.PI / 2);
              const y = 150 + 120 * Math.sin(angle - Math.PI / 2);
              return (
                <text
                  key={name}
                  x={x}
                  y={y}
                  fontSize="10"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {name[0]}
                </text>
              );
            })}
        </svg>
      </div>
      <div className="mt-4 text-sm text-gray-700">
        Ascendant: {data.ascendant?.zodiac.sign} {data.ascendant?.zodiac.degrees}°<br />
        Midheaven: {data.midheaven?.zodiac.sign} {data.midheaven?.zodiac.degrees}°
      </div>
    </div>
  );
};

export default SkyCard;