import ContentCard from "./ContentCard";
export default function ImprintContent({ page, imprint }) {
  return <ContentCard wide><p className="page-kicker">{page.kicker}</p><h2>{page.title}</h2><div className="imprint-grid">
    <section className="imprint-section"><h3>{imprint.editorialHeading}</h3><p><strong>Redaktion:</strong> {imprint.editorialName}<br/>{imprint.company}<br/>{imprint.street}<br/>{imprint.city}<br/><a href={`mailto:${imprint.email}`}>{imprint.email}</a></p></section>
    <section className="imprint-section"><h3>Herausgeber und verantwortlicher Diensteanbieter</h3><p><strong>{imprint.company}</strong><br/>{imprint.street}<br/>{imprint.city}</p><p>Telefon: <a href={`tel:${imprint.phoneHref}`}>{imprint.phone}</a><br/>E-Mail: <a href={`mailto:${imprint.email}`}>{imprint.email}</a></p></section>
    <section className="imprint-section"><h3>Unternehmensangaben</h3><p><strong>Vertreten durch:</strong> {imprint.representatives}<br/><strong>Handelsregister:</strong> {imprint.register}<br/><strong>USt-IdNr.:</strong> {imprint.vatId}</p></section>
    <section className="imprint-section"><h3>Verantwortlich für journalistisch-redaktionelle Inhalte</h3><p>gemäß § 18 Abs. 2 MStV:<br/>{imprint.responsibleEditorial}<br/>{imprint.company}<br/>{imprint.street}<br/>{imprint.city}</p></section>
    <section className="imprint-section imprint-section--full"><h3>Bildnachweise</h3><p>{imprint.imageCredits.map((item,index)=><span key={index}>{item}{index<imprint.imageCredits.length-1&&<br/>}</span>)}</p></section>
  </div></ContentCard>;
}
