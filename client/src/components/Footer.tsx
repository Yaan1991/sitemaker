import { useLocation } from "wouter";

export default function Footer() {
  const [location] = useLocation();
  const isPetrovyProject = location === "/project/petrovy-saratov-drama";
  const isHomoHominiProject = location === "/project/homo-homini-short";
  const isMaProject = location === "/project/ma-short-film";
  
  return (
    <footer 
      className="py-12 px-6 border-t border-border"
      style={isPetrovyProject ? {
        position: 'relative',
        zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(2px)'
      } : isHomoHominiProject ? {
        position: 'relative',
        zIndex: 15,
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(2px)'
      } : isMaProject ? {
        position: 'relative',
        zIndex: 15,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(2px)'
      } : {}}
    >
      <div className="container mx-auto text-center">
        <div className="flex flex-col items-center gap-6">
          {/* Иконки социальных сетей вверху */}
          <div className="flex gap-4 items-center">
            <a
              href="https://t.me/dj_antifun"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Telegram"
              data-testid="footer-telegram"
            >
              <img src="/icons/icon_telegram.png" alt="Telegram" className="w-6 h-6" />
            </a>
            <a
              href="mailto:kuzmich.music@gmail.com"
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Email"
              data-testid="footer-email"
            >
              <img src="/icons/icon_email.png" alt="Email" className="w-6 h-6" />
            </a>
            <a
              href="tel:+79112694546"
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Телефон"
              data-testid="footer-phone"
            >
              <img src="/icons/icon_phone.png" alt="Телефон" className="w-6 h-6" />
            </a>
            <a
              href="https://band.link/zDZyK"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Bandlink"
              data-testid="footer-bandlink"
            >
              <img src="/icons/icon_bandlink.png" alt="Bandlink" className="w-6 h-6" />
            </a>
          </div>
          
          {/* Текст ниже */}
          <div>
            <h3 className="text-xl font-bold mb-2">Ян Кузьмичёв</h3>
            <p className="text-muted-foreground">Композитор • Саунд‑дизайнер • Звукорежиссёр</p>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mt-6">
          © 2025 Ян Кузьмичёв. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
