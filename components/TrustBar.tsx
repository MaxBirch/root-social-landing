const stats = [
  "£20M+ Spent On Ads",
  "4x ROI Delivered in 8 Weeks",
  "No Contracts, Ever",
];

export default function TrustBar() {
  return (
    <section className="bg-root-cream py-8 md:py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
          {stats.map((stat) => (
            <div
              key={stat}
              className="bg-root-dark text-white font-bold text-sm md:text-base px-5 py-3 rounded-full whitespace-nowrap shadow-sm"
            >
              {stat}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
