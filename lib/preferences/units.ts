export type TemperatureUnit = "celsius" | "fahrenheit";
export type DistanceUnit = "meter" | "mile";

export interface UnitPreferences {
  temperature: TemperatureUnit;
  distance: DistanceUnit;
}

export const DEFAULT_UNIT_PREFERENCES: UnitPreferences = {
  temperature: "celsius",
  distance: "meter",
};

const STORAGE_KEY = "ocean-log-unit-preferences-v1";

export function readUnitPreferences(): UnitPreferences {
  if (typeof window === "undefined") return DEFAULT_UNIT_PREFERENCES;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<UnitPreferences> | null;
    return {
      temperature: parsed?.temperature === "fahrenheit" ? "fahrenheit" : "celsius",
      distance: parsed?.distance === "mile" ? "mile" : "meter",
    };
  } catch {
    return DEFAULT_UNIT_PREFERENCES;
  }
}

export function writeUnitPreferences(preferences: UnitPreferences): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const value = unit === "fahrenheit" ? celsius * 9 / 5 + 32 : celsius;
  return `${value.toFixed(1)}°${unit === "fahrenheit" ? "F" : "C"}`;
}

export function formatDistance(kilometers: number, unit: DistanceUnit): string {
  if (unit === "mile") return `${(kilometers * 0.621371).toFixed(1)} mile`;
  const meters = Math.round(kilometers * 1000);
  return `${new Intl.NumberFormat().format(meters)} m`;
}
