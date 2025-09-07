import React, { createContext, useContext, useState, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  url: string;
}

interface AudioContextType {
  isGlobalAudioEnabled: boolean;
  toggleGlobalAudio: () => void;
  showWelcomeModal: boolean;
  setShowWelcomeModal: (show: boolean) => void;
  handleWelcomeChoice: (enabled: boolean) => void;
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
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Track[] | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Проверяем при загрузке, показывали ли уже приветствие
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('has-seen-audio-welcome');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    } else {
      // Загружаем сохраненные настройки
      const savedAudioPreference = localStorage.getItem('global-audio-enabled');
      setIsGlobalAudioEnabled(savedAudioPreference === 'true');
    }
  }, []);

  const toggleGlobalAudio = () => {
    const newValue = !isGlobalAudioEnabled;
    setIsGlobalAudioEnabled(newValue);
    localStorage.setItem('global-audio-enabled', newValue.toString());
  };

  const handleWelcomeChoice = (enabled: boolean) => {
    setIsGlobalAudioEnabled(enabled);
    setShowWelcomeModal(false);
    localStorage.setItem('has-seen-audio-welcome', 'true');
    localStorage.setItem('global-audio-enabled', enabled.toString());
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
      showWelcomeModal,
      setShowWelcomeModal,
      handleWelcomeChoice,
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