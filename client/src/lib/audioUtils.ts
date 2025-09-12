/**
 * Audio utility functions for professional dB scale mixing console interface
 * Based on real-world audio console standards
 */

export interface DbScaleConfig {
  minDb: number;
  maxDb: number;
  labels: (number | string)[];
}

export const DEFAULT_DB_CONFIG: DbScaleConfig = {
  minDb: -60,
  maxDb: 10,
  labels: [10, 0, -5, -10, -20, -30, -40, -50, '∞']
};

/**
 * Convert decibels to linear gain value
 * @param db Decibel value
 * @returns Linear gain (0 for -∞, ~3.16 for +10dB)
 */
export function dbToGain(db: number): number {
  if (db === -Infinity) {
    return 0;
  }
  return Math.pow(10, db / 20);
}

/**
 * Convert linear gain to decibels
 * @param gain Linear gain value (0 to 1+)
 * @returns Decibel value (-∞ to +∞)
 */
export function gainToDb(gain: number): number {
  if (gain <= 0) {
    return -Infinity;
  }
  return 20 * Math.log10(gain);
}

/**
 * Convert fader position (0-1) to decibels
 * @param position Fader position (0 = bottom, 1 = top)
 * @param config dB scale configuration
 * @returns Decibel value
 */
export function positionToDb(position: number, config: DbScaleConfig = DEFAULT_DB_CONFIG): number {
  if (position <= 0) {
    return -Infinity;
  }
  if (position >= 1) {
    return config.maxDb;
  }
  
  return config.minDb + position * (config.maxDb - config.minDb);
}

/**
 * Convert decibels to fader position (0-1)
 * @param db Decibel value
 * @param config dB scale configuration
 * @returns Fader position (0-1)
 */
export function dbToPosition(db: number, config: DbScaleConfig = DEFAULT_DB_CONFIG): number {
  if (db === -Infinity || db <= config.minDb) {
    return 0;
  }
  if (db >= config.maxDb) {
    return 1;
  }
  
  return (db - config.minDb) / (config.maxDb - config.minDb);
}

/**
 * Convert fader position directly to gain (convenience function)
 * @param position Fader position (0-1)
 * @param config dB scale configuration
 * @returns Linear gain value
 */
export function positionToGain(position: number, config: DbScaleConfig = DEFAULT_DB_CONFIG): number {
  const db = positionToDb(position, config);
  return dbToGain(db);
}

/**
 * Convert gain directly to fader position (convenience function)
 * @param gain Linear gain value
 * @param config dB scale configuration
 * @returns Fader position (0-1)
 */
export function gainToPosition(gain: number, config: DbScaleConfig = DEFAULT_DB_CONFIG): number {
  const db = gainToDb(gain);
  return dbToPosition(db, config);
}

/**
 * Calculate tick positions for dB labels on the ruler
 * @param config dB scale configuration
 * @returns Array of {value, position, label} objects for rendering
 */
export function calculateDbTicks(config: DbScaleConfig = DEFAULT_DB_CONFIG) {
  return config.labels.map(label => {
    let db: number;
    let displayLabel: string;
    
    if (label === '∞' || label === '-∞') {
      db = -Infinity;
      displayLabel = '-∞';
    } else if (typeof label === 'string') {
      const parsed = parseFloat(label);
      db = isNaN(parsed) ? -Infinity : parsed;
      displayLabel = isNaN(parsed) ? '-∞' : label;
    } else {
      db = label;
      displayLabel = label.toString();
    }
    
    const position = dbToPosition(db, config);
    
    return {
      value: db,
      position: position * 100, // Convert to percentage for CSS
      label: displayLabel,
      isZeroDb: db === 0,
      isInfinity: db === -Infinity
    };
  });
}

/**
 * Format dB value for display
 * @param db Decibel value
 * @param precision Number of decimal places
 * @returns Formatted string
 */
export function formatDb(db: number, precision: number = 1): string {
  if (db === -Infinity) {
    return '-∞';
  }
  if (db >= 0) {
    return `+${db.toFixed(precision)}`;
  }
  return db.toFixed(precision);
}

/**
 * Clamp dB value to valid range
 * @param db Decibel value
 * @param config dB scale configuration
 * @returns Clamped dB value
 */
export function clampDb(db: number, config: DbScaleConfig = DEFAULT_DB_CONFIG): number {
  if (db === -Infinity || db <= config.minDb) {
    return -Infinity;
  }
  if (db >= config.maxDb) {
    return config.maxDb;
  }
  return db;
}

/**
 * Clamp gain to 0-1 range for audio engines that require it
 * @param gain Linear gain value
 * @returns Clamped gain (0-1)
 */
export function clampGain01(gain: number): number {
  return Math.max(0, Math.min(1, gain));
}

/**
 * Convert dB to gain with optional clamping for engine compatibility
 * @param db Decibel value
 * @param clamp01 Whether to clamp gain to 0-1 range
 * @returns Linear gain value
 */
export function safeGain(db: number, clamp01: boolean = false): number {
  const gain = dbToGain(db);
  return clamp01 ? clampGain01(gain) : gain;
}

/**
 * Snap dB value to 0 dB if within threshold (for UI detent)
 * @param db Decibel value
 * @param threshold Snap threshold in dB
 * @returns Snapped dB value
 */
export function snapToZeroDb(db: number, threshold: number = 0.5): number {
  if (db === -Infinity) {
    return db;
  }
  return Math.abs(db) <= threshold ? 0 : db;
}