export interface AllProject {
  id: string;
  year: string;
  title: string;
  theater: string;
  director: string;
  role: string;
  link?: string;
  category: 'theatre' | 'film' | 'audio' | 'immersive' | 'exhibition';
  type: string;
  press?: string;
}

export const allProjects: AllProject[] = [
  {
    id: "tabakov-radost-mxat",
    year: "2025",
    title: "Олег Табаков. В поисках радости",
    theater: "МХТ им. Чехова",
    director: "Константин Хабенский",
    role: "Саунд-дизайнер, Звукорежиссёр",
    link: "https://mxat.ru/repertuar/show/oleg-tabakov-v-poiskakh-radosti/?ysclid=mhros753v3322502460#about",
    category: "theatre",
    type: "Спектакль",
    press: "https://www.1tv.ru/news/2025-10-27/524448-v_mht_im_a_p_chehova_postavili_dokumentalnyy_spektakl_oleg_tabakov_v_poiskah_radosti?ysclid=mhrpad2r72635593014"
  },
  {
    id: "munhgauzen-dopolnenie",
    year: "2025",
    title: "Мюнхгаузен. Дополнение",
    theater: "Русский драматический театр им. М. Горького (Махачкала)",
    director: "Иван Комаров",
    role: "Композитор, Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "samiy-legkiy-sposob",
    year: "2013",
    title: "(Самый) лёгкий способ бросить курить",
    theater: "Театр на Трубной (Москва)",
    director: "Филипп Лось",
    role: "Звукорежиссёр",
    link: "https://www.youtube.com/watch?v=-7mgu9xKo54",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "spasti-kamer-yunkera",
    year: "2013",
    title: "Спасти камер-юнкера Пушкина",
    theater: "Театр на Трубной (Москва)",
    director: "Валерия Кузнецова",
    role: "Звукорежиссёр",
    category: "theatre",
    type: "Спектакль",
    press: "https://vc.ru/id3122168/1176649-privivka-ot-nelyubvi-k-russkoi-literature-spektakl-spasti-kamer-yunkera-pushkina-teatr-na-trubnoi?ysclid=mevtjnll1n324055674"
  },
  {
    id: "posledniy-aztek",
    year: "2014",
    title: "Последний ацтек",
    theater: "Театр на Трубной (Москва)",
    director: "Иосиф Райхельгауз",
    role: "Звукорежиссёр",
    category: "theatre",
    type: "Спектакль",
    press: "https://interviewmg.ru/6077/?ysclid=mevtfec3y8620157385"
  },
  {
    id: "monologi-gorodov",
    year: "2015",
    title: "Монологи городов",
    theater: "Театр на Трубной (Москва)",
    director: "Иосиф Райхельгауз",
    role: "Звукорежиссёр",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "durochka-i-zek",
    year: "2015",
    title: "Дурочка и зэк",
    theater: "Театр на Трубной (Москва)",
    director: "Виктория Печерникова",
    role: "Звукорежиссёр, Саунд-дизайнер",
    link: "https://neglinka29.ru/repertoire/v-lunnom-siyanii/",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "chasovshchik",
    year: "2015",
    title: "Часовщик",
    theater: "Театр на Трубной (Москва)",
    director: "Иосиф Райхельгауз",
    role: "Звукорежиссёр",
    link: "https://yandex.ru/video/preview/12313443819201618340",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "prank",
    year: "2016",
    title: "Пранк",
    theater: "Театр на Трубной (Москва)",
    director: "Никита Бетехтин",
    role: "Звукорежиссёр, Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль",
    press: "https://ria.ru/20161011/1478924807.html?ysclid=mevtxrjcw2860428303"
  },
  {
    id: "novogodniy-perepoloh",
    year: "2017",
    title: "Новогодний переполох или кто зимой самый главный",
    theater: "МТЦ «Вишнёвый сад» (Москва)",
    director: "Сергей Ковалёв",
    role: "Композитор",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "pechalniy-anekdot",
    year: "2017",
    title: "Печальный анекдот",
    theater: "МТЦ «Вишнёвый сад» (Москва)",
    director: "Александр Вилькин",
    role: "Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "chernaya-korobka",
    year: "2017",
    title: "Чёрная коробка",
    theater: "Центр им. Вс. Мейерхольда (Москва)",
    director: "Никита Бетехтин",
    role: "Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль",
    press: "https://theatre-library.ru/sovremennaya_dramaturgiya/2018-1/9052"
  },
  {
    id: "abyuz",
    year: "2017",
    title: "Абьюз",
    theater: "Центр им. Вс. Мейерхольда (Москва)",
    director: "Иван Комаров",
    role: "Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль",
    press: "https://pluggedin.ru/open/recenziya-na-spektakly-abyyuz-cim-teatralynoe-tok-shou-i-drugie-patologii-semeynoy-ghizni-10629?ysclid=mevuadjrrh353395562"
  },
  {
    id: "solnechnaya-liniya",
    year: "2017",
    title: "Солнечная линия",
    theater: "Центр им. Вс. Мейерхольда (Москва)",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    link: "https://solnechnaya-liniya.tilda.ws/",
    category: "theatre",
    type: "Спектакль",
    press: "https://www.gazetametro.ru/legacy/articles/v-moskve-sostojalas-premera-spektaklja-solnechnaja-linija-19-12-2017?ysclid=mevufvzr2j268307837"
  },
  {
    id: "kodeks-kurilschika",
    year: "2017",
    title: "Кодекс курильщика",
    theater: "Центр театрального мастерства (Нижний Новгород)",
    director: "Иван Комаров",
    role: "Саунд-дизайнер",
    link: "https://ctm-nn.ru/repertuar/kodeks-kurilshchika/",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "leteli-kacheli",
    year: "2018",
    title: "Летели качели",
    theater: "Центр театрального мастерства (Нижний Новгород)",
    director: "Иван Комаров",
    role: "Саунд-дизайнер",
    link: "https://ctm-nn.ru/repertuar/leteli-kacheli/",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "po-chehovu-tri-sestry",
    year: "2018",
    title: "По-Чехову. Три сестры",
    theater: "Театр «Июльансамбль» (Москва)",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль",
    press: "https://posta-magazine.ru/article/three-sisters/"
  },
  {
    id: "baal",
    year: "2018",
    title: "Баал",
    theater: "Театр «Июльансамбль» (Москва)",
    director: "Иван Комаров",
    role: "Композитор и саунд-дизайнер",
    category: "theatre",
    type: "Спектакль",
    press: "https://posta-magazine.ru/article/baal-utopia/"
  },
  {
    id: "solnce-vshodit",
    year: "2018",
    title: "Солнце всходит. Вечер к Горькому",
    theater: "МХТ им. Чехова (Москва)",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    link: "https://mxat.ru/repertuar/show/gorkiy/",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "govorit-moskva",
    year: "2018",
    title: "Говорит Москва",
    theater: "Театр «Угол» (Казань)",
    director: "Иван Комаров",
    role: "Композитор и Саунд-дизайнер",
    link: "https://ugolkazan.ru/govoritmoscow?ysclid=mevuo0cd9d887651965",
    category: "theatre",
    type: "Спектакль",
    press: "https://realnoevremya.ru/articles/126260-recenziya-na-spektakl-govorit-moskva?ysclid=mevup3qcqq871202115"
  },
  {
    id: "dreamworks",
    year: "2018",
    title: "Dreamworks/Álomgyár",
    theater: "Нац. театр (Будапешт)",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    link: "https://nemzetiszinhaz.hu/en/play/alomgyar-dreamworks",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "bratya",
    year: "2018",
    title: "Братья",
    theater: "ГЦСИ Владикавказ",
    director: "Никита Бетехтин",
    role: "Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль",
    press: "https://etokavkaz.ru/molodezh/v-chem-sila-brat-na-kavkaze-postavili-dokumentalnyi-spektakl-o-podrostkakh"
  },
  {
    id: "urod",
    year: "2019",
    title: "Урод",
    theater: "Июльансамбль (Москва)",
    director: "Артём Дубра",
    role: "Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль",
    press: "https://pluggedin.ru/open/recenziya-na-spektakly-urod-iyulyansambly-v-pogone-za-uspehom-15888?ysclid=mevurzzejl856679304"
  },
  {
    id: "more-i-sosny",
    year: "2019",
    title: "Море и сосны",
    theater: "Центр им. Вс. Мейерхольда (Москва)",
    director: "Саша Денисова",
    role: "Звукорежиссёр",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "u-nas-vse-horosho",
    year: "2019",
    title: "У нас всё хорошо",
    theater: "театр «Июльансамбль» и театр Практика (Москва)",
    director: "Иван Комаров",
    role: "Композитор и саунд-дизайнер",
    link: "https://praktikatheatre.ru/posts/unasvsehorosho_1tv?ysclid=mevut3p9lb404207975",
    category: "theatre",
    type: "Спектакль",
    press: "https://snob.ru/entry/185969/?ysclid=mevuut6r4t178465100"
  },
  {
    id: "gorka",
    year: "2019",
    title: "Горка",
    theater: "Пятый театр (Омск)",
    director: "Иван Комаров",
    role: "Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль",
    press: "https://omsk.aif.ru/culture/culture_theatre/rasskaz_o_pedagoge_kotoryy_nenavidit_i_lyubit_svoyu_rabotu?ysclid=mevv5ipero774122565"
  },
  {
    id: "oliver-twist",
    year: "2019",
    title: "Оливер Твист",
    theater: "ТЮЗ (Красноярск)",
    director: "Никита Бетехтин",
    role: "Саунд-дизайнер",
    link: "https://ktyz.ru/play/view/241",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "zhizn-v-iskusstve",
    year: "2019",
    title: "Жизнь в искусстве",
    theater: "",
    director: "Степан Азарян",
    role: "Звукорежиссёр переозвучивания (foley, ambiences), саунд-дизайнер",
    category: "film",
    type: "К/м фильм",
    link: "/project/life-in-art-short"
  },
  {
    id: "illyuzii",
    year: "2020",
    title: "Иллюзии",
    theater: "Современник (Москва)",
    director: "Иван Комаров",
    role: "Композитор и саунд-дизайнер",
    link: "https://sovremennik.ru/plays/illjuzii",
    category: "theatre",
    type: "Спектакль",
    press: "https://snob.ru/entry/203578/?ysclid=mevuvvebok521168691"
  },
  {
    id: "otkrytie-stancii",
    year: "2020",
    title: "Открытие станции",
    theater: "Москва, станция метро «Деловой центр»",
    director: "Саша Денисова",
    role: "Композитор и саунд-дизайнер",
    category: "theatre",
    type: "Перформанс"
  },
  {
    id: "cement",
    year: "2020",
    title: "Цемент",
    theater: "Старый дом (Новосибирск)",
    director: "Никита Бетехтин",
    role: "Саунд-дизайнер",
    link: "https://old-house.ru/vyzov-vremeni-pyl-ili-cement.html?ysclid=mevv79nteq571459160",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "interteiment",
    year: "2020",
    title: "Интертеймент",
    theater: "ОККО Театр (Москва)",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль",
    press: "https://moskvichmag.ru/gorod/pervoj-premeroj-intertejment-novyj-okko-teatr-pretenduet-na-sozdanie-v-rossii-normalnogo-burzhuaznogo-teatra/?ysclid=mevvbpwt7q646047682"
  },
  {
    id: "varya",
    year: "2020",
    title: "Варя",
    theater: "",
    director: "Ника Горбушина",
    role: "Автор композиции «I Need To Go Down», которая стала саундтреком к фильму",
    link: "https://www.kinopoisk.ru/film/1345724/?ysclid=mevwdssumj128259553",
    category: "film",
    type: "К/м фильм"
  },
  {
    id: "vechno-zhivye",
    year: "2021",
    title: "Вечно живые",
    theater: "Современник (Москва)",
    director: "Николай Симонов",
    role: "Саунд-дизайнер",
    link: "https://sovremennik.ru/plays/vechno-zhivye-istoriya-v-litsah",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "kometa-g",
    year: "2021",
    title: "Комета Г",
    theater: "Театр Комедия (Н. Новгород)",
    director: "Иван Комаров",
    role: "Композитор и саунд-дизайнер",
    link: "https://comedy.nnov.ru/spektakl/kometa-g/?ysclid=mevvgdsdyz189047076",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "rok-dnevnik-anny-frank",
    year: "2021",
    title: "Рок-дневник Анны Франк",
    theater: "Театр им. Пушкина (Москва)",
    director: "Семён Серзин",
    role: "Звукорежиссёр",
    link: "https://teatrpushkin.ru/spektakli/detail/rok-dnevnik-anny-frank/",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "pogruzhenie-promenad",
    year: "2021",
    title: "Погружение. Променад",
    theater: "Центр театрального мастерства (Нижний Новгород)",
    director: "Иван Комаров",
    role: "Композитор и саунд-дизайнер",
    link: "/project/pogruzhenie-promenad-telegram",
    category: "immersive",
    type: "Иммерсив/спектакль в наушниках"
  },
  {
    id: "hlebzavod",
    year: "2021",
    title: "Хлебзавод",
    theater: "Красноярский театр юного зрителя (Красноярск)",
    director: "Никита Бетехтин",
    role: "Саунд-дизайнер",
    link: "https://ktyz.ru/play/view/303",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "tancy-na-prazdnike-urozhaya",
    year: "2022",
    title: "Танцы на празднике урожая",
    theater: "Саратовский театр драмы им. Слонова",
    director: "Юлиана Лайкова",
    role: "Композитор",
    link: "https://www.saratovdrama.com/repertoire/tantsy-na-prazdnik-urozhaya/",
    category: "theatre",
    type: "Спектакль",
    press: "https://www.saratov.kp.ru/daily/27451/4655069/?ysclid=mevvjov1os925402180"
  },
  {
    id: "trevozhnyie-lyudi",
    year: "2022",
    title: "Тревожные люди",
    theater: "Театр Мирный",
    director: "Иван Комаров",
    role: "Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "rozovyy-shum",
    year: "2022",
    title: "Розовый шум",
    theater: "ARTиШОК (Алматы)",
    director: "Айганым Рамазан",
    role: "Композитор",
    link: "https://artishock.kz/shum",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "ceh-poetov",
    year: "2022",
    title: "Цехъ поэтов",
    theater: "Няганьский театр юного зрителя (Нягань)",
    director: "Иван Комаров",
    role: "Композитор",
    link: "https://ntyz.ru/spektakl/%D1%86%D0%B5%D1%85-%D0%BF%D0%BE%D1%8D%D1%82%D0%BE%D0%B2/",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "tvoy-otets-zhiv",
    year: "2022",
    title: "Твой отец жив, только об этом не надо говорить",
    theater: "Музей ГУЛАГа (Москва)",
    director: "А. Кострикова, Д. Посаженников",
    role: "Звукорежиссёр",
    link: "https://oteatre.info/opera-v-muzee-gulaga-2022/",
    category: "theatre",
    type: "Опера"
  },
  {
    id: "anna-karenina",
    year: "2023",
    title: "Анна Каренина",
    theater: "Саратовский театр драмы им. Слонова",
    director: "Иван Комаров",
    role: "Композитор",
    link: "https://www.saratovdrama.com/repertoire/anna-karenina/",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "mertvyie-dushi",
    year: "2023",
    title: "Мёртвые души",
    theater: "Саратовский театр драмы им. Слонова",
    director: "Иван Комаров",
    role: "Композитор",
    link: "https://dramtheatre.ru/events/1863/",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "yozhik-v-tumane",
    year: "2023",
    title: "Ёжик в тумане",
    theater: "Керемет (Алматы)",
    director: "Дмитрий Курочкин",
    role: "Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "po-lyubvi",
    year: "2023",
    title: "По любви",
    theater: "ARTиШОК (Алматы)",
    director: "Карина Волкова",
    role: "Композитор и саунд-дизайнер",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "ufo",
    year: "2023",
    title: "UFO",
    theater: "Дом Q (Алматы)",
    director: "Николай Берман",
    role: "Композитор и саунд-дизайнер",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "100-letiye-shkoly",
    year: "2023",
    title: "100-летие Школы-студии МХАТ",
    theater: "МХТ им. Чехова (Москва)",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "vystavka-rossiya",
    year: "2023",
    title: "Международная выставка-форум «Россия» на ВДНХ",
    theater: "Правительство города Москвы",
    director: "",
    role: "Аудио-программист, инженер синхронизации кинозала, звукоинжинер",
    link: "https://vdnh.ru/news/47431/?ysclid=mevwxjn8go214786992",
    category: "exhibition",
    type: "Иммерсивная выставка"
  },
  {
    id: "ma",
    year: "2023",
    title: "Ма",
    theater: "",
    director: "Валентина Бесолова",
    role: "Звукорежиссёр пост-продакшена",
    category: "film",
    type: "К/м фильм",
    link: "/project/ma-short-film"
  },
  {
    id: "idiot",
    year: "2024",
    title: "Идиот",
    theater: "Саратовский театр драмы им. Слонова",
    director: "Иван Комаров",
    role: "Композитор, Саунд-дизайнер, Звукорежиссёр",
    link: "/project/idiot-saratov-drama",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "k-yubileyu-ermakovoy",
    year: "2024",
    title: "К юбилею Валентины Ермаковой",
    theater: "Саратовский театр драмы им. Слонова",
    director: "Виктор Рыжаков",
    role: "Саунд-дизайнер",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "kashtanka",
    year: "2024",
    title: "Каштанка",
    theater: "Няганьский театр юного зрителя (Нягань)",
    director: "Иван Комаров",
    role: "Композитор, ИИ-креативный-продюсер",
    link: "https://ntyz.ru/spektakl/каштанка/?ysclid=mevvxu9wov915079052",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "mayakovsky-ya-sam",
    year: "2024",
    title: "Маяковский. Я сам",
    theater: "Московский театр Эстрады",
    director: "Семён Шомин",
    role: "Композитор, Саунд-дизайнер, ИИ-креативный-продюсер",
    link: "/project/mayakovsky-moscow-estrada",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "dalshe-sami",
    year: "2024",
    title: "Дальше — сами",
    theater: "Современник (Москва)",
    director: "Иван Комаров",
    role: "Композитор и саунд-дизайнер, ИИ-креативный-продюсер",
    link: "https://cyclowiki.org/wiki/Дальше_—_сами",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "a-zori-zdes-tihiye",
    year: "2024",
    title: "А зори здесь тихие",
    theater: "Театральное объединение республики Адыгея (Майкоп)",
    director: "Константин Мишин",
    role: "Композитор и саунд-дизайнер",
    link: "https://to-ra.ru/2024/06/28/а-зори-здесь-тихие/?ysclid=mevvzk8dw832492422",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "puteshestviye-k-chernoy-rechke",
    year: "2024",
    title: "Путешествие к Чёрной речке",
    theater: "Театр юного зрителя (Тверь)",
    director: "Тимур Шарафутдинов",
    role: "Композитор и саунд-дизайнер, ИИ-креативный-продюсер",
    link: "https://tuz-tver.ru/spektakli/pushkin-puteshestvie-k-chjornoj-rechke.html",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "son-o-hlebe",
    year: "2024",
    title: "Сон о хлебе",
    theater: "Центр Зотов (Москва)",
    director: "Тимур Шарафутдинов",
    role: "Композитор, звукорежиссёр постпродакшена, ИИ-креативный-продюсер",
    link: "/project/son-o-hlebe-zotov",
    category: "audio",
    type: "Аудиоспектакль"
  },
  {
    id: "professii-budushchego",
    year: "2024",
    title: "Центр \"Профессии будущего\"",
    theater: "Правительство города Москвы",
    director: "",
    role: "Аудио-программист, инженер синхронизации кинозала, звукоинжинер",
    link: "https://rg.ru/2023/12/26/reg-cfo/sobianin-otkryl-gorodskoj-centr-professii-budushchego.html?ysclid=mevx9dfwip302354195",
    category: "exhibition",
    type: "Иммерсивная выставка"
  },
  {
    id: "skazka-o-skazke",
    year: "2024",
    title: "Сказка о сказке",
    theater: "РАМТ (Москва)",
    director: "Юрий Печенежский",
    role: "Композитор, саунд-дизайнер",
    link: "https://ramt.ru/projects/audiospektakli/slushaem-teatr/",
    category: "audio",
    type: "Аудиоспектакль"
  },
  {
    id: "petrovy-v-grippe",
    year: "2025",
    title: "Петровы в гриппе и вокруг него",
    theater: "Саратовский театр драмы им. Слонова",
    director: "Иван Комаров",
    role: "Композитор, саунд-дизайнер, ИИ-креативный-продюсер",
    link: "/project/petrovy-saratov-drama",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "romeo-i-dzhuletta",
    year: "2025",
    title: "Ромео и Джульетта",
    theater: "Театр юного зрителя (Омск)",
    director: "Иван Комаров",
    role: "Композитор, сонграйтер и саунд-дизайнер, ИИ-креативный-продюсер",
    link: "https://tuzomsk.ru/performances/romeo-i-dzhuletta/?ysclid=mevvoxwfip388238356",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "noch-pered-rozhdestvom",
    year: "2025",
    title: "Ночь перед Рождеством",
    theater: "Камчатский театр драмы и комедии (Петропавловск-Камчатский)",
    director: "Иван Комаров",
    role: "Композитор и саунд-дизайнер",
    link: "https://kam-teatr.ru/performances/18974/?ysclid=mevvqkmvln242575207",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "lyublyu-ne-mogu",
    year: "2025",
    title: "Люблю. Не могу",
    theater: "Гурьевск (Калининградская обл.)",
    director: "Зара Демидова",
    role: "Композитор",
    link: "https://actop.us/performances/lyublyunemogu-insterburg",
    category: "theatre",
    type: "Спектакль"
  },
  {
    id: "neo-silk-way",
    year: "2025",
    title: "Neo Silk Way",
    theater: "Самарканд, Panasonic Convention",
    director: "Ярослав Максименко",
    role: "Композитор, саунд-дизайнер, аудиопрограммист, ИИ-креативный-продюсер",
    category: "immersive",
    type: "Иммерсив/спектакль в наушниках"
  },
  {
    id: "homo-homini",
    year: "2025",
    title: "Homo Homini",
    theater: "",
    director: "Иван Комаров",
    role: "Композитор, саунд-дизайнер, звукорежиссер пост-продакшена, ИИ-креативный-продюсер",
    category: "film",
    type: "К/м фильм",
    link: "/project/homo-homini-short"
  }
];