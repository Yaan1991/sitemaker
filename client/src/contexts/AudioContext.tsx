import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { audioEngine } from '@/lib/HowlerAudioEngine';

interface Track {
  id: string;
  title: string;
  url: string;
}

interface AudioContextType {
  // 🎛️ Главный контроль звука
  isGlobalAudioEnabled: boolean;
  toggleGlobalAudio: () => void; // Главный переключатель всего звука
  
  // 🎵 Индивидуальные контролы шин
  musicEnabledState: boolean;
  sfxEnabledState: boolean;
  toggleMusic: () => void; // Переключатель только музыки
  toggleSoundDesign: () => void; // Переключатель только эффектов
  
  // Фоновый плеер (домашняя страница и обычные страницы)
  currentPlaylist: Track[] | null;
  currentTrackIndex: number;
  setCurrentPlaylist: (playlist: Track[] | null) => void;
  setCurrentTrackIndex: (index: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  // Проектный плеер (страницы проектов)
  currentProjectPlaylist: Track[] | null;
  currentProjectTrack: number;
  isProjectPlayerReady: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  setCurrentProjectPlaylist: (playlist: Track[] | null) => void;
  setCurrentProjectTrack: (track: number) => void;
  setIsProjectPlayerReady: (ready: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  // Sound Design плеер (шумы и эмбиент)
  isSoundDesignEnabled: boolean;
  currentSoundDesign: string | null;
  setCurrentSoundDesign: (sound: string | null) => void;
  // Микшер (управление громкостью)
  musicVolume: number;
  sfxVolume: number;
  masterVolume: number;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setMasterVolume: (volume: number) => void;
  isMixerOpen: boolean;
  setIsMixerOpen: (open: boolean) => void;
  // Общие функции
  fadeOutCurrentAudio: () => Promise<void>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  changeRoute: (route: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isGlobalAudioEnabled, setIsGlobalAudioEnabled] = useState(false); // Выключен по умолчанию - opt-in
  
  // 🎛️ Индивидуальные настройки шин (запоминаем что было включено)
  const [musicEnabledState, setMusicEnabledState] = useState(false); // Музыка выключена пока пользователь не включит
  const [sfxEnabledState, setSfxEnabledState] = useState(false); // Эффекты выключены пока пользователь не включит
  
  // Фоновый плеер
  const [currentPlaylist, setCurrentPlaylist] = useState<Track[] | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  // Проектный плеер
  const [currentProjectPlaylist, setCurrentProjectPlaylist] = useState<Track[] | null>(null);
  const [currentProjectTrack, setCurrentProjectTrack] = useState(0);
  const [isProjectPlayerReady, setIsProjectPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Sound Design плеер (теперь синхронизировано с sfxEnabledState)
  const [isSoundDesignEnabled, setIsSoundDesignEnabled] = useState(false); // Выключен по умолчанию - opt-in
  const [currentSoundDesign, setCurrentSoundDesign] = useState<string | null>(null);
  // Микшер
  const [musicVolume, setMusicVolume] = useState(0.5); // 50% начальное значение
  const [sfxVolume, setSfxVolume] = useState(0.7); // 70% начальное значение  
  const [masterVolume, setMasterVolume] = useState(0.7); // 70% начальное значение
  const [isMixerOpen, setIsMixerOpen] = useState(false);
  // Общее
  const [currentPage, setCurrentPage] = useState('/');
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Восстанавливаем состояние звука из localStorage и настраиваем Howler Engine
  useEffect(() => {
    // 🎛️ Проверяем consent флаг - был ли пользователь когда-то включал звук
    const hasConsent = localStorage.getItem('audio-consent') === 'true';
    const savedGlobalAudio = localStorage.getItem('global-audio-enabled');
    
    // Если пользователь ранее включал звук (consent есть) И сохранено состояние "включено" - восстанавливаем
    // Для первого визита - звук всегда выключен (opt-in)
    if (hasConsent && savedGlobalAudio === 'true') {
      setIsGlobalAudioEnabled(true);
    } else {
      setIsGlobalAudioEnabled(false);
    }
    
    // 🎵 Индивидуальные настройки шин
    const savedMusicEnabled = localStorage.getItem('music-enabled-state');
    if (savedMusicEnabled) {
      setMusicEnabledState(savedMusicEnabled === 'true');
    }
    
    const savedSfxEnabled = localStorage.getItem('sfx-enabled-state');
    if (savedSfxEnabled) {
      setSfxEnabledState(savedSfxEnabled === 'true');
      setIsSoundDesignEnabled(savedSfxEnabled === 'true'); // Синхронизируем
    }

    // 🎚️ Восстанавливаем настройки микшера из localStorage (или дефолтные значения)
    // Защитный parsing с проверкой на NaN и диапазон 0-1
    const parseVolume = (value: string | null, defaultVal: number): number => {
      if (!value) return defaultVal;
      const parsed = parseFloat(value);
      if (isNaN(parsed) || parsed < 0 || parsed > 1) return defaultVal;
      return parsed;
    };
    
    const restoredMusicVolume = parseVolume(localStorage.getItem('mixer-music-volume'), 0.5);
    const restoredSfxVolume = parseVolume(localStorage.getItem('mixer-sfx-volume'), 0.7);
    const restoredMasterVolume = parseVolume(localStorage.getItem('mixer-master-volume'), 0.7);
    
    setMusicVolume(restoredMusicVolume);
    setSfxVolume(restoredSfxVolume);
    setMasterVolume(restoredMasterVolume);
    audioEngine.setMusicVolume(restoredMusicVolume);
    audioEngine.setSfxVolume(restoredSfxVolume);
    audioEngine.setMasterVolume(restoredMasterVolume);

    // Настройка колбэков для отслеживания времени
    audioEngine.setTimeUpdateCallback((time, duration) => {
      setCurrentTime(time);
      setDuration(duration);
    });

    audioEngine.setTrackEndCallback(() => {
      // Обновляем состояние при окончании трека
      const newPlaylist = audioEngine.getCurrentPlaylist();
      const newIndex = audioEngine.getCurrentTrackIndex();
      if (newPlaylist) {
        setCurrentPlaylist(newPlaylist);
        setCurrentTrackIndex(newIndex);
      }
    });

    // 🎵 New callbacks for project player
    audioEngine.setPlaybackStateCallback((isPlaying) => {
      setIsPlaying(isPlaying);
    });

    audioEngine.setTrackChangeCallback((trackIndex, playlist) => {
      setCurrentProjectTrack(trackIndex);
      setCurrentProjectPlaylist(playlist);
      setIsProjectPlayerReady(true);
    });

    // 🔧 КРИТИЧНО: Начальная синхронизация с движком - opt-in по умолчанию
    // Звук ВСЕГДА выключен при загрузке страницы
    audioEngine.setMusicEnabled(false);
    audioEngine.setSfxEnabled(false);

    return () => {
      // Cleanup при размонтировании
      audioEngine.destroy();
    };
  }, []);

  // 🔧 Восстановление сессии: если isGlobalAudioEnabled становится true,
  // запускаем audioEngine для текущей страницы
  useEffect(() => {
    if (isGlobalAudioEnabled) {
      // 🚀 Предзагружаем критичные файлы для мгновенного старта
      audioEngine.preloadCritical();
      
      // При первом включении автоматически активируем обе шины
      let musicShouldBeEnabled = musicEnabledState;
      let sfxShouldBeEnabled = sfxEnabledState;
      
      // Если обе шины выключены (первый запуск), включаем их автоматически
      if (!musicEnabledState && !sfxEnabledState) {
        musicShouldBeEnabled = true;
        sfxShouldBeEnabled = true;
        setMusicEnabledState(true);
        setSfxEnabledState(true);
        setIsSoundDesignEnabled(true);
        localStorage.setItem('music-enabled-state', 'true');
        localStorage.setItem('sfx-enabled-state', 'true');
      }
      
      // Применяем bus states перед запуском
      audioEngine.setMusicEnabled(musicShouldBeEnabled);
      audioEngine.setSfxEnabled(sfxShouldBeEnabled);
      // Запускаем воспроизведение для текущей страницы
      audioEngine.changeRoute(currentPage);
    } else {
      // 🔇 Выключаем: глушим всё
      audioEngine.setMusicEnabled(false);
      audioEngine.setSfxEnabled(false);
    }
  }, [isGlobalAudioEnabled]); // Срабатывает только при изменении isGlobalAudioEnabled

  // 🎵 Главный переключатель всего звука (музыка + эффекты)
  const toggleGlobalAudio = () => {
    const newValue = !isGlobalAudioEnabled;
    setIsGlobalAudioEnabled(newValue);
    // Сохраняем consent флаг и состояние для восстановления при следующем визите
    localStorage.setItem('audio-consent', 'true'); // Отмечаем, что пользователь взаимодействовал со звуком
    localStorage.setItem('global-audio-enabled', newValue.toString());
  };

  // 🌊 Переключатель звуковых эффектов (индивидуально)
  const toggleSoundDesign = () => {
    // Обновляем индивидуальное состояние SFX
    const newValue = !sfxEnabledState;
    setSfxEnabledState(newValue);
    setIsSoundDesignEnabled(newValue); // Синхронизируем
    localStorage.setItem('sfx-enabled-state', newValue.toString());
    
    // Применяем только если глобальный звук включен
    if (isGlobalAudioEnabled) {
      audioEngine.setSfxEnabled(newValue);
      if (newValue) {
        audioEngine.changeRoute(currentPage); // Возобновляем воспроизведение
      }
    }
  };

  // 🎼 Переключатель музыки (индивидуально)
  const toggleMusic = () => {
    // Обновляем индивидуальное состояние музыки
    const newValue = !musicEnabledState;
    setMusicEnabledState(newValue);
    localStorage.setItem('music-enabled-state', newValue.toString());
    
    // Применяем только если глобальный звук включен
    if (isGlobalAudioEnabled) {
      audioEngine.setMusicEnabled(newValue);
      if (newValue) {
        audioEngine.changeRoute(currentPage); // Возобновляем воспроизведение
      }
    }
  };

  // Функции управления громкостью С сохранением в localStorage
  const handleSetMusicVolume = (volume: number) => {
    setMusicVolume(volume);
    audioEngine.setMusicVolume(volume);
    localStorage.setItem('mixer-music-volume', volume.toString());
  };

  const handleSetSfxVolume = (volume: number) => {
    setSfxVolume(volume);
    audioEngine.setSfxVolume(volume);
    localStorage.setItem('mixer-sfx-volume', volume.toString());
  };

  const handleSetMasterVolume = (volume: number) => {
    setMasterVolume(volume);
    audioEngine.setMasterVolume(volume);
    localStorage.setItem('mixer-master-volume', volume.toString());
  };

  // Функция плавного затухания через HowlerAudioEngine
  const fadeOutCurrentAudio = (): Promise<void> => {
    return audioEngine.stopAll();
  };


  const nextTrack = () => {
    audioEngine.nextMusicTrack();
    // Состояние обновится через колбэк
  };

  const prevTrack = () => {
    audioEngine.prevMusicTrack();
    // Состояние обновится через колбэк
  };

  // Новая функция для смены маршрута (для использования в компонентах)
  const changeRoute = (route: string) => {
    // ВСЕГДА обновляем currentPage, независимо от того включен ли звук
    setCurrentPage(route);
    // Загружаем звук только если пользователь включил audio (opt-in)
    if (isGlobalAudioEnabled) {
      audioEngine.changeRoute(route);
    }
  };

  return (
    <AudioContext.Provider value={{
      // 🎛️ Главный контроль звука
      isGlobalAudioEnabled,
      toggleGlobalAudio,
      
      // 🎵 Индивидуальные контролы шин
      musicEnabledState,
      sfxEnabledState,
      toggleMusic,
      toggleSoundDesign,
      
      // Фоновый плеер
      currentPlaylist,
      currentTrackIndex,
      setCurrentPlaylist,
      setCurrentTrackIndex,
      nextTrack,
      prevTrack,
      // Проектный плеер
      currentProjectPlaylist,
      currentProjectTrack,
      isProjectPlayerReady,
      isPlaying,
      currentTime,
      duration,
      setCurrentProjectPlaylist,
      setCurrentProjectTrack,
      setIsProjectPlayerReady,
      setIsPlaying,
      setCurrentTime,
      setDuration,
      // Sound Design плеер
      isSoundDesignEnabled,
      currentSoundDesign,
      setCurrentSoundDesign,
      // Микшер
      musicVolume,
      sfxVolume,
      masterVolume,
      setMusicVolume: handleSetMusicVolume,
      setSfxVolume: handleSetSfxVolume,
      setMasterVolume: handleSetMasterVolume,
      isMixerOpen,
      setIsMixerOpen,
      // Общие функции
      fadeOutCurrentAudio,
      currentPage,
      setCurrentPage,
      changeRoute
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    console.warn('useAudio called outside AudioProvider - this might be due to HMR');
    // Возвращаем заглушку вместо ошибки для HMR
    return {
      isGlobalAudioEnabled: false,
      toggleGlobalAudio: () => {},
      musicEnabledState: false,
      sfxEnabledState: false,
      toggleMusic: () => {},
      toggleSoundDesign: () => {},
      currentPlaylist: null,
      currentTrackIndex: 0,
      setCurrentPlaylist: () => {},
      setCurrentTrackIndex: () => {},
      nextTrack: () => {},
      prevTrack: () => {},
      currentProjectPlaylist: null,
      currentProjectTrack: 0,
      isProjectPlayerReady: false,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      setCurrentProjectPlaylist: () => {},
      setCurrentProjectTrack: () => {},
      setIsProjectPlayerReady: () => {},
      setIsPlaying: () => {},
      setCurrentTime: () => {},
      setDuration: () => {},
      isSoundDesignEnabled: false,
      currentSoundDesign: null,
      setCurrentSoundDesign: () => {},
      musicVolume: 0.5,
      sfxVolume: 0.7,
      masterVolume: 0.7,
      setMusicVolume: () => {},
      setSfxVolume: () => {},
      setMasterVolume: () => {},
      isMixerOpen: false,
      setIsMixerOpen: () => {},
      fadeOutCurrentAudio: async () => {},
      currentPage: '/',
      setCurrentPage: () => {},
      changeRoute: () => {}
    };
  }
  return context;
}