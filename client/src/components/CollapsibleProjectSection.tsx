import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ChevronDown, ChevronUp } from "lucide-react";

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

interface CollapsibleProjectSectionProps {
  categories: ProjectCategory[];
}

export default function CollapsibleProjectSection({ categories }: CollapsibleProjectSectionProps) {
  const [expandedSections, setExpandedSections] = useState<boolean[]>(
    new Array(categories.length).fill(false)
  );

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-russo font-bold text-white mb-4">
            Основные работы
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Избранные проекты из разных направлений моей деятельности
          </p>
        </motion.div>

        <div className="space-y-8">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900/20 backdrop-blur-sm"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleSection(categoryIndex)}
                className="w-full p-6 text-left bg-gray-900/40 hover:bg-gray-900/60 transition-colors duration-300 flex items-center justify-between"
                data-testid={`toggle-section-${categoryIndex}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="text-2xl font-russo font-bold text-white">
                    {category.title}
                  </h3>
                  <span className="text-primary text-lg">
                    {category.projects.length} {category.projects.length === 1 ? 'проект' : 'проекта'}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections[categoryIndex] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                </motion.div>
              </button>

              {/* Projects List */}
              <AnimatePresence>
                {expandedSections[categoryIndex] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 space-y-6">
                      {category.projects.map((project, projectIndex) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: projectIndex * 0.1 }}
                          className="flex flex-col md:flex-row gap-6 group"
                        >
                          {/* Project Image */}
                          <div className="w-full md:w-80 h-48 md:h-56 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          {/* Project Info */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                                <h4 className="text-2xl md:text-3xl font-russo font-bold text-white leading-tight">
                                  {project.title}
                                </h4>
                                <span className="text-primary font-medium text-lg">
                                  {project.year}
                                </span>
                              </div>
                              
                              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                                {project.description}
                              </p>
                            </div>

                            <div className="mt-6">
                              <Link
                                href={`/project/${project.id}`}
                                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 font-semibold text-lg group-hover:translate-x-1 transition-transform"
                                data-testid={`link-project-${project.id}`}
                              >
                                Подробнее →
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
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