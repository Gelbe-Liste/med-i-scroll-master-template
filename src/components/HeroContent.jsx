import ContentCard from "./ContentCard";

export default function HeroContent({ page }) {
  return (
    <ContentCard className="hero-card">
      <p className="page-kicker">{page.kicker}</p>
      <h1>{page.title}</h1>
      <p className="hero-card__subtitle">{page.subtitle}</p>
      <blockquote className="hero-card__quote">
        {page.quote}
        <cite>— {page.attribution}</cite>
      </blockquote>
    </ContentCard>
  );
}
