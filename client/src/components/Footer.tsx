import { Mail, Phone, Sliders } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import telegram from "@assets/telegram.png";
import email from "@assets/email.png";
import bandlink from "@assets/bandlink.png";
const telegramIcon = "/icons/icon_telegram.png";
const emailIcon = "/icons/icon_email.png";
const phoneIcon = "/icons/icon_phone.png";
const bandlinkIcon = "/icons/icon_bandlink.png";

export default function Footer() {
  const { setIsMixerOpen } = useAudio();
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="container mx-auto text-center">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Ян Кузьмичёв</h3>
          <p className="text-muted-foreground">Композитор • Саунд‑дизайнер • Звукорежиссёр</p>
        </div>

        <div className="flex justify-center items-center space-x-6 mb-6">
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

          {/* Кнопка микшера */}
          <button
            onClick={() => setIsMixerOpen(true)}
            className="group flex items-center space-x-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600 hover:border-yellow-400 rounded-lg transition-all duration-200 ml-4"
            title="Открыть аудио микшер"
            data-testid="button-audio-mixer"
          >
            <Sliders size={16} className="text-gray-400 group-hover:text-yellow-400 transition-colors" />
            <span className="text-xs text-gray-400 group-hover:text-yellow-400 transition-colors font-medium">
              MIXER
            </span>
          </button>
        </div>

        <p className="text-muted-foreground text-sm">
          © 2025 Ян Кузьмичёв. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
