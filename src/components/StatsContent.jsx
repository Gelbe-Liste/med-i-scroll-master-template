import { useEffect, useMemo, useRef, useState } from "react";
import ContentCard from "./ContentCard";
import InlineGraphic from "./InlineGraphic";

function parseStatValue(value) {
  const normalized = String(value ?? "").trim();
  const match = normalized.match(/^([\d.,]+)(.*)$/);
  if (!match) return null;

  const rawNumber = match[1];
  const suffix = match[2] || "";
  const decimals = rawNumber.includes(",") ? rawNumber.split(",")[1].length : (rawNumber.includes(".") ? rawNumber.split(".")[1].length : 0);
  const numericValue = Number(rawNumber.replace(".", "").replace(",", "."));

  if (Number.isNaN(numericValue)) return null;
  return { numericValue, decimals, suffix };
}

function formatAnimatedValue(parsed, value) {
  if (!parsed) return value;
  const rendered = parsed.numericValue.toFixed(parsed.decimals).replace(".", ",");
  return `${rendered}${parsed.suffix}`;
}

function AnimatedStatValue({ value }) {
  const ref = useRef(null);
  const frameRef = useRef(0);
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(() => {
    if (!parsed) return value;
    return `${(0).toFixed(parsed.decimals).replace(".", ",")}${parsed.suffix}`;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35] }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    cancelAnimationFrame(frameRef.current);

    if (!parsed) {
      setDisplayValue(value);
      return undefined;
    }

    const zeroValue = `${(0).toFixed(parsed.decimals).replace(".", ",")}${parsed.suffix}`;

    if (!isVisible) {
      setDisplayValue(zeroValue);
      return undefined;
    }

    setDisplayValue(zeroValue);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = parsed.numericValue * eased;
      const rendered = current.toFixed(parsed.decimals).replace(".", ",");
      setDisplayValue(`${rendered}${parsed.suffix}`);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      else setDisplayValue(formatAnimatedValue(parsed, value));
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isVisible, parsed, value]);

  return <strong ref={ref}>{displayValue}</strong>;
}

function StatTile({ stat }) {
  return (
    <div className="stat-tile">
      <AnimatedStatValue value={stat.value} />
      <span>{stat.label}</span>
    </div>
  );
}

export default function StatsContent({ page, onOpenGraphic }) {
  const hasInlineGraphic = Boolean(page.inlineImage);

  return (
    <ContentCard wide={page.wide !== false} className="stats-card">
      <p className="page-kicker">{page.kicker}</p>
      <h2 className="mega-stat">{page.title}</h2>
      {page.subtitle && <p className="page-subtitle">{page.subtitle}</p>}
      {page.stats?.length > 0 && <div className="stat-grid">{page.stats.map((stat, index) => <StatTile stat={stat} key={`${stat.value}-${index}`} />)}</div>}
      {page.quote && <blockquote className="editorial-quote">{page.quote}</blockquote>}
      {page.bullets?.length > 0 && <div className="country-grid">{page.bullets.map((item,index)=><span key={index}>{item}</span>)}</div>}

      {page.inlineImage && (
        <InlineGraphic
          src={page.inlineImage}
          alt={page.inlineImageAlt || page.title}
          onOpenGraphic={onOpenGraphic}
        />
      )}

      {onOpenGraphic && !hasInlineGraphic && (
        <div className="graphic-open-row">
          <button type="button" className="graphic-open-button" onClick={onOpenGraphic} aria-label="Grafik öffnen">
            <span className="graphic-open-button__icon" aria-hidden="true">⌕</span>
            <span>Grafik öffnen</span>
          </button>
        </div>
      )}
    </ContentCard>
  );
}
