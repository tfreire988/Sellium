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
    email: {
      from: string;
      date: string;
      subject: string;
      body: string;
      tag: string;
    };
  };
  howItWorks: {
    title: string;
    step1: { title: string; body: string };
    step2: {
      title: string;
      body: string;
      chipLabel: string;
      chipValue: string;
    };
    step3: {
      title: string;
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
    free: {
      badge: string;
      label: string;
      price: string;
      priceNote: string;
      features: [string, string, string];
      cta: string;
      note: string;
    };
    paid: {
      label: string;
      soon: string;
      body: string;
      items: [string, string, string];
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
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  whyNow: {
    eyebrow: string;
    title: string;
    reasons: { lead: string; body: string }[];
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
    cookies: string;
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
      eyebrow: "Huella de carbono para pymes · Gratis en la beta",
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
      email: {
        from: "grandes.cuentas@grupoaltavera.es",
        date: "Lun · 09:14",
        subject: "Solicitud: huella de carbono de proveedores",
        body: "Hola: para renovar el contrato el año que viene necesitamos vuestro informe de huella de carbono (Alcance 1 y 2) antes del 30 de septiembre. ¿Nos lo podéis enviar?",
        tag: "SIN RESPONDER",
      },
    },
    howItWorks: {
      title: "Cómo funciona",
      step1: {
        title: "Sube tus facturas",
        body: "Foto o PDF de luz, gas o combustible del último año. Como las tengas.",
      },
      step2: {
        title: "Dinos para quién es",
        body: "El informe lleva el nombre de tu cliente y se ajusta a su información conforme trabajamos contigo — no es un PDF genérico con tus datos rellenados.",
        chipLabel: "Destinatario",
        chipValue: "Grupo Altavera Construcciones",
      },
      step3: {
        title: "Listo para enviar",
        filename: "Informe_TalleresRovira_2026.pdf",
        totalLabel: "Total",
        totalValue: "18,6 t CO₂e",
        stampWord: "LISTO",
        body: "Descarga el PDF con tu cálculo, la metodología y un plan de reducción incluido.",
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
      title: "Ahora mismo, gratis",
      subtitle:
        "Sellium está en beta. Mientras lo pulimos contigo, generas tu informe completo sin pagar nada y sin tarjeta.",
      free: {
        badge: "BETA",
        label: "Plan gratis",
        price: "0 €",
        priceNote: "durante la beta · sin tarjeta",
        features: [
          "Informe completo: Alcances 1 y 2 + estimación de Alcance 3",
          "PDF con el nombre de tu cliente, listo para enviar",
          "Cálculo con los factores oficiales del MITECO",
        ],
        cta: "Empezar gratis",
        note: "Sin tarjeta. Sin permanencia.",
      },
      paid: {
        label: "Planes de pago",
        soon: "Próximamente",
        body: "Cuando termine la beta habrá un plan de pago por informe para pymes y un plan por volumen para gestorías. Quien entre ahora mantendrá condiciones especiales de lanzamiento.",
        items: [
          "Informe único para pymes y autónomos",
          "Plan por volumen para gestorías y asesorías",
          "Ventajas de lanzamiento para los primeros usuarios",
        ],
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
      body: "Calculamos con los factores de emisión oficiales del MITECO, actualizados cada ejercicio — los mismos que usa el registro estatal de huella de carbono. Tu informe es una autodeclaración: lista para entregar a tu cliente y como base para inscribirte en ese registro.",
    },
    faq: {
      eyebrow: "Antes de que lo preguntes",
      title: "Lo que todo el mundo pregunta",
      items: [
        {
          q: "¿Es un certificado oficial?",
          a: "No. Es tu autodeclaración de huella de carbono, calculada con los factores oficiales del MITECO. Sirve para entregársela a tu cliente; no es una certificación emitida por un tercero (eso lo hace un verificador acreditado).",
        },
        {
          q: "¿Me vale para inscribirme en el registro del MITECO?",
          a: "Sí, como base: te damos el cálculo de Alcance 1 y 2 con los factores oficiales, que es justo lo que pide el registro estatal. La inscripción para obtener el sello la haces tú en la web del MITECO con esos números.",
        },
        {
          q: "¿Y si mi cliente exige verificación (AENOR)?",
          a: "Para licitaciones o requisitos que piden verificación acreditada necesitas un verificador externo (por ejemplo, AENOR). Nuestro informe le sirve de punto de partida.",
        },
        {
          q: "¿El Alcance 3 estimado cuenta?",
          a: "Sí. El Alcance 3 es opcional y se admite estimarlo (método por gasto), tanto en el GHG Protocol como en el registro del MITECO. Lo esencial —Alcance 1 y 2— lo calculamos con los consumos reales de tus facturas.",
        },
        {
          q: "¿Usáis mis facturas para entrenar la IA?",
          a: "No. Trabajamos con las APIs empresariales de nuestros proveedores de IA, no con sus versiones públicas. Por política y términos contractuales de esos proveedores, los datos enviados por API no se usan para entrenar modelos. Los PDFs se procesan y se eliminan de nuestro almacenamiento una vez generado tu informe, y puedes borrar tu historial cuando quieras.",
        },
        {
          q: "¿Por qué necesito IA para algo que parece un cálculo simple?",
          a: "El cálculo en sí es una multiplicación (consumo × factor de emisión) — ahí no usamos IA. La usamos en el paso anterior: leer tus facturas. Cada compañía (Endesa, Iberdrola, Repsol…) factura en un formato distinto, y programar algo que entienda todos esos formatos a mano es inviable. La IA lee cualquier PDF y extrae el consumo real; nuestro cálculo, transparente y no una caja negra, hace el resto.",
        },
        {
          q: "¿Es tan válido como el informe de una consultora que cobra mucho más?",
          a: "El Ministerio no exige que una consultora concreta firme el cálculo — exige que siga la metodología oficial (factores del MITECO + GHG Protocol). Hacemos exactamente ese mismo cálculo, automatizado. Lo que ahorras no es rigor, es el tiempo de descifrar facturas y aplicar factores a mano.",
        },
      ],
    },
    whyNow: {
      eyebrow: "El momento",
      title: "¿Por qué ahora, si nadie me obliga todavía?",
      reasons: [
        {
          lead: "Tu cliente grande sí está obligado a reportar su cadena de proveedores.",
          body: "Si no le das tu dato, no puede completar el suyo — y cada vez más empresas ya se lo exigen a sus proveedores como condición para seguir trabajando juntos.",
        },
        {
          lead: "Cada vez más concursos públicos valoran o exigen la huella de carbono.",
          body: "Como criterio técnico o de solvencia. No en todos los casos es decisivo, pero presentarte sin ese dato te resta puntos frente a quien sí lo tiene.",
        },
        {
          lead: "Bancos y líneas de financiación piden cada vez más criterios ESG a las pymes.",
          body: "Tenerlo calculado no es un gasto ecológico: es papeleo que evita que te quedes fuera cuando solicitas crédito.",
        },
      ],
    },
    finalCta: {
      title: "Deja de posponer algo que se hace en un día.",
      cta: "Empezar mi informe",
      note: "Gratis durante la beta · listo en 24 h",
    },
    footer: {
      copyright: "© 2026 Sellium — Informes de huella de carbono para pymes",
      legal: "Aviso legal",
      privacy: "Privacidad",
      cookies: "Cookies",
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
      eyebrow: "Carbon footprint for SMEs · Free in beta",
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
      email: {
        from: "procurement@grupoaltavera.es",
        date: "Mon · 09:14",
        subject: "Request: supplier carbon footprint",
        body: "Hi — to keep the contract next year we need your carbon footprint report (Scope 1 and 2) before 30 September. Can you send it over?",
        tag: "UNANSWERED",
      },
    },
    howItWorks: {
      title: "How it works",
      step1: {
        title: "Upload your bills",
        body: "Photo or PDF of electricity, gas or fuel from the last year. However you have them.",
      },
      step2: {
        title: "Tell us who it's for",
        body: "The report carries your client's name and is refined together with you — not a generic PDF with your data filled in.",
        chipLabel: "Recipient",
        chipValue: "Grupo Altavera Construcciones",
      },
      step3: {
        title: "Ready to send",
        filename: "Report_TalleresRovira_2026.pdf",
        totalLabel: "Total",
        totalValue: "18.6 t CO₂e",
        stampWord: "READY",
        body: "Download the PDF with your calculation, methodology and a reduction plan included.",
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
      title: "Right now, it's free",
      subtitle:
        "Sellium is in beta. While we polish it with you, you can generate your full report at no cost and with no card.",
      free: {
        badge: "BETA",
        label: "Free plan",
        price: "€0",
        priceNote: "during the beta · no card",
        features: [
          "Full report: Scopes 1 & 2 + Scope 3 estimate",
          "PDF with your client's name, ready to send",
          "Calculated with official MITECO factors",
        ],
        cta: "Start free",
        note: "No card. No commitment.",
      },
      paid: {
        label: "Paid plans",
        soon: "Coming soon",
        body: "When the beta ends there will be a pay-per-report plan for SMEs and a volume plan for accountancy firms. Whoever joins now keeps special launch terms.",
        items: [
          "Single report for SMEs and freelancers",
          "Volume plan for accountancy & advisory firms",
          "Launch perks for the first users",
        ],
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
      body: "We calculate with the official MITECO emission factors, updated every year — the same ones Spain's national carbon-footprint registry uses. Your report is a self-declaration: ready to hand to your client and a basis to register there.",
    },
    faq: {
      eyebrow: "Before you ask",
      title: "What everyone asks",
      items: [
        {
          q: "Is it an official certificate?",
          a: "No. It's your self-declared carbon footprint, calculated with the official MITECO factors. It's meant to hand to your client; it isn't a third-party certification (that's issued by an accredited verifier).",
        },
        {
          q: "Can I use it to register with MITECO?",
          a: "Yes, as a basis: we give you the Scope 1 and 2 calculation with the official factors, which is exactly what Spain's national registry asks for. You do the registration for the seal on the MITECO website with those numbers.",
        },
        {
          q: "What if my client demands verification (AENOR)?",
          a: "For tenders or requirements that ask for accredited verification you need an external verifier (e.g. AENOR). Our report serves as the starting point.",
        },
        {
          q: "Does the estimated Scope 3 count?",
          a: "Yes. Scope 3 is optional and may be estimated (spend-based method), both under the GHG Protocol and MITECO's registry. The essential part — Scope 1 and 2 — we calculate from the real consumption on your bills.",
        },
        {
          q: "Do you use my bills to train the AI?",
          a: "No. We work with our AI providers' enterprise APIs, not their public versions. By those providers' policy and contractual terms, data sent via API is not used to train models. PDFs are processed and automatically deleted from our storage once your report is generated, and you can delete your history whenever you want.",
        },
        {
          q: "Why do I need AI for something that looks like a simple calculation?",
          a: "The calculation itself is a multiplication (consumption × emission factor) — no AI there. We use it in the step before: reading your bills. Every utility (Endesa, Iberdrola, Repsol…) bills in a different format, and hand-coding something that understands them all is unfeasible. The AI reads any PDF and extracts the real consumption; our calculation — transparent, not a black box — does the rest.",
        },
        {
          q: "Is it as valid as a report from a consultancy that charges much more?",
          a: "The Ministry doesn't require a specific consultancy to sign the calculation — it requires following the official methodology (MITECO factors + GHG Protocol). We do exactly that calculation, automated. What you save isn't rigour, it's the time of deciphering bills and applying factors by hand.",
        },
      ],
    },
    whyNow: {
      eyebrow: "The timing",
      title: "Why now, if nobody's forcing me yet?",
      reasons: [
        {
          lead: "Your big client is required to report its supply chain.",
          body: "If you don't give them your figure, they can't complete theirs — and more and more companies now require it from suppliers as a condition to keep working together.",
        },
        {
          lead: "Public tenders increasingly value or require a carbon footprint.",
          body: "As a technical or solvency criterion. It isn't always decisive, but showing up without it costs you points against those who have it.",
        },
        {
          lead: "Banks and financing lines increasingly ask SMEs for ESG criteria.",
          body: "Having it calculated isn't a green expense: it's paperwork that keeps you from being left out when you apply for credit.",
        },
      ],
    },
    finalCta: {
      title: "Stop postponing something that takes one day.",
      cta: "Start my report",
      note: "Free during the beta · ready in 24 h",
    },
    footer: {
      copyright: "© 2026 Sellium — Carbon footprint reports for SMEs",
      legal: "Legal notice",
      privacy: "Privacy",
      cookies: "Cookies",
      email: "contacto@sellium.es",
    },
  },
};
