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
      // ВАЖНО: НЕ очищаем элементы сразу - даем время для затухания
      // Задержка чтобы не мешать fade out
      setTimeout(() => {
        console.log('🧹 Очистка проектного плеера после затухания');
        setCurrentProjectPlaylist(null);
        setIsProjectPlayerReady(false);
        setAudioElements([]);
      }, 5000); // 4 секунды затухания + 1 секунда буфер
    }
  }, [location, setCurrentProjectPlaylist, setIsProjectPlayerReady]);

  // Автозапуск при включении звука на странице проекта (только один раз)
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  
  useEffect(() => {
    if (getCurrentProject() && isGlobalAudioEnabled && isProjectPlayerReady && !isPlaying && !hasAutoStarted) {
      setTimeout(() => {
        playTrack(0);
        setHasAutoStarted(true);
      }, 500);
    } else if (!isGlobalAudioEnabled && isPlaying) {
      pauseAudio();
      setHasAutoStarted(false); // Сброс при выключении звука
    }
    
    // Сброс флага при смене проекта
    if (!getCurrentProject()) {
      setHasAutoStarted(false);
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

  // Плавное затухание проектного плеера при уходе со страницы
  const fadeOutProjectPlayer = (): Promise<void> => {
    return new Promise((resolve) => {
      const audio = audioElements[currentProjectTrack];
      console.log('fadeOut: аудио элемент:', !!audio);
      console.log('fadeOut: на паузе:', audio?.paused);
      console.log('fadeOut: громкость:', audio?.volume);
      
      if (!audio) {
        console.log('Нет аудио элемента, завершаем');
        resolve();
        return;
      }

      // Сохраняем ссылку на аудио, чтобы она не потерялась при cleanup
      const audioForFade = audio;
      
      if (audioForFade.volume === 0) {
        console.log('Громкость уже 0, завершаем');
        resolve();
        return;
      }

      console.log('Начинаем затухание, исходная громкость:', audioForFade.volume);
      
      let currentVolume = audioForFade.volume;
      const fadeOut = setInterval(() => {
        // Проверяем, что элемент еще доступен
        if (!audioForFade.src) {
          console.log('❌ Аудио элемент очищен во время затухания!');
          clearInterval(fadeOut);
          resolve();
          return;
        }
        
        currentVolume -= 0.0125; // 4 секунды затухания (4000ms / 50ms = 80 шагов, 1.0 / 80 = 0.0125)
        audioForFade.volume = Math.max(0, currentVolume);
        
        console.log('Затухание: громкость =', audioForFade.volume);
        
        if (currentVolume <= 0) {
          console.log('✅ Затухание завершено за 4 секунды');
          audioForFade.pause();
          setIsPlaying(false);
          clearInterval(fadeOut);
          resolve();
        }
      }, 50);
    });
  };

  const togglePlayPause = () => {
    const audio = audioElements[currentProjectTrack];
    if (!audio) return;
    
    if (isPlaying) {
      // Ставим на паузу
      audio.pause();
      setIsPlaying(false);
    } else {
      // Возобновляем с текущего места или начинаем заново
      setIsPlaying(true);
      audio.play().catch(console.error);
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
    const audio = audioElements[currentProjectTrack];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      // НЕ сбрасываем hasAutoStarted - пользователь сам остановил
    }
  };

  // Форматирование времени
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Экспортируем функции в глобальный контекст с реальным временем
  useEffect(() => {
    // Обновляем window.projectPlayer в реальном времени
    (window as any).projectPlayer = {
      togglePlayPause,
      nextTrack,
      prevTrack,
      stopAudio,
      playTrack,
      fadeOutProjectPlayer,
      isPlaying,
      currentTime,
      duration,
      isProjectPlayerReady,
      currentProjectTrack,
      currentProjectPlaylist,
      formatTime
    };
  }); // Убираем dependencies чтобы обновлялось каждый рендер

  return null; // Этот компонент не рендерит UI - только логика
}