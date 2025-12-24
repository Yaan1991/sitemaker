import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { AudioMixer } from "./AudioMixer";
import { FloatingControlsGroup } from "./FloatingControlsGroup";
import { useAudio } from "@/contexts/AudioContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { changeRoute } = useAudio();
  const [previousLocation, setPreviousLocation] = useState<string>('');

  // Профессиональное управление переходами через HowlerAudioEngine
  useEffect(() => {
    console.log('🔄 Layout: location изменился', { from: previousLocation, to: location });
    
    // Скроллим вверх ТОЛЬКО при реальной смене страниц
    if (previousLocation !== location && previousLocation !== '') {
      window.scrollTo(0, 0);
    }
    
    // Обновляем аудио через Howler при смене маршрута
    if (location !== previousLocation) {
      console.log('🎵 Layout: вызываем changeRoute для', location);
      changeRoute(location);
    }
    
    // Обновляем предыдущую локацию
    setPreviousLocation(location);
  }, [location, changeRoute, previousLocation]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pt-16 pb-32"
      >
        {children}
      </motion.main>
      
      {/* Sticky контейнер для floating кнопок - всегда над футером */}
      <div className="sticky bottom-6 pb-6 pointer-events-none" style={{zIndex: 200}}>
        <div className="pointer-events-auto">
          <FloatingControlsGroup />
        </div>
      </div>
      
      <Footer />
      {/* Профессиональная аудиосистема через HowlerAudioEngine */}
      <AudioMixer />
    </div>
  );
}
