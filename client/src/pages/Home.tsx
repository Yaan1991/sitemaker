import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import SEOHead from "@/components/SEOHead";
import CollapsibleProjectSection from "@/components/CollapsibleProjectSection";

// Project categories data
const projectCategories = [
  {
    title: "Театр",
    icon: "🎭",
    projects: [
      {
        id: "idiot-saratov-drama",
        title: "Идиот",
        year: "2024",
        description: "Уникальное сочетание театра и кино: нуар-джаз + полевые записи + ИИ-технологии.",
        image: "/images/idiot_main.webp"
      },
      {
        id: "mayakovsky-moscow-estrada", 
        title: "Маяковский. Я сам",
        year: "2024",
        description: "6 композиций, трёхуровневая звуковая концепция.",
        image: "/images/mayakovsky_main.webp"
      },
      {
        id: "petrovy-saratov-drama",
        title: "Петровы в гриппе и вокруг него", 
        year: "2025",
        description: "Кроссовер/нео-джаз + сюрреалистические эффекты.",
        image: "/images/petrovy_main.webp"
      }
    ]
  },
  {
    title: "Кино",
    icon: "🎬",
    projects: [
      {
        id: "homo-homini-short",
        title: "Homo Homini",
        year: "2025", 
        description: "13 композиций + полный пост.",
        image: "/images/homohomini_main.webp"
      },
      {
        id: "ma-short-film",
        title: "Ма",
        year: "2023",
        description: "Сведение, шумы, амбиенты.",
        image: "/images/ma_film_main.webp"
      },
      {
        id: "life-in-art-short",
        title: "Жизнь в искусстве",
        year: "2019",
        description: "Полная переозвучка шумов и амбиентов.",
        image: "/images/life_in_art_main.webp"
      }
    ]
  },
  {
    title: "Аудиоспектакли",
    icon: "🎧",
    projects: [
      {
        id: "son-o-hlebe-zotov",
        title: "Сон о Хлебе",
        year: "2024",
        description: "Оригинальная музыка, пространственный звук.",
        image: "/images/son_o_hlebe_main.webp"
      },
      {
        id: "pogruzhenie-promenad",
        title: "Погружение. Променад",
        year: "2023",
        description: "Иммерсивный аудиоспектакль с бинауральным звуком.",
        image: "/images/pogruzhenie_main.webp"
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
        <CollapsibleProjectSection categories={projectCategories} />
        
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
