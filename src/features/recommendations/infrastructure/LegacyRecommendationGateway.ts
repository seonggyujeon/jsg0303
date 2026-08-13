import type { HttpClient } from "../../../core/api/HttpClient";
import type { RecommendationGateway, RecommendationQuery } from "../application/ports";
import type { RankedRecommendation } from "../domain/models";

interface LegacyRecommendationResponse {
  recommendations?: RankedRecommendation[];
}

/** Adapter reserved for gradually moving the existing endpoint behind a port. */
export class LegacyRecommendationGateway implements RecommendationGateway {
  constructor(private readonly http: HttpClient) {}

  async getRecommendations(query: RecommendationQuery, signal?: AbortSignal) {
    const params = new URLSearchParams({
      category: query.category,
      people: String(query.people),
      lat: String(query.origin.latitude),
      lon: String(query.origin.longitude),
    });
    const response = await this.http.get<LegacyRecommendationResponse>(`/api/recommendations?${params}`, { signal });
    return response.recommendations ?? [];
  }
}
