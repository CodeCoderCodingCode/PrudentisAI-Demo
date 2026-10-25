import Link from "next/link";
import "../../app/globals.css";
import "./preview.css";

export const metadata = {
  title: "Prudentis AI · Component Preview",
  description: "Real Prudentis AI components, rendered locally with sample data.",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="preview-header">
          <Link href="/" className="preview-brand">Prudentis <span>AI</span></Link>
          <nav aria-label="Preview pages">
            <Link href="/">Analytics</Link>
            <Link href="/reports">Email report</Link>
          </nav>
          <span className="preview-label">COMPONENT PREVIEW · SAMPLE DATA</span>
        </header>
        <main className="preview-main">{children}</main>
        <footer className="preview-footer">
          Original application components · Fictional data · No account, database or API keys required
        </footer>
      </body>
    </html>
  );
}
