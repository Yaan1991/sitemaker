import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { GlobalBackgroundAudio } from "./GlobalBackgroundAudio";
import { GlobalProjectPlayer } from "./GlobalProjectPlayer";
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
      console.log('Покидаем проектную страницу, запускаем затухание');
      // Запускаем специфичное затухание проектного плеера (4 секунды)
      const projectPlayer = (window as any).projectPlayer;
      if (projectPlayer && projectPlayer.audioElements && projectPlayer.currentTrack !== undefined) {
        console.log('Найден проектный плеер с аудио элементами');
        const audio = projectPlayer.audioElements[projectPlayer.currentTrack];
        if (audio && !audio.paused && audio.volume > 0) {
          console.log('Запускаем кастомное затухание проектного плеера');
          // Затухание напрямую с сохраненными элементами
          let currentVolume = audio.volume;
          const fadeOut = setInterval(() => {
            if (!audio.src) {
              console.log('❌ Аудио элемент очищен во время затухания!');
              clearInterval(fadeOut);
              return;
            }
            currentVolume -= 0.0125; // 4 секунды затухания
            audio.volume = Math.max(0, currentVolume);
            console.log('Затухание: громкость =', audio.volume);
            if (currentVolume <= 0) {
              console.log('✅ Затухание завершено за 4 секунды');
              audio.pause();
              clearInterval(fadeOut);
            }
          }, 50);
        }
      } else {
        console.log('Проектный плеер не найден, fallback на общее затухание');
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
    </div>
  );
}
