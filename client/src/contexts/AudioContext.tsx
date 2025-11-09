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
    // 🎛️ Главный переключатель звука - ВСЕГДА выключен по умолчанию при каждом заходе
    // Не восстанавливаем из localStorage - пользователь должен явно включить звук на каждом визите
    setIsGlobalAudioEnabled(false);
    
    // 🎵 Индивидуальные настройки шин
    const savedMusicEnabled = localStorage.getItem('music-enabled-state');
    if (savedMusicEnabled) {
      setMusicEnabledState(savedMusicEnabled === 'true');
    }
    // Не устанавливаем значение по умолчанию - пользователь должен явно включить
    
    const savedSfxEnabled = localStorage.getItem('sfx-enabled-state');
    if (savedSfxEnabled) {
      setSfxEnabledState(savedSfxEnabled === 'true');
      setIsSoundDesignEnabled(savedSfxEnabled === 'true'); // Синхронизируем
    }
    // Не устанавливаем значение по умолчанию - пользователь должен явно включить

    // Сбрасываем настройки микшера на дефолтные значения при каждом заходе
    setMusicVolume(0.5); // 50%
    setSfxVolume(0.7); // 70%
    setMasterVolume(0.7); // 70%
    audioEngine.setMusicVolume(0.5);
    audioEngine.setSfxVolume(0.7);
    audioEngine.setMasterVolume(0.7);

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
      console.log('🎵 Запускаем аудио для страницы:', currentPage);
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
    // НЕ сохраняем в localStorage - звук всегда выключен при новом заходе
    // Вся логика включения/выключения в useEffect выше
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

  // Функции управления громкостью БЕЗ сохранения в localStorage (сбрасывается при каждом заходе)
  const handleSetMusicVolume = (volume: number) => {
    setMusicVolume(volume);
    audioEngine.setMusicVolume(volume);
  };

  const handleSetSfxVolume = (volume: number) => {
    setSfxVolume(volume);
    audioEngine.setSfxVolume(volume);
  };

  const handleSetMasterVolume = (volume: number) => {
    setMasterVolume(volume);
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