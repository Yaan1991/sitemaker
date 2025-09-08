import { motion } from "framer-motion";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { useRef, useEffect, useState } from "react";
const heroDesktop = "/images/hero.webp";
const heroMobile = "/images/hero_mobile.webp";

export default function Hero() {
  const { isGlobalAudioEnabled, toggleGlobalAudio } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Управление фоновой музыкой на главной
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isGlobalAudioEnabled && !isPlaying) {
      audio.volume = 0;
      audio.play().then(() => {
        setIsPlaying(true);
        // Плавное появление звука с задержкой для кроссфейда
        setTimeout(() => {
          let currentVolume = 0;
          const fadeIn = setInterval(() => {
            currentVolume += 0.02;
            if (currentVolume >= 0.3) {
              currentVolume = 0.3;
              clearInterval(fadeIn);
            }
            audio.volume = currentVolume;
          }, 50);
        }, 200);
      }).catch(console.error);
    } else if (!isGlobalAudioEnabled && isPlaying) {
      // Плавное затухание
      let currentVolume = audio.volume;
      const fadeOut = setInterval(() => {
        currentVolume -= 0.02;
        if (currentVolume <= 0) {
          currentVolume = 0;
          audio.pause();
          setIsPlaying(false);
          clearInterval(fadeOut);
        }
        audio.volume = currentVolume;
      }, 50);
    }
  }, [isGlobalAudioEnabled, isPlaying]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 768px)" srcSet={heroMobile} />
          <img
            src={heroDesktop}
            alt="Ян Кузьмичёв за звуковым пультом"
            className="w-full h-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-russo font-bold mb-6"
        >Ян Кузьмичёв</motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground mb-8 font-light"
        >Композитор • Саунд‑дизайнер • Звукорежиссёр</motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onClick={toggleGlobalAudio}
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white transition-all duration-300 animate-pulse-neon"
          data-testid="button-toggle-audio"
        >
          {isGlobalAudioEnabled ? (
            <>
              <VolumeX className="w-5 h-5" />
              Выкл. звук
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              Вкл. звук
            </>
          )}
        </motion.button>
      </div>
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>

      {/* Невидимый аудио элемент для фоновой музыки */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        className="hidden"
      >
        <source src="/audio/homepage.mp3" type="audio/mpeg" />
      </audio>
    </section>
  );
}
