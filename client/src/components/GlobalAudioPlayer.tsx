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
  const homePlayerRef = useRef<HTMLAudioElement>(null);
  const projectPlayerRef = useRef<HTMLAudioElement>(null);
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
  const [activePlayer, setActivePlayer] = useState<'home' | 'project'>('home');
  const crossfadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Получение текущего трека
  const currentTrack = currentPlaylist ? currentPlaylist[currentTrackIndex] : null;

  // Прямое использование локальных аудиофайлов - мгновенная загрузка!
  const getAudioUrl = (url: string) => {
    return url; // Локальные файлы обслуживаются напрямую
  };

  // Получение плеера для главной страницы
  const getHomePlayer = () => homePlayerRef.current;

  // Получение плеера для проектов  
  const getProjectPlayer = () => projectPlayerRef.current;

  // Получение активного плеера
  const getActivePlayer = () => {
    return activePlayer === 'home' ? getHomePlayer() : getProjectPlayer();
  };

  // Получение неактивного плеера (для кроссфейда)
  const getInactivePlayer = () => {
    return activePlayer === 'home' ? getProjectPlayer() : getHomePlayer();
  };

  // Простой фейд-ин для одного плеера
  const fadeIn = (player: HTMLAudioElement) => {
    if (!player || !currentTrack) return;

    player.volume = 0;
    player.play().catch(console.error);
    setIsPlaying(true);

    // Плавно увеличиваем громкость до 0.7 за 2 секунды
    let currentVolume = 0;
    const targetVolume = 0.7;
    const fadeStep = targetVolume / 40; // 40 шагов = 2 секунды при 50мс интервале

    const fadeInterval = setInterval(() => {
      currentVolume += fadeStep;
      if (currentVolume >= targetVolume) {
        currentVolume = targetVolume;
        clearInterval(fadeInterval);
      }
      player.volume = currentVolume;
    }, 50);
  };

  // Простой фейд-аут для одного плеера  
  const fadeOut = (player: HTMLAudioElement, callback?: () => void) => {
    if (!player) return;

    let currentVolume = player.volume;
    const fadeStep = currentVolume / 40; // 40 шагов = 2 секунды

    const fadeInterval = setInterval(() => {
      currentVolume -= fadeStep;
      if (currentVolume <= 0) {
        currentVolume = 0;
        player.pause();
        player.currentTime = 0;
        player.volume = 0;
        setIsPlaying(false);
        clearInterval(fadeInterval);
        callback?.();
      }
      player.volume = currentVolume;
    }, 50);
  };

  // Кроссфейд между двумя плеерами
  const crossfadeToPlayer = (targetPlayer: 'home' | 'project', newTrack: Track) => {
    const oldPlayer = getActivePlayer();
    const newPlayer = targetPlayer === 'home' ? getHomePlayer() : getProjectPlayer();
    
    if (!newPlayer || !newTrack) return;

    // Подготавливаем новый плеер
    newPlayer.src = getAudioUrl(newTrack.url);
    newPlayer.volume = 0;
    newPlayer.currentTime = 0;

    const handleNewTrackLoaded = () => {
      newPlayer.removeEventListener('loadeddata', handleNewTrackLoaded);
      
      // Начинаем кроссфейд
      newPlayer.play().catch(console.error);
      
      if (crossfadeIntervalRef.current) {
        clearInterval(crossfadeIntervalRef.current);
      }

      let oldVolume = oldPlayer?.volume || 0;
      let newVolume = 0;
      const targetVolume = 0.7;
      const steps = 60; // 3 секунды при 50мс интервале
      const volumeStep = targetVolume / steps;

      crossfadeIntervalRef.current = setInterval(() => {
        // Старый плеер затухает
        if (oldPlayer && oldVolume > 0) {
          oldVolume -= volumeStep;
          if (oldVolume <= 0) {
            oldVolume = 0;
            oldPlayer.pause();
            oldPlayer.currentTime = 0;
            oldPlayer.volume = 0;
          } else {
            oldPlayer.volume = oldVolume;
          }
        }

        // Новый плеер появляется
        newVolume += volumeStep;
        if (newVolume >= targetVolume) {
          newVolume = targetVolume;
          if (crossfadeIntervalRef.current) {
            clearInterval(crossfadeIntervalRef.current);
          }
          setActivePlayer(targetPlayer);
        }
        newPlayer.volume = Math.min(targetVolume, newVolume);
      }, 50);
    };

    newPlayer.addEventListener('loadeddata', handleNewTrackLoaded);
    newPlayer.load();
  };

  // Определяем тип контента (домашний или проектный)
  const getPlayerTypeForContent = (content: Track[] | Track): 'home' | 'project' => {
    const firstTrack = Array.isArray(content) ? content[0] : content;
    // Если это музыка с главной страницы - домашний плеер
    return firstTrack.id === 'homepage' ? 'home' : 'project';
  };

  // Смена плейлиста/трека с кроссфейдом между плеерами
  const changePlaylist = (newContent: Track[] | Track) => {
    const newPlaylist = Array.isArray(newContent) ? newContent : [newContent];
    const targetPlayerType = getPlayerTypeForContent(newContent);
    
    // Проверяем, изменился ли плейлист
    const isSamePlaylist = 
      currentPlaylist && 
      currentPlaylist.length === newPlaylist.length &&
      currentPlaylist.every((track, index) => track.id === newPlaylist[index]?.id);
    
    if (isSamePlaylist) return;

    setCurrentPlaylist(newPlaylist);
    setCurrentTrackIndex(0);

    if (isPlaying) {
      // Если нужно переключиться между плеерами - кроссфейд
      if (activePlayer !== targetPlayerType) {
        const newTrack = newPlaylist[0];
        if (newTrack) {
          crossfadeToPlayer(targetPlayerType, newTrack);
        }
      } else {
        // Если остаемся на том же плеере - простая смена трека
        const player = getActivePlayer();
        if (player && newPlaylist[0]) {
          player.src = getAudioUrl(newPlaylist[0].url);
          player.load();
        }
      }
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

  // Настройка активного плеера при смене трека
  useEffect(() => {
    if (!currentTrack) return;
    
    const targetPlayerType = getPlayerTypeForContent([currentTrack]);
    const targetPlayer = targetPlayerType === 'home' ? getHomePlayer() : getProjectPlayer();
    
    if (!targetPlayer) return;

    // Если переключились на другой плеер, обновляем активный
    if (activePlayer !== targetPlayerType) {
      setActivePlayer(targetPlayerType);
    }

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

    // Устанавливаем источник только если плеер не играет этот трек
    if (targetPlayer.src !== getAudioUrl(currentTrack.url)) {
      targetPlayer.pause();
      targetPlayer.currentTime = 0;
      targetPlayer.volume = 0;
      setIsPlaying(false);
      setIsLoaded(false);

      targetPlayer.src = getAudioUrl(currentTrack.url);
      targetPlayer.addEventListener('loadeddata', handleLoadedData);
      targetPlayer.addEventListener('ended', handleEnded);
      
      return () => {
        targetPlayer.removeEventListener('loadeddata', handleLoadedData);
        targetPlayer.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentTrack, activePlayer]);

  // Управление воспроизведением
  useEffect(() => {
    if (!isLoaded || !currentTrack) return;

    const player = getActivePlayer();
    if (!player) return;

    if (isGlobalAudioEnabled && !isPlaying) {
      fadeIn(player);
    } else if (!isGlobalAudioEnabled && isPlaying) {
      fadeOut(player);
    }
  }, [isGlobalAudioEnabled, isLoaded, currentTrack, activePlayer]);

  // Очистка интервалов при демонтировании
  useEffect(() => {
    return () => {
      if (crossfadeIntervalRef.current) {
        clearInterval(crossfadeIntervalRef.current);
      }
    };
  }, []);

  if (!currentTrack) return null;

  return (
    <>
      <audio
        ref={homePlayerRef}
        preload="auto"
        style={{ display: 'none' }}
      />
      <audio
        ref={projectPlayerRef}
        preload="auto"
        style={{ display: 'none' }}
      />
    </>
  );
}