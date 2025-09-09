import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import SEOHead from "@/components/SEOHead";
import ProjectSection from "@/components/CollapsibleProjectSection";

// Project categories data
const projectCategories = [
  {
    title: "Театр",
    projects: [
      {
        id: "idiot-saratov-drama",
        title: "Идиот",
        year: "2024",
        description: "Постановка по Достоевскому в Саратове 1999 года, объединяющая живое театральное действие с киносъёмкой.",
        image: "/images/idiot_main.webp",
        director: "Иван Комаров",
        role: "Композитор, саунд-дизайнер: Ян Кузьмичёв",
        theater: "Театр драмы им. Слонова",
        city: "г. Саратов"
      },
      {
        id: "mayakovsky-moscow-estrada", 
        title: "Маяковский. Я сам",
        year: "2024",
        description: "Спектакль-исследование внутреннего механизма саморазрушения поэта через трагический треугольник Маяковский - Лили и Осип Брик.",
        image: "/images/mayakovsky_main.webp",
        director: "Семён Шомин",
        role: "Композитор, саунд-дизайнер: Ян Кузьмичёв",
        theater: "ООО \"Артлайф\"",
        city: "г. Москва"
      },
      {
        id: "petrovy-saratov-drama",
        title: "Петровы в гриппе и вокруг него", 
        year: "2025",
        description: "Театр как комикс, где пространство одновременно рассказывает историю Петровых и размышляет о театре как о пространстве бреда.",
        image: "/images/petrovy_main.webp",
        director: "Иван Комаров",
        role: "Композитор, саунд-дизайнер: Ян Кузьмичёв",
        theater: "Театр драмы им. Слонова", 
        city: "г. Саратов"
      }
    ]
  },
  {
    title: "Кино",
    projects: [
      {
        id: "homo-homini-short",
        title: "Homo Homini",
        year: "2025", 
        description: "13 композиций + полный пост.",
        image: "/images/homohomini_main.webp",
        director: "Иван Комаров",
        role: "Композитор, саунд-дизайнер: Ян Кузьмичёв"
      },
      {
        id: "ma-short-film",
        title: "Ма",
        year: "2023",
        description: "Сведение, шумы, амбиенты.",
        image: "/images/ma_film_main.webp",
        director: "Валентина Бесолова",
        role: "Звукорежиссёр: Ян Кузьмичёв"
      },
      {
        id: "life-in-art-short",
        title: "Жизнь в искусстве",
        year: "2019",
        description: "Полная переозвучка шумов и амбиентов.",
        image: "/images/life_in_art_main.webp",
        director: "Степан Азарян",
        role: "Звукорежиссёр: Ян Кузьмичёв"
      }
    ]
  },
  {
    title: "Аудиоспектакли",
    projects: [
      {
        id: "son-o-hlebe-zotov",
        title: "Сон о Хлебе",
        year: "2024",
        description: "Оригинальная музыка, пространственный звук.",
        image: "/images/son_o_hlebe_main.webp",
        director: "Тимур Шарафутдинов",
        role: "Композитор, саунд-дизайнер: Ян Кузьмичёв",
        theater: "Центр Зотова",
        city: "г. Москва"
      },
      {
        id: "pogruzhenie-promenad",
        title: "Погружение. Променад",
        year: "2023",
        description: "Иммерсивный аудиоспектакль с бинауральным звуком.",
        image: "/images/pogruzhenie_main.webp",
        director: "Иван Комаров",
        role: "Композитор, саунд-дизайнер: Ян Кузьмичёв",
        theater: "Центр театрального мастерства",
        city: "г. Нижний Новгород"
      }
    ]
  }
];

export default function Home() {
  return (
    <>
      <SEOHead />
      <div className="min-h-screen">
        <Hero />
        
        {/* Main Projects Section */}
        <ProjectSection categories={projectCategories} />
        
        {/* About Section - после основных работ */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-4xl font-russo font-bold text-white mb-8">
                Композитор • Саунд‑дизайнер • Звукорежиссёр
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">Я соединяю музыку, звук и технологии, чтобы создавать проекты, которые работают безупречно — от идеи до воплощения и автоматизации.</p>
              <p className="text-lg text-gray-400 leading-relaxed">Работаю в широком спектре жанров — от нуар-джаза и нео-классики до экспериментальных эмбиентов и пост-рока.Помимо театральных и кинопроектов, создаю джинглы и саунд-дизайн для брендов, разрабатываю аудиопрограммы и автоматизацию в QLab, совмещая творчество и технологии.Активно использую нейросети и ИИ-инструменты для генерации, анализа и обработки звука, расширяя границы традиционного саунд-дизайна.</p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
