import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/i18n/useLanguage";
import { toolPageCss } from "@/lib/toolPageCss";

const APP_KEY = "cue-sheets";
const SITE_URL = "https://iansound.pro";
const ICON_WEBP = "/cue-sheets-icon-256.webp";
const ICON_PNG = "/cue-sheets-icon-256.png";
const ICON_SHARE = "/cue-sheets-icon-512.png";


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
      <style dangerouslySetInnerHTML={{ __html: toolPageCss }} />

      <div className="cue-page">
        <div className="wrap">
          <div className="topbar">
            <div className="brand">
              <span className="k">K</span>
              <span className="pipe">|</span>
              <span className="name">Kuzmichev Tools</span>
            </div>
            <nav className="topnav">
              <Link href={`${prefix}/tools`}>{isEn ? "All tools" : "Все инструменты"}</Link>
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
