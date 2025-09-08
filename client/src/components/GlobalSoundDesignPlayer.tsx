import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAudio } from '@/contexts/AudioContext';

export function GlobalSoundDesignPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [location] = useLocation();
  const { isGlobalAudioEnabled, sfxVolume, masterVolume } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [currentSoundFile, setCurrentSoundFile] = useState<string>('');

  // Определяем какой звуковой файл должен играть на текущей странице
  const getSoundDesignFile = () => {
    if (location.startsWith('/project/idiot-saratov-drama')) {
      return '/audio/idiot_showreel.mp3';
    }
    // Для главной и всех остальных страниц
    return '/audio/vinyl.mp3';
  };

  // Переключение файлов при смене страниц
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const newSoundFile = getSoundDesignFile();
    
    // Если нужно сменить файл
    if (newSoundFile !== currentSoundFile) {
      setCurrentSoundFile(newSoundFile);
      
      if (isPlaying) {
        // Плавно затухаем текущий звук
        fadeOut(() => {
          // После затухания перезагружаем и запускаем новый
          setTimeout(() => {
            audio.load();
            if (isGlobalAudioEnabled) {
              audio.volume = 0;
              audio.play().then(() => {
                setIsPlaying(true);
                fadeIn();
              }).catch(console.error);
            }
          }, 100);
        });
      } else {
        // Просто перезагружаем новый источник
        audio.load();
      }
    }
  }, [location, currentSoundFile, isPlaying, isGlobalAudioEnabled]);

  // Включение/выключение в зависимости от глобального состояния
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSoundFile) return;

    const shouldPlay = isGlobalAudioEnabled; // Sound Design играет когда основной звук включен

    if (shouldPlay && !isPlaying) {
      // Включаем звуковой дизайн
      audio.volume = 0;
      audio.play().then(() => {
        setIsPlaying(true);
        fadeIn();
      }).catch(console.error);
    } else if (!shouldPlay && isPlaying) {
      // Выключаем звуковой дизайн
      fadeOut();
    }
  }, [isGlobalAudioEnabled, isPlaying, currentSoundFile]);

  // Обновляем громкость при изменении настроек микшера
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    const newVolume = 0.15 * sfxVolume * masterVolume;
    audio.volume = newVolume;
    setCurrentVolume(newVolume);
  }, [sfxVolume, masterVolume, isPlaying]);

  const fadeIn = () => {
    const audio = audioRef.current;
    if (!audio) return;

    let volume = 0;
    const targetVolume = 0.15 * sfxVolume * masterVolume; // Учитываем настройки микшера
    const fadeInterval = setInterval(() => {
      volume += targetVolume / 50; // 2.5 секунды появления
      if (volume >= targetVolume) {
        volume = targetVolume;
        clearInterval(fadeInterval);
      }
      audio.volume = volume;
      setCurrentVolume(volume);
    }, 50);
  };

  const fadeOut = (callback?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    let volume = currentVolume;
    const fadeInterval = setInterval(() => {
      volume -= 0.002; // 2.5 секунды затухания
      if (volume <= 0) {
        volume = 0;
        audio.volume = 0;
        audio.pause();
        setIsPlaying(false);
        clearInterval(fadeInterval);
        if (callback) callback();
      } else {
        audio.volume = volume;
      }
      setCurrentVolume(volume);
    }, 50);
  };

  return (
    <audio
      ref={audioRef}
      src={currentSoundFile}
      loop
      preload="auto"
      className="hidden"
    />
  );
}