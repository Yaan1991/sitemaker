import React, { createContext, useContext, useState, useEffect } from 'react';

interface AudioContextType {
  isGlobalAudioEnabled: boolean;
  toggleGlobalAudio: () => void;
  showWelcomeModal: boolean;
  setShowWelcomeModal: (show: boolean) => void;
  handleWelcomeChoice: (enabled: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isGlobalAudioEnabled, setIsGlobalAudioEnabled] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

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

  return (
    <AudioContext.Provider value={{
      isGlobalAudioEnabled,
      toggleGlobalAudio,
      showWelcomeModal,
      setShowWelcomeModal,
      handleWelcomeChoice
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