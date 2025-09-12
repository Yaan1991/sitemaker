import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Square } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { audioEngine } from '@/lib/HowlerAudioEngine';

interface Track {
  id: string;
  title: string;
  url: string;
}

// Equalizer компонент для анимации в стиле Winamp
function Equalizer({ isPlaying }: { isPlaying: boolean }) {
  const [barHeights, setBarHeights] = useState<number[]>(Array(20).fill(2));

  useEffect(() => {
    if (!isPlaying) {
      setBarHeights(Array(20).fill(2));
      return;
    }

    const interval = setInterval(() => {
      setBarHeights(prev => prev.map(() => Math.floor(Math.random() * 28) + 2)); // 2-30px высота
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const bars = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      className="bg-green-400 border-r border-green-600"
      style={{
        width: '2px',
        height: `${barHeights[i]}px`,
        marginRight: '1px',
        transition: 'height 0.1s ease-out',
        boxShadow: isPlaying ? '0 0 2px #00ff00' : 'none'
      }}
    />
  ));

  return (
    <div className="equalizer flex items-end justify-center h-8 px-1 bg-black rounded border border-gray-600 overflow-hidden">
      {bars}
    </div>
  );
}

interface WinampPlayerProps {
  projectId: string;
  className?: string;
  title?: string;
}

export function WinampPlayer({ projectId, className = '', title = "Музыка из спектакля" }: WinampPlayerProps) {
  const {
    isGlobalAudioEnabled,
    toggleGlobalAudio,
    currentProjectPlaylist,
    currentProjectTrack,
    isPlaying,
    currentTime,
    duration,
    isProjectPlayerReady
  } = useAudio();

  // Локальное состояние для отображения
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const [localDuration, setLocalDuration] = useState(0);

  // Синхронизируем локальное состояние с глобальным
  useEffect(() => {
    setLocalIsPlaying(isPlaying);
    setLocalCurrentTime(currentTime);
    setLocalDuration(duration);
  }, [isPlaying, currentTime, duration]);

  // Проверяем есть ли музыка для этого проекта
  const hasMusic = currentProjectPlaylist && currentProjectPlaylist.length > 0;

  // Скрываем плеер если нет музыки
  if (!hasMusic) {
    return null;
  }

  // 🎵 Функции управления - подключаем к HowlerAudioEngine
  const handleTogglePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Используем новый метод toggle pause вместо stopAll/play
    if (!isGlobalAudioEnabled) {
      toggleGlobalAudio();
      return;
    }
    
    audioEngine.toggleMusicPause();
  };
  
  const handleNextTrack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    audioEngine.nextMusicTrack();
  };
  
  const handlePrevTrack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    audioEngine.prevMusicTrack();
  };
  
  const handleStopAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    audioEngine.stopAll();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className={`max-w-4xl mx-auto mt-12 mb-8 relative ${className}`}
      style={{ zIndex: 50 }}
    >
      <h3 className="text-3xl font-bold text-white mb-8 text-center idiot-primary">
        {title}
      </h3>
      
      <div className="winamp-player p-6 relative" style={{ zIndex: 60 }}>
        
        {/* Winamp-style player interface */}
        <div className="space-y-4">
          
          {/* Top row: Display and Equalizer */}
          <div className="flex justify-between items-stretch gap-4">
            <div className="w-48 sm:w-64 md:w-80">
              <div className="winamp-display mb-2 h-8 flex items-center">
                {isProjectPlayerReady ? (
                  <div className="overflow-hidden whitespace-nowrap w-full">
                    <div className={`${
                      (currentProjectPlaylist?.[currentProjectTrack]?.title || 'Не выбран').length > 25 
                        ? 'animate-marquee' 
                        : 'animate-pulse'
                    }`}>
                      ♪ {currentProjectPlaylist?.[currentProjectTrack]?.title || 'Не выбран'} ♪
                    </div>
                  </div>
                ) : (
                  '*** ЗАГРУЗКА... ***'
                )}
              </div>
              <div className="flex items-center">
                <div className="track-info overflow-hidden whitespace-nowrap w-full">
                  <span className={`text-xs sm:text-sm ${
                    'Битрейт: 128 kbps • 44 kHz • Stereo • Композитор: Ян Кузьмичёв'.length > 35 
                      ? 'animate-marquee' 
                      : ''
                  }`}>
                    Битрейт: 128 kbps • 44 kHz • Stereo • Композитор: Ян Кузьмичёв
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleGlobalAudio();
                  }}
                  className={`winamp-button text-xs px-2 py-1 ml-2 ${isGlobalAudioEnabled ? 'active' : ''}`}
                  style={{ zIndex: 60 }}
                  title={isGlobalAudioEnabled ? "Выключить плеер" : "Включить плеер"}
                >
                  {isGlobalAudioEnabled ? 'PWR' : 'OFF'}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-24 sm:w-28 md:w-32">
              <div className="winamp-time text-xs sm:text-base">
                {formatTime(localCurrentTime)} / {formatTime(localDuration)}
              </div>
              <Equalizer isPlaying={localIsPlaying && isGlobalAudioEnabled} />
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${localDuration > 0 ? (localCurrentTime / localDuration) * 100 : 0}%` }}
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-center gap-2">
            <button 
              type="button"
              onClick={handlePrevTrack}
              className="winamp-button"
              style={{ zIndex: 60 }}
              disabled={!isGlobalAudioEnabled}
              title="Предыдущий трек"
              data-testid="button-prev-track"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isGlobalAudioEnabled) {
                  toggleGlobalAudio();
                  // Небольшая задержка после включения звука
                  setTimeout(() => {
                    // Запускаем воспроизведение первого трека
                    if (currentProjectPlaylist && currentProjectPlaylist.length > 0) {
                      audioEngine.playMusicTrack(0);
                    }
                  }, 200);
                } else {
                  handleTogglePlayPause(e);
                }
              }}
              className={`winamp-button ${localIsPlaying ? 'active' : ''}`}
              style={{ zIndex: 60 }}
              title={localIsPlaying ? "Пауза" : "Воспроизвести"}
              data-testid="button-play-pause"
            >
              {localIsPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            
            <button 
              type="button"
              onClick={handleNextTrack}
              className="winamp-button"
              style={{ zIndex: 60 }}
              disabled={!isGlobalAudioEnabled}
              title="Следующий трек"
              data-testid="button-next-track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            
            <button 
              type="button"
              onClick={handleStopAudio}
              className="winamp-button"
              style={{ zIndex: 60 }}
              disabled={!isGlobalAudioEnabled}
              title="Стоп"
              data-testid="button-stop"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}