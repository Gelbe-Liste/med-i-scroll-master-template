import { useEffect, useRef, useState } from "react";
import { trackEvent } from "../tracking/piano";

export default function WorkflowCarousel({ page, pageName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const lastActionSource = useRef("init");
  const total = page.steps?.length || 0;

  useEffect(() => {
    const currentStep = page.steps?.[activeIndex];
    if (!currentStep) return;

    trackEvent("workflow.slide", {
      page: pageName,
      chapter_id: page.id,
      chapter_title: page.nav,
      content_type: "workflow_slide",
      element_id: `${page.id}-workflow-slider`,
      slide_index: activeIndex + 1,
      slide_total: total,
      slide_title: currentStep.title,
      trigger_source: lastActionSource.current
    });
  }, [activeIndex, page, pageName, total]);

  const changeSlide = (direction, triggerSource) => {
    setActiveIndex((current) => {
      const next = current + direction;
      if (next < 0 || next >= total) return current;
      lastActionSource.current = triggerSource;
      return next;
    });
  };

  const goToSlide = (index, triggerSource) => {
    if (index < 0 || index >= total || index === activeIndex) return;
    lastActionSource.current = triggerSource;
    setActiveIndex(index);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches?.[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches?.[0]?.clientX ?? null;
    touchStartX.current = null;
    if (startX === null || endX === null) return;

    const deltaX = endX - startX;
    if (Math.abs(deltaX) < 48) return;

    if (deltaX < 0) changeSlide(1, "swipe_left_forward");
    else changeSlide(-1, "swipe_right_backward");
  };

  if (!total) return null;

  return (
    <div className="workflow-carousel">
      <div className="workflow-carousel__viewport" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div
          className="workflow-carousel__track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {page.steps.map((step, index) => (
            <section
              className="workflow-slide"
              key={`${page.id}-slide-${index + 1}`}
              aria-hidden={index !== activeIndex}
            >
              <div className="workflow-slide__meta">Schritt {index + 1} von {total}</div>
              <div className="workflow-slide__number">{index + 1}</div>
              <h3>{step.title}</h3>
              {step.items && (
                <ul className="editorial-list">
                  {step.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
              {step.quote && <blockquote className="editorial-quote">{step.quote}</blockquote>}
            </section>
          ))}
        </div>
      </div>

      <div className="workflow-carousel__hint">← Vorwärts wischen  |  Rückwärts wischen →</div>

      <div className="workflow-carousel__controls">
        <button
          type="button"
          className="workflow-carousel__button"
          onClick={() => changeSlide(-1, "button_previous")}
          disabled={activeIndex === 0}
        >
          ← Zurück
        </button>

        <div className="workflow-carousel__status" aria-live="polite">
          {activeIndex + 1} / {total}
        </div>

        <button
          type="button"
          className="workflow-carousel__button"
          onClick={() => changeSlide(1, "button_next")}
          disabled={activeIndex === total - 1}
        >
          Weiter →
        </button>
      </div>

      <div className="workflow-carousel__dots" aria-label="Workflow-Schritte">
        {page.steps.map((step, index) => (
          <button
            key={`${page.id}-dot-${index + 1}`}
            type="button"
            className={`workflow-carousel__dot ${index === activeIndex ? "is-active" : ""}`}
            aria-label={`Zu Schritt ${index + 1}: ${step.title}`}
            onClick={() => goToSlide(index, "dot_navigation")}
          />
        ))}
      </div>
    </div>
  );
}
