export default function VideoSection() {
  return (
    <section className="bg-root-cream py-12 md:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Video container */}
        <div className="relative w-full bg-root-dark rounded-2xl overflow-hidden shadow-2xl">
          {/* 16:9 aspect ratio container */}
          <div className="aspect-video flex items-center justify-center">
            <div className="text-center px-8">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3l14 9-14 9V3z" fill="white" />
                </svg>
              </div>
              <p className="text-white/60 text-base font-medium">Video coming soon</p>
              <p className="text-white/30 text-sm mt-1">Max introduces Root Social and the audit process</p>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="text-center text-root-dark/60 text-sm mt-3">
          Max Birch, Founder · 75 seconds
        </p>
      </div>
    </section>
  );
}
