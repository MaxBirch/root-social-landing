export default function Testimonial() {
  return (
    <section className="bg-root-cream py-14 md:py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-root-dark font-black text-3xl md:text-4xl text-center mb-10">
          What Our Clients Say
        </h2>

        {/* Luke Durbin testimonial card */}
        <div className="bg-root-dark rounded-2xl p-6 md:p-8 shadow-2xl">
          {/* Top row: name + verified + stars */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-black text-xl">Luke Durbin</h3>
                {/* Green verification checkmark */}
                <div className="w-5 h-5 rounded-full bg-root-green flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <p className="text-root-green font-semibold text-sm">CEO of Hades Agency</p>
            </div>

            {/* Stars + reviews badge */}
            <div className="flex flex-col items-start sm:items-end gap-1.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="bg-root-green/20 text-root-green text-xs font-semibold px-2.5 py-1 rounded-full">
                7 reviews
              </span>
            </div>
          </div>

          {/* Quote */}
          <div className="relative">
            <svg className="absolute -top-2 -left-1 opacity-20" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M11 7H7a4 4 0 00-4 4v6h6v-6a2 2 0 012-2z"/>
              <path d="M21 7h-4a4 4 0 00-4 4v6h6v-6a2 2 0 012-2z"/>
            </svg>
            <p className="text-white/80 text-base md:text-lg leading-relaxed pl-4">
              Root Social completely transformed our paid social performance. Within the first 8 weeks, we saw a 4x return on ad spend — something we hadn&apos;t come close to achieving with our previous agency. The level of attention, creativity, and strategic thinking they bring is in a different league. I won&apos;t be going anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
