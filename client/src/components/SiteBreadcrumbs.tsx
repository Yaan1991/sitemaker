import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { projects } from "@/data/projects";

interface BreadcrumbsProps {
  currentProject?: string;
}

export default function SiteBreadcrumbs({ currentProject }: BreadcrumbsProps) {
  const [, setLocation] = useLocation();
  
  // Если нет проекта, не показываем хлебные крошки
  if (!currentProject) return null;

  // Находим данные о проекте
  const project = projects.find(p => p.id === currentProject);
  if (!project) return null;

  // Определяем категорию на основе project.category
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'theatre':
        return { name: 'Театр' };
      case 'film': 
        return { name: 'Кино' };
      case 'audio':
        return { name: 'Аудиоспектакли' };
      default:
        return { name: 'Работы' };
    }
  };

  const categoryInfo = getCategoryInfo(project.category);

  // Функция для навигации с якорем
  const navigateToAnchor = (anchor: string) => {
    // Сначала переходим на главную страницу, затем устанавливаем хеш
    setLocation("/");
    setTimeout(() => {
      window.location.hash = anchor;
    }, 100);
  };

  return (
    <nav 
      className="flex items-center space-x-2 text-sm text-muted-foreground relative z-50 mb-6"
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
      <button 
        onClick={() => navigateToAnchor("works")}
        className="hover:text-foreground transition-colors cursor-pointer"
        data-testid="breadcrumb-works"
      >
        Работы
      </button>

      <ChevronRight className="w-4 h-4" />

      {/* Категория */}
      <button 
        onClick={() => navigateToAnchor(project.category === 'film' ? 'cinema' : project.category)}
        className="hover:text-foreground transition-colors cursor-pointer"
        data-testid={`breadcrumb-category-${project.category}`}
      >
        {categoryInfo.name}
      </button>

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