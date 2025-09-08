import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { GlobalBackgroundAudio } from "./GlobalBackgroundAudio";
import { GlobalProjectPlayer } from "./GlobalProjectPlayer";
import { GlobalSoundDesignPlayer } from "./GlobalSoundDesignPlayer";
import { AudioMixer } from "./AudioMixer";
import { useAudio } from "@/contexts/AudioContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { fadeOutCurrentAudio } = useAudio();
  const [previousLocation, setPreviousLocation] = useState<string>('');

  // Управление переходами между страницами с фейдами
  useEffect(() => {
    // Скроллим вверх ТОЛЬКО при реальной смене страниц, а не при обновлениях состояния
    if (previousLocation !== location && previousLocation !== '') {
      window.scrollTo(0, 0);
    }
    
    // Если переходим СО страницы проекта НА другую страницу - делаем кроссфейд
    const isLeavingProject = previousLocation.startsWith('/project/') && !location.startsWith('/project/');
    
    if (isLeavingProject) {
      // Запускаем специфичное затухание проектного плеера (4 секунды)
      const projectPlayer = (window as any).projectPlayer;
      if (projectPlayer && projectPlayer.fadeOutProjectPlayer) {
        projectPlayer.fadeOutProjectPlayer();
      } else {
        // Fallback: общее затухание всех аудио элементов
        fadeOutCurrentAudio();
      }
    }
    
    // Обновляем предыдущую локацию
    setPreviousLocation(location);
  }, [location, fadeOutCurrentAudio, previousLocation]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pt-16"
      >
        {children}
      </motion.main>
      <Footer />
      <GlobalBackgroundAudio />
      <GlobalProjectPlayer />
      <GlobalSoundDesignPlayer />
      <AudioMixer />
    </div>
  );
}
