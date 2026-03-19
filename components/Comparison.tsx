const rows = [
  {
    rootSocial: "Capped clients per media buyer — full focus on you",
    others: "Overworked media buyers",
  },
  {
    rootSocial: "Unlimited creatives, no cap, no extras",
    others: "Set number of creatives",
  },
  {
    rootSocial: "Rolling monthly contracts — stay because it works",
    others: "Locked into contracts",
  },
  {
    rootSocial: "Focused on growing profit",
    others: "Focused on vanity metrics",
  },
  {
    rootSocial: "£20M+ in ad spend managed",
    others: "No experience",
  },
];

export default function Comparison() {
  return (
    <section className="bg-root-cream py-14 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-root-dark font-black text-3xl md:text-4xl lg:text-5xl text-center mb-10 md:mb-14 leading-tight">
          Root Social vs The Rest
        </h2>

        {/* Mobile: stacked cards */}
        <div className="md:hidden space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-xl p-3 flex items-start gap-2 shadow-sm">
                <span className="text-root-green font-bold text-lg shrink-0 mt-0.5">✓</span>
                <p className="text-root-dark text-sm leading-snug">{row.rootSocial}</p>
              </div>
              <div className="bg-root-green rounded-xl p-3 flex items-start gap-2 shadow-sm">
                <span className="text-white/50 font-bold text-lg shrink-0 mt-0.5">✕</span>
                <p className="text-white/80 text-sm leading-snug">{row.others}</p>
              </div>
            </div>
          ))}
          {/* Column headers for mobile */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <p className="text-center text-root-dark font-bold text-sm">Root Social ✅</p>
            <p className="text-center text-white font-bold text-sm bg-root-green rounded-lg py-1">Other Agencies ✕</p>
          </div>
        </div>

        {/* Desktop: side by side table */}
        <div className="hidden md:block rounded-2xl overflow-hidden shadow-xl border border-black/5">
          {/* Header row */}
          <div className="grid grid-cols-2">
            <div className="bg-white px-8 py-5 border-b border-black/10">
              <p className="font-black text-root-dark text-xl">Root Social</p>
              <p className="text-root-green font-semibold text-sm mt-0.5">What you get with us</p>
            </div>
            <div className="bg-root-green px-8 py-5 border-b border-white/10">
              <p className="font-black text-white text-xl">Other Agencies</p>
              <p className="text-white/70 font-semibold text-sm mt-0.5">What you typically get</p>
            </div>
          </div>

          {/* Data rows */}
          {rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-2 ${i % 2 === 0 ? "" : ""}`}>
              <div className={`bg-white px-8 py-5 flex items-center gap-3 border-b border-black/5 ${i === rows.length - 1 ? "border-b-0" : ""}`}>
                <span className="text-root-green font-bold text-xl shrink-0">✓</span>
                <p className="text-root-dark font-medium leading-snug">{row.rootSocial}</p>
              </div>
              <div className={`bg-root-green/90 px-8 py-5 flex items-center gap-3 border-b border-white/10 ${i === rows.length - 1 ? "border-b-0" : ""}`}>
                <span className="text-white/40 font-bold text-xl shrink-0">✕</span>
                <p className="text-white/80 leading-snug">{row.others}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
