import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isGlobalAudioEnabled, setIsGlobalAudioEnabled] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Track[] | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // По умолчанию звук выключен - включается только по кнопке
  useEffect(() => {
    // Убираем автозагрузку настроек - звук всегда выключен по умолчанию
    setIsGlobalAudioEnabled(false);
  }, []);

  const toggleGlobalAudio = () => {
    const newValue = !isGlobalAudioEnabled;
    setIsGlobalAudioEnabled(newValue);
    localStorage.setItem('global-audio-enabled', newValue.toString());
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
      prevTrack
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