// Общие стили для страниц Kuzmichev Tools (KTheme).
// Используются на странице со списком инструментов (/tools) и на страницах
// отдельных приложений (Cue Sheets, KT Leveler). Класс .cue-page сохранён,
// чтобы не дублировать стили на уже существующей странице Cue Sheets.
export const toolPageCss = `
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

  /* Список инструментов (/tools) — карточки приложений */
  .cue-page .tools-hero { text-align: center; padding: 64px 0 40px; }
  .cue-page .tools-hero h1 {
    font-size: 40px; font-weight: 600; color: #E8E8E8; margin: 0 0 12px; letter-spacing: -0.5px;
  }
  .cue-page .tools-hero p {
    font-size: 16px; color: #9A9A9A; max-width: 600px; margin: 0 auto;
  }
  .cue-page .tool-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: 8px 0 64px;
  }
  .cue-page a.tool-card {
    display: flex; flex-direction: column; gap: 14px; text-decoration: none;
    background: #121212; border: 0.5px solid #2A2A2A; border-radius: 12px; padding: 26px;
    transition: border-color .2s, transform .2s, box-shadow .2s;
  }
  .cue-page a.tool-card:hover {
    border-color: #E6D36A55; transform: translateY(-2px);
    box-shadow: 0 8px 30px -12px rgba(230,211,106,0.4);
  }
  .cue-page .tool-card img.cardicon {
    width: 64px; height: 64px; border-radius: 14px; display: block;
  }
  .cue-page .tool-card h2 {
    font-size: 20px; font-weight: 600; color: #E8E8E8; margin: 0; letter-spacing: -0.2px;
  }
  .cue-page .tool-card .tool-platform {
    color: #9A9A9A; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin: -8px 0 0;
  }
  .cue-page .tool-card p.tool-desc { font-size: 13.5px; color: #9A9A9A; margin: 0; flex: 1; }
  .cue-page .tool-card .tool-cta {
    color: #E6D36A; font-size: 13px; font-weight: 600; letter-spacing: 0.3px;
  }

  .cue-page footer {
    text-align: center; padding: 40px 0 60px; border-top: 0.5px solid #2A2A2A; margin-top: 8px;
  }
  .cue-page footer .fbrand { color: #9A9A9A; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; }
  .cue-page footer .fback { display: block; margin-top: 12px; }
  .cue-page footer .fback a { color: #E6D36A; font-size: 12px; text-decoration: none; }
  .cue-page footer .fback a:hover { text-decoration: underline; }

  @media (max-width: 640px) {
    .cue-page .wrap { padding: 0 18px; }
    .cue-page .topbar { padding: 16px 0; }
    .cue-page .brand .pipe, .cue-page .brand .name { display: none; }
    .cue-page .topnav { gap: 14px; }
    .cue-page .topnav a { font-size: 10px; letter-spacing: 1px; }
    .cue-page .topnav .lang { padding: 5px 9px; }
    .cue-page .hero { padding: 44px 0 40px; }
    .cue-page .hero img.appicon { width: 96px; height: 96px; margin-bottom: 20px; }
    .cue-page .hero h1 { font-size: 32px; letter-spacing: -0.3px; }
    .cue-page .hero .tagline { font-size: 15px; margin-bottom: 28px; }
    .cue-page a.download-btn { padding: 14px 30px; }
    .cue-page section { padding: 36px 0; }
    .cue-page .features { grid-template-columns: 1fr; }
    .cue-page .feature { padding: 18px; }
    .cue-page .about p { font-size: 13.5px; }
    .cue-page .tools-hero { padding: 44px 0 32px; }
    .cue-page .tools-hero h1 { font-size: 30px; }
    .cue-page .tool-grid { grid-template-columns: 1fr; gap: 14px; }
    .cue-page a.tool-card { padding: 22px; }
  }
  @media (max-width: 380px) {
    .cue-page .hero h1 { font-size: 28px; }
    .cue-page .topnav a { font-size: 9.5px; letter-spacing: 0.5px; }
    .cue-page .topnav { gap: 11px; }
  }
`;
