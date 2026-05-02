import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { projects } from "@/data/projects";
import { projectTranslationsEn } from "@/i18n/projectsEn";
import { useLanguage } from "@/i18n/useLanguage";

interface BreadcrumbsProps {
  currentProject?: string;
  pageType?: 'about' | 'projects' | 'contact' | 'presskit';
  customTitle?: string;
}

export default function SiteBreadcrumbs({ currentProject, pageType, customTitle }: BreadcrumbsProps) {
  const [, setLocation] = useLocation();
  const { t, prefix, lang } = useLanguage();

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'theatre':
        return { name: t.projectsCatTheatre };
      case 'film': 
        return { name: t.projectsCatFilm };
      case 'audio':
        return { name: t.projectsCatAudio };
      default:
        return { name: t.homeWorksTitle };
    }
  };

  const getPageTitle = () => {
    if (customTitle) return customTitle;
    
    switch (pageType) {
      case 'about':
        return t.aboutTitle;
      case 'projects':
        return t.projectsTitle;
      case 'contact':
        return t.contactTitle;
      default:
        return '';
    }
  };

  const navigateToAnchor = (anchor: string) => {
    setLocation(`${prefix}/`);
    setTimeout(() => {
      window.location.hash = anchor;
    }, 100);
  };

  if (currentProject) {
    const project = projects.find(p => p.id === currentProject);
    if (!project) return null;
    
    const categoryInfo = getCategoryInfo(project.category);
    const projectTitle = lang === 'en'
      ? (projectTranslationsEn[project.id]?.title ?? project.title)
      : project.title;

    return (
      <nav 
        className="flex items-center space-x-2 text-sm text-muted-foreground relative z-50 mb-6"
        aria-label="Breadcrumbs"
        data-testid="breadcrumbs-nav"
      >
        <Link 
          href={`${prefix}/`} 
          className="flex items-center hover:text-foreground transition-colors"
          data-testid="breadcrumb-home"
        >
          <Home className="w-4 h-4 mr-1" />
          {t.navHome}
        </Link>

        <ChevronRight className="w-4 h-4" />

        <button 
          onClick={() => navigateToAnchor("works")}
          className="hover:text-foreground transition-colors cursor-pointer"
          data-testid="breadcrumb-works"
        >
          {t.homeWorksTitle}
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
          {projectTitle}
        </span>
      </nav>
    );
  }

  if (!pageType) return null;

  return (
    <nav 
      className="flex items-center space-x-2 text-sm text-muted-foreground relative z-50 mb-6"
      aria-label="Breadcrumbs"
      data-testid="breadcrumbs-nav"
    >
      <Link 
        href={`${prefix}/`} 
        className="flex items-center hover:text-foreground transition-colors"
        data-testid="breadcrumb-home"
      >
        <Home className="w-4 h-4 mr-1" />
        {t.navHome}
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
