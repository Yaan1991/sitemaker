import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface Track {
  id: string;
  title: string;
  url: string;
}

interface AudioContextType {
  isGlobalAudioEnabled: boolean;
  toggleGlobalAudio: () => void;
  currentPlaylist: Track[] | null;
  currentTrackIndex: number;
  setCurrentPlaylist: (playlist: Track[] | null) => void;
  setCurrentTrackIndex: (index: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  fadeOutCurrentAudio: () => Promise<void>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isGlobalAudioEnabled, setIsGlobalAudioEnabled] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Track[] | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState('/');
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // По умолчанию звук выключен - включается только по кнопке
  useEffect(() => {
    setIsGlobalAudioEnabled(false);
  }, []);

  const toggleGlobalAudio = () => {
    const newValue = !isGlobalAudioEnabled;
    setIsGlobalAudioEnabled(newValue);
    localStorage.setItem('global-audio-enabled', newValue.toString());
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
      currentPlaylist,
      currentTrackIndex,
      setCurrentPlaylist,
      setCurrentTrackIndex,
      nextTrack,
      prevTrack,
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