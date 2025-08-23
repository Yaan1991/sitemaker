import { motion } from "framer-motion";
import { useRoute, Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { getProjectById } from "@/data/projects";
import NotFound from "./not-found";

export default function ProjectDetail() {
  const [, params] = useRoute("/project/:id");
  const project = params?.id ? getProjectById(params.id) : undefined;

  if (!project) {
    return <NotFound />;
  }

  return (
    <>
      <SEOHead
        title={`${project.title} — Ян Кузьмичёв`}
        description={project.fullDescription}
        url={`https://yankuzmichev.ru/project/${project.id}`}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "name": project.title,
          "description": project.fullDescription,
          "creator": {
            "@type": "Person",
            "name": "Ян Кузьмичёв"
          },
          "dateCreated": project.year,
          "genre": project.category,
          "image": project.image
        }}
      />

      <section className="py-20 px-6 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href={`/projects/${project.category}`}
              className="inline-flex items-center text-primary hover:text-white transition-colors duration-300"
              data-testid="link-back-to-projects"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к проектам
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Project Image */}
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
            />

            {/* Project Info */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                <p className="text-xl text-muted-foreground mb-6">{project.year}</p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {project.fullDescription}
                </p>

                {/* Links */}
                {project.links && project.links.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Ссылки</h3>
                    {project.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center text-primary hover:text-white transition-colors duration-300 mr-6"
                        data-testid={`link-project-external-${index}`}
                      >
                        {link.label}
                        {link.external && <ExternalLink className="w-4 h-4 ml-1" />}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Details Sidebar */}
              <div className="glass-effect rounded-xl p-6 border border-border h-fit">
                <h3 className="text-lg font-semibold mb-4">Детали проекта</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground">Роль</h4>
                    <p className="text-muted-foreground">{project.role.join(", ")}</p>
                  </div>

                  {project.venue && (
                    <div>
                      <h4 className="font-medium text-foreground">Место</h4>
                      <p className="text-muted-foreground">{project.venue}</p>
                    </div>
                  )}

                  {project.details?.director && (
                    <div>
                      <h4 className="font-medium text-foreground">Режиссёр</h4>
                      <p className="text-muted-foreground">{project.details.director}</p>
                    </div>
                  )}

                  {project.details?.genre && (
                    <div>
                      <h4 className="font-medium text-foreground">Жанр</h4>
                      <p className="text-muted-foreground">{project.details.genre}</p>
                    </div>
                  )}

                  {project.details?.duration && (
                    <div>
                      <h4 className="font-medium text-foreground">Длительность</h4>
                      <p className="text-muted-foreground">{project.details.duration}</p>
                    </div>
                  )}

                  {project.details?.cast && project.details.cast.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground">В ролях</h4>
                      <p className="text-muted-foreground">{project.details.cast.join(", ")}</p>
                    </div>
                  )}

                  {project.details?.technical && project.details.technical.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground">Технологии</h4>
                      <p className="text-muted-foreground">{project.details.technical.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
