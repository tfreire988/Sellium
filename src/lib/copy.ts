import type { Lang } from "./language-context";

export interface SiteCopy {
  nav: {
    howItWorks: string;
    pricing: string;
    accountants: string;
    login: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    tagline: string;
    report: {
      label: string;
      client: string;
      recipientLabel: string;
      recipientValue: string;
      scope1Label: string;
      scope1Value: string;
      scope2Label: string;
      scope2Value: string;
      scope3Label: string;
      scope3Value: string;
      totalLabel: string;
      totalValue: string;
      footnote: string;
    };
    stampRing: string;
    stampLine1: string;
    stampLine2: string;
  };
  problem: {
    eyebrow: string;
    line1: string;
    line2: string;
    line3: string;
    closing: string;
  };
  howItWorks: {
    title: string;
    step1: { title: string; body: string };
    step2: { number: string; title: string; body: string };
    step3: {
      number: string;
      filename: string;
      totalLabel: string;
      totalValue: string;
      stampWord: string;
      body: string;
    };
  };
  demo: {
    eyebrow: string;
    title: string;
    body: string;
    dropHint: string;
    destQuestion: string;
    destValue: string;
    destCheck: string;
    procLine1: string;
    procLine2: string;
    reportFilename: string;
    totalLabel: string;
    totalValue: string;
    stampWord: string;
    labels: [string, string, string, string];
  };
  pricing: {
    title: string;
    subtitle: string;
    single: {
      label: string;
      price: string;
      priceNote: string;
      features: [string, string, string];
      cta: string;
      roi: string;
    };
    accountancy: {
      label: string;
      priceFrom: string;
      price: string;
      pricePer: string;
      priceNote: string;
      features: [string, string, string];
      cta: string;
      roi: string;
    };
  };
  accountants: {
    eyebrow: string;
    title: string;
    body: string;
    panelLabel: string;
    rows: [
      { name: string; status: string },
      { name: string; status: string },
      { name: string; status: string },
    ];
    request: string;
    pendingClient: string;
    cta: string;
  };
  trust: {
    badge: string;
    body: string;
  };
  finalCta: {
    title: string;
    cta: string;
    note: string;
  };
  footer: {
    copyright: string;
    legal: string;
    privacy: string;
    email: string;
  };
}

export const copy: Record<Lang, SiteCopy> = {
  es: {
    nav: {
      howItWorks: "Cómo funciona",
      pricing: "Precios",
      accountants: "Para gestorías",
      login: "Entrar",
      cta: "Empezar mi informe",
    },
    hero: {
      eyebrow: "Huella de carbono para pymes · Informe en 24 h",
      title:
        "Tu cliente te ha pedido tu huella de carbono. Aquí la tienes en un día.",
      subtitle:
        "Sube tus facturas de luz y combustible. Nosotros hacemos el resto y te damos algo que tu cliente va a aceptar.",
      ctaPrimary: "Empezar mi informe",
      ctaSecondary: "Ver cómo funciona",
      tagline: 'Sin jerga. Sin consultora. Sin saber qué es un "Alcance".',
      report: {
        label: "Informe de huella de carbono · Ejercicio 2026",
        client: "Talleres Mecánicos Rovira, S.L.",
        recipientLabel: "Destinatario",
        recipientValue: "Grupo Altavera Construcciones",
        scope1Label: "Alcance 1 · Combustión directa",
        scope1Value: "4,2 t CO₂e",
        scope2Label: "Alcance 2 · Electricidad",
        scope2Value: "1,8 t CO₂e",
        scope3Label: "Alcance 3 · Estimación",
        scope3Value: "12,6 t CO₂e",
        totalLabel: "Total",
        totalValue: "18,6 t CO₂e",
        footnote: "Factores de emisión MITECO 2026 · Metodología GHG Protocol",
      },
      stampRing: "LISTO PARA TU CLIENTE · SELLIUM ·",
      stampLine1: "GRUPO",
      stampLine2: "ALTAVERA",
    },
    problem: {
      eyebrow: "Te suena, ¿verdad?",
      line1:
        "No sabes qué es Alcance 1 ni Alcance 2, y tu cliente lo pide como si fuera obvio.",
      line2:
        "Una consultora te cobra 2.000 € por algo que solo necesitas una vez al año.",
      line3: "Tu gestoría de siempre no incluye esto en su servicio habitual.",
      closing:
        "Sellium no viene a hablarte de sostenibilidad. Viene a quitarte un trámite de encima.",
    },
    howItWorks: {
      title: "Cómo funciona",
      step1: {
        title: "Sube tus facturas",
        body: "Foto o PDF de luz, gas o combustible del último año. Como las tengas.",
      },
      step2: {
        number: "2 —",
        title: "Dinos para quién es",
        body: "El informe lleva el nombre de tu cliente y se ajusta a su información conforme trabajamos contigo — no es un PDF genérico con tus datos rellenados.",
      },
      step3: {
        number: "3 —",
        filename: "Informe_TalleresRovira_2026.pdf",
        totalLabel: "Total",
        totalValue: "18,6 t CO₂e",
        stampWord: "LISTO",
        body: "Descarga el informe, listo para enviar.",
      },
    },
    demo: {
      eyebrow: "Demo · 40 segundos",
      title: "Míralo hacer un informe",
      body: "Del montón de facturas al PDF sellado. Esto es, literalmente, todo lo que hay que hacer.",
      dropHint: "SUELTA AQUÍ TUS FACTURAS",
      destQuestion: "¿Para qué cliente es este informe?",
      destValue: "Grupo Altavera Construcciones",
      destCheck: "El informe irá a nombre de Grupo Altavera",
      procLine1: "Leyendo tus facturas…",
      procLine2: "Calculando con los factores oficiales del MITECO…",
      reportFilename: "Informe_2026_GrupoAltavera.pdf",
      totalLabel: "Total",
      totalValue: "18,6 t CO₂e",
      stampWord: "LISTO",
      labels: [
        "1/4 · Sube tus facturas",
        "2/4 · Di para qué cliente es",
        "3/4 · Calculamos (MITECO)",
        "4/4 · Informe sellado",
      ],
    },
    pricing: {
      title: "Precio, sin letra pequeña",
      subtitle:
        "Sin permanencia. Y si tu cliente pide otro formato, los cambios van dentro.",
      single: {
        label: "Informe único",
        price: "149 €",
        priceNote: "pago único · IVA incluido",
        features: [
          "Alcances 1 y 2 + estimación de Alcance 3",
          "PDF listo para tu cliente en 24 h",
          "Cambios incluidos si tu cliente pide otro formato",
        ],
        cta: "Empezar mi informe",
        roi: "Entre 7 y 20 veces más barato que una consultora tradicional.",
      },
      accountancy: {
        label: "Plan gestoría",
        priceFrom: "desde",
        price: "29 €",
        pricePer: "/mes",
        priceNote: "al mes · informes a precio por volumen",
        features: [
          "Panel multi-cliente con estado de cada informe",
          "Recordatorios automáticos y enlace de subida para cada cliente",
          "Precio por volumen",
        ],
        cta: "Crear mi panel",
        roi: "Un solo contacto comercial, decenas de informes.",
      },
    },
    accountants: {
      eyebrow: "Para gestorías y asesorías",
      title: "¿Gestionas varios clientes con este mismo problema?",
      body: "Si eres gestoría o asesoría, probablemente varios de tus clientes están recibiendo el mismo tipo de petición de sus clientes grandes. Gestiónalos todos desde un mismo panel: el estado de cada informe y un enlace para que cada cliente suba sus facturas sin perseguirle por email.",
      panelLabel: "Panel · Asesoría Ficticia, S.L.P.",
      rows: [
        { name: "Talleres Rovira, S.L.", status: "ENVIADO" },
        { name: "Imprenta Solvent", status: "LISTO" },
        { name: "Transportes Nadal", status: "BORRADOR" },
      ],
      request: "Solicitar facturas →",
      pendingClient: "Limpiezas Ordax",
      cta: "Ver el plan gestoría",
    },
    trust: {
      badge: "MITECO · 2026",
      body: "Los cálculos usan los factores de emisión oficiales del MITECO (Ministerio para la Transición Ecológica), actualizados cada ejercicio — la misma referencia que exige el registro voluntario de huella de carbono en España.",
    },
    finalCta: {
      title: "Deja de posponer algo que se hace en un día.",
      cta: "Empezar mi informe",
      note: "149 € · listo en 24 h",
    },
    footer: {
      copyright: "© 2026 Sellium — Informes de huella de carbono para pymes",
      legal: "Aviso legal",
      privacy: "Privacidad",
      email: "contacto@sellium.es",
    },
  },
  en: {
    nav: {
      howItWorks: "How it works",
      pricing: "Pricing",
      accountants: "For accountants",
      login: "Log in",
      cta: "Start my report",
    },
    hero: {
      eyebrow: "Carbon footprint for SMEs · Report in 24 h",
      title: "Your client asked for your carbon footprint. Here it is — in a day.",
      subtitle:
        "Upload your electricity and fuel bills. We do the rest — and hand you something your client will accept.",
      ctaPrimary: "Start my report",
      ctaSecondary: "See how it works",
      tagline: 'No jargon. No consultancy. No idea what a "Scope" is required.',
      report: {
        label: "Carbon footprint report · FY 2026",
        client: "Talleres Mecánicos Rovira, S.L.",
        recipientLabel: "Recipient",
        recipientValue: "Grupo Altavera Construcciones",
        scope1Label: "Scope 1 · Direct combustion",
        scope1Value: "4.2 t CO₂e",
        scope2Label: "Scope 2 · Electricity",
        scope2Value: "1.8 t CO₂e",
        scope3Label: "Scope 3 · Estimate",
        scope3Value: "12.6 t CO₂e",
        totalLabel: "Total",
        totalValue: "18.6 t CO₂e",
        footnote: "MITECO 2026 emission factors · GHG Protocol methodology",
      },
      stampRing: "READY FOR YOUR CLIENT · SELLIUM ·",
      stampLine1: "GRUPO",
      stampLine2: "ALTAVERA",
    },
    problem: {
      eyebrow: "Sound familiar?",
      line1:
        "You don't know what Scope 1 or Scope 2 means, and your client asks as if it were obvious.",
      line2: "A consultancy charges €2,000 for something you only need once a year.",
      line3: "Your regular accountant doesn't offer this as part of their usual service.",
      closing:
        "Sellium isn't here to lecture you about sustainability. It's here to take a chore off your plate.",
    },
    howItWorks: {
      title: "How it works",
      step1: {
        title: "Upload your bills",
        body: "Photo or PDF of electricity, gas or fuel from the last year. However you have them.",
      },
      step2: {
        number: "2 —",
        title: "Tell us who it's for",
        body: "The report carries your client's name and is refined together with you — not a generic PDF with your data filled in.",
      },
      step3: {
        number: "3 —",
        filename: "Report_TalleresRovira_2026.pdf",
        totalLabel: "Total",
        totalValue: "18.6 t CO₂e",
        stampWord: "READY",
        body: "Download the report, ready to send.",
      },
    },
    demo: {
      eyebrow: "Demo · 40 seconds",
      title: "Watch it build a report",
      body: "From a pile of bills to a stamped PDF. This is, literally, all there is to it.",
      dropHint: "DROP YOUR BILLS HERE",
      destQuestion: "Which client is this report for?",
      destValue: "Grupo Altavera Construcciones",
      destCheck: "The report will carry Grupo Altavera's name",
      procLine1: "Reading your bills…",
      procLine2: "Calculating with official MITECO factors…",
      reportFilename: "Report_2026_GrupoAltavera.pdf",
      totalLabel: "Total",
      totalValue: "18.6 t CO₂e",
      stampWord: "READY",
      labels: [
        "1/4 · Upload your bills",
        "2/4 · Name the client",
        "3/4 · We calculate (MITECO)",
        "4/4 · Stamped report",
      ],
    },
    pricing: {
      title: "Pricing, no fine print",
      subtitle:
        "No commitment. If your client asks for a different format, revisions are included.",
      single: {
        label: "Single report",
        price: "€149",
        priceNote: "one-time payment · VAT included",
        features: [
          "Scopes 1 & 2 + Scope 3 estimate",
          "Client-ready PDF within 24 h",
          "Revisions included if your client wants another format",
        ],
        cta: "Start my report",
        roi: "Between 7× and 20× cheaper than a traditional consultancy.",
      },
      accountancy: {
        label: "Accountancy plan",
        priceFrom: "from",
        price: "€29",
        pricePer: "/mo",
        priceNote: "per month · volume pricing on reports",
        features: [
          "Multi-client panel with per-report status",
          "Automatic reminders and an upload link for each client",
          "Volume pricing",
        ],
        cta: "Set up my panel",
        roi: "One sales conversation, dozens of reports.",
      },
    },
    accountants: {
      eyebrow: "For accountancy & advisory firms",
      title: "Managing several clients with this same problem?",
      body: "If you're an accounting firm, several of your clients are likely getting the same kind of request from their own big clients. Manage all of them from one panel: the status of every report, and a link each client uses to upload their own bills — no chasing by email.",
      panelLabel: "Panel · Asesoría Ficticia, S.L.P.",
      rows: [
        { name: "Talleres Rovira, S.L.", status: "SENT" },
        { name: "Imprenta Solvent", status: "READY" },
        { name: "Transportes Nadal", status: "DRAFT" },
      ],
      request: "Request bills →",
      pendingClient: "Limpiezas Ordax",
      cta: "See the accountancy plan",
    },
    trust: {
      badge: "MITECO · 2026",
      body: "Calculations use the official MITECO emission factors (Spain's Ministry for the Ecological Transition), updated every fiscal year — the same reference required by Spain's voluntary carbon footprint registry.",
    },
    finalCta: {
      title: "Stop postponing something that takes one day.",
      cta: "Start my report",
      note: "€149 · ready in 24 h",
    },
    footer: {
      copyright: "© 2026 Sellium — Carbon footprint reports for SMEs",
      legal: "Legal notice",
      privacy: "Privacy",
      email: "contacto@sellium.es",
    },
  },
};
