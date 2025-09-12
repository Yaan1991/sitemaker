import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { audioEngine } from '@/lib/HowlerAudioEngine';

interface Track {
  id: string;
  title: string;
  url: string;
}

interface AudioContextType {
  isGlobalAudioEnabled: boolean;
  toggleGlobalAudio: () => void;
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
  toggleSoundDesign: () => void;
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
  // Sound Design плеер
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
    const savedGlobal = localStorage.getItem('global-audio-enabled');
    if (savedGlobal) {
      setIsGlobalAudioEnabled(savedGlobal === 'true');
    } else {
      // Если нет сохраненного состояния, устанавливаем true и сохраняем
      setIsGlobalAudioEnabled(true);
      localStorage.setItem('global-audio-enabled', 'true');
    }
    
    const savedSoundDesign = localStorage.getItem('sound-design-enabled');
    if (savedSoundDesign) {
      setIsSoundDesignEnabled(savedSoundDesign === 'true');
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

    // 🔧 КРИТИЧНО: Синхронизация настроек включения с движком
    // Читаем напрямую из localStorage чтобы избежать race condition
    const savedMusicEnabled = localStorage.getItem('global-audio-enabled') !== 'false';
    const savedSfxEnabled = localStorage.getItem('sound-design-enabled') !== 'false';
    audioEngine.setMusicEnabled(savedMusicEnabled);
    audioEngine.setSfxEnabled(savedSfxEnabled);

    return () => {
      // Cleanup при размонтировании
      audioEngine.destroy();
    };
  }, []);

  const toggleGlobalAudio = () => {
    const newValue = !isGlobalAudioEnabled;
    setIsGlobalAudioEnabled(newValue);
    localStorage.setItem('global-audio-enabled', newValue.toString());
    
    // Управляем музыкальной шиной через Howler
    audioEngine.setMusicEnabled(newValue);
    
    // КРИТИЧНО: Возобновляем воспроизведение при включении
    if (newValue) {
      audioEngine.changeRoute(currentPage);
    }
  };

  const toggleSoundDesign = () => {
    const newValue = !isSoundDesignEnabled;
    setIsSoundDesignEnabled(newValue);
    localStorage.setItem('sound-design-enabled', newValue.toString());
    
    // Управляем шиной звукового дизайна через Howler
    audioEngine.setSfxEnabled(newValue);
    
    // КРИТИЧНО: Возобновляем воспроизведение при включении
    if (newValue) {
      audioEngine.changeRoute(currentPage);
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
      isGlobalAudioEnabled,
      toggleGlobalAudio,
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
      toggleSoundDesign,
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
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}