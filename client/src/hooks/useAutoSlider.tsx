import { useState, useEffect, useRef } from "react";

interface UseAutoSliderProps {
  totalSlides: number;
  intervalMs?: number;
  pauseOnHover?: boolean;
}

export function useAutoSlider({
  totalSlides,
  intervalMs = 6000,
  pauseOnHover = true,
}: UseAutoSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const play = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const pause = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying && totalSlides > 1) {
      intervalRef.current = setInterval(nextSlide, intervalMs);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, totalSlides, intervalMs]);

  const containerProps = pauseOnHover
    ? {
        onMouseEnter: pause,
        onMouseLeave: play,
      }
    : {};

  return {
    currentSlide,
    goToSlide,
    nextSlide,
    play,
    pause,
    isPlaying,
    containerProps,
  };
}
