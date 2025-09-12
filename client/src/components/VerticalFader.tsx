import { useState, useRef, useEffect, useCallback } from 'react';
import {
  DbScaleConfig,
  DEFAULT_DB_CONFIG,
  MIXER_DB_CONFIG,
  gainToPosition,
  positionToGain,
  gainToDb,
  dbToPosition,
  calculateDbTicks,
  formatDb,
  snapToZeroDb,
  safeGain,
  dbToMixerGain,
  mixerGainToDb
} from '@/lib/audioUtils';

interface VerticalFaderProps {
  value: number; // Linear gain value (0.0 - 1.0+)
  onChange: (value: number) => void;
  label: string;
  isMaster?: boolean;
  dbConfig?: DbScaleConfig;
  showMobileLabels?: boolean; // For responsive design
  allowHeadroom?: boolean; // Allow gain values >1 for headroom, default: false
  useMixerScale?: boolean; // Use mixer scale where 0dB = 0.9 gain, default: false
}

export function VerticalFader({ 
  value, 
  onChange, 
  label, 
  isMaster = false,
  dbConfig = DEFAULT_DB_CONFIG,
  showMobileLabels = false,
  allowHeadroom = false,
  useMixerScale = false
}: VerticalFaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const faderRef = useRef<HTMLDivElement>(null);
  const trackHeight = 280; // Increased height for better precision
  const lastUpdateRef = useRef<number>(0);
  const pendingUpdateRef = useRef<number | null>(null);
  const latestValueRef = useRef<number>(value);

  // Convert gain to fader position and vice versa using dB scale
  const valueToPosition = useCallback((gain: number) => {
    if (useMixerScale) {
      // Convert mixer gain to dB, then to position
      const db = mixerGainToDb(gain);
      const position = dbToPosition(db, dbConfig);
      return (1 - position) * 100;
    } else {
      const position = gainToPosition(gain, dbConfig);
      return (1 - position) * 100; // Invert for visual representation (0 at bottom)
    }
  }, [dbConfig, useMixerScale]);

  const positionToValue = useCallback((posPercent: number) => {
    const normalizedPos = Math.max(0, Math.min(100, posPercent));
    const position = 1 - (normalizedPos / 100); // Invert back
    
    if (useMixerScale) {
      // Convert position to dB, then to mixer gain
      const db = positionToDb(position, dbConfig);
      return dbToMixerGain(db);
    } else {
      return positionToGain(position, dbConfig);
    }
  }, [dbConfig, useMixerScale]);

  // Smooth volume update with throttling and dB snapping
  const smoothOnChange = useCallback((newValue: number) => {
    const clampedValue = Math.max(0, newValue);
    
    // Apply dB snapping for 0 dB detent
    const currentDb = gainToDb(clampedValue);
    const snappedDb = snapToZeroDb(currentDb, 0.5);
    const rawFinalValue = snappedDb === currentDb ? clampedValue : safeGain(snappedDb);
    
    // Apply headroom clamping if disabled
    const finalValue = allowHeadroom ? rawFinalValue : safeGain(snappedDb, true);
    
    latestValueRef.current = finalValue;
    
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;
    
    // Limit updates to 60 FPS (16ms)
    if (timeSinceLastUpdate >= 16) {
      onChange(finalValue);
      lastUpdateRef.current = now;
      
      if (pendingUpdateRef.current) {
        cancelAnimationFrame(pendingUpdateRef.current);
        pendingUpdateRef.current = null;
      }
    } else {
      if (!pendingUpdateRef.current) {
        pendingUpdateRef.current = requestAnimationFrame(() => {
          onChange(latestValueRef.current);
          lastUpdateRef.current = Date.now();
          pendingUpdateRef.current = null;
        });
      }
    }
  }, [onChange, allowHeadroom]);

  const flushPendingUpdate = useCallback(() => {
    if (pendingUpdateRef.current) {
      cancelAnimationFrame(pendingUpdateRef.current);
      pendingUpdateRef.current = null;
      onChange(latestValueRef.current);
    }
  }, [onChange]);

  const currentPosition = valueToPosition(value);
  const currentDb = useMixerScale ? mixerGainToDb(value) : gainToDb(value);
  const dbTicks = calculateDbTicks(dbConfig);
  
  // Calculate 0 dB position safely
  const zeroDbPosition = dbToPosition(0, dbConfig);
  const zeroDbTick = dbTicks.find(t => t.isZeroDb);

  // Filter ticks for mobile view
  const visibleTicks = showMobileLabels 
    ? dbTicks.filter(tick => [10, 0, -10, -Infinity].includes(tick.value))
    : dbTicks;

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
    
    smoothOnChange(newValue);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
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
    
    smoothOnChange(newValue);
  };

  // Double-click to mute/unmute
  const handleDoubleClick = useCallback(() => {
    const newValue = value === 0 ? safeGain(0) : 0; // Toggle mute
    onChange(newValue);
  }, [value, onChange]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMouseMove(e);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      flushPendingUpdate();
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isTouching) {
        e.preventDefault();
        handleTouchMove(e);
      }
    };

    const handleTouchEnd = () => {
      setIsTouching(false);
      flushPendingUpdate();
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
      
      if (pendingUpdateRef.current) {
        cancelAnimationFrame(pendingUpdateRef.current);
        pendingUpdateRef.current = null;
      }
    };
  }, [isDragging, isTouching]);

  return (
    <div className="flex flex-col items-center space-y-3 p-4" data-testid={`fader-${label.toLowerCase()}`}>
      {/* Channel Label */}
      <div className={`text-xs font-bold text-white bg-black/50 px-2 py-1 rounded ${
        isMaster ? 'bg-red-900/50 border border-red-500/30' : ''
      }`}>
        {label}
      </div>

      {/* Fader Container */}
      <div className="relative flex items-center">
        {/* dB Scale Ruler */}
        <div className="relative mr-3" style={{ height: `${trackHeight}px` }}>
          {visibleTicks.map((tick, index) => (
            <div
              key={index}
              className="absolute flex items-center"
              style={{ 
                top: `${(1 - tick.position / 100) * 100}%`, 
                transform: 'translateY(-50%)',
                right: '0'
              }}
            >
              {/* Tick Mark */}
              <div className={`h-px bg-gray-400 ${
                tick.isZeroDb ? 'w-3 bg-yellow-400' : 
                tick.isInfinity ? 'w-2 bg-red-400' : 
                'w-2'
              }`}></div>
              
              {/* Label */}
              <div className={`text-[10px] ml-1 select-none ${
                tick.isZeroDb ? 'text-yellow-400 font-bold' : 
                tick.isInfinity ? 'text-red-400' : 
                'text-gray-300'
              }`}>
                {tick.label}
              </div>
            </div>
          ))}
        </div>

        {/* Fader Track */}
        <div 
          ref={faderRef}
          className="relative w-8 bg-gray-800 border border-gray-600 cursor-pointer select-none touch-none"
          style={{ height: `${trackHeight}px` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onDoubleClick={handleDoubleClick}
          data-testid={`fader-track-${label.toLowerCase()}`}
        >
          {/* Track Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900"></div>
          
          {/* Headroom Zone (above 0dB) */}
          <div 
            className="absolute left-0 w-full bg-gradient-to-b from-red-500/20 to-transparent"
            style={{
              top: '0%',
              height: `${(1 - zeroDbPosition) * 100}%`
            }}
          ></div>

          {/* 0 dB Line */}
          <div
            className="absolute left-0 w-full h-px bg-yellow-400 shadow-yellow-400/50"
            style={{ 
              top: `${(1 - zeroDbPosition) * 100}%`,
              boxShadow: '0 0 2px currentColor'
            }}
          ></div>
          
          {/* Fader Handle */}
          <div
            className={`absolute w-full h-5 rounded-sm border-2 transition-all duration-100 ${
              isMaster 
                ? 'bg-red-500 border-red-400 shadow-red-500/50' 
                : 'bg-gray-200 border-gray-300 shadow-gray-400/50'
            } ${(isDragging || isTouching) ? 'shadow-lg scale-105' : 'shadow-md'}`}
            style={{
              top: `${currentPosition}%`,
              transform: 'translateY(-50%)',
              boxShadow: (isDragging || isTouching)
                ? `0 0 12px ${isMaster ? '#ef4444' : '#9ca3af'}` 
                : `0 2px 6px ${isMaster ? '#dc2626' : '#6b7280'}`
            }}
            data-testid={`fader-handle-${label.toLowerCase()}`}
          >
            {/* Handle grip lines */}
            <div className="absolute inset-x-1 top-1/2 transform -translate-y-1/2 space-y-0.5">
              <div className="h-0.5 bg-black/20"></div>
              <div className="h-0.5 bg-black/20"></div>
              <div className="h-0.5 bg-black/20"></div>
            </div>

            {/* Live dB Readout on Handle */}
            <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-[9px] font-mono px-1 py-0.5 rounded text-white ${
              isMaster ? 'bg-red-600' : 'bg-gray-700'
            } ${(isDragging || isTouching) ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
              {formatDb(currentDb, 1)}
            </div>
          </div>

          {/* Tick marks on track */}
          {visibleTicks.map((tick, index) => (
            <div
              key={index}
              className={`absolute left-0 w-full h-px ${
                tick.isZeroDb ? 'bg-yellow-400' : 
                tick.isInfinity ? 'bg-red-400' : 
                'bg-gray-600'
              }`}
              style={{ top: `${(1 - tick.position / 100) * 100}%` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Current dB Value Display */}
      <div className={`text-[11px] font-mono px-2 py-1 rounded border ${
        isMaster 
          ? 'text-red-400 bg-red-900/30 border-red-500/30' 
          : 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30'
      }`} data-testid={`fader-value-${label.toLowerCase()}`}>
        {formatDb(currentDb, 1)}
      </div>

      {/* Gain percentage for reference */}
      <div className="text-[10px] text-gray-500 font-mono">
        {Math.round(value * 100)}%
      </div>
    </div>
  );
}