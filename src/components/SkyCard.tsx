import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Zodiac {
  sign: string;
  degrees: number;
  minutes: number;
  decimal: number;
}

interface SkyData {
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  sun: {
    ra: string;
    dec: string;
    zodiac: Zodiac;
  };
  moon: {
    ra: string;
    dec: string;
    zodiac: Zodiac;
  };
}

const SkyCard: React.FC = () => {
  const [data, setData] = useState<SkyData | null>(null);
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'https://tarotpathwork-personal-oracle.vercel.app';

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const res = await axios.get<SkyData>(`${apiBaseUrl}/api/current-sky`, {
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
        <svg width="300" height="300" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="140" fill="#f9f9f9" stroke="#ccc" strokeWidth="2" />
          {/* Adjust rendering for sun and moon if needed */}
          {data.sun && (
            <text
              x={150 + 120 * Math.cos((data.sun.zodiac.degrees * Math.PI) / 180 - Math.PI / 2)}
              y={150 + 120 * Math.sin((data.sun.zodiac.degrees * Math.PI) / 180 - Math.PI / 2)}
              fontSize="10"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              S
            </text>
          )}
          {data.moon && (
            <text
              x={150 + 120 * Math.cos((data.moon.zodiac.degrees * Math.PI) / 180 - Math.PI / 2)}
              y={150 + 120 * Math.sin((data.moon.zodiac.degrees * Math.PI) / 180 - Math.PI / 2)}
              fontSize="10"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              M
            </text>
          )}
        </svg>
      </div>
      <div className="mt-4 text-sm text-gray-700">
        Sun: {data.sun.zodiac.sign} {data.sun.zodiac.degrees}°{data.sun.zodiac.minutes}'<br />
        Moon: {data.moon.zodiac.sign} {data.moon.zodiac.degrees}°{data.moon.zodiac.minutes}'
      </div>
    </div>
  );
};

export default SkyCard;