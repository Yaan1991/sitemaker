import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAudio } from '@/contexts/AudioContext';

interface Track {
  id: string;
  title: string;
  url: string;
}

// Мэппинг страниц на треки/плейлисты (локальные файлы - МГНОВЕННАЯ ЗАГРУЗКА!)
const pageTrackMap: Record<string, Track[] | Track> = {
  '/': {
    id: 'homepage',
    title: 'Фоновая музыка',
    url: '/audio/homepage.mp3'
  },
  '/project/idiot-saratov-drama': [
    {
      id: 'nastasya',
      title: 'Тема Настасьи Филипповны',
      url: '/audio/nastasya.mp3'
    },
    {
      id: 'myshkin',
      title: 'Тема Мышкина',
      url: '/audio/myshkin.mp3'
    },
    {
      id: 'nastasya_nightmare',
      title: 'Кошмар Настасьи Филипповны',
      url: '/audio/nastasya_nightmare.mp3'
    },
    {
      id: 'city',
      title: 'Тема города',
      url: '/audio/city.mp3'
    }
  ]
};

export function GlobalAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [location] = useLocation();
  const { 
    isGlobalAudioEnabled, 
    currentPlaylist, 
    currentTrackIndex,
    setCurrentPlaylist,
    setCurrentTrackIndex
  } = useAudio();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Получение текущего трека
  const currentTrack = currentPlaylist ? currentPlaylist[currentTrackIndex] : null;

  // Прямое использование локальных аудиофайлов - мгновенная загрузка!
  const getAudioUrl = (url: string) => {
    return url; // Локальные файлы обслуживаются напрямую
  };

  // Плавный фейд-ин (3 секунды)
  const fadeIn = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.volume = 0;
    audio.play().catch(console.error);
    setIsPlaying(true);

    let currentVolume = 0;
    const targetVolume = 0.25;
    const fadeStep = targetVolume / (3000 / 50); // 3 секунды

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

  // Плавный фейд-аут (6 секунд для кроссфейда)
  const fadeOut = (callback?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    let currentVolume = audio.volume;
    const fadeStep = currentVolume / (6000 / 50); // 6 секунд

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

  // Смена плейлиста/трека с кроссфейдом
  const changePlaylist = (newContent: Track[] | Track) => {
    const newPlaylist = Array.isArray(newContent) ? newContent : [newContent];
    
    // Проверяем, изменился ли плейлист
    const isSamePlaylist = 
      currentPlaylist && 
      currentPlaylist.length === newPlaylist.length &&
      currentPlaylist.every((track, index) => track.id === newPlaylist[index]?.id);
    
    if (isSamePlaylist) return;

    if (isPlaying) {
      // 6 секунд фейдаут текущего трека
      fadeOut(() => {
        setCurrentPlaylist(newPlaylist);
        setCurrentTrackIndex(0); // Начинаем с первого трека в плейлисте
      });
    } else {
      setCurrentPlaylist(newPlaylist);
      setCurrentTrackIndex(0);
    }
  };

  // Отслеживание изменения страницы
  useEffect(() => {
    const contentForPage = pageTrackMap[location];
    
    if (isGlobalAudioEnabled) {
      if (contentForPage) {
        // Есть специфичная музыка для этой страницы
        changePlaylist(contentForPage);
      } else {
        // Нет специфичной музыки - играем музыку с главной страницы
        const homeMusic = pageTrackMap['/'];
        if (homeMusic) {
          changePlaylist(homeMusic);
        }
      }
    }
  }, [location, isGlobalAudioEnabled]);

  // Отслеживание смены трека в плейлисте
  useEffect(() => {
    if (currentTrack && isGlobalAudioEnabled && !isPlaying) {
      setIsLoaded(false); // Сбрасываем состояние загрузки при смене трека
    }
  }, [currentTrackIndex]);

  // Загрузка аудио при смене трека
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Останавливаем текущее воспроизведение и сбрасываем время
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setIsLoaded(false);

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handleEnded = () => {
      // Автоматический переход к следующему треку в плейлисте
      if (currentPlaylist && currentTrackIndex < currentPlaylist.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        // Зацикливаем плейлист
        setCurrentTrackIndex(0);
      }
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
      src={getAudioUrl(currentTrack.url)}
      preload="auto"
      style={{ display: 'none' }}
    />
  );
}