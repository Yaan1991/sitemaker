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

interface PageSEO {
  title: string;
  description: string;
  url: string;
  lang: 'ru' | 'en';
  alternateUrl: string;
  jsonLd?: object;
  content: string;
}

const projectsData: Array<{
  id: string;
  title: string;
  titleEn: string;
  year: string;
  description: string;
  descriptionEn: string;
  fullDescription: string;
  fullDescriptionEn: string;
  category: string;
  role: string[];
  roleEn: string[];
  venue?: string;
  venueEn?: string;
}> = [
  {
    id: "idiot-saratov-drama",
    title: "Идиот",
    titleEn: "The Idiot",
    year: "2024",
    description: "Уникальное сочетание театра и кино: нуар-джаз + полевые записи + ИИ-технологии.",
    descriptionEn: "A unique blend of theatre and cinema: noir-jazz + field recordings + AI technologies.",
    fullDescription: "Радикально переосмысленная постановка по Достоевскому, где действие перенесено в Саратов 1999 года. Спектакль объединяет живое театральное действие с киносъёмкой. Создана многослойная звуковая партитура: 10 оригинальных композиций в жанрах нуар-джаз и пост-рок, аутентичные полевые записи Саратова, использование ИИ для клонирования голоса актёра.",
    fullDescriptionEn: "A radically reimagined production of Dostoevsky's novel, set in Saratov, 1999. The performance combines live theatre with cinematography. A multilayered sound score was created: 10 original compositions in noir-jazz and post-rock genres, authentic field recordings of Saratov, and AI voice cloning.",
    category: "theatre",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
    roleEn: ["Composer", "Sound Designer", "Sound Engineer"],
    venue: "Саратовский театр драмы имени Слонова",
    venueEn: "Saratov Drama Theatre"
  },
  {
    id: "mayakovsky-moscow-estrada",
    title: "Маяковский. Я сам",
    titleEn: "Mayakovsky. Myself",
    year: "2024",
    description: "6 композиций, трёхуровневая звуковая концепция.",
    descriptionEn: "6 compositions, three-level sound concept.",
    fullDescription: "Спектакль-исследование внутреннего механизма саморазрушения поэта через трагический треугольник Маяковский - Лили и Осип Брик. Создана трёхслойная звуковая драматургия: реальность, поэтический слой и абстракция. Написано 6 оригинальных композиций.",
    fullDescriptionEn: "A performance exploring the poet's inner self-destruction mechanism through the tragic triangle of Mayakovsky, Lilya, and Osip Brik. A three-layer sound dramaturgy was created: reality, poetic layer, and abstraction. 6 original compositions were written.",
    category: "theatre",
    role: ["Композитор", "Саунд-дизайнер"],
    roleEn: ["Composer", "Sound Designer"],
    venue: "Московский театр Эстрады",
    venueEn: "Moscow Estrada Theatre"
  },
  {
    id: "petrovy-saratov-drama",
    title: "Петровы в гриппе и вокруг него",
    titleEn: "The Petrovs In and Around the Flu",
    year: "2025",
    description: "Театр как комикс, где пространство одновременно рассказывает историю Петровых и размышляет о театре как о пространстве бреда.",
    descriptionEn: "Theatre as a comic book, where space simultaneously tells the story of the Petrovs and reflects on theatre as a space of delirium.",
    fullDescription: "Постановка по роману Алексея Сальникова — одному из самых «несценичных» текстов современной литературы. Спектакль решён как комикс и театр о самом себе. Создано 12 оригинальных композиций разных жанров — от неоклассических фортепианных пьес до гротескных эффектов.",
    fullDescriptionEn: "Based on Alexei Salnikov's novel — one of the most 'unstageable' texts of contemporary literature. The production is conceived as a comic book and a theatre about itself. 12 original compositions of various genres were created — from neoclassical piano pieces to grotesque effects.",
    category: "theatre",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр", "Промт-инженер"],
    roleEn: ["Composer", "Sound Designer", "Sound Engineer", "Prompt Engineer"],
    venue: "Саратовский театр драмы",
    venueEn: "Saratov Drama Theatre"
  },
  {
    id: "homo-homini-short",
    title: "Homo Homini",
    titleEn: "Homo Homini",
    year: "2025",
    description: "Короткометражная драма с элементами чёрной комедии. 13 оригинальных композиций + полный пост-продакшн в 5.1.",
    descriptionEn: "Short drama with black comedy elements. 13 original compositions + full 5.1 post-production.",
    fullDescription: "История робкого Саввы, увлечённого японской культурой. После смерти собаки и предательства девушки, герой превращается в персонажа азиатского боевика. Фильм о человеке, превращающем свою жизнь в кинематографическую цитату. Саунд-дизайн балансирует между реализмом и стилизацией под азиатские боевики.",
    fullDescriptionEn: "The story of timid Savva, fascinated by Japanese culture. After the death of his dog and betrayal by his girlfriend, the hero transforms into an Asian action movie character. A film about a man turning his life into a cinematic quotation. The sound design balances between realism and Asian action movie stylization.",
    category: "film",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр пост-продакшена", "Сонграйтер", "Промт-инженер"],
    roleEn: ["Composer", "Sound Designer", "Post-Production Sound Engineer", "Songwriter", "Prompt Engineer"]
  },
  {
    id: "ma-short-film",
    title: "Ма",
    titleEn: "Ma",
    year: "2024",
    description: "Короткометражная драма о матери и дочери, переживающих утрату. Кино почти без диалогов, где пейзаж и быт говорят вместо слов.",
    descriptionEn: "A short drama about a mother and daughter coping with loss. A film almost without dialogue, where landscape and everyday life speak instead of words.",
    fullDescription: "Короткометражная драма о матери и дочери, переживающих утрату. Действие происходит в Северной Осетии, в селе Даргавс. Проведена реставрация звукового материала, переозвучена часть сцен. Создан живой, достоверный звуковой слой. В отсутствие музыки именно звук ведёт зрителя.",
    fullDescriptionEn: "A short drama about a mother and daughter coping with loss. Set in North Ossetia, in the village of Dargavs. Sound material restoration was performed, some scenes were re-dubbed. An authentic, believable sound layer was created. In the absence of music, sound itself guides the viewer.",
    category: "film",
    role: ["Звукорежиссёр пост-продакшна"],
    roleEn: ["Post-Production Sound Engineer"]
  },
  {
    id: "life-in-art-short",
    title: "Жизнь в искусстве",
    titleEn: "Life in Art",
    year: "2019",
    description: "Полная переозвучка шумов и амбиентов.",
    descriptionEn: "Complete re-dubbing of sounds and ambiences.",
    fullDescription: "Игровой короткометражный фильм о жизни художника. Выполнена полная переозвучка всех шумов и создание атмосферных амбиентов. Звуковое решение подчёркивает контраст между внутренним миром творца и окружающей реальностью.",
    fullDescriptionEn: "A narrative short film about the life of an artist. Complete re-dubbing of all sounds and creation of atmospheric ambiences. The sound design emphasizes the contrast between the creator's inner world and surrounding reality.",
    category: "film",
    role: ["Саунд-дизайнер"],
    roleEn: ["Sound Designer"]
  },
  {
    id: "son-o-hlebe-zotov",
    title: "Сон о Хлебе",
    titleEn: "Dream of Bread",
    year: "2024",
    description: "Оригинальная музыка, пространственный звук.",
    descriptionEn: "Original music, spatial sound.",
    fullDescription: "Аудиоспектакль Центра «Зотов» — история в жанре haunted house о Хлебозаводе №5. Главный герой — сотрудник охраны, который день и ночь проводит рядом с музейными экспонатами. С участием Константина Хабенского. Премьера состоялась 18 мая 2024 в рамках акции «Ночь в музее».",
    fullDescriptionEn: "An audio performance by Zotov Centre — a haunted house story about Bread Factory No. 5. The protagonist is a security guard who spends day and night near museum exhibits. Featuring Konstantin Khabensky. Premiered on May 18, 2024 during the 'Night at the Museum' event.",
    category: "audio",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
    roleEn: ["Composer", "Sound Designer", "Sound Engineer"],
    venue: "Центр «Зотов»",
    venueEn: "Zotov Centre"
  },
  {
    id: "pogruzhenie-promenad-telegram",
    title: "Погружение. Променад",
    titleEn: "Immersion. Promenade",
    year: "2021",
    description: "Сайт-специфик аудиоспектакль",
    descriptionEn: "Site-specific audio performance",
    fullDescription: "Спектакль-променад проходит на улицах Нижнего Новгорода. Проект создан в формате иммерсивной аудиопрогулки, где звук становится проводником в мир личных историй жителей города. Каждая локация оживает через голоса героев, музыку и звуковой ландшафт Нижнего Новгорода.",
    fullDescriptionEn: "A promenade performance takes place on the streets of Nizhny Novgorod. The project is created as an immersive audio walk, where sound becomes a guide into the world of personal stories of city residents. Each location comes alive through the voices of heroes, music, and the soundscape of Nizhny Novgorod.",
    category: "audio",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
    roleEn: ["Composer", "Sound Designer", "Sound Engineer"],
    venue: "Центр театрального мастерства (Нижний Новгород)",
    venueEn: "Centre for Theatre Mastery (Nizhny Novgorod)"
  }
];

function getPageSEO(path: string): PageSEO | null {
  const isEn = path.startsWith('/en');
  const cleanPath = isEn ? path.replace(/^\/en/, '') || '/' : path;
  const lang = isEn ? 'en' : 'ru';
  const prefix = isEn ? '/en' : '';
  const altPrefix = isEn ? '' : '/en';

  const categoryNamesRu: Record<string, string> = { theatre: "Театр", film: "Кино", audio: "Аудиоспектакли" };
  const categoryNamesEn: Record<string, string> = { theatre: "Theatre", film: "Film", audio: "Audio Performances" };
  const catNames = isEn ? categoryNamesEn : categoryNamesRu;

  if (cleanPath === "/" || cleanPath === "") {
    const title = isEn
      ? "Ian Kuzmichev — Composer, Sound Designer, Sound Engineer"
      : "Ян Кузьмичёв — композитор, саунд-дизайнер, звукорежиссёр";
    const desc = isEn
      ? "Ian Kuzmichev — composer, sound designer and sound engineer with 14+ years of experience. Over 100 projects in theatre, film, and audio."
      : "Ян Кузьмичёв — композитор, саунд-дизайнер и звукорежиссёр с 14-летним опытом. Более 100 проектов в театре, кино и аудио. Музыка и звук для пространства.";
    const name = isEn ? "Ian Kuzmichev" : "Ян Кузьмичёв";
    const jobs = isEn ? ["Composer", "Sound Designer", "Sound Engineer"] : ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"];
    return {
      title, description: desc, lang,
      url: `${SITE_URL}${prefix}/`,
      alternateUrl: `${SITE_URL}${altPrefix}/`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": name,
        "jobTitle": jobs,
        "url": SITE_URL,
        "sameAs": ["https://t.me/iankzmcv", "https://band.link/zDZyK"],
        "description": desc
      },
      content: isEn ? `
        <h1>Ian Kuzmichev — Composer, Sound Designer, Sound Engineer</h1>
        <p>14+ years of experience, 100+ projects in theatre, film, and audio.</p>
        <h2>Theatre</h2><p>Immersive performances. Working with Russia's leading theatres: Chekhov Moscow Art Theatre, Theatre of Nations, Sovremennik, Pushkin Theatre, Meyerhold Centre.</p>
        <h2>Film</h2><p>Full post-production cycle. Composition, sound design, post-production sound engineering.</p>
        <h2>Audio Performances</h2><p>Spatial sound and immersion. Immersive audio walks and headphone performances.</p>
        <h2>Featured Projects</h2>
        <ul>${projectsData.map(p => `<li><a href="${SITE_URL}/en/project/${p.id}">${p.titleEn} (${p.year}) — ${p.roleEn.join(", ")}</a></li>`).join("\n")}</ul>
      ` : `
        <h1>Ян Кузьмичёв — композитор, саунд-дизайнер, звукорежиссёр</h1>
        <p>14+ лет опыта, 100+ проектов в театре, кино и аудио. Музыка и звук для пространства.</p>
        <h2>Театр</h2><p>Спектакли с погружением в атмосферу. Работа с ведущими театрами России.</p>
        <h2>Кино</h2><p>Полный цикл пост-продакшна.</p>
        <h2>Аудиоспектакли</h2><p>Пространственный звук и иммерсия.</p>
        <h2>Избранные проекты</h2>
        <ul>${projectsData.map(p => `<li><a href="${SITE_URL}/project/${p.id}">${p.title} (${p.year}) — ${p.role.join(", ")}</a></li>`).join("\n")}</ul>
      `
    };
  }

  if (cleanPath === "/about") {
    const title = isEn ? "About — Ian Kuzmichev" : "Обо мне — Ян Кузьмичёв";
    const desc = isEn
      ? "Ian Kuzmichev — composer, sound designer and sound engineer. Over 100 projects. Chekhov Moscow Art Theatre, Theatre of Nations, Sovremennik, Van Cleef & Arpels, Porsche."
      : "Ян Кузьмичёв — композитор, саунд-дизайнер и звукорежиссёр. Более 100 проектов. МХТ, Театр Наций, Современник, Van Cleef & Arpels, Porsche.";
    return {
      title, description: desc, lang,
      url: `${SITE_URL}${prefix}/about`,
      alternateUrl: `${SITE_URL}${altPrefix}/about`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": title,
        "mainEntity": {
          "@type": "Person",
          "name": isEn ? "Ian Kuzmichev" : "Ян Кузьмичёв",
          "alumniOf": { "@type": "CollegeOrUniversity", "name": "GITIS" },
          "jobTitle": isEn ? ["Composer", "Sound Designer", "Sound Engineer"] : ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"]
        }
      },
      content: isEn ? `
        <h1>About — Ian Kuzmichev</h1>
        <p>Composer | Sound Designer | Sound Engineer</p>
        <p>Ian Kuzmichev creates sound that becomes part of the story. GITIS graduate with honors (2015). Over 13 years — more than 100 completed projects.</p>
        <p>Clients include: Chekhov Moscow Art Theatre, Meyerhold Centre, Theatre of Nations, Sovremennik, Pushkin Theatre, National Theatre of Budapest.</p>
        <p>Corporate projects for Van Cleef & Arpels, Porsche, Panasonic, VDNKh and Zotov Centre.</p>
      ` : `
        <h1>О себе — Ян Кузьмичёв</h1>
        <p>Композитор | Саунд-дизайнер | Звукорежиссёр</p>
        <p>Ян Кузьмичёв создаёт звук, становящийся частью истории. Выпускник ГИТИСа с красным дипломом (2015). Более 100 проектов.</p>
        <p>Клиенты: МХТ им. Чехова, Центр им. Мейерхольда, Театр Наций, Современник, Театр Пушкина, Национальный театр Будапешта.</p>
        <p>Корпоративные проекты для Van Cleef & Arpels, Porsche, Panasonic, ВДНХ и Центра Зотов.</p>
      `
    };
  }

  if (cleanPath === "/projects" || cleanPath.startsWith("/projects/")) {
    const category = cleanPath.split("/projects/")[1];
    const catName = category ? (catNames[category] || (isEn ? "All Projects" : "Все проекты")) : (isEn ? "All Projects" : "Все проекты");
    const catDesc = isEn
      ? (category ? `Projects by Ian Kuzmichev in the "${catName}" category. Composition, sound design and sound engineering.` : "All projects by Ian Kuzmichev: theatre, film, audio performances. Over 100 works as composer, sound designer and sound engineer.")
      : (category ? `Проекты Яна Кузьмичёва в категории «${catName}». Композиция, саунд-дизайн и звукорежиссура.` : "Все проекты Яна Кузьмичёва: театр, кино, аудиоспектакли. Более 100 работ.");

    const filteredProjects = category ? projectsData.filter(p => p.category === category) : projectsData;

    return {
      title: isEn ? `${catName} — Projects | Ian Kuzmichev` : `${catName} — Проекты | Ян Кузьмичёв`,
      description: catDesc, lang,
      url: `${SITE_URL}${prefix}${cleanPath}`,
      alternateUrl: `${SITE_URL}${altPrefix}${cleanPath}`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": isEn ? `${catName} — projects by Ian Kuzmichev` : `${catName} — проекты Яна Кузьмичёва`,
        "description": catDesc,
        "url": `${SITE_URL}${prefix}${cleanPath}`
      },
      content: `
        <h1>${catName}</h1><p>${catDesc}</p>
        <ul>${filteredProjects.map(p => `<li><a href="${SITE_URL}${prefix}/project/${p.id}">${isEn ? p.titleEn : p.title} (${p.year}) — ${(isEn ? p.roleEn : p.role).join(", ")}${(isEn ? p.venueEn : p.venue) ? ` | ${isEn ? p.venueEn : p.venue}` : ""}</a><br/>${isEn ? p.descriptionEn : p.description}</li>`).join("\n")}</ul>
      `
    };
  }

  if (cleanPath === "/contact") {
    const title = isEn ? "Contact — Ian Kuzmichev" : "Контакты — Ян Кузьмичёв";
    const desc = isEn
      ? "Contact composer and sound designer Ian Kuzmichev. Email, Telegram, social media."
      : "Связаться с композитором и саунд-дизайнером Яном Кузьмичёвым. Email, Telegram, социальные сети.";
    return {
      title, description: desc, lang,
      url: `${SITE_URL}${prefix}/contact`,
      alternateUrl: `${SITE_URL}${altPrefix}/contact`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": title,
        "url": `${SITE_URL}${prefix}/contact`
      },
      content: isEn ? `
        <h1>Contact — Ian Kuzmichev</h1>
        <p>Contact composer and sound designer Ian Kuzmichev for collaboration.</p>
        <p>Email: kuzmichevyan@gmail.com</p>
        <p>Telegram: @iankzmcv</p>
      ` : `
        <h1>Контакты — Ян Кузьмичёв</h1>
        <p>Связаться с композитором и саунд-дизайнером Яном Кузьмичёвым для сотрудничества.</p>
        <p>Email: kuzmichevyan@gmail.com</p>
        <p>Telegram: @iankzmcv</p>
      `
    };
  }

  const projectMatch = cleanPath.match(/^\/project\/(.+)$/);
  if (projectMatch) {
    const projectId = projectMatch[1];
    const project = projectsData.find(p => p.id === projectId);
    if (project) {
      const pTitle = isEn ? project.titleEn : project.title;
      const pDesc = isEn ? project.fullDescriptionEn : project.fullDescription;
      const pRole = isEn ? project.roleEn : project.role;
      const pVenue = isEn ? project.venueEn : project.venue;
      const name = isEn ? "Ian Kuzmichev" : "Ян Кузьмичёв";
      return {
        title: `${pTitle} — ${project.year} | ${name}`,
        description: pDesc.substring(0, 200) + "...",
        lang,
        url: `${SITE_URL}${prefix}/project/${project.id}`,
        alternateUrl: `${SITE_URL}${altPrefix}/project/${project.id}`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "name": pTitle,
          "description": pDesc,
          "dateCreated": project.year,
          "genre": catNames[project.category] || project.category,
          "creator": { "@type": "Person", "name": name, "jobTitle": pRole },
          ...(pVenue ? { "locationCreated": { "@type": "Place", "name": pVenue } } : {})
        },
        content: `
          <h1>${pTitle} (${project.year})</h1>
          <p><strong>${isEn ? 'Category' : 'Категория'}:</strong> ${catNames[project.category] || project.category}</p>
          <p><strong>${isEn ? 'Role' : 'Роль'}:</strong> ${pRole.join(", ")}</p>
          ${pVenue ? `<p><strong>${isEn ? 'Venue' : 'Площадка'}:</strong> ${pVenue}</p>` : ""}
          <p>${pDesc}</p>
          <p><a href="${SITE_URL}${prefix}">${name}</a></p>
        `
      };
    }
  }

  return null;
}

/**
 * Экранирование HTML-сущностей для безопасной вставки plain-text данных
 * в HTML-шаблон (текст и значения атрибутов).
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Безопасная сериализация JSON-LD: помимо стандартного JSON.stringify
 * экранируем последовательности, которые могут закрыть тег <script>
 * или начать HTML-комментарий внутри inline-script.
 */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function generateHTML(seo: PageSEO): string {
  const jsonLdScript = seo.jsonLd
    ? `<script type="application/ld+json">${safeJsonLd(seo.jsonLd)}</script>`
    : "";

  const ogLocale = seo.lang === 'en' ? 'en_US' : 'ru_RU';
  const altLocale = seo.lang === 'en' ? 'ru_RU' : 'en_US';
  const altLang = seo.lang === 'en' ? 'ru' : 'en';
  const siteName = seo.lang === 'en' ? 'Ian Kuzmichev' : 'Ян Кузьмичёв';
  const homeLabel = seo.lang === 'en' ? 'Home' : 'Главная';
  const aboutLabel = seo.lang === 'en' ? 'About' : 'Обо мне';
  const projectsLabel = seo.lang === 'en' ? 'Projects' : 'Проекты';
  const contactLabel = seo.lang === 'en' ? 'Contact' : 'Контакты';
  const prefix = seo.lang === 'en' ? '/en' : '';

  // Экранируем все динамические plain-text поля.
  // ВАЖНО: seo.content — это уже подготовленный HTML-фрагмент, его НЕ экранируем.
  const safeTitle = escapeHtml(seo.title);
  const safeDescription = escapeHtml(seo.description);
  const safeUrl = escapeHtml(seo.url);
  const safeAltUrl = escapeHtml(seo.alternateUrl);
  const safeXDefaultUrl = escapeHtml(seo.lang === 'ru' ? seo.url : seo.alternateUrl);
  const safeSiteName = escapeHtml(siteName);

  return `<!DOCTYPE html>
<html lang="${seo.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}">
  <link rel="canonical" href="${safeUrl}">
  <link rel="alternate" hreflang="${seo.lang}" href="${safeUrl}">
  <link rel="alternate" hreflang="${altLang}" href="${safeAltUrl}">
  <link rel="alternate" hreflang="x-default" href="${safeXDefaultUrl}">
  
  <meta property="og:type" content="website">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:url" content="${safeUrl}">
  <meta property="og:site_name" content="${safeSiteName}">
  <meta property="og:locale" content="${ogLocale}">
  <meta property="og:locale:alternate" content="${altLocale}">
  
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDescription}">
  
  <meta name="robots" content="index, follow">
  <meta name="author" content="${safeSiteName}">
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
    <a href="${SITE_URL}${prefix}/">${homeLabel}</a> |
    <a href="${SITE_URL}${prefix}/about">${aboutLabel}</a> |
    <a href="${SITE_URL}${prefix}/projects">${projectsLabel}</a> |
    <a href="${SITE_URL}${prefix}/contact">${contactLabel}</a> |
    <a href="${SITE_URL}${seo.lang === 'en' ? '/' : '/en/'}">${seo.lang === 'en' ? 'RU' : 'EN'}</a>
  </nav>
  ${seo.content}
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${safeSiteName}.</p>
    <p><a href="${SITE_URL}/sitemap.xml">Sitemap</a></p>
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
