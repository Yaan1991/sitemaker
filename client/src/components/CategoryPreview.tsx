import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface CategoryPreviewProps {
  title: string;
  description: string;
  image: string;
  category: string;
}

export default function CategoryPreview({
  title,
  description,
  image,
  category,
}: CategoryPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="project-card glass-effect rounded-xl p-6 border border-border"
    >
      <div className="mb-4">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <Link
        href={`/projects/${category}`}
        className="inline-flex items-center text-primary hover:text-white transition-colors duration-300"
        data-testid={`link-category-${category}`}
      >
        Смотреть проекты
        <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </motion.div>
  );
}
