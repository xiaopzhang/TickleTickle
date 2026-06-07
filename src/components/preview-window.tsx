type PreviewWindowProps = {
  compact?: boolean;
};

export function PreviewWindow({ compact = false }: PreviewWindowProps) {
  return (
    <article className={compact ? "browser-card secondary-preview" : "browser-card"} aria-hidden={compact}>
      <div className="browser-bar">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        {!compact ? <span className="address" /> : null}
      </div>
      <div className="mock-site">
        {compact ? (
          <div className="mock-lines">
            <span className="mock-line dark" />
            <span className="mock-line medium" />
            <span className="mock-line short" />
          </div>
        ) : (
          <>
            <div className="mock-hero">
              <div className="mock-lines">
                <span className="mock-line dark" />
                <span className="mock-line medium" />
                <span className="mock-line short" />
              </div>
              <div className="mock-panel" />
            </div>
            <div className="mock-grid">
              <span className="mock-tile" />
              <span className="mock-tile" />
              <span className="mock-tile" />
            </div>
          </>
        )}
      </div>
    </article>
  );
}
