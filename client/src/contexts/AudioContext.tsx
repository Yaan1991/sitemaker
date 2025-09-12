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
  const [isGlobalAudioEnabled, setIsGlobalAudioEnabled] = useState(true); // Включен по умолчанию
  
  // 🎛️ Индивидуальные настройки шин (запоминаем что было включено)
  const [musicEnabledState, setMusicEnabledState] = useState(true); // Музыка включена отдельно
  const [sfxEnabledState, setSfxEnabledState] = useState(true); // Эффекты включены отдельно
  
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
  const [isSoundDesignEnabled, setIsSoundDesignEnabled] = useState(true); // По умолчанию включен
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
    // 🎛️ Главный переключатель звука
    const savedGlobal = localStorage.getItem('global-audio-enabled');
    if (savedGlobal) {
      setIsGlobalAudioEnabled(savedGlobal === 'true');
    } else {
      setIsGlobalAudioEnabled(true);
      localStorage.setItem('global-audio-enabled', 'true');
    }
    
    // 🎵 Индивидуальные настройки шин
    const savedMusicEnabled = localStorage.getItem('music-enabled-state');
    if (savedMusicEnabled) {
      setMusicEnabledState(savedMusicEnabled === 'true');
    } else {
      setMusicEnabledState(true);
      localStorage.setItem('music-enabled-state', 'true');
    }
    
    const savedSfxEnabled = localStorage.getItem('sfx-enabled-state');
    if (savedSfxEnabled) {
      setSfxEnabledState(savedSfxEnabled === 'true');
      setIsSoundDesignEnabled(savedSfxEnabled === 'true'); // Синхронизируем
    } else {
      setSfxEnabledState(true);
      setIsSoundDesignEnabled(true);
      localStorage.setItem('sfx-enabled-state', 'true');
    }

    // Восстанавливаем настройки микшера
    const savedMusicVolume = localStorage.getItem('mixer-music-volume');
    if (savedMusicVolume) {
      const volume = parseFloat(savedMusicVolume);
      setMusicVolume(volume);
      audioEngine.setMusicVolume(volume);
    }

    const savedSfxVolume = localStorage.getItem('mixer-sfx-volume');
    if (savedSfxVolume) {
      const volume = parseFloat(savedSfxVolume);
      setSfxVolume(volume);
      audioEngine.setSfxVolume(volume);
    }

    const savedMasterVolume = localStorage.getItem('mixer-master-volume');
    if (savedMasterVolume) {
      const volume = parseFloat(savedMasterVolume);
      setMasterVolume(volume);
      audioEngine.setMasterVolume(volume);
    }

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

    // 🔧 КРИТИЧНО: Начальная синхронизация с движком
    // Определяем что должно быть включено
    const shouldMusicBeEnabled = (localStorage.getItem('global-audio-enabled') !== 'false') && 
                                (localStorage.getItem('music-enabled-state') !== 'false');
    const shouldSfxBeEnabled = (localStorage.getItem('global-audio-enabled') !== 'false') && 
                              (localStorage.getItem('sfx-enabled-state') !== 'false');
    
    audioEngine.setMusicEnabled(shouldMusicBeEnabled);
    audioEngine.setSfxEnabled(shouldSfxBeEnabled);

    return () => {
      // Cleanup при размонтировании
      audioEngine.destroy();
    };
  }, []);

  // 🎵 Главный переключатель всего звука (музыка + эффекты)
  const toggleGlobalAudio = () => {
    const newValue = !isGlobalAudioEnabled;
    setIsGlobalAudioEnabled(newValue);
    localStorage.setItem('global-audio-enabled', newValue.toString());
    
    if (newValue) {
      // 🔊 Включаем: восстанавливаем индивидуальные настройки
      audioEngine.setMusicEnabled(musicEnabledState);
      audioEngine.setSfxEnabled(sfxEnabledState);
      audioEngine.changeRoute(currentPage); // Возобновляем воспроизведение
    } else {
      // 🔇 Выключаем: глушим всё, но запоминаем состояния
      audioEngine.setMusicEnabled(false);
      audioEngine.setSfxEnabled(false);
    }
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

  // Функции управления громкостью с сохранением в localStorage и обновлением Howler
  const handleSetMusicVolume = (volume: number) => {
    setMusicVolume(volume);
    localStorage.setItem('mixer-music-volume', volume.toString());
    audioEngine.setMusicVolume(volume);
  };

  const handleSetSfxVolume = (volume: number) => {
    setSfxVolume(volume);
    localStorage.setItem('mixer-sfx-volume', volume.toString());
    audioEngine.setSfxVolume(volume);
  };

  const handleSetMasterVolume = (volume: number) => {
    setMasterVolume(volume);
    localStorage.setItem('mixer-master-volume', volume.toString());
    audioEngine.setMasterVolume(volume);
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
    setCurrentPage(route);
    audioEngine.changeRoute(route);
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
      // Audio Engine
      engine: null,
      isGlobalAudioEnabled: false,
      toggleGlobalAudio: () => {},
      changeRoute: () => {},
      // Music плеер
      isMusicEnabled: false,
      toggleMusicEnabled: () => {},
      currentMusicTrack: null,
      isMusicPlaying: false,
      playMusic: () => {},
      pauseMusic: () => {},
      nextMusicTrack: () => {},
      previousMusicTrack: () => {},
      // Прогресс и время
      currentMusicTime: 0,
      duration: 0,
      setCurrentMusicTime: () => {},
      setDuration: () => {},
      // Sound Design плеер
      isSoundDesignEnabled: false,
      currentSoundDesign: null,
      setCurrentSoundDesign: () => {},
      // Микшер
      musicVolume: 0.8,
      sfxVolume: 0.8,
      masterVolume: 0.8,
      setMusicVolume: () => {},
      setSfxVolume: () => {},
      setMasterVolume: () => {},
      isMixerOpen: false,
      setIsMixerOpen: () => {},
      // Общие функции
      fadeOutCurrentAudio: () => {},
      currentPage: '/',
      setCurrentPage: () => {}
    };
  }
  return context;
}