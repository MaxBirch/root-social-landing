"use client";

const logos = [
  { src: "/logos/hades-agency.png", alt: "Hades Agency" },
  { src: "/logos/phantom-jewels.png", alt: "Phantom Jewels" },
  { src: "/logos/spectra.png", alt: "Spectra" },
  { src: "/logos/apex.png", alt: "Apex" },
  { src: "/logos/body-boom.png", alt: "Body Boom" },
  { src: "/logos/pumpables.png", alt: "Pumpables" },
  { src: "/logos/dopeboykits.png", alt: "Dope Boy Kits" },
  { src: "/logos/wilsons.png", alt: "Wilsons" },
  { src: "/logos/nitro-co.png", alt: "Nitro Co" },
];

export default function LogoCarousel() {
  // Triple logos for truly seamless infinite loop (no gap at reset point)
  const allLogos = [...logos, ...logos, ...logos];

  return (
    <section
      className="py-8 px-0 overflow-hidden"
      style={{
        background: "#0A0A0A",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <p
        className="text-center mb-5"
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.68rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        Trusted by
      </p>

      {/* Fade masks on edges */}
      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
          style={{
            width: "80px",
            background: "linear-gradient(90deg, #0A0A0A, transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
          style={{
            width: "80px",
            background: "linear-gradient(-90deg, #0A0A0A, transparent)",
          }}
        />

        {/* Scrolling track */}
        <div
          className="carousel-track"
          style={{ gap: "0" }}
        >
          {allLogos.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center shrink-0"
              style={{ padding: "0 32px" }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="logo-carousel-img"
                style={{
                  height: "48px",
                  width: "auto",
                  maxWidth: "160px",
                  objectFit: "contain",
                  opacity: 0.7,
                  transition: "opacity 0.2s ease",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
