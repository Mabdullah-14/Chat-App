export default function Footer() {
  return (
    <footer className="flex shrink-0 flex-col items-center justify-between gap-1 border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 sm:flex-row">
      <p>© {new Date().getFullYear()}  ChatApp. All rights reserved.</p>
      <nav className="flex gap-4">
        <a href="/privacy" className="hover:text-teal-700">Privacy</a>
        <a href="/terms" className="hover:text-teal-700">Terms</a>
        <a href="/help" className="hover:text-teal-700">Help</a>
      </nav>
    </footer>
  );
}