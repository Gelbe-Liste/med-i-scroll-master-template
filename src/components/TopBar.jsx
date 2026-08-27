import { useEffect, useState } from "react";

export default function TopBar({ activeIndex, pages, project, onMenu, onPdf, pdfGenerating = false, pdfProgress = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const pdfLabel = pdfGenerating ? `PDF wird erstellt (${pdfProgress} %)` : "PDF erstellen";
  return (
    <header className={`topbar ${scrolled ? "topbar--scrolled" : ""}`}>
      <a className="topbar__logo" href={project.meta.logoUrl} target="_blank" rel="noreferrer" aria-label="Gelbe Liste öffnen">
        <img src={project.meta.logo} alt="Gelbe Liste" />
      </a>
      <div className="topbar__title" aria-live="polite">
        <span className="topbar__eyebrow">{project.meta.eyebrow}</span>
        <span className="topbar__chapter">{pages[activeIndex]?.nav}</span>
      </div>
      <div className="topbar__actions">
        <button className={`pdf-button ${pdfGenerating ? "is-generating" : ""}`} onClick={onPdf} disabled={pdfGenerating} aria-label={pdfLabel} title={pdfLabel} aria-busy={pdfGenerating}>
          {pdfGenerating ? <span className="pdf-button__progress" aria-hidden="true">{pdfProgress}%</span> : (
            <svg className="pdf-button__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 2.75h7.25L18.5 7.5v13.75H6.5z"/><path d="M13.75 2.75V7.5h4.75"/><path d="M8.4 15.8h1.25c1.05 0 1.7-.55 1.7-1.45 0-.9-.65-1.45-1.7-1.45H8.4v4.2M13 17.1v-4.2h1.15c1.45 0 2.35.78 2.35 2.1s-.9 2.1-2.35 2.1H13M18 12.9v4.2M18 12.9h2.3M18 14.85h1.95"/></svg>
          )}
        </button>
        <button className="menu-button" onClick={onMenu} aria-label="Kapitelmenü öffnen"><span/><span/><span/></button>
      </div>
    </header>
  );
}
