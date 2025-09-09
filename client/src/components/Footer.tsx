import { Mail, Phone } from "lucide-react";
import { useLocation } from "wouter";
import telegram from "@assets/telegram.png";
import email from "@assets/email.png";
import bandlink from "@assets/bandlink.png";
const telegramIcon = "/icons/icon_telegram.png";
const emailIcon = "/icons/icon_email.png";
const phoneIcon = "/icons/icon_phone.png";
const bandlinkIcon = "/icons/icon_bandlink.png";

export default function Footer() {
  const [location] = useLocation();
  const isPetrovyProject = location === "/project/petrovy-saratov-drama";
  
  return (
    <footer 
      className="py-12 px-6 border-t border-border"
      style={isPetrovyProject ? {
        position: 'relative',
        zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(2px)'
      } : {}}
    >
      <div className="container mx-auto text-center">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Ян Кузьмичёв</h3>
          <p className="text-muted-foreground">Композитор • Саунд‑дизайнер • Звукорежиссёр</p>
        </div>

        <div className="flex justify-center space-x-6 mb-6">
          <a
            href="mailto:kuzmichevyan@gmail.com"
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
            data-testid="link-footer-email"
          >
            <img src={email} alt="Email" className="w-6 h-6 invert" />
          </a>
          <a
            href="https://t.me/iankzmcv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
            data-testid="link-footer-telegram"
          >
            <img src={telegram} alt="Telegram" className="w-6 h-6 invert" />
          </a>
          <a
            href="https://band.link/zDZyK"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
            data-testid="link-footer-bandlink"
          >
            <img src={bandlink} alt="Bandlink" className="w-6 h-6 invert" />
          </a>

        </div>

        <p className="text-muted-foreground text-sm">
          © 2025 Ян Кузьмичёв. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
