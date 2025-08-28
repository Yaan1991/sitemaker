import { motion } from "framer-motion";
import { useRoute } from "wouter";
import { projects } from "@/data/projects";
import SEOHead from "@/components/SEOHead";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ProjectPage() {
  const [, params] = useRoute("/project/:id");
  const projectId = params?.id;
  
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Проект не найден</h1>
          <Link 
            href="/" 
            className="text-primary hover:text-primary/80 transition-colors duration-200"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const categoryNames = {
    theatre: "Театр",
    film: "Кино", 
    audio: "Аудиоспектакли"
  };

  return (
    <>
      <SEOHead 
        title={`${project.title} — ${project.year} | Ян Кузьмичёв`}
        description={project.fullDescription}
      />
      
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-primary transition-colors duration-200"
              data-testid="link-back"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Project Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-auto rounded-lg shadow-2xl"
                data-testid="img-project"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              
              {/* Header */}
              <div>
                <div className="text-sm text-primary font-medium tracking-wide uppercase mb-2">
                  {categoryNames[project.category]} • {project.year}
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-title">
                  {project.title}
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {project.fullDescription}
                </p>
              </div>

              {/* Roles */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Роль в проекте</h3>
                <div className="flex flex-wrap gap-2">
                  {project.role.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Venue */}
              {project.venue && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Место проведения</h3>
                  <p className="text-gray-300">{project.venue}</p>
                </div>
              )}

              {/* Details */}
              {project.details && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Детали проекта</h3>
                  
                  {project.details.director && (
                    <div>
                      <span className="text-sm text-gray-400">Режиссёр:</span>
                      <span className="text-gray-300 ml-2">{project.details.director}</span>
                    </div>
                  )}
                  
                  {project.details.genre && (
                    <div>
                      <span className="text-sm text-gray-400">Жанр:</span>
                      <span className="text-gray-300 ml-2">{project.details.genre}</span>
                    </div>
                  )}
                  
                  {project.details.duration && (
                    <div>
                      <span className="text-sm text-gray-400">Продолжительность:</span>
                      <span className="text-gray-300 ml-2">{project.details.duration}</span>
                    </div>
                  )}

                  {project.details.technical && project.details.technical.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-400 block mb-2">Технические решения:</span>
                      <div className="flex flex-wrap gap-2">
                        {project.details.technical.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-800 text-gray-300 text-sm rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.details.cast && project.details.cast.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-400">В ролях:</span>
                      <span className="text-gray-300 ml-2">{project.details.cast.join(", ")}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Awards */}
              {project.awards && project.awards.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Награды</h3>
                  <ul className="space-y-2">
                    {project.awards.map((award, index) => (
                      <li key={index} className="text-gray-300">
                        • {award}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Links */}
              {project.links && project.links.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Ссылки</h3>
                  <div className="space-y-2">
                    {project.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target={link.external ? "_blank" : "_self"}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200"
                        data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {link.label}
                        {link.external && <ExternalLink className="w-4 h-4" />}
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}