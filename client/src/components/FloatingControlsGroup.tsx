import { Sliders, Mail, Music } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { Link } from "wouter";

export function FloatingControlsGroup() {
  const { isMixerOpen, setIsMixerOpen } = useAudio();

  const toggleMixer = () => {
    setIsMixerOpen(!isMixerOpen);
  };

  return (
    <div 
      className="fixed left-1/2 transform -translate-x-1/2 flex items-center gap-3
                 bottom-20 md:bottom-5"
      style={{zIndex: 200}}
    >
      {/* Кнопка Контакты */}
      <Link href="/contact">
        <button
          className="group w-12 h-12 md:w-10 md:h-10 bg-gray-900/80 hover:bg-gray-800/90 
                     border border-gray-600 hover:border-yellow-400 
                     rounded-full shadow-lg hover:shadow-xl
                     backdrop-blur-sm transition-all duration-200 
                     flex items-center justify-center"
          title="Связаться со мной"
          data-testid="floating-contact-button"
        >
          <Mail 
            size={18} 
            className="text-gray-400 group-hover:text-yellow-400 transition-colors md:w-4 md:h-4" 
          />
          
          {/* Пульсирующее кольцо при hover */}
          <div className="absolute inset-0 rounded-full border-2 border-yellow-400/0 
                          group-hover:border-yellow-400/20 transition-all duration-300
                          group-hover:scale-110"></div>
        </button>
      </Link>

      {/* Кнопка микшера (центральная) */}
      <button
        onClick={toggleMixer}
        className="group w-12 h-12 md:w-10 md:h-10 bg-gray-900/80 hover:bg-gray-800/90 
                   border border-gray-600 hover:border-yellow-400 
                   rounded-full shadow-lg hover:shadow-xl
                   backdrop-blur-sm transition-all duration-200 
                   flex items-center justify-center"
        title={isMixerOpen ? "Закрыть аудио микшер" : "Открыть аудио микшер"}
        data-testid="floating-mixer-button"
      >
        <Sliders 
          size={18} 
          className="text-gray-400 group-hover:text-yellow-400 transition-colors md:w-4 md:h-4" 
        />
        
        {/* Пульсирующее кольцо при hover */}
        <div className="absolute inset-0 rounded-full border-2 border-yellow-400/0 
                        group-hover:border-yellow-400/30 transition-all duration-300
                        group-hover:scale-110"></div>
      </button>

      {/* Кнопка Bandlink */}
      <a
        href="https://band.link/zDZyK"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button
          className="group w-12 h-12 md:w-10 md:h-10 bg-gray-900/80 hover:bg-gray-800/90 
                     border border-gray-600 hover:border-yellow-400 
                     rounded-full shadow-lg hover:shadow-xl
                     backdrop-blur-sm transition-all duration-200 
                     flex items-center justify-center"
          title="Слушать музыку"
          data-testid="floating-bandlink-button"
        >
          <Music 
            size={18} 
            className="text-gray-400 group-hover:text-yellow-400 transition-colors md:w-4 md:h-4" 
          />
          
          {/* Пульсирующее кольцо при hover */}
          <div className="absolute inset-0 rounded-full border-2 border-yellow-400/0 
                          group-hover:border-yellow-400/20 transition-all duration-300
                          group-hover:scale-110"></div>
        </button>
      </a>
    </div>
  );
}