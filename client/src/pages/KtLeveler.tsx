import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/i18n/useLanguage";
import { toolPageCss } from "@/lib/toolPageCss";

const APP_KEY = "kt-leveler";
const SITE_URL = "https://iansound.pro";
const ICON_WEBP = "/leveler-icon-256.webp";
const ICON_PNG = "/leveler-icon-256.png";
const ICON_SHARE = "/leveler-icon-512.png";

const content = {
  ru: {
    metaTitle: "KT Leveler — пакетная нормализация LUFS и конвертация аудио | Kuzmichev Tools",
    metaDesc:
      "KT Leveler — бесплатная нативная macOS-утилита для пакетного выравнивания громкости аудио по LUFS и конвертации форматов. Театральный звук, плейбек QLab, подкасты. Полностью локально, без облака.",
    keywords:
      "KT Leveler, LUFS, нормализация громкости, пакетная нормализация, выравнивание громкости, конвертация аудио, театральный звук, плейбек QLab, True Peak, аудио для подкастов, Kuzmichev Tools, Ян Кузьмичёв, macOS приложение для звука",
    nav_about: "О приложении",
    nav_features: "Возможности",
    back: "Ян Кузьмичёв",
    platform: "для macOS",
    tagline:
      "Подготовьте всю аудиопапку к спектаклю за несколько минут. Перетащите файлы или целую папку, выберите профиль громкости и нажмите Process — всё остальное приложение сделает локально на вашем Mac.",
    download: "Скачать приложение",
    aboutLabel: "О приложении",
    about: [
      "KT Leveler — бесплатная нативная утилита для macOS от Kuzmichev Tools. Она пакетно анализирует и выравнивает громкость аудиофайлов по стандарту LUFS, конвертирует форматы и сохраняет структуру ваших папок.",
      "Без Terminal. Без Homebrew. Без аккаунта. Без облака.",
      "Приложение создано прежде всего для театрального звука и подготовки плейбека в QLab, но подойдёт также для саунд-дизайна, музыкального продакшна, пост-продакшна, подкастов и больших аудиобиблиотек. Оно помогает привести к единому уровню десятки или сотни файлов, не ломая динамику.",
      "KT Leveler использует двухпроходный анализ loudness: сначала измеряет материал, затем точно применяет нужную коррекцию. По умолчанию соблюдается потолок −1 dBTP True Peak, агрессивный лимитер не используется.",
    ],
    featuresLabel: "Ключевые возможности",
    features: [
      {
        h: "Нормализация по LUFS",
        p: "Готовые профили: Theatre −32, Active −29, Music −26, Voice −23, Podcast −16, Streaming −14, либо Custom от −40 до −8 LUFS.",
      },
      {
        h: "Конвертация форматов",
        p: "Вход: WAV, AIFF, AIF, MP3, M4A, CAF. Выход: WAV / AIFF / CAF (16/24-bit), MP3, частота 44.1 или 48 кГц.",
      },
      {
        h: "Для больших папок",
        p: "Рекурсивный импорт папок, сохранение структуры вложений. Исходники никогда не перезаписываются.",
      },
      {
        h: "CSV-отчёт",
        p: "Исходный и финальный LUFS, применённое усиление, True Peak и статус по каждому файлу. Понятные ошибки.",
      },
    ],
    specs: ["macOS 14 Sonoma+", "Apple Silicon", "RU / EN", "Встроенный FFmpeg", "Локально и приватно", "Бесплатно"],
    countLabel: (n: number) => `Скачано ${n} раз`,
  },
  en: {
    metaTitle: "KT Leveler — batch LUFS normalization & audio conversion | Kuzmichev Tools",
    metaDesc:
      "KT Leveler — a free native macOS utility for batch loudness leveling to LUFS and format conversion. Theatre sound, QLab playback, podcasts. Fully local, no cloud.",
    keywords:
      "KT Leveler, LUFS, loudness normalization, batch normalization, loudness leveling, audio conversion, theatre sound, QLab playback, True Peak, podcast audio, Kuzmichev Tools, Ian Kuzmichev, macOS audio app",
    nav_about: "About",
    nav_features: "Features",
    back: "Ian Kuzmichev",
    platform: "for macOS",
    tagline:
      "Prepare an entire audio folder for a show in minutes. Drag in files or a whole folder, pick a loudness profile and hit Process — the app does everything else locally on your Mac.",
    download: "Download the app",
    aboutLabel: "About the app",
    about: [
      "KT Leveler is a free native macOS utility by Kuzmichev Tools. It batch-analyzes and levels the loudness of audio files to the LUFS standard, converts formats, and preserves your folder structure.",
      "No Terminal. No Homebrew. No account. No cloud.",
      "The app is built primarily for theatre sound and QLab playback preparation, but also works for sound design, music production, post-production, podcasts and large audio libraries. It brings dozens or hundreds of files to a consistent level without breaking their dynamics.",
      "KT Leveler uses two-pass loudness analysis: it first measures the material, then applies the precise correction. By default it respects a −1 dBTP True Peak ceiling, and no aggressive limiter is used.",
    ],
    featuresLabel: "Key features",
    features: [
      {
        h: "LUFS normalization",
        p: "Presets: Theatre −32, Active −29, Music −26, Voice −23, Podcast −16, Streaming −14, or Custom from −40 to −8 LUFS.",
      },
      {
        h: "Format conversion",
        p: "Input: WAV, AIFF, AIF, MP3, M4A, CAF. Output: WAV / AIFF / CAF (16/24-bit), MP3, at 44.1 or 48 kHz.",
      },
      {
        h: "Built for big folders",
        p: "Recursive folder import, preserves nested structure. Source files are never overwritten.",
      },
      {
        h: "CSV report",
        p: "Original and final LUFS, applied gain, True Peak and status per file. Human-readable errors.",
      },
    ],
    specs: ["macOS 14 Sonoma+", "Apple Silicon", "EN / RU", "Bundled FFmpeg", "Local & private", "Free"],
    countLabel: (n: number) => `Downloaded ${n} times`,
  },
};

export default function KtLeveler() {
  const { lang, prefix } = useLanguage();
  const c = content[lang];
  const isEn = lang === "en";
  const canonical = `${SITE_URL}${prefix}/tools/kt-leveler`;
  const altUrl = `${SITE_URL}${isEn ? "" : "/en"}/tools/kt-leveler`;

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
    name: "KT Leveler",
    operatingSystem: "macOS 14",
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
      { "@type": "ListItem", position: 2, name: isEn ? "Tools" : "Инструменты", item: `${SITE_URL}${prefix}/tools` },
      { "@type": "ListItem", position: 3, name: "KT Leveler", item: canonical },
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
        <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/tools/kt-leveler`} />
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
              <Link href={isEn ? "/tools/kt-leveler" : "/en/tools/kt-leveler"} className="lang">
                {isEn ? "RU" : "EN"}
              </Link>
            </nav>
          </div>

          <div className="hero">
            <picture>
              <source srcSet={ICON_WEBP} type="image/webp" />
              <img className="appicon" src={ICON_PNG} alt="KT Leveler" width={128} height={128} decoding="async" {...{ fetchpriority: "high" } as any} />
            </picture>
            <h1>KT Leveler</h1>
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
