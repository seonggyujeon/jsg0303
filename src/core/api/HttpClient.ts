export interface RequestOptions {
  signal?: AbortSignal;
  headers?: HeadersInit;
}

export interface HttpClient {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  post<TResponse, TBody>(path: string, body: TBody, options?: RequestOptions): Promise<TResponse>;
}

export class FetchHttpClient implements HttpClient {
  constructor(private readonly baseUrl = "") {}

  get<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { method: "GET", ...options });
  }

  post<TResponse, TBody>(path: string, body: TBody, options?: RequestOptions) {
    return this.request<TResponse>(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${path}`);
    return response.json() as Promise<T>;
  }
}
