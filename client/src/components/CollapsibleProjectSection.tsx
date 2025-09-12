import { motion } from "framer-motion";
import { Link } from "wouter";

interface Project {
  id: string;
  title: string;
  year: string;
  description: string;
  image: string;
  director?: string;
  role: string;
  theater?: string;
  city?: string;
}

interface ProjectCategory {
  title: string;
  projects: Project[];
}

interface ProjectSectionProps {
  categories: ProjectCategory[];
}

export default function ProjectSection({ categories }: ProjectSectionProps) {

  return (
    <section className="pt-0 pb-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          id="works"
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

        <div className="space-y-32">
          {categories.map((category, categoryIndex) => {
            const anchorId = category.title === "Театр" ? "theatre" : 
                           category.title === "Кино" ? "cinema" : "audioplays";
            
            return (
              <motion.div
                key={category.title}
                id={anchorId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                className="space-y-12 relative"
              >
                {/* Визуальный разделитель перед секцией (кроме первой) */}
                {categoryIndex > 0 && (
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
                    <div className="flex items-center">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                      <div className="mx-4">
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                    </div>
                  </div>
                )}
                
                {/* Category Header */}
                <div className="text-center">
                  <h3 className="text-3xl md:text-4xl font-medium text-gray-300 mb-4 tracking-wide uppercase" 
                      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif', letterSpacing: '0.1em' }}>
                    {category.title}
                  </h3>
                  <div className="w-24 h-0.5 bg-gray-600 mx-auto rounded-full"></div>
                </div>

                {/* Projects List */}
                <div className="space-y-12">
                  {category.projects.map((project, projectIndex) => {
                    const isImageLeft = projectIndex % 2 === 0; // четные слева, нечетные справа
                    
                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: categoryIndex * 0.2 + projectIndex * 0.1 }}
                        className={`flex flex-col md:flex-row gap-8 group ${
                          !isImageLeft ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        {/* Project Image */}
                        <div className="w-full md:w-96 h-56 md:h-64 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Project Info */}
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                              <h4 className="text-2xl md:text-3xl font-russo font-bold text-white leading-tight">
                                {project.title}
                              </h4>
                              <span className="text-primary font-medium text-xl">
                                {project.year}
                              </span>
                            </div>
                            
                            {project.director && (
                              <p className="text-gray-400 text-base">
                                <span className="text-gray-500">Режиссёр:</span> {project.director}
                              </p>
                            )}
                            
                            <p className="text-gray-300 text-base font-medium">
                              {project.role}
                            </p>
                            
                            {project.theater && project.city && (
                              <p className="text-gray-400 text-base">
                                {project.theater}, {project.city}
                              </p>
                            )}
                            
                            <p className="text-gray-300 text-lg leading-relaxed">
                              {project.description}
                            </p>
                            
                            <div className="pt-2">
                              <Link
                                href={`/project/${project.id}`}
                                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 font-semibold text-lg group-hover:translate-x-1 transition-transform"
                                data-testid={`link-project-${project.id}`}
                              >
                                Подробнее →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
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