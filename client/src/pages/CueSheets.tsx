import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/i18n/useLanguage";

const APP_KEY = "cue-sheets";
const SITE_URL = "https://iansound.pro";
const ICON_WEBP = "/cue-sheets-icon-256.webp";
const ICON_PNG = "/cue-sheets-icon-256.png";
const ICON_SHARE = "/cue-sheets-icon-512.png";

const CUE_CSS = `
  html.cue-page, html.cue-page body {
    margin: 0;
    padding: 0;
    background: #080808;
    color: #E8E8E8;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Helvetica, Arial, sans-serif;
    font-weight: 400;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  .cue-page * { box-sizing: border-box; }
  .cue-page { background: #080808; min-height: 100vh; }
  .cue-page .wrap { max-width: 880px; margin: 0 auto; padding: 0 24px; }

  .cue-page .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 0; border-bottom: 0.5px solid #2A2A2A;
  }
  .cue-page .brand { display: flex; align-items: center; gap: 10px; }
  .cue-page .brand .k { color: #E6D36A; font-size: 18px; font-weight: 300; letter-spacing: 4px; }
  .cue-page .brand .pipe { color: #2A2A2A; }
  .cue-page .brand .name { color: #9A9A9A; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; }
  .cue-page .topnav { display: flex; align-items: center; gap: 18px; }
  .cue-page .topnav a {
    color: #9A9A9A; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
    text-decoration: none; transition: color .2s;
  }
  .cue-page .topnav a:hover { color: #E8E8E8; }
  .cue-page .topnav .lang {
    border: 0.5px solid #FFFFFF14; border-radius: 6px; padding: 5px 10px; color: #E8E8E8;
  }
  .cue-page .topnav .lang:hover { border-color: #E6D36A40; color: #E6D36A; }

  .cue-page .hero { text-align: center; padding: 72px 0 56px; }
  .cue-page .hero img.appicon {
    width: 128px; height: 128px; border-radius: 28px; margin: 0 auto 28px; display: block;
  }
  .cue-page .hero h1 {
    font-size: 44px; font-weight: 600; color: #E8E8E8; margin: 0 0 8px; letter-spacing: -0.5px;
  }
  .cue-page .hero .platform {
    color: #9A9A9A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 22px;
  }
  .cue-page .hero .tagline {
    font-size: 17px; color: #E8E8E8; max-width: 620px; margin: 0 auto 34px; font-weight: 400;
  }

  .cue-page .cta { display: inline-flex; flex-direction: column; align-items: center; gap: 10px; }
  .cue-page a.download-btn {
    display: inline-block; background: #E6D36A; color: #080808; font-size: 15px; font-weight: 600;
    padding: 14px 34px; border-radius: 8px; text-decoration: none; letter-spacing: 0.3px;
    transition: opacity .2s, transform .2s, box-shadow .2s; cursor: pointer;
    animation: cueGlow 2.2s ease-in-out infinite; will-change: box-shadow;
  }
  .cue-page a.download-btn:hover {
    opacity: 1; transform: translateY(-1px);
    box-shadow: 0 0 34px 8px rgba(230,211,106,0.85), 0 0 12px 2px rgba(230,211,106,0.95);
  }
  @keyframes cueGlow {
    0%, 100% { box-shadow: 0 0 12px 0 rgba(230,211,106,0.45), 0 0 4px 0 rgba(230,211,106,0.6); }
    50% { box-shadow: 0 0 30px 6px rgba(230,211,106,0.8), 0 0 10px 2px rgba(230,211,106,0.9); }
  }
  .cue-page .dl-count { color: #9A9A9A; font-size: 11px; letter-spacing: 0.5px; opacity: 0.8; }

  .cue-page section { padding: 44px 0; border-top: 0.5px solid #2A2A2A; }
  .cue-page .section-label {
    color: #9A9A9A; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 20px;
  }
  .cue-page .about p { font-size: 14px; color: #E8E8E8; margin: 0 0 16px; max-width: 720px; }

  .cue-page .features { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .cue-page .feature {
    background: #121212; border: 0.5px solid #2A2A2A; border-radius: 8px; padding: 20px 22px;
  }
  .cue-page .feature h3 {
    font-size: 14px; font-weight: 600; color: #E6D36A; margin: 0 0 8px; letter-spacing: 0.2px;
  }
  .cue-page .feature p { font-size: 13px; color: #9A9A9A; margin: 0; }

  .cue-page .specs { display: flex; flex-wrap: wrap; gap: 10px; }
  .cue-page .spec {
    background: #E6D36A0F; border: 0.5px solid #E6D36A40; border-radius: 6px;
    padding: 7px 14px; font-size: 12px; color: #E8E8E8;
  }

  .cue-page footer {
    text-align: center; padding: 40px 0 60px; border-top: 0.5px solid #2A2A2A; margin-top: 8px;
  }
  .cue-page footer .fbrand { color: #9A9A9A; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; }
  .cue-page footer .fback { display: block; margin-top: 12px; }
  .cue-page footer .fback a { color: #E6D36A; font-size: 12px; text-decoration: none; }
  .cue-page footer .fback a:hover { text-decoration: underline; }

  @media (max-width: 640px) {
    .cue-page .hero h1 { font-size: 34px; }
    .cue-page .features { grid-template-columns: 1fr; }
    .cue-page .topnav { gap: 12px; }
  }
`;

const content = {
  ru: {
    metaTitle: "Cue Sheets — партитуры и документация из QLab | Kuzmichev Tools",
    metaDesc:
      "Cue Sheets — бесплатное macOS-приложение для театральных и event-техников: импорт cue-листов из QLab, автогенерация описаний на RU/EN, экспорт в PDF и Excel, запись данных обратно в QLab.",
    keywords:
      "Cue Sheets, QLab, cue sheet, партитура QLab, документация QLab, театральный звук, звукорежиссёр театра, экспорт QLab в PDF, экспорт QLab в Excel, cue лист, Kuzmichev Tools, Ян Кузьмичёв, macOS приложение для театра",
    nav_about: "О приложении",
    nav_features: "Возможности",
    back: "Ян Кузьмичёв",
    platform: "для macOS",
    tagline:
      "Бесплатный профессиональный инструмент для автоматического создания партитур и документации из QLab. Импортируйте данные, генерируйте описания, экспортируйте в PDF и Excel, записывайте данные обратно в QLab.",
    download: "Скачать приложение",
    aboutLabel: "О приложении",
    about: [
      "Cue Sheets — macOS-приложение для театральных и event-техников, которое автоматизирует создание технической документации из QLab.",
      "Приложение подключается к QLab по сети, импортирует все cue-листы с полной информацией о каждом cue: тип, номер, имя, действие, триггер, тайминги pre/post-wait. Данные отображаются в удобной таблице с цветовой маркировкой типов, фильтрацией и поиском.",
      "Встроенный генератор описаний анализирует техническое действие каждого cue и создаёт понятное человеку описание на русском или английском языке. Описания можно редактировать вручную и записать обратно в QLab.",
      "Готовые cue sheets экспортируются в PDF с профессиональным оформлением или в Excel с форматированием.",
    ],
    featuresLabel: "Ключевые возможности",
    features: [
      {
        h: "Импорт из QLab",
        p: "Автоматическое обнаружение воркспейсов, выбор cue-листов, прогресс с оценкой времени.",
      },
      {
        h: "Автогенерация описаний",
        p: "Анализ действий каждого cue и генерация текста на русском или английском языке.",
      },
      {
        h: "Запись в QLab",
        p: "Сгенерированные описания записываются обратно в Notes каждого cue.",
      },
      {
        h: "Экспорт PDF / Excel",
        p: "Профессионально оформленный документ с цветовой маркировкой типов.",
      },
    ],
    specs: ["macOS", "Работа с QLab по сети", "RU / EN", "Экспорт PDF + Excel", "Бесплатно"],
    countLabel: (n: number) => `Скачано ${n} раз`,
  },
  en: {
    metaTitle: "Cue Sheets — cue sheets & documentation from QLab | Kuzmichev Tools",
    metaDesc:
      "Cue Sheets — a free macOS app for theatre and event technicians: import cue lists from QLab, auto-generate descriptions in EN/RU, export to PDF and Excel, write data back to QLab.",
    keywords:
      "Cue Sheets, QLab, cue sheet, QLab documentation, QLab to PDF, QLab to Excel, theatre sound, theatre sound engineer, cue list, Kuzmichev Tools, Ian Kuzmichev, macOS app for theatre",
    nav_about: "About",
    nav_features: "Features",
    back: "Ian Kuzmichev",
    platform: "for macOS",
    tagline:
      "A free professional tool for automatically creating cue sheets and documentation from QLab. Import data, generate descriptions, export to PDF and Excel, and write data back to QLab.",
    download: "Download the app",
    aboutLabel: "About the app",
    about: [
      "Cue Sheets is a macOS app for theatre and event technicians that automates the creation of technical documentation from QLab.",
      "The app connects to QLab over the network and imports all cue lists with full information about each cue: type, number, name, action, trigger, pre/post-wait timings. The data is shown in a convenient table with color-coded types, filtering and search.",
      "A built-in description generator analyzes the technical action of each cue and creates a human-readable description in English or Russian. Descriptions can be edited manually and written back to QLab.",
      "Finished cue sheets are exported to a professionally formatted PDF or to a formatted Excel file.",
    ],
    featuresLabel: "Key features",
    features: [
      {
        h: "Import from QLab",
        p: "Automatic workspace discovery, cue list selection, progress with time estimates.",
      },
      {
        h: "Auto-generated descriptions",
        p: "Analyzes each cue's action and generates text in English or Russian.",
      },
      {
        h: "Write back to QLab",
        p: "Generated descriptions are written back into the Notes of each cue.",
      },
      {
        h: "Export PDF / Excel",
        p: "A professionally formatted document with color-coded cue types.",
      },
    ],
    specs: ["macOS", "Networked QLab access", "EN / RU", "PDF + Excel export", "Free"],
    countLabel: (n: number) => `Downloaded ${n} times`,
  },
};

export default function CueSheets() {
  const { lang, prefix } = useLanguage();
  const c = content[lang];
  const isEn = lang === "en";
  const canonical = `${SITE_URL}${prefix}/tools/cue-sheets`;
  const altUrl = `${SITE_URL}${isEn ? "" : "/en"}/tools/cue-sheets`;

  const [downloadCount, setDownloadCount] = useState<number | null>(null);
  const keyPressesRef = useRef<number[]>([]);

  // Скрытый жест: 5 нажатий "k" за <4 сек → показать число скачиваний.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "k") return;
      const now = Date.now();
      const presses = [...keyPressesRef.current, now].filter((t) => now - t < 4000);
      keyPressesRef.current = presses;
      if (presses.length >= 5) {
        keyPressesRef.current = [];
        fetch(`/api/downloads/${APP_KEY}`)
          .then((r) => r.json())
          .then((d) => setDownloadCount(typeof d.count === "number" ? d.count : 0))
          .catch(() => {});
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Cue Sheets",
    operatingSystem: "macOS",
    applicationCategory: "MultimediaApplication",
    description: c.metaDesc,
    url: canonical,
    downloadUrl: `${SITE_URL}/api/download/${APP_KEY}`,
    softwareVersion: "1.0",
    image: `${SITE_URL}${ICON_SHARE}`,
    inLanguage: ["ru", "en"],
    featureList: c.features.map((f) => f.h),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: {
      "@type": "Person",
      name: isEn ? "Ian Kuzmichev" : "Ян Кузьмичёв",
      url: SITE_URL,
    },
    publisher: { "@type": "Organization", name: "Kuzmichev Tools", url: SITE_URL },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: isEn ? "Home" : "Главная", item: `${SITE_URL}${prefix}/` },
      { "@type": "ListItem", position: 2, name: "Cue Sheets", item: canonical },
    ],
  };

  return (
    <>
      <Helmet>
        <html lang={lang} className="cue-page" />
        <title>{c.metaTitle}</title>
        <meta name="description" content={c.metaDesc} />
        <meta name="keywords" content={c.keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang={isEn ? "ru" : "en"} href={altUrl} />
        <link rel="alternate" hrefLang={isEn ? "en" : "ru"} href={canonical} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/tools/cue-sheets`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={c.metaTitle} />
        <meta property="og:description" content={c.metaDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${SITE_URL}${ICON_SHARE}`} />
        <meta property="og:locale" content={isEn ? "en_US" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={c.metaTitle} />
        <meta name="twitter:description" content={c.metaDesc} />
        <meta name="twitter:image" content={`${SITE_URL}${ICON_SHARE}`} />
        <script type="application/ld+json">{JSON.stringify(softwareJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>
      <style dangerouslySetInnerHTML={{ __html: CUE_CSS }} />

      <div className="cue-page">
        <div className="wrap">
          <div className="topbar">
            <div className="brand">
              <span className="k">K</span>
              <span className="pipe">|</span>
              <span className="name">Kuzmichev Tools</span>
            </div>
            <nav className="topnav">
              <a href="#about">{c.nav_about}</a>
              <a href="#features">{c.nav_features}</a>
              <Link href={isEn ? "/tools/cue-sheets" : "/en/tools/cue-sheets"} className="lang">
                {isEn ? "RU" : "EN"}
              </Link>
            </nav>
          </div>

          <div className="hero">
            <picture>
              <source srcSet={ICON_WEBP} type="image/webp" />
              <img className="appicon" src={ICON_PNG} alt="Cue Sheets" width={128} height={128} decoding="async" {...{ fetchpriority: "high" } as any} />
            </picture>
            <h1>Cue Sheets</h1>
            <p className="platform">{c.platform}</p>
            <p className="tagline">{c.tagline}</p>
            <div className="cta">
              <a className="download-btn" href={`/api/download/${APP_KEY}`} data-testid="link-download">
                {c.download}
              </a>
              {downloadCount !== null && (
                <span className="dl-count" data-testid="text-download-count">
                  {c.countLabel(downloadCount)}
                </span>
              )}
            </div>
          </div>

          <section id="about" className="about">
            <p className="section-label">{c.aboutLabel}</p>
            {c.about.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <div className="specs" style={{ marginTop: "8px" }}>
              {c.specs.map((s) => (
                <span className="spec" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section id="features">
            <p className="section-label">{c.featuresLabel}</p>
            <div className="features">
              {c.features.map((f) => (
                <div className="feature" key={f.h}>
                  <h3>{f.h}</h3>
                  <p>{f.p}</p>
                </div>
              ))}
            </div>
          </section>

          <footer>
            <div className="fbrand">K | Kuzmichev Tools</div>
            <div className="fback">
              <Link href={`${prefix}/`}>← {c.back}</Link>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
