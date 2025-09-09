import { Sliders } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";

export function FloatingMixerButton() {
  const { setIsMixerOpen } = useAudio();

  return (
    <button
      onClick={() => setIsMixerOpen(true)}
      className="group fixed bottom-5 left-1/2 transform -translate-x-1/2
                 w-12 h-12 bg-gray-900/80 hover:bg-gray-800/90 
                 border border-gray-600 hover:border-yellow-400 
                 rounded-full shadow-lg hover:shadow-xl
                 backdrop-blur-sm transition-all duration-200 
                 flex items-center justify-center"
      style={{zIndex: 200}}
      title="Открыть аудио микшер"
      data-testid="floating-mixer-button"
    >
      <Sliders 
        size={18} 
        className="text-gray-400 group-hover:text-yellow-400 transition-colors" 
      />
      
      {/* Пульсирующее кольцо при hover */}
      <div className="absolute inset-0 rounded-full border-2 border-yellow-400/0 
                      group-hover:border-yellow-400/30 transition-all duration-300
                      group-hover:scale-110"></div>
    </button>
  );
}