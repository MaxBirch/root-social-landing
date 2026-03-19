"use client";

export default function Footer() {
  return (
    <footer
      className="py-6 px-4"
      style={{
        background: "#0A0A0A",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 44 44" fill="none" aria-hidden="true">
            <circle cx="22" cy="22" r="22" fill="#2D8B3C" />
            <rect x="20" y="27" width="4" height="9" rx="1.5" fill="white" />
            <path d="M22 7 L33 24 H11 Z" fill="white" />
            <path d="M22 14 L30 28 H14 Z" fill="#2D8B3C" />
          </svg>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}>
            © 2026 Root Social LTD
          </p>
        </div>
        <a
          href="/privacy"
          className="transition-colors"
          style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
