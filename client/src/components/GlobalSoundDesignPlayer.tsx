import { useRef, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAudio } from '@/contexts/AudioContext';

export function GlobalSoundDesignPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [location] = useLocation();
  const { isGlobalAudioEnabled } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [currentSoundFile, setCurrentSoundFile] = useState<string>('');

  // Определяем какой звуковой файл должен играть на текущей странице
  const getSoundDesignFile = () => {
    console.log('=== SOUND DESIGN PLAYER ===');
    console.log('Current location:', location);
    
    if (location.startsWith('/project/idiot-saratov-drama')) {
      console.log('🎭 На странице Идиота, переключаю на idiot_showreel.mp3');
      return '/audio/idiot_showreel.mp3';
    }
    // Для главной и всех остальных страниц
    console.log('🏠 На другой странице, оставляю vinyl.mp3');
    return '/audio/vinyl.mp3';
  };

  // Переключение файлов при смене страниц
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const newSoundFile = getSoundDesignFile();
    
    console.log('Текущий файл:', currentSoundFile);
    console.log('Новый файл:', newSoundFile);
    
    // Если нужно сменить файл
    if (newSoundFile !== currentSoundFile) {
      console.log('🔄 Смена аудиофайла Sound Design');
      if (isPlaying) {
        // Плавно затухаем текущий звук
        fadeOut(() => {
          // После затухания меняем файл
          console.log('🎵 Загружаю новый аудиофайл:', newSoundFile);
          setCurrentSoundFile(newSoundFile);
          // ВАЖНО: Перезагружаем аудио элемент с новым источником
          audio.load(); 
          // И запускаем новый если нужно
          if (isGlobalAudioEnabled) {
            setTimeout(() => {
              audio.volume = 0;
              audio.play().then(() => {
                console.log('▶️ Новый файл играет:', newSoundFile);
                setIsPlaying(true);
                fadeIn();
              }).catch(console.error);
            }, 200); // Больше времени для загрузки
          }
        });
      } else {
        // Просто меняем файл если не играет
        console.log('🎵 Меняю файл в паузе:', newSoundFile);
        setCurrentSoundFile(newSoundFile);
        audio.load(); // Перезагружаем новый источник
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

  const fadeIn = () => {
    const audio = audioRef.current;
    if (!audio) return;

    let volume = 0;
    const fadeInterval = setInterval(() => {
      volume += 0.002; // 2.5 секунды появления, тише чем основная музыка
      if (volume >= 0.15) { // Максимум 15% громкости для фоновых шумов
        volume = 0.15;
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
      loop
      preload="auto"
      className="hidden"
    >
      {currentSoundFile && <source src={currentSoundFile} type="audio/mpeg" />}
    </audio>
  );
}