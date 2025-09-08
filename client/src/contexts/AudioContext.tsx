import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

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
  setCurrentProjectPlaylist: (playlist: Track[] | null) => void;
  setCurrentProjectTrack: (track: number) => void;
  setIsProjectPlayerReady: (ready: boolean) => void;
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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isGlobalAudioEnabled, setIsGlobalAudioEnabled] = useState(false);
  // Фоновый плеер
  const [currentPlaylist, setCurrentPlaylist] = useState<Track[] | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  // Проектный плеер
  const [currentProjectPlaylist, setCurrentProjectPlaylist] = useState<Track[] | null>(null);
  const [currentProjectTrack, setCurrentProjectTrack] = useState(0);
  const [isProjectPlayerReady, setIsProjectPlayerReady] = useState(false);
  // Sound Design плеер
  const [isSoundDesignEnabled, setIsSoundDesignEnabled] = useState(true); // По умолчанию включен
  const [currentSoundDesign, setCurrentSoundDesign] = useState<string | null>(null);
  // Микшер
  const [musicVolume, setMusicVolume] = useState(0.7); // 70% = полная громкость
  const [sfxVolume, setSfxVolume] = useState(0.7); // 70% = полная громкость  
  const [masterVolume, setMasterVolume] = useState(0.7); // 70% = полная громкость
  const [isMixerOpen, setIsMixerOpen] = useState(false);
  // Общее
  const [currentPage, setCurrentPage] = useState('/');
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Восстанавливаем состояние звука из localStorage
  useEffect(() => {
    const savedGlobal = localStorage.getItem('global-audio-enabled');
    if (savedGlobal) {
      setIsGlobalAudioEnabled(savedGlobal === 'true');
    }
    
    const savedSoundDesign = localStorage.getItem('sound-design-enabled');
    if (savedSoundDesign) {
      setIsSoundDesignEnabled(savedSoundDesign === 'true');
    }

    // Восстанавливаем настройки микшера
    const savedMusicVolume = localStorage.getItem('mixer-music-volume');
    if (savedMusicVolume) {
      setMusicVolume(parseFloat(savedMusicVolume));
    }

    const savedSfxVolume = localStorage.getItem('mixer-sfx-volume');
    if (savedSfxVolume) {
      setSfxVolume(parseFloat(savedSfxVolume));
    }

    const savedMasterVolume = localStorage.getItem('mixer-master-volume');
    if (savedMasterVolume) {
      setMasterVolume(parseFloat(savedMasterVolume));
    }
  }, []);

  const toggleGlobalAudio = () => {
    const newValue = !isGlobalAudioEnabled;
    setIsGlobalAudioEnabled(newValue);
    localStorage.setItem('global-audio-enabled', newValue.toString());
  };

  const toggleSoundDesign = () => {
    const newValue = !isSoundDesignEnabled;
    setIsSoundDesignEnabled(newValue);
    localStorage.setItem('sound-design-enabled', newValue.toString());
  };

  // Функции управления громкостью с сохранением в localStorage
  const handleSetMusicVolume = (volume: number) => {
    setMusicVolume(volume);
    localStorage.setItem('mixer-music-volume', volume.toString());
  };

  const handleSetSfxVolume = (volume: number) => {
    setSfxVolume(volume);
    localStorage.setItem('mixer-sfx-volume', volume.toString());
  };

  const handleSetMasterVolume = (volume: number) => {
    setMasterVolume(volume);
    localStorage.setItem('mixer-master-volume', volume.toString());
  };

  // Функция плавного затухания текущего аудио
  const fadeOutCurrentAudio = (): Promise<void> => {
    return new Promise((resolve) => {
      // Находим все активные аудио элементы и затухаем их
      const audioElements = document.querySelectorAll('audio');
      let fadePromises: Promise<void>[] = [];

      audioElements.forEach(audio => {
        if (!audio.paused && audio.volume > 0) {
          const fadePromise = new Promise<void>((fadeResolve) => {
            let currentVolume = audio.volume;
            const fadeOut = setInterval(() => {
              currentVolume -= 0.003; // 4 секунды затухания
              if (currentVolume <= 0) {
                currentVolume = 0;
                audio.volume = 0;
                audio.pause();
                clearInterval(fadeOut);
                fadeResolve();
              } else {
                audio.volume = currentVolume;
              }
            }, 50);
          });
          fadePromises.push(fadePromise);
        }
      });

      if (fadePromises.length === 0) {
        resolve();
      } else {
        Promise.all(fadePromises).then(() => resolve());
      }
    });
  };


  const nextTrack = () => {
    if (currentPlaylist && currentTrackIndex < currentPlaylist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const prevTrack = () => {
    if (currentPlaylist && currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
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
      setCurrentProjectPlaylist,
      setCurrentProjectTrack,
      setIsProjectPlayerReady,
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
      setCurrentPage
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