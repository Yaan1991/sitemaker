const idiotImage = "/images/idiot.webp";
const mayakovskyImage = "/images/mayakovsky.webp";
// Комиксные изображения для Петровых
import petrovyCoverImage from "@assets/CoverPetrovy_1757437253647.webp";
import petrovyBoyImage from "@assets/Boy_1757437253646.webp";
import petrovyTramImage from "@assets/boyandtram_1757437253647.webp";
import petrovyPhoneImage from "@assets/Phone_1757437253647.webp";
import petrovyPhone2Image from "@assets/Phone2_1757437253647.webp";
const homoHominiImage = "/images/homo-homini-cover.webp";
const maFilmImage = "/images/ma_film.webp";
const lifeInArtImage = "/images/life_in_art.webp";
const sonOHlebeImage = "/images/son_o_hlebe.webp";
const pogruzhenieImage = "/images/pogruzhenie.webp";

export interface Project {
  id: string;
  title: string;
  year: string;
  description: string;
  fullDescription: string;
  image: string;
  category: "theatre" | "film" | "audio";
  role: string[];
  venue?: string;
  links?: Array<{
    label: string;
    url: string;
    external?: boolean;
  }>;
  awards?: string[];
  photos?: string[];
  comicImages?: {
    cover: string;
    boy: string;
    tram: string;
    phone: string;
    phone2: string;
  };
  tracks?: Array<{
    id: string;
    title: string;
    url: string;
  }>;
  details?: {
    duration?: string;
    genre?: string;
    director?: string;
    producer?: string;
    cast?: string[];
    technical?: string[];
    theatre?: string;
    premiere?: string;
  };
}

export const projects: Project[] = [
  // Theatre Projects
  {
    id: "idiot-saratov-drama",
    title: "Идиот",
    year: "2024",
    description: "Уникальное сочетание театра и кино: нуар-джаз + полевые записи + ИИ-технологии.",
    fullDescription: "Радикально переосмысленная постановка по Достоевскому, где действие перенесено в Саратов 1999 года. Спектакль объединяет живое театральное действие с киносъёмкой — два оператора снимают происходящее, а зритель видит параллельно спектакль и его экранную версию в духе 90-х. Создана многослойная звуковая партитура: 10 оригинальных композиций в жанрах нуар-джаз и пост-рок, аутентичные полевые записи Саратова (трамваи, улицы, двери), использование ИИ для клонирования голоса актёра для немецкой речи. Звук вдохновлён эстетикой Twin Peaks и Секретных материалов.",
    image: idiotImage,
    category: "theatre",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
    venue: "Саратовский театр драмы имени Слонова",
    links: [
      {
        label: "Афиша театра",
        url: "https://www.saratovdrama.com/repertoire/idiot/",
        external: true,
      },
      {
        label: "Cool Connections — обзор",
        url: "https://www.coolconnections.ru/ru/blog/posts/Idiot-Do-samogo-konca-sveta?ysclid=mewxumf8ff413247497",
        external: true,
      },
      {
        label: "Комсомольская правда — рецензия",
        url: "https://www.saratov.kp.ru/daily/27601.5/4952575/?ysclid=mewxvh7x9w791506972",
        external: true,
      },
    ],
    details: {
      director: "Иван Комаров",
      genre: "Драма",
      producer: "Художник: Ольга Кузнецова, Свет: Максим Бирюков",
      technical: ["Logic Pro", "QLab 4 + M32", "OSC-команды", "Omnisphere", "Spitfire Labs", "Kontakt", "Splice", "Soundly", "Udio AI", "Голосовые нейросети", "Полевые записи Саратова"],
    },
  },
  {
    id: "mayakovsky-moscow-estrada",
    title: "Маяковский. Я сам",
    year: "2024",
    description: "6 композиций, трёхуровневая звуковая концепция.",
    fullDescription: "Спектакль-исследование внутреннего механизма саморазрушения поэта через трагический треугольник Маяковский - Лили и Осип Брик. Основа - автобиография «Я сам», стихи и поэмы. Создана трёхслойная звуковая драматургия: реальность, поэтический слой и абстракция. Звук движется между зонами, создавая кинематографический эффект смены точки зрения. Написано 6 оригинальных композиций + переаранжировки предложенных режиссером композиций, использованы полевые записи и ИИ для спецэффектов.",
    image: mayakovskyImage,
    category: "theatre",
    role: ["Композитор", "Саунд-дизайнер"],
    venue: "Московский театр Эстрады",
    links: [
      {
        label: "MSK1 — обзор",
        url: "https://msk1.ru/text/culture/2025/02/08/75082631/",
        external: true,
      },
    ],
    details: {
      director: "Семён Шомин",
      cast: ["Никита Кологривый"],
      genre: "Моноспектакль",
      technical: ["Оригинальные композиции", "Аранжировки", "QLab"],
    },
  },
  {
    id: "petrovy-saratov-drama",
    title: "Петровы в гриппе и вокруг него",
    year: "2025",
    description: "Театр как комикс, где пространство одновременно рассказывает историю Петровых и размышляет о театре как о пространстве бреда. Постановка балансирует между бытовым реализмом и абсурдом.",
    fullDescription: "Постановка по роману Алексея Сальникова - одному из самых «несценичных» текстов современной литературы. Спектакль решён как комикс и театр о самом себе. Создано 12 оригинальных композиций разных жанров - от неоклассических фортепианных пьес до гротескных эффектов.",
    image: petrovyCoverImage,
    category: "theatre",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр", "Промт-инженер"],
    venue: "Саратовский театр драмы",
    comicImages: {
      cover: petrovyCoverImage,
      boy: petrovyBoyImage,
      tram: petrovyTramImage,
      phone: petrovyPhoneImage,
      phone2: petrovyPhone2Image,
    },
    tracks: [
      {
        id: "petrovy_lonely_theme",
        title: "Тема одиночества",
        url: "/audio/petrovy_lonely_theme.mp3"
      },
      {
        id: "petrovy_mad_theme",
        title: "Приехали в гости",
        url: "/audio/petrovy_mad_theme.mp3"
      },
      {
        id: "petrovy_theme_of_sick",
        title: "Болезнь Петрова младшего",
        url: "/audio/petrovy_theme_of_sick.mp3"
      }
    ],
    links: [
      {
        label: "Афиша театра",
        url: "https://www.saratovdrama.com/repertoire/petrovy-v-grippe-i-vokrug-nego/?ysclid=mfcsmr4sx380848479",
        external: true,
      },
      {
        label: "Cool Connections — пресса",
        url: "https://www.coolconnections.ru/en/blog/posts/Po-vse-storony-Petrovyh-v-grippe?ysclid=mfcspzyytu896058503",
        external: true,
      },
      {
        label: "Пресса - SarInform",
        url: "https://sarinform.ru/news/culture/petrovy-v-grippe-i-vokrug-nego-spektakl-o-mnozhestvennyh-mirah-v-boleznennom-bredu?ysclid=mfd3rl4hjv56090761",
        external: true,
      },
    ],
    details: {
      director: "Иван Комаров",
      genre: "Комикс-драма",
      theatre: "Саратовский театр драмы",
      producer: "Художник-постановщик: Ольга Кузнецова, Художник по свету: Максим Бирюков, Режиссёр, автор инсценировки: Иван Комаров",
      technical: ["12 полноценных композиций разных жанров", "Разработка лейтмотивной системы для персонажей и сцен", "Создание атмосферных эмбиентов и дроун-текстур", "Работа с ИИ для создания оперного кавера", "Программирование и автоматизация в QLab", "Звукорежиссура и FOH-инженеринг"],
    },
  },

  // Film Projects
  {
    id: "homo-homini-short",
    title: "Homo Homini",
    year: "2025",
    description: "Короткометражная драма с элементами чёрной комедии. 13 оригинальных композиций + полный пост-продакшн в 5.1.",
    fullDescription: "История робкого Саввы, увлечённого японской культурой. После смерти собаки и предательства девушки, обокравшей его, герой превращается в персонажа азиатского боевика - надевает кимоно, маску демона-они и отправляется мстить с молотком. Фильм о человеке, превращающем свою жизнь в кинематографическую цитату, где герой находит в чужой культуре силу для мести, балансируя между подлинностью и условностью. Саунд-дизайн балансирует между реализмом и стилизацией под азиатские боевики.",
    image: homoHominiImage,
    category: "film",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр пост-продакшена", "Сонграйтер", "Промт-инженер"],
    photos: [
      "/images/homo-homini-cover.webp",
      "/images/homo-homini-1.webp",
      "/images/homo-homini-2.webp",
      "/images/homo-homini-3.webp",
      "/images/homo-homini-4.webp",
      "/images/homo-homini-5.webp"
    ],
    links: [
      {
        label: "Кинопоиск",
        url: "https://www.kinopoisk.ru/film/9017614/",
        external: true,
      },
    ],
    details: {
      duration: "Короткометражный",
      genre: "Драма с элементами чёрной комедии",
      director: "Иван Комаров",
      producer: "Элеонора Клементьева, Иван Комаров, Елена Ербакова",
      cast: ["Семён Штейнберг", "Елена Ербакова", "Антон Кузнецов", "Алёна Бабенко", "Александр Панов", "Батраз Засеев", "Ефим Белосорочка"],
      technical: ["13 оригинальных композиций", "Японская песня 70-х с ИИ", "Полевые записи", "Стилизованный саунд-дизайн", "Финальный микс в стерео и 5.1"],
      premiere: "Кинофестиваль «Короче», Калининград"
    },
  },
  {
    id: "ma-short-film",
    title: "Ма",
    year: "2024",
    description: "Короткометражная драма о матери и дочери, переживающих утрату. Кино почти без диалогов, где пейзаж и быт говорят вместо слов.",
    fullDescription: "Короткометражная драма о матери и дочери, переживающих утрату. Кино почти без диалогов, где пейзаж и быт говорят вместо слов. Действие происходит в Северной Осетии, в селе Даргавс. Фильм построен вокруг отношений матери и дочери, оставшихся вдвоём после смерти сына и брата. В культуре Кавказа не принято говорить о чувствах вслух, поэтому героини проживают боль через молчание, через ритуалы и быт. Проведена реставрация звукового материала, переозвучена часть сцен без предзаписанного звука. Создан живой, достоверный звуковой слой без перегрузки. В отсутствие музыки именно звук ведёт зрителя, помогая прочитать желания героев и ощутить пространство Северного Кавказа.",
    image: maFilmImage,
    category: "film",
    role: ["Звукорежиссёр пост-продакшна"],
    photos: [
      "/images/ma-cover.webp",
      "/images/ma-1.webp",
      "/images/ma-2.webp",
      "/images/ma-3.webp",
      "/images/ma-4.webp",
      "/images/ma-5.webp"
    ],
    links: [
      {
        label: "The Blueprint — обзор",
        url: "https://theblueprint.ru/culture/bluescreen/bluescreen-ma",
        external: true,
      },
      {
        label: "Смотреть фильм",
        url: "https://www.youtube.com/watch?v=nX_CluAW0WI",
        external: true,
      },
    ],
    details: {
      duration: "Короткометражный",
      genre: "Драма",
      director: "Валентина Бесолова",
      cast: ["Зита Лацоева (Зарема)", "Милана Кониева (Сабина)", "Алан Албегов (Алик)"],
      technical: ["Реставрация исходного материала в iZotope RX", "Создание полного foley (шаги, одежда, предметы)", "Создание атмосферных слоев среды", "Пространственная обработка под планы камеры", "Финальное сведение и мастеринг в стерео"],
    },
  },
  {
    id: "life-in-art-short",
    title: "Жизнь в искусстве",
    year: "2019",
    description: "Полная переозвучка шумов и амбиентов.",
    fullDescription: "Игровой короткометражный фильм о жизни художника. Выполнена полная переозвучка всех шумов и создание атмосферных амбиентов. Звуковое решение подчёркивает контраст между внутренним миром творца и окружающей реальностью.",
    image: lifeInArtImage,
    category: "film",
    role: ["Саунд-дизайнер"],
    details: {
      genre: "Драма",
      technical: ["Переозвучка шумов", "Атмосферные амбиенты", "Фоли"],
    },
  },

  // Audio Projects
  {
    id: "son-o-hlebe-zotov",
    title: "Сон о Хлебе",
    year: "2024",
    description: "Оригинальная музыка, пространственный звук.",
    fullDescription: "ВТБ представляет аудиоспектакль Центра «Зотов» «Сон о хлебе» — историю в жанре haunted house (дом с привидениями) о Хлебозаводе №5. Главный герой — сотрудник охраны, который день и ночь проводит рядом с музейными экспонатами. Однажды он видит сон, в котором слышит загадочные голоса. От них он узнает секрет «вечного хлеба», а также разгадывает тайну, которая помогает ему лучше понять историю своей страны и семьи.\n\nВ процессе подготовки сценария была проведена большая работа с архивами: текстами книг и публичных лекций Василия Петровича Зотова, газетами рабочих завода 1930-х годов, воспоминаниями и дневниками сотрудников завода с сервиса «Прожито». Вдохновением для пьесы послужили художественные произведения от фольклора до опер.\n\nПремьера состоялась 18 мая 2024 в рамках акции «Ночь в музее» и сопровождалась видеоинсталляцией на первом этаже центра.",
    image: sonOHlebeImage,
    category: "audio",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
    venue: "Центр «Зотов»",
    details: {
      director: "Тимур Шарафутдинов",
      genre: "Аудиоспектакль в жанре haunted house",
      premiere: "18 мая 2024 (акция «Ночь в музее»)",
      producer: "Сценарий: Валерий Печейкин • Продакшн: контент-бюро «Шторм»",
      cast: ["Константин Хабенский", "Рита Крон", "Аскар Нигамедзянов"],
      technical: [
        "Написание 12 оригинальных композиций",
        "Звуковой монтаж",
        "Работа с пространственным аудио",
        "Финальный постпродакшен"
      ],
    },
    links: [
      {
        label: "Страница проекта на centrezotov.ru",
        url: "https://centrezotov.ru/events/audiospektakl-son-o-hlebe-vtb/?ysclid=mhrk30w24q990177300",
        external: true,
      },
    ],
  },
  {
    id: "pogruzhenie-promenad-telegram",
    title: "Погружение. Променад",
    year: "2021",
    description: "Сайт-специфик аудиоспектакль",
    fullDescription: "Спектакль-променад проходит на улицах Нижнего Новгорода. Нижний Новгород является не просто массивом зданий и улиц, а местом, где хранятся все наши воспоминания. Услышьте личные истории простых людей во время променада по городу – и почувствуйте то, что чувствуют они.\n\n«ПОГРУЖЕНИЕ ПРОМЕНАД» — это прогулка по историческому центру города, во время которой зрители смогут услышать истории разных людей и увидеть незаметные места, очень значимые для них.\n\nПроект создан в формате иммерсивной аудиопрогулки, где звук становится проводником в мир личных историй жителей города. Каждая локация оживает через голоса героев, музыку и звуковой ландшафт Нижнего Новгорода.",
    image: pogruzhenieImage,
    category: "audio",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
    venue: "Центр театрального мастерства (Нижний Новгород)",
    details: {
      director: "Иван Комаров",
      genre: "Сайт-специфик аудиоспектакль",
      premiere: "2021",
      producer: "Драматург: Наталья Зайцева • Продюсеры: Евгений Пыхтин, Татьяна Тенькова",
      technical: [
        "Создание оригинальной музыки",
        "Работа с полевыми записями",
        "Чистка голоса героев",
        "Работа с шумами",
        "Саунд-дизайн"
      ],
    },
    links: [
      {
        label: "Страница проекта на ctm-nn.ru",
        url: "https://ctm-nn.ru/pogruzhenie-promenad/",
        external: true,
      },
      {
        label: "Rambler News — статья о проекте",
        url: "https://news.rambler.ru/moscow_city/47024657-v-nizhnem-novgorode-startovali-audiospektakli-progulki-pogruzhenie-promenad/",
        external: true,
      },
    ],
  },
];

export const projectCategories = {
  theatre: {
    title: "Театр",
    description: "Спектакли с погружением в атмосферу",
    image: idiotImage,
  },
  film: {
    title: "Кино",
    description: "Полный цикл пост-продакшна",
    image: homoHominiImage,
  },
  audio: {
    title: "Аудиоспектакли",
    description: "Пространственный звук и иммерсия",
    image: pogruzhenieImage,
  },
};

export function getProjectsByCategory(category: string): Project[] {
  return projects.filter((project) => project.category === category);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}
