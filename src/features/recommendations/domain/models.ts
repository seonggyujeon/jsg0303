import type { LocalizedText } from "../../../core/i18n/types";

export type ActivityKind = "swim" | "surf" | "sup" | "kayak" | "yacht" | "walk" | "fishing";
export type ActivityCategory = "all" | "activity" | "fishing" | "relax" | "kids";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MarineActivity {
  id: string;
  placeId: string;
  kind: ActivityKind;
  title: LocalizedText;
  description: LocalizedText;
  requiresReservation: boolean;
  minimumAge?: number;
}

export interface CoastalPlace extends Coordinates {
  id: string;
  name: LocalizedText;
  categories: Exclude<ActivityCategory, "all">[];
  activityKind: ActivityKind;
  groupSize: { minimum: number; maximum: number };
}

export interface MarineConditions {
  airTemperature: number;
  waterTemperature: number;
  precipitation: number;
  windSpeed: number;
  waveHeight: number;
  crowdEstimate: number;
  observedAt: string;
}

export interface RecommendationScore {
  total: number;
  weather: number;
  sea: number;
  crowd: number;
  distance: number;
  group: number;
  unsafe: boolean;
}

export interface RankedRecommendation {
  place: CoastalPlace;
  conditions: MarineConditions;
  score: RecommendationScore;
  distanceKm: number;
}
