import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import backgroundImage from "@assets/mainworksbg_1756420572164.webp";

// Основные работы с главной страницы
const mainWorks = [
  // Театр
  {
    id: "idiot-saratov-drama",
    title: "Идиот",
    year: "2024",
    category: "Театр",
    description: "Нуар/дарк-джаз + полевые записи. Многослойная партитура.",
  },
  {
    id: "mayakovsky-moscow-estrada", 
    title: "Маяковский. Я сам",
    year: "2024",
    category: "Театр",
    description: "6 композиций, трёхуровневая звуковая концепция.",
  },
  {
    id: "petrovy-saratov-drama",
    title: "Петровы в гриппе и вокруг него", 
    year: "2025",
    category: "Театр",
    description: "Кроссовер/нео-джаз + сюрреалистические эффекты.",
  },
  // Кино
  {
    id: "homo-homini-short",
    title: "Homo Homini",
    year: "2025",
    category: "Кино", 
    description: "13 композиций + полный пост.",
  },
  {
    id: "ma-short-film",
    title: "Ма",
    year: "2023",
    category: "Кино",
    description: "Сведение, шумы, амбиенты.",
  },
  {
    id: "life-in-art-short",
    title: "Жизнь в искусстве",
    year: "2019",
    category: "Кино",
    description: "Полная переозвучка шумов и амбиентов.",
  },
  // Аудиоспектакли
  {
    id: "son-o-hlebe-zotov",
    title: "Сон о Хлебе",
    year: "2024",
    category: "Аудиоспектакли",
    description: "Оригинальная музыка, пространственный звук.",
  },
  {
    id: "pogruzhenie-promenad",
    title: "Погружение. Променад",
    year: "2023",
    category: "Аудиоспектакли",
    description: "Иммерсивный аудиоспектакль с бинауральным звуком.",
  }
];

export default function MainWorks() {
  const groupedWorks = mainWorks.reduce((acc, work) => {
    if (!acc[work.category]) {
      acc[work.category] = [];
    }
    acc[work.category].push(work);
    return acc;
  }, {} as Record<string, typeof mainWorks>);

  return (
    <>
      <SEOHead 
        title="Основные работы — Ян Кузьмичёв"
        description="Избранные проекты Яна Кузьмичёва из разных направлений: театр, кино и аудиоспектакли."
      />
      
      <section 
        className="py-20 px-6 min-h-screen relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70 pointer-events-none" />
        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-primary transition-colors duration-200"
              data-testid="link-back-home"
            >
              <ArrowLeft className="w-5 h-5" />
              Вернуться на главную
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-russo font-bold text-white mb-4">
              Основные работы
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Избранные проекты из разных направлений моей деятельности
            </p>
          </motion.div>

          {/* Works by Category */}
          <div className="space-y-12">
            {Object.entries(groupedWorks).map(([category, works], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-russo font-bold text-primary border-b border-primary pb-2">
                  {category}
                </h2>
                
                <div className="grid gap-4">
                  {works.map((work, index) => (
                    <motion.div
                      key={work.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="glass-effect rounded-lg p-6 hover:bg-white/5 transition-colors duration-200"
                      data-testid={`work-card-${work.id}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-2">
                          <Link
                            href={`/project/${work.id}`}
                            className="text-xl font-bold text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-2 group w-fit"
                            data-testid={`link-work-${work.id}`}
                          >
                            {work.title}
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                          </Link>
                          <p className="text-gray-300 text-sm">
                            {work.description}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-xl font-bold text-primary">
                            {work.year}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}