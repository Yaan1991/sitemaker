const idiotImage = "/images/idiot.webp";
const mayakovskyImage = "/images/mayakovsky.webp";
const petrovyImage = "/images/petrovy.webp";
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
  details?: {
    duration?: string;
    genre?: string;
    director?: string;
    producer?: string;
    cast?: string[];
    technical?: string[];
  };
}

export const projects: Project[] = [
  // Theatre Projects
  {
    id: "idiot-saratov-drama",
    title: "Идиот",
    year: "2024",
    description: "Нуар/дарк-джаз + полевые записи. Многослойная партитура.",
    fullDescription: "Музыкальное решение для постановки по роману Достоевского в Саратовском театре драмы. Создана многослойная партитура, сочетающая элементы нуар и дарк-джаза с аутентичными полевыми записями. Звук формирует психологическое пространство спектакля, подчеркивая внутренние переживания персонажей.",
    image: idiotImage,
    category: "theatre",
    role: ["Композитор", "Саунд-дизайнер", "FOH-инженер"],
    venue: "Саратовский театр драмы",
    links: [
      {
        label: "Афиша театра",
        url: "https://www.saratovdrama.com/repertoire/idiot/",
        external: true,
      },
    ],
    details: {
      director: "Семён Шомин",
      genre: "Драма",
      technical: ["QLab", "Многоканальная система", "Полевые записи"],
    },
  },
  {
    id: "mayakovsky-moscow-estrada",
    title: "Маяковский. Я сам",
    year: "2024",
    description: "6 композиций, трёхуровневая звуковая концепция.",
    fullDescription: "Моноспектакль с Никитой Кологривым в главной роли. Разработана трёхуровневая звуковая концепция: оригинальные композиции, аранжировки известных произведений и саунд-дизайн. 6 авторских композиций создают эмоциональную канву спектакля, отражая поэтический мир Маяковского.",
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
    description: "Кроссовер/нео-джаз + сюрреалистические эффекты.",
    fullDescription: "Спектакль-комикс по одноимённому роману Алексея Сальникова. Музыкальное решение построено на синтезе кроссовера и нео-джаза с экспериментальными звуковыми эффектами. Саунд-дизайн создаёт сюрреалистическую атмосферу, отражающую абсурдистский мир произведения.",
    image: petrovyImage,
    category: "theatre",
    role: ["Композитор", "Саунд-дизайнер"],
    venue: "Саратовский театр драмы",
    links: [
      {
        label: "Афиша",
        url: "https://www.saratovdrama.com/repertoire/petrovy-v-grippe-i-vokrug-nego/",
        external: true,
      },
    ],
    details: {
      director: "Семён Шомин",
      genre: "Комедия-драма",
      technical: ["Кроссовер", "Нео-джаз", "Экспериментальные эффекты"],
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
