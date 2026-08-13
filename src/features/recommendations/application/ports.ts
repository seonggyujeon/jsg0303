import type { ActivityCategory, Coordinates, RankedRecommendation } from "../domain/models";

export interface RecommendationQuery {
  category: ActivityCategory;
  people: number;
  origin: Coordinates;
}

export interface RecommendationGateway {
  getRecommendations(query: RecommendationQuery, signal?: AbortSignal): Promise<RankedRecommendation[]>;
}

export interface RecommendationEngine {
  rank(query: RecommendationQuery): Promise<RankedRecommendation[]>;
}
