export interface AllProject {
  id: string;
  year: string;
  title: string;
  theater: string;
  director: string;
  role: string;
  link?: string;
  category: 'theatre' | 'film' | 'audio';
}

export const allProjects: AllProject[] = [
  {
    id: "samiy-legkiy-sposob",
    year: "2012",
    title: "Самый лёгкий способ бросить курить",
    theater: "Театр на Трубной (Москва)",
    director: "Филипп Лось",
    role: "Звукорежиссёр",
    category: "theatre"
  },
  {
    id: "spasti-kamer-yunkera",
    year: "2012",
    title: "Спасти камер-юнкера Пушкина",
    theater: "Театр на Трубной (Москва)",
    director: "Валерия Кузнецова",
    role: "Звукорежиссёр",
    category: "theatre"
  },
  {
    id: "posledniy-actek",
    year: "2013",
    title: "Последний ацтек",
    theater: "Театр на Трубной (Москва)",
    director: "Иосиф Райхельгауз",
    role: "Звукорежиссёр",
    category: "theatre"
  },
  {
    id: "durochka-i-zek",
    year: "2015",
    title: "Дурочка и зэк",
    theater: "Театр на Трубной (Москва)",
    director: "Виктория Печерникова",
    role: "Звукорежиссёр",
    category: "theatre"
  },
  {
    id: "monologi-gorodov",
    year: "2015",
    title: "Монологи городов",
    theater: "Театр на Трубной (Москва)",
    director: "Евгений Кочетков",
    role: "Звукорежиссёр",
    category: "theatre"
  },
  {
    id: "chasovshik",
    year: "2015",
    title: "Часовщик",
    theater: "Театр на Трубной (Москва)",
    director: "Иосиф Райхельгауз",
    role: "Звукорежиссёр",
    category: "theatre"
  },
  {
    id: "prank",
    year: "2016",
    title: "Пранк",
    theater: "Театр на Трубной (Москва)",
    director: "Никита Бетехтин",
    role: "Звукорежиссёр",
    category: "theatre"
  },
  {
    id: "abyuz",
    year: "2017",
    title: "Абьюз",
    theater: "Центр им. Вс. Мейерхольда (Москва)",
    director: "Иван Комаров",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "kodeks-kurilshika",
    year: "2017",
    title: "Кодекс курильщика",
    theater: "Центр театрального мастерства (Нижний Новгород)",
    director: "Иван Комаров",
    role: "Саунд-дизайнер",
    link: "https://example.com/kodeks-kurilshika",
    category: "theatre"
  },
  {
    id: "novogodniy-perepoloh",
    year: "2017",
    title: "Новогодний переполох",
    theater: "МТЦ «Вишнёвый сад» (Москва)",
    director: "Сергей Ковалёв",
    role: "Композитор",
    category: "theatre"
  },
  {
    id: "pechalniy-anekdot",
    year: "2017",
    title: "Печальный анекдот",
    theater: "МТЦ «Вишнёвый сад» (Москва)",
    director: "Александр Вилькин",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "solnechnaya-liniya",
    year: "2017",
    title: "Солнечная линия",
    theater: "Центр им. Вс. Мейерхольда (Москва)",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "chernaya-korobka",
    year: "2017",
    title: "Чёрная коробка",
    theater: "Центр им. Вс. Мейерхольда (Москва)",
    director: "Никита Бетехтин",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "baal",
    year: "2018",
    title: "Баал",
    theater: "Центр им. Вс. Мейерхольда (Москва)",
    director: "Иван Комаров",
    role: "Композитор и саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "govorit-moskva",
    year: "2018",
    title: "Говорит Москва",
    theater: "Театр «Угол» (Казань)",
    director: "Иван Комаров",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "leteli-kacheli",
    year: "2018",
    title: "Летели качели",
    theater: "Центр театрального мастерства (Нижний Новгород)",
    director: "Иван Комаров",
    role: "Саунд-дизайнер",
    link: "https://example.com/leteli-kacheli",
    category: "theatre"
  },
  {
    id: "solnce-vshodit",
    year: "2018",
    title: "Солнце всходит. Вечер к Горькому",
    theater: "МХТ им. А. П. Чехова (Москва)",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    link: "https://example.com/solnce-vshodit",
    category: "theatre"
  },
  {
    id: "tri-sestry",
    year: "2018",
    title: "Три сестры",
    theater: "Центр им. Вс. Мейерхольда (Москва)",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "dream-works",
    year: "2019",
    title: "Dream Works",
    theater: "Nemzeti Színház / Национальный театр (Будапешт)",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "gorka",
    year: "2019",
    title: "Горка",
    theater: "Омский государственный драматический театр «Пятый театр»",
    director: "Иван Комаров",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "more-i-sosny",
    year: "2019",
    title: "Море и сосны",
    theater: "Центр им. Вс. Мейерхольда (Москва)",
    director: "Саша Денисова",
    role: "Звукорежиссёр",
    category: "theatre"
  },
  {
    id: "oliver-twist",
    year: "2019",
    title: "Оливер Твист",
    theater: "Красноярский ТЮЗ",
    director: "Никита Бетехтин",
    role: "Саунд-дизайнер",
    link: "https://example.com/oliver-twist",
    category: "theatre"
  },
  {
    id: "u-nas-vse-horosho",
    year: "2019",
    title: "У нас всё хорошо",
    theater: "Театр «Практика» (Москва)",
    director: "Иван Комаров",
    role: "Композитор и саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "urod",
    year: "2019",
    title: "Урод",
    theater: "Центр им. Вс. Мейерхольда (Москва)",
    director: "Артём Дубра",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "illyuzii",
    year: "2020",
    title: "Иллюзии",
    theater: "Театр «Современник» (Москва)",
    director: "Иван Комаров",
    role: "Композитор и саунд-дизайнер",
    link: "https://example.com/illyuzii",
    category: "theatre"
  },
  {
    id: "spektakl-delovoy-centr",
    year: "2020",
    title: "Спектакль к открытию станции метро «Деловой центр»",
    theater: "Москва (станция «Деловой центр»)",
    director: "Саша Денисова",
    role: "Композитор и саунд-дизайнер",
    link: "https://example.com/delovoy-centr",
    category: "theatre"
  },
  {
    id: "cement",
    year: "2020",
    title: "Цемент",
    theater: "Театр «Старый дом» (Новосибирск)",
    director: "Никита Бетехтин",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "vechno-zhivye",
    year: "2021",
    title: "Вечно живые",
    theater: "Театр «Современник» (Москва)",
    director: "Николай Симонов",
    role: "Композитор и саунд-дизайнер",
    link: "https://example.com/vechno-zhivye",
    category: "theatre"
  },
  {
    id: "kometa-g",
    year: "2021",
    title: "Комета Г",
    theater: "Театр «Комедiя» (Нижний Новгород)",
    director: "?",
    role: "Композитор и саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "pogruzheniye-promenad",
    year: "2021",
    title: "ПОГРУЖЕНИЕ. Променад",
    theater: "Центр театрального мастерства (Нижний Новгород)",
    director: "Иван Комаров",
    role: "Композитор и саунд-дизайнер",
    link: "https://example.com/pogruzheniye-promenad",
    category: "theatre"
  },
  {
    id: "rok-dnevnik-anny-frank",
    year: "2021",
    title: "Рок-дневник Анны Франк",
    theater: "Театр им. А. С. Пушкина (Москва)",
    director: "Семён Серзин",
    role: "Звукорежиссёр",
    category: "theatre"
  },
  {
    id: "hlebzavod",
    year: "2021",
    title: "Хлебзавод",
    theater: "Красноярский ТЮЗ",
    director: "Никита Бетехтин",
    role: "Саунд-дизайнер",
    link: "https://example.com/hlebzavod",
    category: "theatre"
  },
  {
    id: "enterteyment",
    year: "2021",
    title: "Энтертеймент",
    theater: "ОККО Театр (Москва)",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "opera-tvoy-otec-zhiv",
    year: "2022",
    title: "Опера «Твой отец жив, только об этом не надо говорить»",
    theater: "Музей истории ГУЛАГа (Москва)",
    director: "Анна Кострикова, Даниил Посаженников",
    role: "Звукорежиссёр",
    link: "https://example.com/opera-tvoy-otec-zhiv",
    category: "theatre"
  },
  {
    id: "rozoviy-shum",
    year: "2022",
    title: "Розовый шум",
    theater: "Театр ARTиШОК (Алматы)",
    director: "Айганым Рамазан",
    role: "Композитор",
    link: "https://example.com/rozoviy-shum",
    category: "theatre"
  },
  {
    id: "tancy-na-prazdnike-urozhaya",
    year: "2022",
    title: "Танцы на празднике урожая",
    theater: "Саратовский театр драмы им. И. А. Слонова",
    director: "Юлиана Лайкова",
    role: "Композитор",
    link: "https://example.com/tancy-na-prazdnike-urozhaya",
    category: "theatre"
  },
  {
    id: "trevozhnyye-lyudi",
    year: "2022",
    title: "Тревожные люди",
    theater: "Театр г. Мирный",
    director: "Иван Комаров",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "ceh-poetov",
    year: "2022",
    title: "Цехъ поэтов",
    theater: "Няганский театр юного зрителя",
    director: "Иван Комаров",
    role: "Композитор",
    link: "https://example.com/ceh-poetov",
    category: "theatre"
  },
  {
    id: "ufo",
    year: "2023",
    title: "UFO",
    theater: "Театр Дом Q (Алматы)",
    director: "Николай Берман",
    role: "Композитор и саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "yozhik-v-tumane",
    year: "2023",
    title: "Ёжик в тумане",
    theater: "Театр «Керемет» (Алматы)",
    director: "Дмитрий Курочкин",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "anna-karenina",
    year: "2023",
    title: "Анна Каренина",
    theater: "Саратовский театр драмы им. И. А. Слонова",
    director: "Иван Комаров",
    role: "Композитор",
    link: "https://example.com/anna-karenina",
    category: "theatre"
  },
  {
    id: "dokumentalny-spektakl-bratya",
    year: "2023",
    title: "Документальный спектакль «Братья»",
    theater: "ГЦСИ (Владикавказ)",
    director: "Никита Бетехтин",
    role: "Саунд-дизайнер и звукорежиссёр",
    link: "https://example.com/dokumentalny-spektakl-bratya",
    category: "theatre"
  },
  {
    id: "mertvye-dushi",
    year: "2023",
    title: "Мёртвые души",
    theater: "Самарский театр драмы им. М. Горького",
    director: "Иван Комаров",
    role: "Композитор",
    link: "https://example.com/mertvye-dushi",
    category: "theatre"
  },
  {
    id: "po-lyubvi",
    year: "2023",
    title: "По любви",
    theater: "Театр ARTиШОК (Алматы)",
    director: "Карина Волкова",
    role: "Композитор и саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "a-zori-zdes-tihiye",
    year: "2024",
    title: "А зори здесь тихие",
    theater: "Русский драматический театр Республики Адыгея (Майкоп)",
    director: "Константин Мишин",
    role: "Композитор и саунд-дизайнер",
    link: "https://example.com/a-zori-zdes-tihiye",
    category: "theatre"
  },
  {
    id: "son-o-hlebe",
    year: "2024",
    title: "Аудиоспектакль «Сон о хлебе»",
    theater: "Центр «Зотов» (Москва)",
    director: "Тимур Шарафутдинов",
    role: "Композитор, звукорежиссёр постпродакшена",
    link: "https://example.com/son-o-hlebe",
    category: "audio"
  },
  {
    id: "dalshe-sami",
    year: "2024",
    title: "Дальше — сами",
    theater: "Театр «Современник» (Москва)",
    director: "Иван Комаров",
    role: "Композитор и саунд-дизайнер",
    link: "https://example.com/dalshe-sami",
    category: "theatre"
  },
  {
    id: "idiot",
    year: "2024",
    title: "Идиот",
    theater: "Саратовский театр драмы им. И. А. Слонова",
    director: "Иван Комаров",
    role: "Композитор",
    link: "https://example.com/idiot",
    category: "theatre"
  },
  {
    id: "kashtanka",
    year: "2024",
    title: "Каштанка",
    theater: "Няганский театр юного зрителя",
    director: "Иван Комаров",
    role: "Композитор",
    category: "theatre"
  },
  {
    id: "mayakovsky-ya-sam",
    year: "2024",
    title: "Маяковский. Я сам",
    theater: "Московский театр Эстрады",
    director: "Семён Шомин",
    role: "Саунд-дизайнер",
    link: "https://example.com/mayakovsky-ya-sam",
    category: "theatre"
  },
  {
    id: "puteshestviye-k-chernoy-rechke",
    year: "2024",
    title: "Путешествие к Чёрной речке",
    theater: "Тверской театр юного зрителя",
    director: "Тимур Шарафутдинов",
    role: "Композитор и саунд-дизайнер",
    link: "https://example.com/puteshestviye-k-chernoy-rechke",
    category: "theatre"
  },
  {
    id: "spektakl-k-yubileyu-valentivy-ermakovoy",
    year: "2024",
    title: "Спектакль к юбилею Валентины Ермаковой",
    theater: "Саратовский театр драмы им. И. А. Слонова",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "immersive-panasonic",
    year: "2025",
    title: "Immersive Panasonic (Neo Silk Way)",
    theater: "Самарканд (конвенция Panasonic)",
    director: "Ярослав Максименко",
    role: "Композитор, саунд-дизайнер, аудиопрограммист",
    link: "https://example.com/immersive-panasonic",
    category: "theatre"
  },
  {
    id: "lyublyu-ne-mogu",
    year: "2025",
    title: "Люблю. Не могу",
    theater: "Центр культуры и досуга, Гурьевск (Калининградская обл.)",
    director: "Зара Демидова",
    role: "Саунд-дизайнер",
    link: "https://example.com/lyublyu-ne-mogu",
    category: "theatre"
  },
  {
    id: "noch-pered-rozhdestvom",
    year: "2025",
    title: "Ночь перед Рождеством",
    theater: "Петропавловск-Камчатский драмтеатр",
    director: "Иван Комаров",
    role: "Композитор",
    category: "theatre"
  },
  {
    id: "petrovy-v-grippe",
    year: "2025",
    title: "Петровы в гриппе и вокруг него",
    theater: "Саратовский театр драмы им. И. А. Слонова",
    director: "Иван Комаров",
    role: "Композитор",
    link: "https://example.com/petrovy-v-grippe",
    category: "theatre"
  },
  {
    id: "romeo-i-dzhuletta",
    year: "2025",
    title: "Ромео и Джульетта",
    theater: "Омский ТЮЗ",
    director: "Иван Комаров",
    role: "Композитор и саунд-дизайнер",
    category: "theatre"
  },
  {
    id: "spektakl-k-100-letiyu-shkoly",
    year: "2025",
    title: "Спектакль к 100-летию Школы-студии МХАТ",
    theater: "МХТ им. А. П. Чехова (Москва)",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    category: "theatre"
  }
];