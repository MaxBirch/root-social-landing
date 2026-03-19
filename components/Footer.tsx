"use client";

export default function Footer() {
  return (
    <footer
      className="py-8 px-4"
      style={{
        background: "#080808",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Root Social" width={24} height={24} className="rounded" />
            <div>
              <p className="font-black text-white text-sm tracking-wider uppercase" style={{ letterSpacing: "0.08em" }}>Root Social</p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem" }}>Growth Through Performance</p>
            </div>
          </div>

          {/* Trust signals */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", marginLeft: "4px", fontWeight: 600 }}>5.0 Google</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>|</span>
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", fontWeight: 600 }}>50+ Brands Scaled</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5">
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>
            © 2026 Root Social Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/privacy"
              style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              Privacy Policy
            </a>
            <a
              href="mailto:hello@root-social.com"
              style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              hello@root-social.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
