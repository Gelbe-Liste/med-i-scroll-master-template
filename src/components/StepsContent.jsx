import ContentCard from "./ContentCard";

export default function StepsContent({ page }) {
  return (
    <ContentCard wide>
      <p className="page-kicker">{page.kicker}</p>
      <h2>{page.title}</h2>
      <p className="page-subtitle">{page.intro}</p>
      <div className="steps">
        {page.steps.map((step, index) => (
          <section className="step" key={step.title}>
            <div className="step__number">{index + 1}</div>
            <div>
              <h3>{step.title}</h3>
              {step.items && (
                <ul className="editorial-list">
                  {step.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
              {step.quote && <blockquote className="editorial-quote">{step.quote}</blockquote>}
            </div>
          </section>
        ))}
      </div>
    </ContentCard>
  );
}
