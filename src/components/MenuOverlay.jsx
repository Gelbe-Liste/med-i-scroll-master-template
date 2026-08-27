import { useEffect } from "react";
export default function MenuOverlay({ open, pages, activeIndex, title, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    document.body.classList.add("menu-open"); window.addEventListener("keydown", onKeyDown);
    return () => { document.body.classList.remove("menu-open"); window.removeEventListener("keydown", onKeyDown); };
  }, [open, onClose]);
  if (!open) return null;
  const goTo = (id) => { onClose(); requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })); };
  return <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Kapitelübersicht">
    <div className="menu-overlay__header"><strong>{title}</strong><button onClick={onClose} aria-label="Menü schließen">×</button></div>
    <nav className="menu-overlay__nav">{pages.map((page,index)=><button key={page.id} onClick={()=>goTo(page.id)} className={index===activeIndex?"is-active":""}><span>{page.number}</span><strong>{page.nav}</strong></button>)}</nav>
  </div>;
}
