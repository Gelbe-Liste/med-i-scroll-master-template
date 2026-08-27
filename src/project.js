/**
 * med.i.scroll MASTER CONTENT FILE
 * ------------------------------------------------------------
 * For a new project you normally only edit THIS file and replace
 * the media files in /public/assets.
 */

export const project = {
  meta: {
    title: "Indikation",
    eyebrow: "Medizinisches Fachgebiet",
    description: "med.i.scroll – interaktives Gelbe-Liste-Scrollytelling",
    logo: "/assets/images/glo-logo.png",
    logoUrl: "https://www.gelbe-liste.de/",
    moduleId: "indikation-template",
    analyticsPage: "med-i-scroll-indikation",
    analyticsChapter1: "medizinisches-fachgebiet",
    pdfFileName: "Indikation_Gelbe-Liste.pdf",
    pdfSubject: "Medizinisches Fachgebiet | Gelbe Liste",
    pdfAuthor: "Vidal MMI Germany GmbH"
  },

  sources: [
    {
      text: "Quelle 1 – hier vollständige Literaturangabe eintragen.",
      url: "https://www.gelbe-liste.de/"
    },
    {
      text: "Quelle 2 – weitere Referenz ergänzen.",
      url: "https://www.gelbe-liste.de/"
    }
  ],

  imprint: {
    editorialHeading: "Corporate Publishing",
    editorialName: "Guido Strehlau",
    company: "Vidal MMI Germany GmbH",
    street: "Monzastraße 4",
    city: "63225 Langen",
    phone: "06103 2076-0",
    phoneHref: "+49610320760",
    email: "info@mmi.de",
    representatives: "Michael Schösser, Vincent Bouvier",
    register: "Amtsgericht Offenbach/Main, HRB 8014",
    vatId: "DE113524692",
    responsibleEditorial: "Michael Schösser, Vincent Bouvier",
    imageCredits: ["© Vidal MMI Germany GmbH"]
  },

  pages: [
    {
      id: "intro",
      number: "01",
      nav: "Indikation",
      kicker: "Medizinisches Fachgebiet",
      title: "Indikation",
      subtitle: "Beispielinhalt für ein neues med.i.scroll-Projekt – Texte und Medien zentral in project.js austauschen.",
      background: "/assets/images/placeholder-hero.svg",
      focal: "center center",
      tone: "dark",
      align: "left",
      kind: "hero",
      quote: "Hier kann eine zentrale fachliche Kernaussage oder redaktionelle Einordnung stehen.",
      attribution: "Redaktion Gelbe Liste"
    },
    {
      id: "ueberblick",
      number: "02",
      nav: "Überblick",
      kicker: "Kernaussagen",
      title: "Die wichtigsten Fakten auf einen Blick",
      subtitle: "Beispielhafte Kennzahlen – vor Veröffentlichung durch freigegebene Inhalte ersetzen.",
      background: "/assets/images/placeholder-data.svg",
      inlineImage: "/assets/images/placeholder-data.svg",
      inlineImageAlt: "Beispielgrafik",
      zoomable: true,
      wide: true,
      tone: "light",
      align: "left",
      kind: "stats",
      stats: [
        { value: "01", label: "Beispielkennzahl oder Kernaussage" },
        { value: "02", label: "Zweite Kennzahl oder Einordnung" }
      ],
      quote: "Eine zentrale Botschaft kann hier besonders hervorgehoben werden.",
      bullets: ["Aspekt A", "Aspekt B", "Aspekt C"]
    },
    {
      id: "diagnose-versorgung",
      number: "03",
      nav: "Diagnose und Versorgung",
      kicker: "Versorgung",
      title: "Diagnose und Versorgung",
      background: "/assets/images/placeholder-medical.svg",
      tone: "dark",
      align: "right",
      kind: "standard",
      paragraphs: [
        "Hier wird der fachliche Inhalt des Kapitels gepflegt. Absätze können beliebig ergänzt oder entfernt werden."
      ],
      heading: "Mögliche Untergliederung",
      bullets: [
        "Impfempfehlungen und Versorgungssituationen im Überblick",
        "Praxisrelevante Einordnung",
        "Häufige Fragen aus der Versorgung"
      ]
    },
    {
      id: "praxis",
      number: "04",
      nav: "Praxis",
      kicker: "Praxisblock",
      title: "Vom Wissen zur Entscheidung",
      background: "/assets/images/placeholder-practice.svg",
      tone: "light",
      align: "left",
      kind: "steps",
      long: true,
      intro: "Schrittfolgen eignen sich für Entscheidungswege, Versorgungspfade oder praktische Handlungslogiken.",
      steps: [
        { title: "Schritt 1", items: ["Ersten Punkt ergänzen", "Zweiten Punkt ergänzen"] },
        { title: "Schritt 2", items: ["Weitere Entscheidung oder Einordnung"] },
        { title: "Schritt 3", quote: "Optional kann ein Schritt als hervorgehobene Aussage dargestellt werden." }
      ]
    },
    {
      id: "grafik",
      number: "05",
      nav: "Fachgrafik",
      kicker: "Vertiefung",
      title: "Relevante Grafik im Detail",
      background: "/assets/images/placeholder-graphic.svg",
      zoomable: true,
      wide: true,
      tone: "dark",
      align: "right",
      kind: "standard",
      paragraphs: [
        "Wenn eine Grafik für die Zielgruppe fachlich wichtig ist, kann sie über „Grafik öffnen“ im Vollbild betrachtet und gezoomt werden."
      ],
      note: "Die Originalgrafik im Viewer bleibt unverändert und kann auf mobilen Geräten per Pinch-Zoom vergrößert werden."
    },
    {
      id: "literatur",
      number: "06",
      nav: "Literatur & Download",
      kicker: "Quellen",
      title: "Literatur & weiterführende Informationen",
      tone: "light",
      align: "left",
      kind: "sources",
      long: true,
      primaryCta: {
        label: "Weitere Informationen auf Gelbe Liste",
        url: "https://www.gelbe-liste.de/"
      },
      pdfCtaLabel: "Inhalte als PDF erstellen"
    },
    {
      id: "impressum",
      number: "07",
      nav: "Impressum",
      kicker: "Rechtliche Angaben",
      title: "Impressum",
      tone: "light",
      align: "left",
      kind: "imprint",
      long: true
    }
  ]
};

export const pages = project.pages;
