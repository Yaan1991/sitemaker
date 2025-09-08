import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  url: string;
}

interface AudioPlayerProps {
  tracks: Track[];
  className?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function AudioPlayer({ tracks, className = '', onPlayStateChange }: AudioPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
    
    // Уведомляем родительский компонент об изменении состояния
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, currentTrackIndex, onPlayStateChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = (Number(e.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle Yandex.Disk links through our server proxy
  const getDirectUrl = (shareUrl: string) => {
    if (shareUrl.includes('disk.yandex.ru/d/')) {
      // Use our server proxy to handle Yandex.Disk links
      return `/api/proxy-audio?url=${encodeURIComponent(shareUrl)}`;
    }
    return shareUrl;
  };

  return (
    <div className={`glass-effect rounded-xl p-6 ${className}`}>
      <h4 className="text-xl font-semibold text-primary mb-4">Музыка из спектакля</h4>
      
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={getDirectUrl(currentTrack.url)}
        preload="metadata"
      />

      {/* Current Track Display */}
      <div className="mb-4">
        <div className="w-full max-w-xs overflow-hidden">
          <h5 className={`text-lg font-medium text-white mb-2 whitespace-nowrap ${
            currentTrack.title.length > 20 ? 'animate-marquee' : ''
          }`}>
            {currentTrack.title}
          </h5>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleProgressChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-12 h-12 bg-primary text-black rounded-full hover:bg-primary/80 transition-colors"
            data-testid="button-play-pause"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>

          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={toggleMute}
              className="text-gray-300 hover:text-white transition-colors"
              data-testid="button-mute"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-2">
        <h6 className="text-sm font-medium text-gray-400 mb-3">Все треки</h6>
        {tracks.map((track, index) => (
          <button
            key={track.id}
            onClick={() => selectTrack(index)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              index === currentTrackIndex
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
            data-testid={`button-track-${index}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                index === currentTrackIndex && isPlaying 
                  ? 'bg-primary animate-pulse' 
                  : 'bg-gray-500'
              }`} />
              <div className="flex-1 overflow-hidden">
                <span className={`text-sm whitespace-nowrap ${
                  track.title.length > 25 ? 'animate-marquee' : ''
                }`}>
                  {track.title}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}