import { useEffect, useRef, useState } from "react";
import { trackEvent } from "../tracking/piano";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const STEP = 0.5;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export default function ImageLightbox({ open, image, title, chapterId, moduleId, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const pointers = useRef(new Map());
  const lastPanPoint = useRef(null);
  const pinchStart = useRef(null);

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!open) return;

    resetView();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "+" || event.key === "=") {
        setScale((current) => clamp(current + STEP, MIN_SCALE, MAX_SCALE));
      }
      if (event.key === "-") {
        setScale((current) => {
          const next = clamp(current - STEP, MIN_SCALE, MAX_SCALE);
          if (next === 1) setPosition({ x: 0, y: 0 });
          return next;
        });
      }
      if (event.key === "0") resetView();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const changeScale = (delta) => {
    setScale((current) => {
      const next = clamp(current + delta, MIN_SCALE, MAX_SCALE);
      if (next === 1) setPosition({ x: 0, y: 0 });
      trackEvent("image_zoom", {
        chapter_id: chapterId,
        zoom_level: next,
        module_id: moduleId
      });
      return next;
    });
  };

  const onPointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 1) {
      lastPanPoint.current = { x: event.clientX, y: event.clientY };
    }

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { distance: distance(a, b), scale };
      lastPanPoint.current = null;
    }
  };

  const onPointerMove = (event) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      if (!pinchStart.current) return;
      const ratio = distance(a, b) / pinchStart.current.distance;
      setScale(clamp(pinchStart.current.scale * ratio, MIN_SCALE, MAX_SCALE));
      return;
    }

    if (pointers.current.size === 1 && scale > 1 && lastPanPoint.current) {
      const dx = event.clientX - lastPanPoint.current.x;
      const dy = event.clientY - lastPanPoint.current.y;
      setPosition((current) => ({ x: current.x + dx, y: current.y + dy }));
      lastPanPoint.current = { x: event.clientX, y: event.clientY };
    }
  };

  const endPointer = (event) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 1) {
      const [point] = [...pointers.current.values()];
      lastPanPoint.current = point;
    } else if (pointers.current.size === 0) {
      lastPanPoint.current = null;
    }
  };

  const onWheel = (event) => {
    event.preventDefault();
    changeScale(event.deltaY < 0 ? STEP : -STEP);
  };

  return (
    <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={`${title} – vergrößerte Grafik`}>
      <div className="image-lightbox__header">
        <div className="image-lightbox__title">
          <span>Grafikansicht</span>
          <strong>{title}</strong>
        </div>
        <button className="image-lightbox__close" onClick={onClose} aria-label="Grafikansicht schließen"><span aria-hidden="true">×</span><span>Schließen</span></button>
      </div>

      <div
        className={`image-lightbox__stage ${scale > 1 ? "is-zoomed" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onWheel={onWheel}
      >
        <img
          src={image}
          alt={title}
          draggable="false"
          style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})` }}
        />
      </div>

      <div className="image-lightbox__toolbar" aria-label="Zoom-Steuerung">
        <button onClick={() => changeScale(-STEP)} disabled={scale <= MIN_SCALE} aria-label="Verkleinern">−</button>
        <button className="image-lightbox__zoom-value" onClick={resetView} aria-label="Zoom zurücksetzen">
          {Math.round(scale * 100)}%
        </button>
        <button onClick={() => changeScale(STEP)} disabled={scale >= MAX_SCALE} aria-label="Vergrößern">+</button>
        <button className="image-lightbox__reset" onClick={resetView} aria-label="Originalansicht wiederherstellen">1:1</button>
        <button className="image-lightbox__close-labeled" onClick={onClose} aria-label="Grafik schließen">
          <span aria-hidden="true">×</span> Schließen
        </button>
      </div>

      <p className="image-lightbox__hint">Mit +/− zoomen · auf dem Smartphone mit zwei Fingern vergrößern · vergrößerte Grafik verschieben</p>
    </div>
  );
}
