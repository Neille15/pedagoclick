import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;
const healthUrl = `${apiUrl}/api/health`;


export default function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadHealth() {
      try {
        const response = await fetch(healthUrl, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`API returned HTTP ${response.status}`);
        }

        const data = await response.json();
        setHealth(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      }
    }

    loadHealth();
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <h1 className="text-3xl font-bold">Pedagoclick API status</h1>
      {error && <p role="alert">{error}</p>}
      {!health && !error && <p>Checking the API…</p>}
      {health && <p>Database: {health.db}</p>}
    </main>
  );
}
