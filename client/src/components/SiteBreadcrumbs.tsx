import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { projects } from "@/data/projects";

interface BreadcrumbsProps {
  currentProject?: string;
  pageType?: 'about' | 'projects' | 'contact';
  customTitle?: string;
}

export default function SiteBreadcrumbs({ currentProject, pageType, customTitle }: BreadcrumbsProps) {
  const [, setLocation] = useLocation();

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

  // Определяем заголовок страницы
  const getPageTitle = () => {
    if (customTitle) return customTitle;
    
    switch (pageType) {
      case 'about':
        return 'Обо мне';
      case 'projects':
        return 'Все проекты';
      case 'contact':
        return 'Контакты';
      default:
        return 'Страница';
    }
  };

  // Функция для навигации с якорем
  const navigateToAnchor = (anchor: string) => {
    // Сначала переходим на главную страницу, затем устанавливаем хеш
    setLocation("/");
    setTimeout(() => {
      window.location.hash = anchor;
    }, 100);
  };

  // Если есть проект, показываем полные хлебные крошки
  if (currentProject) {
    const project = projects.find(p => p.id === currentProject);
    if (!project) return null;
    
    const categoryInfo = getCategoryInfo(project.category);

    return (
      <nav 
        className="flex items-center space-x-2 text-sm text-muted-foreground relative z-50 mb-6"
        aria-label="Навигация по сайту"
        data-testid="breadcrumbs-nav"
      >
        <Link 
          href="/" 
          className="flex items-center hover:text-foreground transition-colors"
          data-testid="breadcrumb-home"
        >
          <Home className="w-4 h-4 mr-1" />
          Главная
        </Link>

        <ChevronRight className="w-4 h-4" />

        <button 
          onClick={() => navigateToAnchor("works")}
          className="hover:text-foreground transition-colors cursor-pointer"
          data-testid="breadcrumb-works"
        >
          Работы
        </button>

        <ChevronRight className="w-4 h-4" />

        <button 
          onClick={() => navigateToAnchor(project.category === 'film' ? 'cinema' : project.category)}
          className="hover:text-foreground transition-colors cursor-pointer"
          data-testid={`breadcrumb-category-${project.category}`}
        >
          {categoryInfo.name}
        </button>

        <ChevronRight className="w-4 h-4" />

        <span 
          className="text-foreground font-medium" 
          data-testid="breadcrumb-current-project"
        >
          {project.title}
        </span>
      </nav>
    );
  }

  // Если нет проекта и типа страницы, не показываем
  if (!pageType) return null;

  // Хлебные крошки для обычных страниц
  return (
    <nav 
      className="flex items-center space-x-2 text-sm text-muted-foreground relative z-50 mb-6"
      aria-label="Навигация по сайту"
      data-testid="breadcrumbs-nav"
    >
      <Link 
        href="/" 
        className="flex items-center hover:text-foreground transition-colors"
        data-testid="breadcrumb-home"
      >
        <Home className="w-4 h-4 mr-1" />
        Главная
      </Link>

      <ChevronRight className="w-4 h-4" />

      <span 
        className="text-foreground font-medium" 
        data-testid={`breadcrumb-current-${pageType}`}
      >
        {getPageTitle()}
      </span>
    </nav>
  );
}