import { useState } from "react";
import { motion } from "framer-motion";
import { allProjects } from "@/data/allProjects";
import SEOHead from "@/components/SEOHead";
import { ExternalLink } from "lucide-react";

const categories = {
  all: "Все",
  theatre: "Театр", 
  film: "Кино",
  audio: "Аудиоспектакли"
} as const;

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const filteredProjects = allProjects.filter(project => {
    const categoryMatch = selectedCategory === "all" || project.category === selectedCategory;
    const yearMatch = selectedYear === "all" || project.year === selectedYear;
    return categoryMatch && yearMatch;
  });

  const years = Array.from(new Set(allProjects.map(p => p.year))).sort((a, b) => parseInt(b) - parseInt(a));

  const groupedProjects = filteredProjects.reduce((acc, project) => {
    const year = project.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(project);
    return acc;
  }, {} as Record<string, typeof allProjects>);

  const sortedYears = Object.keys(groupedProjects).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <>
      <SEOHead 
        title="Все проекты - Ян Кузьмичёв"
        description="Полный список театральных работ, кинопроектов и аудиоспектаклей Яна Кузьмичёва с 2012 года. Композитор, саунд-дизайнер, звукорежиссёр."
      />
      
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-4">
              Все проекты
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Полная хронология работ с 2012 года — {allProjects.length} проектов в театре, кино и аудиоискусстве
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col lg:flex-row gap-6 mb-12"
          >
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-400 font-medium mr-2 self-center">Категория:</span>
              {Object.entries(categories).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as keyof typeof categories)}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 font-medium ${
                    selectedCategory === key
                      ? "bg-primary text-black"
                      : "glass-effect text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  data-testid={`button-category-${key}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Year Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-400 font-medium mr-2 self-center">Год:</span>
              <button
                onClick={() => setSelectedYear("all")}
                className={`px-4 py-2 rounded-full transition-colors duration-200 font-medium ${
                  selectedYear === "all"
                    ? "bg-primary text-black"
                    : "glass-effect text-gray-300 hover:text-white hover:bg-white/10"
                }`}
                data-testid="button-year-all"
              >
                Все
              </button>
              {years.slice(0, 6).map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 font-medium ${
                    selectedYear === year
                      ? "bg-primary text-black"
                      : "glass-effect text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                  data-testid={`button-year-${year}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Projects List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-12"
          >
            {sortedYears.map((year, yearIndex) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: yearIndex * 0.1 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-cinzel font-bold text-white border-b border-primary pb-2">
                  {year}
                </h2>
                
                <div className="grid gap-6">
                  {groupedProjects[year].map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="glass-effect rounded-lg p-6 hover:bg-white/5 transition-colors duration-200"
                      data-testid={`project-card-${project.id}`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-grow space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            {project.link ? (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xl md:text-2xl font-bold text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-2 group"
                                data-testid={`link-project-${project.id}`}
                              >
                                {project.title}
                                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                              </a>
                            ) : (
                              <h3 className="text-xl md:text-2xl font-bold text-white" data-testid={`text-project-title-${project.id}`}>
                                {project.title}
                              </h3>
                            )}
                            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/20 text-primary rounded-full whitespace-nowrap">
                              {categories[project.category]}
                            </span>
                          </div>
                          
                          <div className="text-gray-300 space-y-1">
                            <p className="font-medium">{project.theater}</p>
                            <p className="text-sm text-gray-400">
                              <span className="font-medium">Режиссёр:</span> {project.director}
                            </p>
                            <p className="text-sm text-gray-400">
                              <span className="font-medium">Роль:</span> {project.role}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-2xl font-bold text-primary">
                            {project.year}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <p className="text-xl text-gray-400">
                Проекты по выбранным критериям не найдены
              </p>
            </motion.div>
          )}

          {/* Stats */}
          {selectedCategory === "all" && selectedYear === "all" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 pt-12 border-t border-border"
            >
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {allProjects.filter(p => p.category === 'theatre').length}
                  </div>
                  <div className="text-gray-300">Театральных проектов</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {years.length}
                  </div>
                  <div className="text-gray-300">Лет работы</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {allProjects.filter(p => p.link).length}
                  </div>
                  <div className="text-gray-300">Проектов со ссылками</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}