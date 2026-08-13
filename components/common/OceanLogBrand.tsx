export function OceanLogBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "ol-brand ol-brand--compact" : "ol-brand"} aria-label="Ocean Log">
      <span className="ol-brand__mark" aria-hidden="true"><i /><b /></span>
      <span className="ol-brand__wordmark">
        <strong>오션로그</strong>
        <small>OCEAN LOG</small>
      </span>
    </div>
  );
}
