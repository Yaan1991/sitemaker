import { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // миллисекунды между символами
  className?: string;
  style?: React.CSSProperties;
  delay?: number; // задержка перед началом печати
}

export function TypewriterText({ 
  text, 
  speed = 40, 
  className = "", 
  style = {},
  delay = 0 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Проверяем что text существует и это строка
  const safeText = text || "";

  // Intersection Observer для отслеживания видимости
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3, // Запускать когда 30% элемента видно
        rootMargin: '50px' // Запускать чуть раньше
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasStarted]);

  // Эффект печати
  useEffect(() => {
    if (!isVisible || hasStarted) return;
    
    setHasStarted(true);
    
    const startTyping = () => {
      let index = 0;
      const typeNextChar = () => {
        if (index < safeText.length) {
          setDisplayedText(prev => prev + safeText[index]);
          index++;
          setTimeout(typeNextChar, speed);
        }
      };
      typeNextChar();
    };

    if (delay > 0) {
      setTimeout(startTyping, delay);
    } else {
      startTyping();
    }
  }, [isVisible, safeText, speed, delay, hasStarted]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        fontFamily: '"Courier New", "American Typewriter", monospace',
        letterSpacing: '0.5px',
        lineHeight: '1.6',
        minHeight: `${Math.ceil(safeText.length / 80) * 1.6}em`, // Резервируем пространство заранее
        ...style
      }}
    >
      {displayedText}
    </div>
  );
}