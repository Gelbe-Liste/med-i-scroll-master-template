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
    projectId: "indikation-template",
    analytics: {
      page: "med.i.scroll | Indikation",
      pageType: "Microsite",
      visitorType: "Not logged",
      medicalField: "Medizinisches Fachgebiet",
      indication: "Indikation",
      articleCategory: ["MED.I.SCROLL"],
      tags: ["med.i.scroll", "Gelbe Liste", "Scrollytelling"],
      product: {
        name: "",
        molecules: [],
        titulaire: "",
        atcClassCodes: [],
        atcClassNames: [],
        ucd10Codes: []
      }
    },
    pdfFileName: "Indikation_Gelbe-Liste.pdf",
    pdfSubject: "Medizinisches Fachgebiet | Gelbe Liste",
    pdfAuthor: "Vidal MMI Germany GmbH"
  },

  sources: [
    {
      text: "Quelle 1 – hier vollständige Literaturangabe eintragen.",
      url: "https://www.gelbe-liste.de/",
      analyticsId: "source-1"
    },
    {
      text: "Quelle 2 – weitere Referenz ergänzen.",
      url: "https://www.gelbe-liste.de/",
      analyticsId: "source-2"
    }
  ],

  imprint: {
    brandHeading: "Gelbe Liste",
    editorialHeading: "Corporate Publishing",
    editorialRoleLabel: "Redaktion",
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
      id: "kernaussagen",
      number: "02",
      nav: "Kernaussagen",
      kicker: "Kernaussagen",
      title: "Die wichtigsten Fakten auf einen Blick",
      subtitle: "Beispielhafte Kennzahlen – vor Veröffentlichung durch freigegebene Inhalte ersetzen.",
      background: "/assets/images/placeholder-data.svg",
      inlineImage: "/assets/images/placeholder-data.svg",
      inlineImageAlt: "Beispielgrafik",
      zoomable: true,
      imageId: "ueberblick-grafik",
      wide: true,
      tone: "light",
      align: "left",
      kind: "stats",
      stats: [
        { value: "78 %", label: "Beispielkennzahl – zählt bei jedem Sichtbarwerden von 0 % hoch" },
        { value: "63 %", label: "Zweite Beispielkennzahl – Animation wird beim erneuten Sichtbarwerden wiederholt" }
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
      imageId: "fachgrafik",
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
      id: "faq",
      number: "06",
      nav: "Fragen & Antworten",
      kicker: "Praxis-FAQ",
      title: "Häufige Fragen – kompakt beantwortet",
      subtitle: "Die Frage antippen, um die Antwort ein- oder auszublenden.",
      background: "/assets/images/placeholder-practice.svg",
      tone: "light",
      align: "left",
      kind: "standard",
      long: true,
      accordionVariant: "faq",
      accordionItems: [
        {
          id: "faq-1",
          question: "Wie kann eine typische Praxisfrage formuliert werden?",
          answer: [
            "Hier steht die kurze, fachlich freigegebene Antwort. Die Antwort kann aus einem oder mehreren Absätzen bestehen.",
            "Weitere Erläuterungen lassen sich bei Bedarf als zusätzlicher Absatz ergänzen."
          ]
        },
        {
          id: "faq-2",
          question: "Können mehrere Fragen unabhängig voneinander geöffnet werden?",
          answer: "Ja. Jede Frage kann separat auf- und zugeklappt werden. Mehrere Antworten dürfen gleichzeitig geöffnet sein."
        },
        {
          id: "faq-3",
          question: "Wird die Interaktion in Piano Analytics erfasst?",
          answer: "Ja. Öffnen und Schließen werden als accordion.toggle inklusive Frage, Kapitel, Status und Auslöser erfasst."
        }
      ]
    },
    {
      id: "literatur",
      number: "07",
      nav: "Literatur & Download",
      kicker: "Quellen",
      title: "Literatur & weiterführende Informationen",
      tone: "light",
      align: "left",
      kind: "sources",
      long: true,
      primaryCta: {
        label: "Weitere Informationen auf Gelbe Liste",
        url: "https://www.gelbe-liste.de/",
        analyticsId: "cta-gelbe-liste-weitere-informationen"
      },
      pdfCtaLabel: "Inhalte als PDF erstellen"
    },
    {
      id: "impressum",
      number: "08",
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
