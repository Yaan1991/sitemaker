import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { useAudio } from "@/contexts/AudioContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { 
    isGlobalAudioEnabled, 
    toggleGlobalAudio,
    currentPlaylist,
    currentTrackIndex,
    nextTrack,
    prevTrack
  } = useAudio();

  const currentTrack = currentPlaylist ? currentPlaylist[currentTrackIndex] : null;
  const hasPlaylist = currentPlaylist && currentPlaylist.length > 1;
  const [needsMarquee, setNeedsMarquee] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  // Проверяем, нужна ли бегущая строка
  useEffect(() => {
    if (titleRef.current && currentTrack?.title) {
      const containerWidth = 120; // фиксированная ширина контейнера
      const textWidth = titleRef.current.scrollWidth;
      setNeedsMarquee(textWidth > containerWidth);
    }
  }, [currentTrack?.title]);

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

          {/* Audio Toggle & Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Audio Toggle */}
            <button
              onClick={toggleGlobalAudio}
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

            {/* Playlist Controls */}
            {hasPlaylist && isGlobalAudioEnabled && (
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg border border-primary/20">
                <button
                  onClick={prevTrack}
                  disabled={currentTrackIndex === 0}
                  className="p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Предыдущий трек"
                >
                  <SkipBack size={16} className="text-primary" />
                </button>
                
                <div className="px-2 text-sm w-[120px]">
                  <div className="text-primary font-medium text-xs">Плеер</div>
                  <div className="track-title-container w-full h-5 relative overflow-hidden">
                    <div 
                      ref={titleRef}
                      className={`text-white whitespace-nowrap absolute ${
                        needsMarquee ? 'track-title-marquee' : ''
                      }`}
                      title={currentTrack?.title}
                    >
                      {currentTrack?.title}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={nextTrack}
                  disabled={currentTrackIndex === currentPlaylist.length - 1}
                  className="p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Следующий трек"
                >
                  <SkipForward size={16} className="text-primary" />
                </button>
              </div>
            )}
            
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

          {/* Mobile Audio Toggle & Menu */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Audio Toggle */}
            <button
              onClick={toggleGlobalAudio}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isGlobalAudioEnabled 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-white'
              }`}
              data-testid="button-mobile-audio-toggle"
            >
              {isGlobalAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Mobile Playlist Controls */}
            {hasPlaylist && isGlobalAudioEnabled && (
              <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded border border-primary/20">
                <button
                  onClick={prevTrack}
                  disabled={currentTrackIndex === 0}
                  className="p-1 rounded disabled:opacity-50"
                >
                  <SkipBack size={14} className="text-primary" />
                </button>
                
                <div className="text-xs text-primary font-medium min-w-[40px] text-center">
                  {currentTrackIndex + 1}/{currentPlaylist.length}
                </div>
                
                <button
                  onClick={nextTrack}
                  disabled={currentTrackIndex === currentPlaylist.length - 1}
                  className="p-1 rounded disabled:opacity-50"
                >
                  <SkipForward size={14} className="text-primary" />
                </button>
              </div>
            )}
            
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
                  href="/main-works"
                  className={`block px-4 py-3 transition-colors duration-200 ${
                    isActive('/main-works')
                      ? "text-primary bg-primary/10"
                      : "text-gray-300 hover:text-primary hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="mobile-link-main-works"
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
