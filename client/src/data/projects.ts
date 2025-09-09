const idiotImage = "/images/idiot.webp";
const mayakovskyImage = "/images/mayakovsky.webp";
const petrovyImage = "/images/petrovy.webp";
// Комиксные изображения для Петровых
import petrovyCoverImage from "@assets/CoverPetrovy_1757432306008.webp";
import petrovyBoyImage from "@assets/Boy_1757432306008.webp";
import petrovyTramImage from "@assets/boyandtram_1757432306008.webp";
import petrovyPhoneImage from "@assets/Phone_1757432306008.webp";
import petrovyPhone2Image from "@assets/Phone2_1757432306009.webp";
const homoHominiImage = "/images/homohomini.webp";
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
    description: "12 композиций разных жанров для спектакля-комикса по роману Алексея Сальникова.",
    fullDescription: "Постановка по роману Алексея Сальникова — одному из самых «несценичных» текстов современной литературы. Спектакль решён как комикс и театр о самом себе: действие начинается в закулисье с режиссёром-панк-ведьмой и уборщицей со шваброй-знаменем. Создано 12 оригинальных композиций разных жанров, разработана лейтмотивная система для персонажей и сцен, использованы экспериментальные ИИ-решения для создания оперного кавера песни «Ноль».",
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
        url: "https://www.saratovdrama.com/repertoire/petrovy-v-grippe-i-vokrug-nego/",
        external: true,
      },
    ],
    details: {
      director: "Иван Комаров",
      genre: "Комикс-драма",
      theatre: "Саратовский театр драмы",
      producer: "Художник-постановщик: Ольга Кузнецова, Художник по свету: Максим Бирюков",
      technical: ["12 композиций разных жанров", "Лейтмотивная система", "QLab автоматизация", "MIDI и OSC-протоколы", "ИИ-эксперименты", "Оперный кавер"],
    },
  },

  // Film Projects
  {
    id: "homo-homini-short",
    title: "Homo Homini",
    year: "2025",
    description: "13 композиций + полный пост.",
    fullDescription: "Короткометражный фильм с полным циклом звукового пост-продакшна. Создано 13 оригинальных композиций, выполнены сведение диалогов, создание шумов и атмосфер. Музыкальное решение строится на контрасте лирических и драматических моментов, подчеркивая философскую глубину повествования.",
    image: homoHominiImage,
    category: "film",
    role: ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
    links: [
      {
        label: "Kino.Mail.ru",
        url: "https://kino.mail.ru/cinema/movies/950068_homo_homini_chelovek_cheloveku/",
        external: true,
      },
    ],
    details: {
      duration: "15 минут",
      genre: "Драма",
      technical: ["13 композиций", "Полный постпродакшн", "Сведение", "Шумы"],
    },
  },
  {
    id: "ma-short-film",
    title: "Ма",
    year: "2023",
    description: "Сведение, шумы, амбиенты.",
    fullDescription: "Экспериментальный короткометражный фильм. Звуковое решение сосредоточено на создании атмосферных амбиентов и детальной проработке звуковых эффектов. Минималистичный подход к музыке позволяет звуковому дизайну стать главным выразительным средством.",
    image: maFilmImage,
    category: "film",
    role: ["Саунд-дизайнер", "Звукорежиссёр"],
    details: {
      genre: "Экспериментальная драма",
      technical: ["Атмосферные амбиенты", "Звуковые эффекты", "Сведение"],
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
    fullDescription: "Аудиоспектакль в Зотов Центре с использованием технологий пространственного звука. Создана оригинальная музыкальная партитура, адаптированная для многоканального воспроизведения. Звук перемещается в пространстве, создавая эффект погружения для слушателей.",
    image: sonOHlebeImage,
    category: "audio",
    role: ["Композитор", "Звукорежиссёр"],
    venue: "Зотов Центр",
    details: {
      technical: ["Пространственный звук", "Многоканальная система", "Оригинальные композиции"],
    },
  },
  {
    id: "pogruzhenie-promenad-telegram",
    title: "Погружение. Променад",
    year: "2021",
    description: "Музыка, маршруты, пространственный звук.",
    fullDescription: "Инновационный аудиоспектакль, проводимый через Telegram. Слушатели получают аудиомаршруты для прогулок по городу с синхронизированным звуковым сопровождением. Создана система композиций, которые реагируют на местоположение и время, формируя уникальный звуковой ландшафт.",
    image: pogruzhenieImage,
    category: "audio",
    role: ["Композитор", "Саунд-дизайнер"],
    details: {
      technical: ["Геолокационный звук", "Интерактивные маршруты", "Мобильные технологии"],
    },
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
