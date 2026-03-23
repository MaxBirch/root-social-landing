"use client";

const logos = [
  { src: "/logos/hades-agency.png", alt: "Hades Agency" },
  { src: "/logos/phantom-jewels.png", alt: "Phantom Jewels" },
  { src: "/logos/spectra.png", alt: "Spectra" },
  { src: "/logos/apex.png", alt: "Apex" },
  { src: "/logos/body-boom.png", alt: "Body Boom" },
  { src: "/logos/pumpables.png", alt: "Pumpables" },
  { src: "/logos/dopeboykits.webp", alt: "Dope Boy Kits" },
  { src: "/logos/wilsons.webp", alt: "Wilsons" },
  { src: "/logos/nitro-co.avif", alt: "Nitro Co" },
];

export default function LogoCarousel() {
  // Duplicate logos for seamless infinite loop
  const allLogos = [...logos, ...logos];

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
                style={{
                  height: "36px",
                  width: "auto",
                  objectFit: "contain",
                  opacity: 0.55,
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
