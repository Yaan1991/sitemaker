import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAudio } from '@/contexts/AudioContext';

// Мэппинг страниц на треки
const pageTrackMap: Record<string, string> = {
  '/': 'https://disk.yandex.ru/d/qD8DD5RQ16ehsw', // Музыка для главной
  '/project/idiot-saratov-drama': 'https://disk.yandex.ru/d/_N303DN6vIaHbQ', // ТОЛЬКО для Идиота!
  // Остальные страницы без музыки
};

export function GlobalAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [location] = useLocation();
  const { isGlobalAudioEnabled, currentTrack, setCurrentTrack } = useAudio();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Конвертация Yandex.Disk ссылок в прокси
  const getProxyUrl = (shareUrl: string) => {
    if (shareUrl.includes('disk.yandex.ru/d/')) {
      return `/api/proxy-audio?url=${encodeURIComponent(shareUrl)}`;
    }
    return shareUrl;
  };

  // Плавный фейд-ин (3 секунды)
  const fadeIn = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    audio.play().catch(console.error);
    setIsPlaying(true);

    let currentVolume = 0;
    const targetVolume = 0.25;
    const fadeStep = targetVolume / (3000 / 50); // 3 секунды, шаг каждые 50мс

    fadeIntervalRef.current = setInterval(() => {
      currentVolume += fadeStep;
      if (currentVolume >= targetVolume) {
        currentVolume = targetVolume;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
      }
      if (audio) {
        audio.volume = currentVolume;
      }
    }, 50);
  };

  // Плавный фейд-аут
  const fadeOut = (callback?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    let currentVolume = audio.volume;
    const fadeStep = currentVolume / (1000 / 50); // 1 секунда

    fadeIntervalRef.current = setInterval(() => {
      currentVolume -= fadeStep;
      if (currentVolume <= 0) {
        currentVolume = 0;
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
        callback?.();
      }
      if (audio) {
        audio.volume = currentVolume;
      }
    }, 50);
  };

  // Смена трека с плавным переходом
  const changeTrack = (newTrackUrl: string) => {
    if (currentTrack === newTrackUrl) return;

    if (isPlaying) {
      fadeOut(() => {
        setCurrentTrack(newTrackUrl);
      });
    } else {
      setCurrentTrack(newTrackUrl);
    }
  };

  // Отслеживание изменения страницы
  useEffect(() => {
    const trackForPage = pageTrackMap[location];
    
    if (trackForPage && isGlobalAudioEnabled) {
      changeTrack(trackForPage);
    } else if (!trackForPage && isPlaying) {
      // Останавливаем музыку на страницах без треков
      fadeOut(() => {
        setCurrentTrack(null);
      });
    }
  }, [location, isGlobalAudioEnabled]);

  // Загрузка аудио
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(console.error);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  // Управление воспроизведением
  useEffect(() => {
    if (!isLoaded || !currentTrack) return;

    if (isGlobalAudioEnabled && !isPlaying) {
      fadeIn();
    } else if (!isGlobalAudioEnabled && isPlaying) {
      fadeOut();
    }
  }, [isGlobalAudioEnabled, isLoaded, currentTrack]);

  // Очистка интервалов при демонтировании
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  if (!currentTrack) return null;

  return (
    <audio
      ref={audioRef}
      src={getProxyUrl(currentTrack)}
      loop
      preload="auto"
      style={{ display: 'none' }}
    />
  );
}