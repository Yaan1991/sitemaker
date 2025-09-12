import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Volume2, VolumeX, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { useAudio } from "@/contexts/AudioContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWorksSubmenuOpen, setIsWorksSubmenuOpen] = useState(false);
  const [isMobileWorksOpen, setIsMobileWorksOpen] = useState(false);
  const [location] = useLocation();
  const { 
    isGlobalAudioEnabled, 
    toggleGlobalAudio
  } = useAudio();


  const mainNavigation = [
    { name: "Работы", href: null, hasSubmenu: true },
    { name: "Все проекты", href: "/projects" },
    { name: "Обо мне", href: "/about" },
    { name: "Контакты", href: "/contact" },
  ];

  const projectsByCategory = {
    theatre: projects.filter(p => p.category === 'theatre'),
    film: projects.filter(p => p.category === 'film'),
    audio: projects.filter(p => p.category === 'audio'),
  };

  const categoryLabels = {
    theatre: "ТЕАТР",
    film: "КИНО", 
    audio: "АУДИО"
  };

  const socialLinks = [
    { name: "Bandlink", href: "https://band.link/zDZyK", icon: "/icons/icon_bandlink.png" },
    { name: "Telegram", href: "https://t.me/iankzmcv", icon: "/icons/icon_telegram.png" },
    { name: "Email", href: "mailto:kuzmichevyan@gmail.com", icon: "/icons/icon_email.png" },
    { name: "Телефон", href: "tel:+79197643745", icon: "/icons/icon_phone.png" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 glass-effect border-b border-border" style={{zIndex: 100}}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="block" data-testid="link-home">
            <div className="text-xl md:text-xl font-russo font-bold">
              <div className="text-white">Ян Кузьмичёв</div>
              <div className="text-xs md:text-sm text-muted-foreground font-normal hidden sm:block">
                Композитор • Саунд‑дизайнер • Звукорежиссёр
              </div>
            </div>
          </Link>

          {/* Audio Toggle & Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleGlobalAudio();
              }}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isGlobalAudioEnabled 
                  ? 'text-primary bg-primary/10 hover:bg-primary/20' 
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
              data-testid="button-audio-toggle"
              title={isGlobalAudioEnabled ? 'Выключить звук' : 'Включить звук'}
            >
              {isGlobalAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>


            {/* Menu Button */}
            <button
              className="text-white hover:text-primary focus:outline-none transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-desktop-menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Desktop Menu Dropdown */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-48 glass-effect rounded-lg border border-border shadow-lg overflow-hidden"
                >
                  <div className="py-2">
                    <Link
                      href="/"
                      className={`block px-4 py-3 transition-colors duration-200 ${
                        isActive('/')
                          ? "text-primary bg-primary/10"
                          : "text-gray-300 hover:text-primary hover:bg-white/5"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                      data-testid="link-home"
                    >
                      На главную
                    </Link>
                    {mainNavigation.map((item) => (
                      item.hasSubmenu ? (
                        <div 
                          key={item.name}
                          className="relative"
                          onMouseEnter={() => setIsWorksSubmenuOpen(true)}
                          onMouseLeave={() => setIsWorksSubmenuOpen(false)}
                        >
                          <div
                            className="block px-4 py-3 text-gray-300 hover:text-primary hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                            data-testid={`menu-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {item.name}
                          </div>
                          
                          {/* Side submenu for Works */}
                          <AnimatePresence>
                            {isWorksSubmenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-full top-0 ml-2 w-80 glass-effect rounded-lg border border-border shadow-lg overflow-hidden z-50"
                              >
                                <div className="py-2">
                                  {Object.entries(projectsByCategory).map(([category, categoryProjects]) => (
                                    <div key={category} className="mb-4 last:mb-0">
                                      <div className="px-4 py-2 text-primary font-medium text-sm uppercase tracking-wider border-b border-border/30">
                                        {categoryLabels[category as keyof typeof categoryLabels]}
                                      </div>
                                      {categoryProjects.map((project) => (
                                        <Link
                                          key={project.id}
                                          href={`/project/${project.id}`}
                                          className="block px-4 py-2 text-gray-300 hover:text-primary hover:bg-white/5 transition-colors duration-200"
                                          onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsWorksSubmenuOpen(false);
                                          }}
                                          data-testid={`submenu-project-${project.id}`}
                                        >
                                          <div className="font-medium">{project.title}</div>
                                          <div className="text-xs text-muted-foreground mt-1">{project.year}</div>
                                        </Link>
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href!}
                          className={`block px-4 py-3 transition-colors duration-200 ${
                            isActive(item.href!)
                              ? "text-primary bg-primary/10"
                              : "text-gray-300 hover:text-primary hover:bg-white/5"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                          data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {item.name}
                        </Link>
                      )
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Audio Toggle & Menu */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Audio Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleGlobalAudio();
              }}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isGlobalAudioEnabled 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-white'
              }`}
              data-testid="button-mobile-audio-toggle"
            >
              {isGlobalAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            
            {/* Mobile Works Dropdown */}
            <div className="relative">
              <button
                className={`flex items-center gap-1 focus:outline-none transition-colors duration-300 ${
                  isMobileWorksOpen 
                    ? 'text-primary' 
                    : 'text-white hover:text-primary'
                }`}
                onClick={() => setIsMobileWorksOpen(!isMobileWorksOpen)}
                onBlur={() => {
                  // Небольшая задержка для корректной работы с выпадающим меню
                  setTimeout(() => setIsMobileWorksOpen(false), 150);
                }}
                data-testid="button-mobile-works"
              >
                Работы
                <ChevronDown 
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isMobileWorksOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Mobile Works Dropdown Menu */}
              <AnimatePresence>
                {isMobileWorksOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-72 glass-effect rounded-lg border border-border shadow-lg overflow-hidden z-50"
                  >
                    <div className="py-2 max-h-[70vh] overflow-y-auto">
                      {Object.entries(projectsByCategory).map(([category, categoryProjects]) => (
                        <div key={category} className="mb-3 last:mb-0">
                          <div className="px-4 py-2 text-primary font-medium text-sm uppercase tracking-wider border-b border-border/30">
                            {categoryLabels[category as keyof typeof categoryLabels]}
                          </div>
                          {categoryProjects.map((project) => (
                            <Link
                              key={project.id}
                              href={`/project/${project.id}`}
                              className="block px-4 py-2 text-gray-300 hover:text-primary hover:bg-white/5 transition-colors duration-200"
                              onClick={() => setIsMobileWorksOpen(false)}
                              data-testid={`link-mobile-works-${project.id}`}
                            >
                              <div className="font-medium text-sm">{project.title}</div>
                              <div className="text-xs text-muted-foreground mt-1">{project.year}</div>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-48 glass-effect rounded-lg border border-border shadow-lg overflow-hidden md:hidden"
            >
              <div className="py-2">
                <Link
                  href="/"
                  className={`block px-4 py-3 transition-colors duration-200 ${
                    isActive('/')
                      ? "text-primary bg-primary/10"
                      : "text-gray-300 hover:text-primary hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="mobile-link-home"
                >
                  На главную
                </Link>
                {mainNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 transition-colors duration-200 ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-gray-300 hover:text-primary hover:bg-white/5"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid={`mobile-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/projects"
                  className={`block px-4 py-3 transition-colors duration-200 ${
                    isActive('/projects')
                      ? "text-primary bg-primary/10"
                      : "text-gray-300 hover:text-primary hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="mobile-link-projects"
                >
                  Все проекты
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
