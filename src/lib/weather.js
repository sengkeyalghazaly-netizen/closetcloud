/* ============ WEATHER ============
 * Real current weather via Open-Meteo (no API key) + browser geolocation.
 * Falls back gracefully to Manado if location is denied or offline. Returns a
 * shape that also feeds the Outfit Generator's weatherKey (panas/sejuk/hujan). */

const FALLBACK = { lat: 1.4748, lon: 124.8421, city: "Manado" };

function getPosition() {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude, city: "Lokasimu" }),
      () => resolve(null),
      { timeout: 6000, maximumAge: 30 * 60 * 1000 }
    );
  });
}

/* WMO weather code → human label + outfit key */
function describe(code, temp) {
  const rainy = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95);
  const cloudy = code === 2 || code === 3 || (code >= 45 && code <= 48);
  if (rainy) return { key: "hujan", label: "Hujan", desc: "Bawa payung ya" };
  if (temp >= 30) return { key: "panas", label: "Cerah & panas", desc: "Pilih bahan adem" };
  if (cloudy) return { key: "sejuk", label: "Berawan", desc: "Sejuk, pas buat layering" };
  return { key: "sejuk", label: "Cerah", desc: "Enak buat aktivitas" };
}

export async function fetchWeather() {
  const pos = (await getPosition()) || FALLBACK;
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.lat}&longitude=${pos.lon}&current=temperature_2m,weather_code`);
    if (!r.ok) throw new Error("weather");
    const d = await r.json();
    const temp = Math.round(d.current.temperature_2m);
    return { tempC: temp, city: pos.city, ...describe(d.current.weather_code, temp) };
  } catch {
    return { tempC: 29, city: pos.city || "Manado", key: "panas", label: "Cerah & panas", desc: "Pilih bahan adem" };
  }
}
