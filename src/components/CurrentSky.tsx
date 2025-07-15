import React, { useEffect, useState } from "react";

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

const API_BASE_URL = "https://ephemeris-api-jmjjqa-production.up.railway.app"; // Replace with your actual Railway URL
const LOCATION = "Battle, East Sussex, UK";

const CurrentSky: React.FC = () => {
  const [data, setData] = useState<CurrentSkyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/current-sky?location=${encodeURIComponent(LOCATION)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch current sky.");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data) return <div>Loading current sky...</div>;

  return (
    <div className="p-4 border rounded-xl shadow-lg bg-white max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-2">Current Sky over {data.location}</h2>
      <p><strong>Moon Phase:</strong> {data.sun_moon.moon_phase}</p>
      <p><strong>Sunrise:</strong> {new Date(data.sun_moon.sunrise).toLocaleTimeString()}</p>
      <p><strong>Sunset:</strong> {new Date(data.sun_moon.sunset).toLocaleTimeString()}</p>

      <div className="mt-4">
        <h3 className="font-medium">Planets</h3>
        <ul className="grid grid-cols-2 gap-2 mt-2">
          {Object.entries(data.planets).map(([planet, details]) => (
            <li key={planet}>
              <strong>{planet}:</strong> {details.sign} {details.degree_in_sign}° ({details.house})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CurrentSky;