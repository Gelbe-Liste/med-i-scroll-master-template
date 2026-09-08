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
        setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.12);
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
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
      { threshold: [0.12, 0.2, 0.35, 0.55, 0.75] }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [index, onActive, page, pageName]);

  const scrollTo = (targetId, action) => {
    if (!targetId) return;
    trackEvent("click.action", {
      pop_in_type: "Navigation",
      pop_in_name: "Chapter navigation",
      click: action,
      page: pageName,
      chapter_id: page.id,
      destination_path: `#${targetId}`,
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
