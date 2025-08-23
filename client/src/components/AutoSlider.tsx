import { motion } from "framer-motion";
import { useAutoSlider } from "@/hooks/useAutoSlider";
import { cn } from "@/lib/utils";

interface AutoSliderProps {
  slides: React.ReactNode[];
  className?: string;
}

export default function AutoSlider({ slides, className }: AutoSliderProps) {
  const { currentSlide, goToSlide, containerProps } = useAutoSlider({
    totalSlides: slides.length,
    intervalMs: 6000,
  });

  if (slides.length === 0) return null;

  return (
    <div className={cn("w-full", className)} {...containerProps}>
      <div className="slider-container rounded-xl overflow-hidden">
        <motion.div
          className="slider-track"
          animate={{ transform: `translateX(-${currentSlide * 100}%)` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full">
              {slide}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Slider Controls */}
      {slides.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-colors duration-300",
                index === currentSlide
                  ? "bg-primary"
                  : "bg-muted-foreground hover:bg-muted"
              )}
              onClick={() => goToSlide(index)}
              data-testid={`slider-dot-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
