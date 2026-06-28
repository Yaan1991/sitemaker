import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { useLanguage } from "@/i18n/useLanguage";
import { toolPageCss } from "@/lib/toolPageCss";

const SITE_URL = "https://iansound.pro";

const content = {
  ru: {
    metaTitle: "Kuzmichev Tools — бесплатные приложения для театрального звука",
    metaDesc:
      "Kuzmichev Tools — бесплатные нативные macOS-приложения для звукорежиссёров и театральных техников: Cue Sheets (документация из QLab) и KT Leveler (пакетная нормализация LUFS и конвертация аудио).",
    keywords:
      "Kuzmichev Tools, приложения для театрального звука, QLab, LUFS, Cue Sheets, KT Leveler, macOS приложения для звукорежиссёра, Ян Кузьмичёв",
    heroTitle: "Kuzmichev Tools",
    heroSub: "Бесплатные нативные приложения для macOS, которые упрощают работу со звуком в театре, кино и аудио.",
    back: "Ян Кузьмичёв",
    cta: "Подробнее →",
    tools: [
      {
        href: "/tools/cue-sheets",
        icon: { webp: "/cue-sheets-icon-256.webp", png: "/cue-sheets-icon-256.png" },
        name: "Cue Sheets",
        platform: "для macOS",
        desc: "Партитуры и техническая документация из QLab: импорт cue-листов, автогенерация описаний на RU/EN, экспорт в PDF и Excel, запись данных обратно в QLab.",
      },
      {
        href: "/tools/kt-leveler",
        icon: { webp: "/leveler-icon-256.webp", png: "/leveler-icon-256.png" },
        name: "KT Leveler",
        platform: "для macOS",
        desc: "Пакетное выравнивание громкости по LUFS и конвертация аудио. Профили для театра, плейбека, подкастов. Полностью локально, без облака.",
      },
    ],
  },
  en: {
    metaTitle: "Kuzmichev Tools — free apps for theatre sound",
    metaDesc:
      "Kuzmichev Tools — free native macOS apps for sound engineers and theatre technicians: Cue Sheets (documentation from QLab) and KT Leveler (batch LUFS normalization and audio conversion).",
    keywords:
      "Kuzmichev Tools, apps for theatre sound, QLab, LUFS, Cue Sheets, KT Leveler, macOS apps for sound engineers, Ian Kuzmichev",
    heroTitle: "Kuzmichev Tools",
    heroSub: "Free native macOS apps that make working with sound in theatre, film and audio easier.",
    back: "Ian Kuzmichev",
    cta: "Learn more →",
    tools: [
      {
        href: "/tools/cue-sheets",
        icon: { webp: "/cue-sheets-icon-256.webp", png: "/cue-sheets-icon-256.png" },
        name: "Cue Sheets",
        platform: "for macOS",
        desc: "Cue sheets and technical documentation from QLab: import cue lists, auto-generate descriptions in EN/RU, export to PDF and Excel, write data back to QLab.",
      },
      {
        href: "/tools/kt-leveler",
        icon: { webp: "/leveler-icon-256.webp", png: "/leveler-icon-256.png" },
        name: "KT Leveler",
        platform: "for macOS",
        desc: "Batch loudness leveling to LUFS and audio conversion. Presets for theatre, playback, podcasts. Fully local, no cloud.",
      },
    ],
  },
};

export default function Tools() {
  const { lang, prefix } = useLanguage();
  const c = content[lang];
  const isEn = lang === "en";
  const canonical = `${SITE_URL}${prefix}/tools`;
  const altUrl = `${SITE_URL}${isEn ? "" : "/en"}/tools`;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: c.metaTitle,
    description: c.metaDesc,
    url: canonical,
    inLanguage: isEn ? "en" : "ru",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: c.tools.map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: tool.name,
        url: `${SITE_URL}${prefix}${tool.href}`,
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: isEn ? "Home" : "Главная", item: `${SITE_URL}${prefix}/` },
      { "@type": "ListItem", position: 2, name: isEn ? "Tools" : "Инструменты", item: canonical },
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
        <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/tools`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={c.metaTitle} />
        <meta property="og:description" content={c.metaDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${SITE_URL}/leveler-icon-512.png`} />
        <meta property="og:locale" content={isEn ? "en_US" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={c.metaTitle} />
        <meta name="twitter:description" content={c.metaDesc} />
        <meta name="twitter:image" content={`${SITE_URL}/leveler-icon-512.png`} />
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
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
              <Link href={`${prefix}/`}>{c.back}</Link>
              <Link href={isEn ? "/tools" : "/en/tools"} className="lang">
                {isEn ? "RU" : "EN"}
              </Link>
            </nav>
          </div>

          <div className="tools-hero">
            <h1>{c.heroTitle}</h1>
            <p>{c.heroSub}</p>
          </div>

          <div className="tool-grid">
            {c.tools.map((tool) => (
              <Link
                key={tool.href}
                href={`${prefix}${tool.href}`}
                className="tool-card"
                data-testid={`link-tool-${tool.href.split("/").pop()}`}
              >
                <picture>
                  <source srcSet={tool.icon.webp} type="image/webp" />
                  <img className="cardicon" src={tool.icon.png} alt={tool.name} width={64} height={64} loading="lazy" decoding="async" />
                </picture>
                <h2>{tool.name}</h2>
                <p className="tool-platform">{tool.platform}</p>
                <p className="tool-desc">{tool.desc}</p>
                <span className="tool-cta">{c.cta}</span>
              </Link>
            ))}
          </div>

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
