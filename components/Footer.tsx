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
          <img src="/logo.png" alt="Root Social" width={20} height={20} className="rounded" />
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
