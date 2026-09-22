"use client";

export function CertificateToolbar({ verifyUrl }: { verifyUrl: string }) {
  return (
    <div className="toolbar">
      <button className="btn btn-primary" onClick={() => window.print()}>
        ⬇ Download PDF
      </button>
      <a href={verifyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
        🔗 Verify Online
      </a>
      <button
        className="btn btn-secondary"
        onClick={() => navigator.clipboard?.writeText(verifyUrl)}
      >
        📋 Copy Verify URL
      </button>
    </div>
  );
}
