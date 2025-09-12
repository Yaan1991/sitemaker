import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAudio } from '@/contexts/AudioContext';

// 🚀 ОТКЛЮЧЕНО: Заменено на HowlerAudioEngine
export function GlobalBackgroundAudio() {
  // Компонент отключён - аудио управляется HowlerAudioEngine
  return null;
}

// 🗑️ Старая реализация (HTML5 - ОТКЛЮЧЕНО)
function GlobalBackgroundAudio_DISABLED() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [location] = useLocation();
  const { isGlobalAudioEnabled, musicVolume, masterVolume } = useAudio();
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
      // Запускаем сразу для настоящего кроссфейда (накладываем звуки)
      // Запускаем с нулевой громкости
      audio.volume = 0;
      audio.play().then(() => {
        setIsPlaying(true);
        // Плавное появление звука (2 секунды)
        fadeIn();
      }).catch(console.error);
    } else if (!shouldPlay && isPlaying) {
      // Плавное затухание (без задержки)
      fadeOut();
    }
  }, [isGlobalAudioEnabled, location, isPlaying]);

  // Обновляем громкость при изменении настроек микшера
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    const musicMultiplier = musicVolume / 0.7;
    const masterMultiplier = masterVolume / 0.7;
    const newVolume = 0.25 * musicMultiplier * masterMultiplier;
    audio.volume = newVolume;
    setCurrentVolume(newVolume);
  }, [musicVolume, masterVolume, isPlaying]);

  const fadeIn = () => {
    const audio = audioRef.current;
    if (!audio) return;

    let volume = 0;
    const musicMultiplier = musicVolume / 0.7; // 70% фейдера = 1.0x оригинала
    const masterMultiplier = masterVolume / 0.7; // 70% фейдера = 1.0x оригинала
    const targetVolume = 0.25 * musicMultiplier * masterMultiplier;
    const fadeInterval = setInterval(() => {
      volume += targetVolume / 40; // 2 секунды появления (2000ms / 50ms = 40 шагов)
      if (volume >= targetVolume) {
        volume = targetVolume;
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