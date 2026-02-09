import type { Request, Response, NextFunction } from "express";

const BOT_USER_AGENTS = [
  'googlebot', 'bingbot', 'yandex', 'baiduspider', 'duckduckbot',
  'slurp', 'facebot', 'ia_archiver', 'semrushbot', 'ahrefsbot',
  'dotbot', 'rogerbot', 'linkedinbot', 'embedly', 'quora link preview',
  'showyoubot', 'outbrain', 'pinterest', 'applebot', 'twitterbot',
  'vkshare', 'w3c_validator', 'whatsapp', 'telegram', 'viber',
  'developers.google.com', 'google-inspectiontool', 'petalbot',
  'chrome-lighthouse', 'pagespeed'
];

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

const SITE_URL = "https://iansound.pro";
const SITE_NAME = "Ян Кузьмичёв — композитор, саунд-дизайнер, звукорежиссёр";

interface PageSEO {
  title: string;
  description: string;
  url: string;
  jsonLd?: object;
  content: string;
}

const projectsData: Array<{
  id: string;
  title: string;
  year: string;
  description: string;
  fullDescription: string;
  category: string;
  role: string[];
  venue?: string;
}> = [
  {
    id: "idiot-saratov-drama",
    title: "Идиот",
    year: "2024",
    description: "Уникальное сочетание театра и кино: нуар-джаз + полевые записи + ИИ-технологии.",
    fullDescription: "Радикально переосмысленная постановка по Достоевскому, где действие перенесено в Саратов 1999 года. Спектакль объединяет живое театральное действие с киносъёмкой. Создана многослойная звуковая партитура: 10 оригинальных композиций в жанрах нуар-джаз и пост-рок, аутентичные полевые записи Саратова, использование ИИ для клонирования голоса актёра.",
    category: "theatre",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
    venue: "Саратовский театр драмы имени Слонова"
  },
  {
    id: "mayakovsky-moscow-estrada",
    title: "Маяковский. Я сам",
    year: "2024",
    description: "6 композиций, трёхуровневая звуковая концепция.",
    fullDescription: "Спектакль-исследование внутреннего механизма саморазрушения поэта через трагический треугольник Маяковский - Лили и Осип Брик. Создана трёхслойная звуковая драматургия: реальность, поэтический слой и абстракция. Написано 6 оригинальных композиций.",
    category: "theatre",
    role: ["Композитор", "Саунд-дизайнер"],
    venue: "Московский театр Эстрады"
  },
  {
    id: "petrovy-saratov-drama",
    title: "Петровы в гриппе и вокруг него",
    year: "2025",
    description: "Театр как комикс, где пространство одновременно рассказывает историю Петровых и размышляет о театре как о пространстве бреда.",
    fullDescription: "Постановка по роману Алексея Сальникова — одному из самых «несценичных» текстов современной литературы. Спектакль решён как комикс и театр о самом себе. Создано 12 оригинальных композиций разных жанров — от неоклассических фортепианных пьес до гротескных эффектов.",
    category: "theatre",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр", "Промт-инженер"],
    venue: "Саратовский театр драмы"
  },
  {
    id: "homo-homini-short",
    title: "Homo Homini",
    year: "2025",
    description: "Короткометражная драма с элементами чёрной комедии. 13 оригинальных композиций + полный пост-продакшн в 5.1.",
    fullDescription: "История робкого Саввы, увлечённого японской культурой. После смерти собаки и предательства девушки, герой превращается в персонажа азиатского боевика. Фильм о человеке, превращающем свою жизнь в кинематографическую цитату. Саунд-дизайн балансирует между реализмом и стилизацией под азиатские боевики.",
    category: "film",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр пост-продакшена", "Сонграйтер", "Промт-инженер"]
  },
  {
    id: "ma-short-film",
    title: "Ма",
    year: "2024",
    description: "Короткометражная драма о матери и дочери, переживающих утрату. Кино почти без диалогов, где пейзаж и быт говорят вместо слов.",
    fullDescription: "Короткометражная драма о матери и дочери, переживающих утрату. Действие происходит в Северной Осетии, в селе Даргавс. Проведена реставрация звукового материала, переозвучена часть сцен. Создан живой, достоверный звуковой слой. В отсутствие музыки именно звук ведёт зрителя.",
    category: "film",
    role: ["Звукорежиссёр пост-продакшна"]
  },
  {
    id: "life-in-art-short",
    title: "Жизнь в искусстве",
    year: "2019",
    description: "Полная переозвучка шумов и амбиентов.",
    fullDescription: "Игровой короткометражный фильм о жизни художника. Выполнена полная переозвучка всех шумов и создание атмосферных амбиентов. Звуковое решение подчёркивает контраст между внутренним миром творца и окружающей реальностью.",
    category: "film",
    role: ["Саунд-дизайнер"]
  },
  {
    id: "son-o-hlebe-zotov",
    title: "Сон о Хлебе",
    year: "2024",
    description: "Оригинальная музыка, пространственный звук.",
    fullDescription: "Аудиоспектакль Центра «Зотов» — история в жанре haunted house о Хлебозаводе №5. Главный герой — сотрудник охраны, который день и ночь проводит рядом с музейными экспонатами. С участием Константина Хабенского. Премьера состоялась 18 мая 2024 в рамках акции «Ночь в музее».",
    category: "audio",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
    venue: "Центр «Зотов»"
  },
  {
    id: "pogruzhenie-promenad-telegram",
    title: "Погружение. Променад",
    year: "2021",
    description: "Сайт-специфик аудиоспектакль",
    fullDescription: "Спектакль-променад проходит на улицах Нижнего Новгорода. Проект создан в формате иммерсивной аудиопрогулки, где звук становится проводником в мир личных историй жителей города. Каждая локация оживает через голоса героев, музыку и звуковой ландшафт Нижнего Новгорода.",
    category: "audio",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
    venue: "Центр театрального мастерства (Нижний Новгород)"
  }
];

function getPageSEO(path: string): PageSEO | null {
  if (path === "/" || path === "") {
    return {
      title: SITE_NAME,
      description: "Ян Кузьмичёв — композитор, саунд-дизайнер и звукорежиссёр с 14-летним опытом. Более 100 проектов в театре, кино и аудио. Музыка и звук для пространства.",
      url: SITE_URL,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Ян Кузьмичёв",
        "jobTitle": ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
        "url": SITE_URL,
        "sameAs": ["https://t.me/iankzmcv", "https://band.link/zDZyK"],
        "knowsAbout": ["Композиция", "Саунд-дизайн", "Звукорежиссура", "Театр", "Кино", "Аудиоспектакли"],
        "description": "Мультидисциплинарный специалист в области звука и музыки, работающий на стыке театра, кино и новых технологий. Более 100 реализованных проектов."
      },
      content: `
        <h1>Ян Кузьмичёв — композитор, саунд-дизайнер, звукорежиссёр</h1>
        <p>14+ лет опыта, 100+ проектов в театре, кино и аудио. Музыка и звук для пространства.</p>
        <h2>Театр</h2>
        <p>Спектакли с погружением в атмосферу. Работа с ведущими театрами России: МХТ им. Чехова, Театр Наций, Современник, Театр Пушкина, Центр им. Вс. Мейерхольда.</p>
        <h2>Кино</h2>
        <p>Полный цикл пост-продакшна. Композиция, саунд-дизайн, звукорежиссура пост-продакшена.</p>
        <h2>Аудиоспектакли</h2>
        <p>Пространственный звук и иммерсия. Иммерсивные аудиопрогулки и спектакли в наушниках.</p>
        <h2>Избранные проекты</h2>
        <ul>
          ${projectsData.map(p => `<li><a href="${SITE_URL}/project/${p.id}">${p.title} (${p.year}) — ${p.role.join(", ")}</a></li>`).join("\n")}
        </ul>
      `
    };
  }

  if (path === "/about") {
    return {
      title: "Обо мне — Ян Кузьмичёв",
      description: "Ян Кузьмичёв — композитор, саунд-дизайнер и звукорежиссёр, который создаёт звук, становящийся частью истории. Более 100 проектов. МХТ, Театр Наций, Современник, Van Cleef & Arpels, Porsche.",
      url: `${SITE_URL}/about`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "Обо мне — Ян Кузьмичёв",
        "mainEntity": {
          "@type": "Person",
          "name": "Ян Кузьмичёв",
          "alumniOf": { "@type": "CollegeOrUniversity", "name": "ГИТИС" },
          "jobTitle": ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
          "knowsAbout": ["OSC/MIDI", "AI-композиция", "Иммерсивный звук", "Театральная автоматизация"],
          "award": ["Красный диплом ГИТИС (2015)"]
        }
      },
      content: `
        <h1>О себе — Ян Кузьмичёв</h1>
        <p>Композитор | Саунд-дизайнер | Звукорежиссёр</p>
        <p>Ян Кузьмичёв — композитор, саунд-дизайнер и звукорежиссёр, который создаёт звук, становящийся частью истории.</p>
        <p>Выпускник ГИТИСа с красным дипломом (2015). За 13 лет профессиональной карьеры — более 100 реализованных проектов, от камерных спектаклей до масштабных мультимедийных шоу.</p>
        <p>Мои клиенты — ведущие театры России и зарубежья: МХТ им. Чехова, Центр им. Вс. Мейерхольда, Театр Наций, Современник, Театр Пушкина, РАМТ, Национальный театр Будапешта, а также драматические театры Саратова, Нижнего Новгорода, Красноярска, Омска, Твери, Казани, Махачкалы, Алматы и других городов.</p>
        <p>Корпоративные проекты для Van Cleef & Arpels, Porsche, Panasonic, выставочные пространства ВДНХ и Центра Зотов.</p>
        <p>Я создаю оригинальную музыку и иммерсивные звуковые ландшафты, которые усиливают драматургию и погружают зрителя в атмосферу спектакля. Работаю на стыке традиций и инноваций: от живых оркестров до AI-композиции, от аналоговых синтезаторов до полной автоматизации звука через OSC/MIDI протоколы.</p>
        <p>Первопроходец театральной автоматизации в России — разрабатываю и внедряю системы полностью автоматизированного управления звуком для спектаклей, синхронизированные с светом, видео и сценическими механизмами.</p>
        <p>Если вашему проекту нужен звук, который работает как полноценный драматургический инструмент — давайте обсудим сотрудничество.</p>
      `
    };
  }

  if (path === "/projects" || path.startsWith("/projects/")) {
    const category = path.split("/projects/")[1];
    const categoryNames: Record<string, string> = {
      theatre: "Театр",
      film: "Кино",
      audio: "Аудиоспектакли"
    };
    const catName = category ? categoryNames[category] || "Все проекты" : "Все проекты";
    const catDesc = category
      ? `Проекты Яна Кузьмичёва в категории «${catName}». Композиция, саунд-дизайн и звукорежиссура.`
      : "Все проекты Яна Кузьмичёва: театр, кино, аудиоспектакли. Более 100 работ в качестве композитора, саунд-дизайнера и звукорежиссёра.";

    const filteredProjects = category
      ? projectsData.filter(p => p.category === category)
      : projectsData;

    return {
      title: `${catName} — Проекты | Ян Кузьмичёв`,
      description: catDesc,
      url: `${SITE_URL}${path}`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${catName} — проекты Яна Кузьмичёва`,
        "description": catDesc,
        "url": `${SITE_URL}${path}`
      },
      content: `
        <h1>${catName} — проекты Яна Кузьмичёва</h1>
        <p>${catDesc}</p>
        <ul>
          ${filteredProjects.map(p => `<li><a href="${SITE_URL}/project/${p.id}">${p.title} (${p.year}) — ${p.role.join(", ")}${p.venue ? ` | ${p.venue}` : ""}</a><br/>${p.description}</li>`).join("\n")}
        </ul>
      `
    };
  }

  if (path === "/contact") {
    return {
      title: "Контакты — Ян Кузьмичёв",
      description: "Связаться с композитором и саунд-дизайнером Яном Кузьмичёвым. Email, Telegram, социальные сети.",
      url: `${SITE_URL}/contact`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Контакты Яна Кузьмичёва",
        "url": `${SITE_URL}/contact`
      },
      content: `
        <h1>Контакты — Ян Кузьмичёв</h1>
        <p>Связаться с композитором и саунд-дизайнером Яном Кузьмичёвым для сотрудничества.</p>
        <p>Email: kuzmichevyan@gmail.com</p>
        <p>Telegram: @iankzmcv</p>
      `
    };
  }

  const projectMatch = path.match(/^\/project\/(.+)$/);
  if (projectMatch) {
    const projectId = projectMatch[1];
    const project = projectsData.find(p => p.id === projectId);
    if (project) {
      const categoryNames: Record<string, string> = {
        theatre: "Театр",
        film: "Кино",
        audio: "Аудиоспектакли"
      };
      return {
        title: `${project.title} — ${project.year} | Ян Кузьмичёв`,
        description: project.fullDescription.substring(0, 200) + "...",
        url: `${SITE_URL}/project/${project.id}`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "name": project.title,
          "description": project.fullDescription,
          "dateCreated": project.year,
          "genre": categoryNames[project.category] || project.category,
          "creator": {
            "@type": "Person",
            "name": "Ян Кузьмичёв",
            "jobTitle": project.role
          },
          ...(project.venue ? { "locationCreated": { "@type": "Place", "name": project.venue } } : {})
        },
        content: `
          <h1>${project.title} (${project.year})</h1>
          <p><strong>Категория:</strong> ${categoryNames[project.category] || project.category}</p>
          <p><strong>Роль:</strong> ${project.role.join(", ")}</p>
          ${project.venue ? `<p><strong>Площадка:</strong> ${project.venue}</p>` : ""}
          <p>${project.fullDescription}</p>
          <p><a href="${SITE_URL}">Ян Кузьмичёв — композитор, саунд-дизайнер, звукорежиссёр</a></p>
        `
      };
    }
  }

  return null;
}

function generateHTML(seo: PageSEO): string {
  const jsonLdScript = seo.jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(seo.jsonLd)}</script>`
    : "";

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seo.title}</title>
  <meta name="description" content="${seo.description}">
  <link rel="canonical" href="${seo.url}">
  
  <meta property="og:type" content="website">
  <meta property="og:title" content="${seo.title}">
  <meta property="og:description" content="${seo.description}">
  <meta property="og:url" content="${seo.url}">
  <meta property="og:site_name" content="Ян Кузьмичёв">
  <meta property="og:locale" content="ru_RU">
  
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${seo.title}">
  <meta name="twitter:description" content="${seo.description}">
  
  <meta name="robots" content="index, follow">
  <meta name="author" content="Ян Кузьмичёв">
  <meta name="theme-color" content="#00ffff">
  
  ${jsonLdScript}

  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #e5e7eb; }
    h1, h2 { color: #fff; }
    a { color: #06b6d4; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <nav>
    <a href="${SITE_URL}">Главная</a> |
    <a href="${SITE_URL}/about">Обо мне</a> |
    <a href="${SITE_URL}/projects">Проекты</a> |
    <a href="${SITE_URL}/projects/theatre">Театр</a> |
    <a href="${SITE_URL}/projects/film">Кино</a> |
    <a href="${SITE_URL}/projects/audio">Аудиоспектакли</a> |
    <a href="${SITE_URL}/contact">Контакты</a>
  </nav>
  ${seo.content}
  <footer>
    <p>&copy; ${new Date().getFullYear()} Ян Кузьмичёв. Композитор, саунд-дизайнер, звукорежиссёр.</p>
    <p><a href="${SITE_URL}/sitemap.xml">Карта сайта</a></p>
  </footer>
</body>
</html>`;
}

export function seoMiddleware(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers["user-agent"] || "";

  if (!isBot(userAgent)) {
    return next();
  }

  const path = req.path;

  if (path.startsWith("/api/") || path.startsWith("/audio/") || path.includes(".")) {
    return next();
  }

  const seo = getPageSEO(path);

  if (!seo) {
    return next();
  }

  const html = generateHTML(seo);
  res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).send(html);
}
