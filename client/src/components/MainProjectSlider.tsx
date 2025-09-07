import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  year: string;
  description: string;
  image: string;
}

interface ProjectCategory {
  title: string;
  icon: string;
  projects: Project[];
}

const projectCategories: ProjectCategory[] = [
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

function ProjectCard({ 
  category, 
  currentIndex, 
  onNext, 
  onPrev, 
  onGoTo 
}: { 
  category: ProjectCategory, 
  currentIndex: number,
  onNext: () => void,
  onPrev: () => void,
  onGoTo: (index: number) => void
}) {
  const currentProject = category.projects[currentIndex];
  
  return (
    <motion.div 
      className="glass-effect rounded-xl overflow-hidden h-[280px] sm:h-[320px] md:h-[400px] relative group w-full max-w-6xl mx-auto"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={currentProject.image}
            alt={currentProject.title}
            className="w-full h-full object-contain"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20 sm:bg-gradient-to-r sm:from-black sm:via-black/70 sm:to-transparent" />
      </div>

      {/* Navigation arrows - positioned relative to the entire card */}
      {category.projects.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            data-testid="button-prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            data-testid="button-next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-12 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
          <span className="text-2xl sm:text-3xl md:text-4xl">{category.icon}</span>
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-russo font-bold text-white">{category.title}</h3>
        </div>

        {/* Content */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6 flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="space-y-2 sm:space-y-3 md:space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline gap-2 sm:gap-3 md:gap-4">
                <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-russo font-bold text-white leading-tight">
                  {currentProject.title}
                </h4>
                <span className="text-primary font-medium text-sm sm:text-base md:text-lg lg:text-xl">
                  {currentProject.year}
                </span>
              </div>
              
              <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-xl">
                {currentProject.description}
              </p>
              
              <Link
                href={`/project/${currentProject.id}`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 font-semibold text-sm sm:text-base md:text-lg group-hover:translate-x-1 transition-transform"
                data-testid={`link-project-${currentProject.id}`}
              >
                Подробнее →
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Clickable indicators */}
        <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 md:mt-8">
          {category.projects.map((_, index) => (
            <button
              key={index}
              onClick={() => onGoTo(index)}
              className={`h-1 sm:h-1.5 w-8 sm:w-10 md:w-12 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer ${
                index === currentIndex 
                  ? 'bg-primary' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              data-testid={`indicator-${index}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function MainProjectSlider() {
  const [currentIndices, setCurrentIndices] = useState([0, 0, 0]);
  const [userInteracted, setUserInteracted] = useState([false, false, false]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const resetAutoSlide = (categoryIndex: number) => {
    // Clear existing timeout for this category
    if (timeoutsRef.current[categoryIndex]) {
      clearTimeout(timeoutsRef.current[categoryIndex]);
    }
    
    // Set user interaction flag
    setUserInteracted(prev => {
      const newState = [...prev];
      newState[categoryIndex] = true;
      return newState;
    });
    
    // Resume auto-slide after 10 seconds of inactivity
    timeoutsRef.current[categoryIndex] = setTimeout(() => {
      setUserInteracted(prev => {
        const newState = [...prev];
        newState[categoryIndex] = false;
        return newState;
      });
    }, 10000);
  };

  const handleNext = (categoryIndex: number) => {
    resetAutoSlide(categoryIndex);
    setCurrentIndices(prev => {
      const newIndices = [...prev];
      const maxIndex = projectCategories[categoryIndex].projects.length - 1;
      newIndices[categoryIndex] = newIndices[categoryIndex] >= maxIndex ? 0 : newIndices[categoryIndex] + 1;
      return newIndices;
    });
  };

  const handlePrev = (categoryIndex: number) => {
    resetAutoSlide(categoryIndex);
    setCurrentIndices(prev => {
      const newIndices = [...prev];
      const maxIndex = projectCategories[categoryIndex].projects.length - 1;
      newIndices[categoryIndex] = newIndices[categoryIndex] <= 0 ? maxIndex : newIndices[categoryIndex] - 1;
      return newIndices;
    });
  };

  const handleGoTo = (categoryIndex: number, projectIndex: number) => {
    resetAutoSlide(categoryIndex);
    setCurrentIndices(prev => {
      const newIndices = [...prev];
      newIndices[categoryIndex] = projectIndex;
      return newIndices;
    });
  };

  useEffect(() => {
    // Create separate intervals for each category with different delays
    intervalsRef.current = [];
    
    projectCategories.forEach((_, categoryIndex) => {
      const startDelay = categoryIndex * 1000; // 0ms, 1000ms, 2000ms delays
      
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setCurrentIndices(prev => {
            const newIndices = [...prev];
            // Only auto-advance if user hasn't interacted recently
            if (!userInteracted[categoryIndex]) {
              const maxIndex = projectCategories[categoryIndex].projects.length - 1;
              newIndices[categoryIndex] = newIndices[categoryIndex] >= maxIndex ? 0 : newIndices[categoryIndex] + 1;
            }
            return newIndices;
          });
        }, 5000); // 5 seconds
        
        intervalsRef.current.push(interval);
      }, startDelay);
      
      intervalsRef.current.push(timeout);
    });

    return () => {
      intervalsRef.current.forEach(interval => clearInterval(interval));
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, [userInteracted]);

  return (
    <section id="main-projects" className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-russo font-bold text-white mb-4">
            Основные работы
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Избранные проекты из разных направлений моей деятельности
          </p>
        </motion.div>

        <div className="space-y-8">
          {projectCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
            >
              <ProjectCard 
                category={category} 
                currentIndex={currentIndices[categoryIndex]}
                onNext={() => handleNext(categoryIndex)}
                onPrev={() => handlePrev(categoryIndex)}
                onGoTo={(projectIndex) => handleGoTo(categoryIndex, projectIndex)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/projects"
            className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white transition-all duration-300 animate-pulse-neon"
            data-testid="link-all-projects"
          >
            Все работы
          </Link>
        </motion.div>
      </div>
    </section>
  );
}