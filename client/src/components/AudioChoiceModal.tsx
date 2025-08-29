import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioChoiceModalProps {
  isOpen: boolean;
  onChoice: (withAudio: boolean) => void;
}

export function AudioChoiceModal({ isOpen, onChoice }: AudioChoiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-black/90 border border-primary/30 rounded-2xl p-8 max-w-md mx-4 text-center backdrop-blur-xl"
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Music className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <h3 className="text-2xl font-russo font-bold text-white mb-2">
          Добро пожаловать!
        </h3>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          Хотите включить фоновую музыку для погружения в атмосферу работ?
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={() => onChoice(true)}
            className="flex-1 flex items-center justify-center gap-3 bg-primary text-black py-3 px-6 rounded-xl font-medium hover:bg-primary/80 transition-all duration-200 shadow-lg hover:shadow-primary/25"
            data-testid="button-with-audio"
          >
            <Volume2 className="w-5 h-5" />
            Со звуком
          </button>
          
          <button
            onClick={() => onChoice(false)}
            className="flex-1 flex items-center justify-center gap-3 bg-gray-800 text-gray-300 py-3 px-6 rounded-xl font-medium hover:bg-gray-700 transition-all duration-200"
            data-testid="button-without-audio"
          >
            <VolumeX className="w-5 h-5" />
            Без звука
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          Вы всегда сможете изменить настройку кнопкой в правом верхнем углу
        </p>
      </motion.div>
    </div>
  );
}