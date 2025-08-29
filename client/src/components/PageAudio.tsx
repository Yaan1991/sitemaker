import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { BackgroundAudio } from './BackgroundAudio';
import { useAudio } from '@/contexts/AudioContext';

// Мэппинг страниц на фоновую музыку
const pageAudioMap: Record<string, string> = {
  '/project/idiot-saratov-drama': 'https://disk.yandex.ru/d/_N303DN6vIaHbQ', // Тема Настасьи Филипповны
  // Здесь можно добавить музыку для других страниц:
  // '/about': 'ссылка-на-звук',
  // '/contact': 'ссылка-на-звук',
  // '/projects': 'ссылка-на-звук',
};

interface PageAudioProps {
  isMainPlayerPlaying?: boolean;
}

export function PageAudio({ isMainPlayerPlaying = false }: PageAudioProps) {
  const [location] = useLocation();
  const { isGlobalAudioEnabled } = useAudio();
  
  // Получаем музыку для текущей страницы
  const currentPageAudio = pageAudioMap[location];
  
  // Если для текущей страницы нет музыки, не рендерим компонент
  if (!currentPageAudio) {
    return null;
  }

  return (
    <BackgroundAudio
      isEnabled={isGlobalAudioEnabled}
      trackUrl={currentPageAudio}
      volume={0.25}
      shouldPause={isMainPlayerPlaying}
    />
  );
}