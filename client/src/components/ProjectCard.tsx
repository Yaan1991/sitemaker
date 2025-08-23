import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface ProjectCardProps {
  id: string;
  title: string;
  year: string;
  description: string;
  image: string;
  category: string;
  links?: Array<{
    label: string;
    url: string;
    external?: boolean;
  }>;
}

export default function ProjectCard({
  id,
  title,
  year,
  description,
  image,
  category,
  links = [],
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="project-card glass-effect rounded-xl overflow-hidden border border-border"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-64 md:h-96 object-cover"
      />
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{year}</p>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/project/${id}`}
            className="text-primary hover:text-white transition-colors duration-300 inline-flex items-center"
            data-testid={`link-project-${id}`}
          >
            Подробнее
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-muted-foreground hover:text-white transition-colors duration-300"
              data-testid={`link-external-${index}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
