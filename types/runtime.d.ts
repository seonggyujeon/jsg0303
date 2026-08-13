interface ImportMetaEnv {
  readonly VITE_PUBLIC_APP_NAME?: string;
  readonly VITE_PUBLIC_DEFAULT_LOCALE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

type D1Database = {
  batch(statements: unknown[]): Promise<unknown[]>;
  prepare(query: string): {
    bind(...values: unknown[]): unknown;
    run(): Promise<unknown>;
  };
};

declare module "cloudflare:workers" {
  export const env: Record<string, unknown> & { DB: D1Database };
}
