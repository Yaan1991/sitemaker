import { useState, useRef, useEffect, useCallback } from 'react';

interface VerticalFaderProps {
  value: number; // 0.0 - 1.0
  onChange: (value: number) => void;
  label: string;
  isMaster?: boolean;
}

// dB шкала для конвертации линейного значения в dB
const dbScale = [
  { db: '+10', position: 0, value: 1.1 },
  { db: '+5', position: 12, value: 1.05 },
  { db: '0', position: 30, value: 1.0 },
  { db: '-5', position: 45, value: 0.95 },
  { db: '-10', position: 60, value: 0.9 },
  { db: '-20', position: 80, value: 0.8 },
  { db: '-30', position: 95, value: 0.7 },
  { db: '∞', position: 100, value: 0.0 }
];

export function VerticalFader({ value, onChange, label, isMaster = false }: VerticalFaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const faderRef = useRef<HTMLDivElement>(null);
  const trackHeight = 200; // высота трека фейдера
  const lastUpdateRef = useRef<number>(0);
  const pendingUpdateRef = useRef<number | null>(null);
  const latestValueRef = useRef<number>(value); // 🎯 Последнее значение

  // 🎵 Плавное обновление громкости с throttling
  const smoothOnChange = useCallback((newValue: number) => {
    const clampedValue = Math.max(0, Math.min(1.1, newValue));
    latestValueRef.current = clampedValue; // 🎯 Сохраняем последнее значение
    
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;
    
    // Ограничиваем частоту обновлений до 60 FPS (16ms)
    if (timeSinceLastUpdate >= 16) {
      onChange(clampedValue);
      lastUpdateRef.current = now;
      
      // Очищаем pending update
      if (pendingUpdateRef.current) {
        cancelAnimationFrame(pendingUpdateRef.current);
        pendingUpdateRef.current = null;
      }
    } else {
      // Отладываем обновление на следующий кадр
      if (!pendingUpdateRef.current) {
        pendingUpdateRef.current = requestAnimationFrame(() => {
          onChange(latestValueRef.current); // 🎯 Используем последнее значение
          lastUpdateRef.current = Date.now();
          pendingUpdateRef.current = null;
        });
      }
    }
  }, [onChange]);

  // 🎯 Применяем финальное значение при завершении
  const flushPendingUpdate = useCallback(() => {
    if (pendingUpdateRef.current) {
      cancelAnimationFrame(pendingUpdateRef.current);
      pendingUpdateRef.current = null;
      onChange(latestValueRef.current); // Применяем последнее значение
    }
  }, [onChange]);

  // Конвертируем значение 0-1 в позицию пикселей 
  const valueToPosition = (val: number) => {
    // Инвертируем значение (0 внизу, 1 вверху)
    const invertedValue = 1 - val;
    return Math.max(0, Math.min(100, invertedValue * 100));
  };

  // Конвертируем позицию пикселей в значение 0-1
  const positionToValue = (pos: number) => {
    const normalizedPos = Math.max(0, Math.min(100, pos));
    return 1 - (normalizedPos / 100);
  };

  const currentPosition = valueToPosition(value);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!faderRef.current) return;
    
    const rect = faderRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = (y / trackHeight) * 100;
    const newValue = positionToValue(percentage);
    
    smoothOnChange(newValue); // 🎵 Плавное обновление
  };

  // Touch-события для мобильных устройств
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Предотвращаем скролл страницы
    setIsTouching(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (!faderRef.current) return;
    
    const touch = e.touches[0];
    const rect = faderRef.current.getBoundingClientRect();
    const y = touch.clientY - rect.top;
    const percentage = (y / trackHeight) * 100;
    const newValue = positionToValue(percentage);
    
    smoothOnChange(newValue); // 🎵 Плавное обновление
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMouseMove(e);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      flushPendingUpdate(); // 🎯 Сохраняем последнее значение
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isTouching) {
        e.preventDefault(); // Предотвращаем скролл страницы
        handleTouchMove(e);
      }
    };

    const handleTouchEnd = () => {
      setIsTouching(false);
      flushPendingUpdate(); // 🎯 Сохраняем последнее значение
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    if (isTouching) {
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      // 🎵 Очищаем pending animation frame
      if (pendingUpdateRef.current) {
        cancelAnimationFrame(pendingUpdateRef.current);
        pendingUpdateRef.current = null;
      }
    };
  }, [isDragging, isTouching]);

  // Получаем ближайшее значение dB для отображения
  const getDbValue = (val: number) => {
    const closest = dbScale.reduce((prev, current) => 
      Math.abs(current.value - val) < Math.abs(prev.value - val) ? current : prev
    );
    return closest.db;
  };

  return (
    <div className="flex flex-col items-center space-y-3 p-4">
      {/* Заголовок канала */}
      <div className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">
        {label}
      </div>

      {/* Фейдер-контейнер */}
      <div className="relative flex items-center">
        {/* dB шкала слева */}
        <div className="relative h-50 w-8 mr-2">
          {dbScale.map((mark, index) => (
            <div
              key={index}
              className="absolute text-[10px] text-gray-300 right-0"
              style={{ 
                top: `${mark.position}%`, 
                transform: 'translateY(-50%)' 
              }}
            >
              {mark.db}
            </div>
          ))}
        </div>

        {/* Трек фейдера */}
        <div 
          ref={faderRef}
          className="relative w-8 bg-gray-800 border border-gray-600 cursor-pointer select-none touch-none"
          style={{ height: `${trackHeight}px` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Фон трека */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900"></div>
          
          {/* Ручка фейдера */}
          <div
            className={`absolute w-full h-4 rounded-sm border-2 transition-all duration-100 ${
              isMaster 
                ? 'bg-red-500 border-red-400 shadow-red-500/50' 
                : 'bg-gray-200 border-gray-300 shadow-gray-400/50'
            } ${(isDragging || isTouching) ? 'shadow-lg scale-105' : 'shadow-md'}`}
            style={{
              top: `${currentPosition}%`,
              transform: 'translateY(-50%)',
              boxShadow: (isDragging || isTouching)
                ? `0 0 10px ${isMaster ? '#ef4444' : '#9ca3af'}` 
                : `0 2px 4px ${isMaster ? '#dc2626' : '#6b7280'}`
            }}
          >
            {/* Линии на ручке для реализма */}
            <div className="absolute inset-x-1 top-1/2 transform -translate-y-1/2">
              <div className="h-0.5 bg-black/20 mb-0.5"></div>
              <div className="h-0.5 bg-black/20"></div>
            </div>
          </div>

          {/* Отметки на треке */}
          {dbScale.map((mark, index) => (
            <div
              key={index}
              className="absolute left-0 w-full h-px bg-gray-600"
              style={{ top: `${mark.position}%` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Текущее значение в dB */}
      <div className="text-[10px] text-yellow-400 font-mono bg-black/70 px-2 py-1 rounded">
        {getDbValue(value)}
      </div>

      {/* Процент громкости */}
      <div className="text-[10px] text-gray-400 font-mono">
        {Math.round(value * 100)}%
      </div>
    </div>
  );
}