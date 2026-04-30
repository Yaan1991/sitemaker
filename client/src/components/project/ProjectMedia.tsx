import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/useLanguage";

/**
 * Неоновый заголовок проекта с мигающей буквой «О» (для постера к «Идиоту»).
 */
export function NeonTitle({ text }: { text: string }) {
  return (
    <div className="inline-block">
      <h1 className="text-6xl lg:text-8xl neon-scorsese mb-2">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={char === 'О' ? 'neon-flicker-o' : ''}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}

/**
 * Двухстрочный заголовок «Маяковский / Я сам» с конструктивистской типографикой.
 */
export function MayakTitle({ text, lang }: { text: string; lang: 'ru' | 'en' }) {
  const isEn = lang === 'en';
  return (
    <div className="inline-block text-center">
      <h1 className="mayak-heading font-bold mb-2 adaptive-title" style={{ fontFamily: 'Jost, sans-serif' }}>
        {isEn ? 'MAYAKOVSKY' : 'МАЯКОВСКИЙ'}
      </h1>
      <h2
        className="text-4xl lg:text-6xl font-bold"
        style={{
          fontFamily: 'Bad Script, cursive',
          color: '#8B4513',
          textShadow: '2px 2px 4px rgba(139, 69, 19, 0.3)'
        }}
      >
        {isEn ? 'Myself' : 'Я сам'}
      </h2>
    </div>
  );
}

/**
 * Карусель комиксных кадров для «Петровых» — бесконечная горизонтальная лента.
 * Принимает либо проект с полем comicImages, либо просто массив изображений.
 */
interface ComicImageCarouselProps {
  images: string[];
}

export function ComicImageCarousel({ images }: ComicImageCarouselProps) {
  const { lang } = useLanguage();
  const duplicatedImages = [...images, ...images];

  return (
    <div className="comic-image-carousel">
      <div className="comic-images-container">
        {duplicatedImages.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt={lang === 'en'
              ? `Comic frame ${(index % images.length) + 1}`
              : `Комикс кадр ${(index % images.length) + 1}`}
            data-testid="img-project"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Авто-карусель фотографий с эффектом VHS. Меняет кадр каждые 4 секунды.
 */
export function PhotoCarousel({ photos }: { photos: string[] }) {
  const { lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <div className="photo-carousel vhs-enhanced rounded-lg shadow-2xl">
      {photos.map((photo, index) => (
        <img
          key={`${photo}-${index}`}
          src={photo}
          alt={lang === 'en'
            ? `Scene from the performance ${index + 1}`
            : `Кадр из спектакля ${index + 1}`}
          className={index === currentIndex ? 'active' : ''}
          data-testid="img-project"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ))}
    </div>
  );
}

/**
 * Анимированный эквалайзер в стиле Winamp. Высота столбиков рандомизируется
 * каждые 100 мс пока isPlaying === true.
 */
export function Equalizer({ isPlaying }: { isPlaying: boolean }) {
  const [bars, setBars] = useState<number[]>(Array(10).fill(0));

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(10).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setBars(bars => bars.map(() => Math.random() * 100));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="equalizer">
      {bars.map((height, index) => (
        <div
          key={index}
          className="eq-bar"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}
