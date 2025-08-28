import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const mainNavigation = [
    { name: "Обо мне", href: "/about" },
    { name: "Контакты", href: "/contact" },
  ];

  const projectsByCategory = {
    theatre: projects.filter(p => p.category === 'theatre'),
    film: projects.filter(p => p.category === 'film'),
    audio: projects.filter(p => p.category === 'audio'),
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
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="block" data-testid="link-home">
            <div className="text-xl font-russo font-bold">
              <div className="text-white">Ян Кузьмичёв</div>
              <div className="text-sm text-muted-foreground font-normal">
                Композитор • Саунд‑дизайнер • Звукорежиссёр
              </div>
            </div>
          </Link>

          {/* Desktop Menu Button */}
          <div className="hidden md:block relative">
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
                      href="/main-works"
                      className={`block px-4 py-3 transition-colors duration-200 ${
                        isActive('/main-works')
                          ? "text-primary bg-primary/10"
                          : "text-gray-300 hover:text-primary hover:bg-white/5"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                      data-testid="link-main-works"
                    >
                      Основные работы
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
                        onClick={() => setIsMenuOpen(false)}
                        data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                      onClick={() => setIsMenuOpen(false)}
                      data-testid="link-projects"
                    >
                      Все проекты
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
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

        {/* Projects Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-95 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="container mx-auto px-6 py-8 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white">Все проекты</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white hover:text-primary transition-colors"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {/* Theatre Projects */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-6 border-b border-primary pb-2">
                      Театр
                    </h3>
                    <div className="space-y-3">
                      {projectsByCategory.theatre.map((project) => (
                        <Link
                          key={project.id}
                          href={`/project/${project.id}`}
                          className="block text-gray-300 hover:text-primary transition-colors duration-200 text-sm uppercase tracking-wide"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {project.title}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Film Projects */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-6 border-b border-primary pb-2">
                      Кино
                    </h3>
                    <div className="space-y-3">
                      {projectsByCategory.film.map((project) => (
                        <Link
                          key={project.id}
                          href={`/project/${project.id}`}
                          className="block text-gray-300 hover:text-primary transition-colors duration-200 text-sm uppercase tracking-wide"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {project.title}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Audio Projects */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-6 border-b border-primary pb-2">
                      Аудиоспектакли
                    </h3>
                    <div className="space-y-3">
                      {projectsByCategory.audio.map((project) => (
                        <Link
                          key={project.id}
                          href={`/project/${project.id}`}
                          className="block text-gray-300 hover:text-primary transition-colors duration-200 text-sm uppercase tracking-wide"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {project.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Navigation */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-6 border-b border-primary pb-2">
                    Навигация
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/main-works"
                      className="block text-gray-300 hover:text-primary transition-colors duration-200 text-sm uppercase tracking-wide"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Основные работы
                    </Link>
                    {mainNavigation.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block text-gray-300 hover:text-primary transition-colors duration-200 text-sm uppercase tracking-wide"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6 border-b border-primary pb-2">
                    Контакты
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors duration-200"
                      >
                        <img src={link.icon} alt={link.name} className="w-6 h-6" />
                        <span className="text-sm">{link.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
