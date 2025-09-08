import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAudio } from '@/contexts/AudioContext';

export function GlobalBackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [location] = useLocation();
  const { isGlobalAudioEnabled } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0);

  // Определяем, должна ли играть фоновая музыка на текущей странице
  const shouldPlayBackground = () => {
    // Фоновая музыка играет на всех страницах КРОМЕ страниц проектов
    return !location.startsWith('/project/');
  };

  // Плавное включение/выключение в зависимости от страницы и глобального состояния
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const shouldPlay = isGlobalAudioEnabled && shouldPlayBackground();

    if (shouldPlay && !isPlaying) {
      // Если переходим С проектной страницы - добавляем задержку для кроссфейда
      const delay = location === '/' || !location.startsWith('/project/') ? 2000 : 0;
      
      setTimeout(() => {
        // Запускаем с нулевой громкости
        audio.volume = 0;
        audio.play().then(() => {
          setIsPlaying(true);
          // Плавное появление звука (2 секунды)
          fadeIn();
        }).catch(console.error);
      }, delay);
    } else if (!shouldPlay && isPlaying) {
      // Плавное затухание (без задержки)
      fadeOut();
    }
  }, [isGlobalAudioEnabled, location, isPlaying]);

  const fadeIn = () => {
    const audio = audioRef.current;
    if (!audio) return;

    let volume = 0;
    const fadeInterval = setInterval(() => {
      volume += 0.006; // 2 секунды появления (2000ms / 50ms = 40 шагов, 0.25 / 40 = 0.006)
      if (volume >= 0.25) {
        volume = 0.25;
        clearInterval(fadeInterval);
      }
      audio.volume = volume;
      setCurrentVolume(volume);
    }, 50);
  };

  const fadeOut = () => {
    const audio = audioRef.current;
    if (!audio) return;

    let volume = currentVolume;
    const fadeInterval = setInterval(() => {
      volume -= 0.003; // 4 секунды затухания (4000ms / 50ms = 80 шагов, 0.25 / 80 = 0.003)
      if (volume <= 0) {
        volume = 0;
        audio.volume = 0;
        audio.pause();
        setIsPlaying(false);
        clearInterval(fadeInterval);
      } else {
        audio.volume = volume;
      }
      setCurrentVolume(volume);
    }, 50);
  };

  return (
    <audio
      ref={audioRef}
      loop
      preload="auto"
      className="hidden"
    >
      <source src="/audio/homepage.mp3" type="audio/mpeg" />
    </audio>
  );
}