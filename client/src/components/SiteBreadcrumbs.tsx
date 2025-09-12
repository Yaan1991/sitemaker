import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { projects } from "@/data/projects";

interface BreadcrumbsProps {
  currentProject?: string;
}

export default function SiteBreadcrumbs({ currentProject }: BreadcrumbsProps) {
  // Если нет проекта, не показываем хлебные крошки
  if (!currentProject) return null;

  // Находим данные о проекте
  const project = projects.find(p => p.id === currentProject);
  if (!project) return null;

  // Определяем категорию на основе project.category
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'theatre':
        return { name: 'Театр', path: '/#theatre' };
      case 'film': 
        return { name: 'Кино', path: '/#cinema' };
      case 'audio':
        return { name: 'Аудиоспектакли', path: '/#audioplays' };
      default:
        return { name: 'Работы', path: '/#works' };
    }
  };

  const categoryInfo = getCategoryInfo(project.category);

  return (
    <nav 
      className="flex items-center space-x-2 text-sm text-muted-foreground relative z-10 mb-6"
      aria-label="Навигация по сайту"
      data-testid="breadcrumbs-nav"
    >
      {/* Главная */}
      <Link 
        href="/" 
        className="flex items-center hover:text-foreground transition-colors"
        data-testid="breadcrumb-home"
      >
        <Home className="w-4 h-4 mr-1" />
        Главная
      </Link>

      <ChevronRight className="w-4 h-4" />

      {/* Работы */}
      <Link 
        href="/#works" 
        className="hover:text-foreground transition-colors"
        data-testid="breadcrumb-works"
      >
        Работы
      </Link>

      <ChevronRight className="w-4 h-4" />

      {/* Категория */}
      <Link 
        href={categoryInfo.path} 
        className="hover:text-foreground transition-colors"
        data-testid={`breadcrumb-category-${project.category}`}
      >
        {categoryInfo.name}
      </Link>

      <ChevronRight className="w-4 h-4" />

      {/* Текущий проект */}
      <span 
        className="text-foreground font-medium" 
        data-testid="breadcrumb-current-project"
      >
        {project.title}
      </span>
    </nav>
  );
}