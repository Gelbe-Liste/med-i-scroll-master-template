import { useEffect, useRef, useState } from "react";
import { trackEvent, trackOnce } from "../tracking/piano";

export default function PageShell({
  page,
  index,
  total,
  nextId,
  previousId,
  startId,
  onActive,
  children,
  long = false,
  projectId,
  pageName
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(index === 0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Für lange Kapitel ist ein Anteil an der gesamten Kapitelhöhe oft unerreichbar.
        // Deshalb auf das kleinere Maß aus Kapitelhöhe und Viewport beziehen.
        const referenceHeight = Math.min(entry.boundingClientRect.height, window.innerHeight);
        const visibleHeight = entry.isIntersecting ? entry.intersectionRect.height : 0;
        setVisible(visibleHeight >= referenceHeight * 0.12);
        if (referenceHeight > 0 && visibleHeight >= referenceHeight * 0.35) {
          onActive(index);
          trackOnce(`chapter-${page.id}`, "chapter.display", {
            page: pageName,
            chapter_id: page.id,
            chapter_number: index + 1,
            chapter_title: page.nav,
            content_type: page.kind
          });
        }
      },
      { threshold: [0, 0.01, 0.05, 0.12, 0.2, 0.35, 0.55, 0.75] }
    );

    observer.observe(element);
    // Prüfen auch beim Scrollen: bei sehr langen Kapiteln bleibt die IO-Ratio < 0.12.
    let animationFrame = 0;
    const updateLongChapter = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        const rect = element.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        const referenceHeight = Math.min(rect.height, window.innerHeight);
        setVisible(referenceHeight > 0 && visibleHeight >= referenceHeight * 0.12);
        if (referenceHeight > 0 && visibleHeight >= referenceHeight * 0.35) {
          onActive(index);
          trackOnce(`chapter-${page.id}`, "chapter.display", {
            page: pageName,
            chapter_id: page.id,
            chapter_number: index + 1,
            chapter_title: page.nav,
            content_type: page.kind
          });
        }
      });
    };
    window.addEventListener("scroll", updateLongChapter, { passive: true });
    window.addEventListener("resize", updateLongChapter);
    updateLongChapter();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateLongChapter);
      window.removeEventListener("resize", updateLongChapter);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [index, onActive, page, pageName]);

  const scrollTo = (targetId, action) => {
    if (!targetId) return;
    trackEvent("click.action", {
      pop_in_type: "Navigation",
      pop_in_name: "Chapter navigation",
      click: action,
      page: pageName,
      chapter_id: page.id,
      target_chapter_id: targetId,
      element_id: `chapter-nav-${action.toLowerCase().replace(/\s+/g, "-")}`,
      trigger_source: "chapter_navigation"
    });
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={ref}
      id={page.id}
      className={`story-page story-page--${page.tone} story-page--${page.align} ${long ? "story-page--long" : ""} ${visible ? "is-visible" : ""}`}
    >
      <div
        className={`story-page__background ${page.background ? "" : "story-page__background--plain"}`}
        style={page.background ? {
          backgroundImage: `url("${page.background}")`,
          backgroundPosition: page.focal || "center center"
        } : undefined}
      >
        <div className="story-page__scrim" />
      </div>

      {page.background && (
        <figure className="print-chapter-image" aria-hidden="true">
          <img src={page.background} alt="" />
        </figure>
      )}

      <div className="story-page__inner">{children}</div>

      <div className="scroll-controls" aria-label="Kapitel-Navigation">
        <button
          className="scroll-button scroll-button--down"
          onClick={() => scrollTo(nextId, "Next chapter")}
          aria-label={nextId ? "Zum nächsten Kapitel" : "Kein weiteres Kapitel"}
          disabled={!nextId}
        >
          <span aria-hidden="true">↓</span>
        </button>
        <button
          className="scroll-button scroll-button--up"
          onClick={() => scrollTo(previousId, "Previous chapter")}
          aria-label={previousId ? "Zum vorherigen Kapitel" : "Kein vorheriges Kapitel"}
          disabled={!previousId}
        >
          <span aria-hidden="true">↑</span>
        </button>
        <button
          className="scroll-button scroll-button--top"
          onClick={() => scrollTo(startId, "Scroll to top")}
          aria-label="Zum Anfang der Anwendung"
          title="Zum Anfang"
        >
          <span className="scroll-to-top-icon" aria-hidden="true">
            <span className="scroll-to-top-icon__bar" />
            <span className="scroll-to-top-icon__arrow">↑</span>
          </span>
        </button>
      </div>
    </section>
  );
}
