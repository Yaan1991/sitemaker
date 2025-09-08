import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAudio } from '@/contexts/AudioContext';

interface Track {
  id: string;
  title: string;
  url: string;
}

// Мэппинг проектов на плейлисты
const projectPlaylistMap: Record<string, Track[]> = {
  'idiot-saratov-drama': [
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
  // Будущие проекты добавляются сюда
};

export function GlobalProjectPlayer() {
  const [location] = useLocation();
  const { 
    isGlobalAudioEnabled, 
    currentProjectPlaylist, 
    currentProjectTrack,
    isProjectPlayerReady,
    setCurrentProjectPlaylist,
    setCurrentProjectTrack,
    setIsProjectPlayerReady
  } = useAudio();
  
  const [audioElements, setAudioElements] = useState<HTMLAudioElement[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Определяем текущий проект из URL
  const getCurrentProject = () => {
    const match = location.match(/^\/project\/(.+)$/);
    return match ? match[1] : null;
  };

  // Обновляем плейлист при смене проекта
  useEffect(() => {
    const currentProject = getCurrentProject();
    
    if (currentProject && projectPlaylistMap[currentProject]) {
      const playlist = projectPlaylistMap[currentProject];
      setCurrentProjectPlaylist(playlist);
      
      // Инициализируем аудио элементы
      const elements = playlist.map((track) => {
        const audio = new Audio(track.url);
        audio.preload = 'metadata';
        return audio;
      });
      setAudioElements(elements);
      setIsProjectPlayerReady(true);

      // Cleanup предыдущих элементов
      return () => {
        elements.forEach(audio => {
          audio.pause();
          audio.src = '';
        });
      };
    } else {
      // Если не на странице проекта - очищаем
      setCurrentProjectPlaylist(null);
      setIsProjectPlayerReady(false);
      setAudioElements([]);
    }
  }, [location, setCurrentProjectPlaylist, setIsProjectPlayerReady]);

  // Автозапуск при включении звука на странице проекта
  useEffect(() => {
    if (getCurrentProject() && isGlobalAudioEnabled && isProjectPlayerReady && !isPlaying) {
      setTimeout(() => {
        playTrack(0);
      }, 500);
    } else if (!isGlobalAudioEnabled && isPlaying) {
      pauseAudio();
    }
  }, [isGlobalAudioEnabled, isProjectPlayerReady, location]);

  // Функции управления плеером
  const playTrack = (trackIndex: number) => {
    if (!audioElements[trackIndex]) return;

    // Останавливаем текущий трек
    if (isPlaying) {
      audioElements[currentProjectTrack]?.pause();
    }

    setCurrentProjectTrack(trackIndex);
    setIsPlaying(true);
    
    const audio = audioElements[trackIndex];
    audio.currentTime = 0;
    audio.volume = 0.7;
    audio.play().catch(console.error);

    // Обновление времени
    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    // Автопереход к следующему треку
    audio.onended = () => {
      if (currentProjectPlaylist) {
        const nextTrack = (trackIndex + 1) % currentProjectPlaylist.length;
        playTrack(nextTrack);
      }
    };
  };

  const pauseAudio = () => {
    if (audioElements[currentProjectTrack]) {
      audioElements[currentProjectTrack].pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      const audio = audioElements[currentProjectTrack];
      if (audio && audio.currentTime > 0) {
        setIsPlaying(true);
        audio.play().catch(console.error);
      } else {
        playTrack(currentProjectTrack);
      }
    }
  };

  const nextTrack = () => {
    if (currentProjectPlaylist) {
      const next = (currentProjectTrack + 1) % currentProjectPlaylist.length;
      playTrack(next);
    }
  };

  const prevTrack = () => {
    if (currentProjectPlaylist) {
      const prev = currentProjectTrack === 0 ? currentProjectPlaylist.length - 1 : currentProjectTrack - 1;
      playTrack(prev);
    }
  };

  const stopAudio = () => {
    if (audioElements[currentProjectTrack]) {
      audioElements[currentProjectTrack].pause();
      audioElements[currentProjectTrack].currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  // Форматирование времени
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Экспортируем функции в глобальный контекст
  useEffect(() => {
    // Добавляем функции в window для доступа из ProjectPage
    (window as any).projectPlayer = {
      togglePlayPause,
      nextTrack,
      prevTrack,
      stopAudio,
      playTrack,
      isPlaying,
      currentTime,
      duration,
      isProjectPlayerReady,
      currentProjectTrack,
      currentProjectPlaylist,
      formatTime
    };
  }, [togglePlayPause, nextTrack, prevTrack, stopAudio, playTrack, isPlaying, currentTime, duration, isProjectPlayerReady, currentProjectTrack, currentProjectPlaylist]);

  return null; // Этот компонент не рендерит UI - только логика
}