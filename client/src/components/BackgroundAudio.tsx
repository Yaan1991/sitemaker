import { useState, useRef, useEffect } from 'react';

interface BackgroundAudioProps {
  isEnabled: boolean;
  trackUrl: string;
  volume?: number;
}

export function BackgroundAudio({ isEnabled, trackUrl, volume = 0.3 }: BackgroundAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    
    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isEnabled) {
      audio.volume = volume;
      audio.loop = true;
      audio.play().catch(console.error);
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isEnabled, isLoaded, volume]);

  // Convert Yandex.Disk share links to server proxy
  const getProxyUrl = (shareUrl: string) => {
    if (shareUrl.includes('disk.yandex.ru/d/')) {
      return `/api/proxy-audio?url=${encodeURIComponent(shareUrl)}`;
    }
    return shareUrl;
  };

  return (
    <audio
      ref={audioRef}
      src={getProxyUrl(trackUrl)}
      preload="auto"
      style={{ display: 'none' }}
    />
  );
}