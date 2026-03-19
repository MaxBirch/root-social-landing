export default function Footer() {
  return (
    <footer className="bg-root-dark border-t border-white/5 py-6 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/30 text-sm">
          © 2026 Root Social LTD
        </p>
        <a
          href="/privacy"
          className="text-white/30 text-sm hover:text-white/50 transition-colors"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
