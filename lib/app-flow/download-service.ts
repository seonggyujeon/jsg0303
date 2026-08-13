export interface InitialDataPreparationOptions {
  signal?: AbortSignal;
  onProgress: (progress: number) => void;
}

export interface InitialDataPreparationResult {
  preparedAt: string;
  source: "mock";
}

const MOCK_STEPS = [8, 19, 34, 52, 68, 84, 100] as const;
const LANGUAGE_STEPS = [18, 42, 68, 86, 100] as const;

function delay(milliseconds: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = window.setTimeout(resolve, milliseconds);
    signal?.addEventListener("abort", () => {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}

// Replace only this adapter when real API downloads and cache warming are ready.
export async function prepareInitialAppData({
  signal,
  onProgress,
}: InitialDataPreparationOptions): Promise<InitialDataPreparationResult> {
  onProgress(0);
  for (const progress of MOCK_STEPS) {
    await delay(180, signal);
    onProgress(progress);
  }
  return { preparedAt: new Date().toISOString(), source: "mock" };
}

// Replace this adapter when language packs are fetched or cached remotely.
export async function applyLanguageResources({
  signal,
  onProgress,
}: InitialDataPreparationOptions): Promise<void> {
  onProgress(0);
  for (const progress of LANGUAGE_STEPS) {
    await delay(110, signal);
    onProgress(progress);
  }
}
