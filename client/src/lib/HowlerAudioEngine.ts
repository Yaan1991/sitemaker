import { Howl, Howler } from 'howler';

interface Track {
  id: string;
  title: string;
  url: string;
}

interface AudioBusOptions {
  volume: number;
  loop: boolean;
  fade?: boolean;
}

/**
 * Professional two-bus audio engine using Howler.js
 * Manages Music Bus + Sound Design Bus with simultaneous playback
 */
export class HowlerAudioEngine {
  // Audio Buses
  private musicBus: Howl | null = null;
  private soundDesignBus: Howl | null = null;
  
  // 🚀 Кэш предзагруженных Howl-ов для мгновенного переключения
  private musicCache: Map<string, Howl> = new Map();
  private sfxCache: Map<string, Howl> = new Map();
  private isPreloaded = false;
  
  // Playback State
  private isInitialized = false;
  private musicVolume = 0.3; // Reduced by ~5dB from 0.5
  private sfxVolume = 0.7;
  private masterVolume = 0.7;
  private isMusicEnabled = true;
  private isSfxEnabled = true;
  
  // Track Management
  private currentMusicPlaylist: Track[] | null = null;
  private currentMusicTrackIndex = 0;
  private currentSfxTrack: string | null = null;
  
  // Fade Management - Независимые фейды для каждой шины
  private musicFadeTimer?: NodeJS.Timeout;
  private sfxFadeTimer?: NodeJS.Timeout;
  
  // Event Callbacks
  private onTimeUpdate?: (time: number, duration: number) => void;
  private onTrackEnd?: () => void;
  private onPlaybackStateChange?: (isPlaying: boolean) => void;
  private onTrackChange?: (trackIndex: number, playlist: Track[]) => void;
  
  // Time tracking
  private timeTrackingInterval?: NodeJS.Timeout;
  
  // Route-based Audio Mapping
  private readonly routeMapping = {
    music: {
      '/': {
        id: 'homepage',
        title: 'Фоновая музыка',
        url: '/audio/homepage.mp3'
      },
      '/project/idiot-saratov-drama': [
        { id: 'nastasya', title: 'Тема Настасьи Филипповны', url: '/audio/nastasya.mp3' },
        { id: 'myshkin', title: 'Тема Мышкина', url: '/audio/myshkin.mp3' },
        { id: 'nastasya_nightmare', title: 'Кошмар Настасьи Филипповны', url: '/audio/nastasya_nightmare.mp3' },
        { id: 'city', title: 'Тема города', url: '/audio/city.mp3' }
      ],
      '/project/mayakovsky-moscow-estrada': [
        { id: 'letters', title: 'Письма', url: '/audio/mayak_letters.mp3' },
        { id: 'lilya_theme', title: 'Тема Маяковского и Лили', url: '/audio/mayak_lilya_theme.mp3' },
        { id: 'gori_gori', title: 'Гори-гори', url: '/audio/mayak_gori_gori.mp3' }
      ],
      '/project/petrovy-saratov-drama': [
        { id: 'petrovy_lonely_theme', title: 'Тема одиночества', url: '/audio/Petrovy_lonely_theme.mp3' },
        { id: 'petrovy_mad_theme', title: 'Приехали в гости', url: '/audio/Petrovy_mad_theme.mp3' },
        { id: 'petrovy_theme_of_sick', title: 'Болезнь Петрова младшего', url: '/audio/Petrovy_theme_of_sick.mp3' }
      ],
      '/project/homo-homini-short': [
        { id: 'hhmusicreel', title: 'Homo Homini Music Reel', url: '/audio/hhmusicreel.mp3' }
      ],
      '/project/ma-short-film': [], // No music for Ma project - just sound design
      '/project/son-o-hlebe-zotov': [] // No music for Son o Hlebe project
    },
    soundDesign: {
      '/': '/audio/vinyl.mp3', // Default vinyl sound
      '/project/idiot-saratov-drama': '/audio/idiot_showreel.mp3',
      '/project/mayakovsky-moscow-estrada': '/audio/mayak_showreel.mp3',
      '/project/ma-short-film': '/audio/masounds.mp3',
      '/project/homo-homini-short': '/audio/vinyl.mp3',
      '/project/petrovy-saratov-drama': '/audio/vinyl.mp3'
    }
  };

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;
    
    // Set global Howler settings
    Howler.volume(1.0); // We manage volume per-sound
    this.isInitialized = true;
  }

  /**
   * 🚀 Умная предзагрузка: только критичные файлы (главная страница)
   * Остальные загружаются по требованию с html5: true для экономии памяти
   */
  public preloadCritical(): void {
    if (this.isPreloaded) return;
    
    console.log('🎵 Предзагрузка критичных аудиофайлов...');
    
    // Предзагружаем только главную страницу для мгновенного старта
    const homeMusic = this.routeMapping.music['/'];
    if (homeMusic && 'url' in homeMusic) {
      const howl = new Howl({
        src: [homeMusic.url],
        preload: true,
        html5: true, // Для экономии памяти
        volume: 0
      });
      howl.load();
      this.musicCache.set(homeMusic.url, howl);
    }
    
    const homeSfx = this.routeMapping.soundDesign['/'];
    if (homeSfx) {
      const howl = new Howl({
        src: [homeSfx],
        preload: true,
        html5: true, // Для экономии памяти на больших лупах
        loop: true,
        volume: 0
      });
      howl.load();
      this.sfxCache.set(homeSfx, howl);
    }
    
    this.isPreloaded = true;
    console.log('✅ Предзагрузка критичных файлов завершена');
  }

  /**
   * Calculate effective volume: master * busVolume
   */
  private calculateEffectiveVolume(busVolume: number): number {
    return this.masterVolume * busVolume;
  }

  /**
   * Clear fade timers per bus - независимо
   */
  private clearMusicFade() {
    if (this.musicFadeTimer) {
      clearTimeout(this.musicFadeTimer);
      this.musicFadeTimer = undefined;
    }
  }

  private clearSfxFade() {
    if (this.sfxFadeTimer) {
      clearTimeout(this.sfxFadeTimer);
      this.sfxFadeTimer = undefined;
    }
  }

  /**
   * Профессиональные независимые фейды для каждой шины
   */
  private fadeMusicBus(fromVolume: number, toVolume: number, duration: number, onComplete?: () => void): void {
    if (!this.musicBus) return;
    
    this.clearMusicFade();
    this.musicBus.fade(fromVolume, toVolume, duration);
    
    if (onComplete) {
      this.musicFadeTimer = setTimeout(onComplete, duration);
    }
  }

  private fadeSfxBus(fromVolume: number, toVolume: number, duration: number, onComplete?: () => void): void {
    if (!this.soundDesignBus) return;
    
    this.clearSfxFade();
    this.soundDesignBus.fade(fromVolume, toVolume, duration);
    
    if (onComplete) {
      this.sfxFadeTimer = setTimeout(onComplete, duration);
    }
  }

  /**
   * Music Bus Management
   */
  public async playMusic(route: string, trackIndex = 0): Promise<void> {
    if (!this.isMusicEnabled) return;

    // Проверяем есть ли специфичная музыка для маршрута
    let musicData = this.routeMapping.music[route as keyof typeof this.routeMapping.music];
    
    // Для проектных страниц (не путать с /projects) без специфичной музыки - останавливаем музыку
    if (!musicData && route.startsWith('/project/')) {
      if (this.musicBus) {
        this.fadeMusicBus(this.musicBus.volume(), 0, 300, () => {
          this.musicBus?.stop(); // НЕ unload - сохраняем кэш!
          this.musicBus = null;
        });
      }
      return;
    }
    
    // Если нет специфичной музыки для обычных страниц, используем музыку главной страницы как фоновую
    if (!musicData) {
      musicData = this.routeMapping.music['/'];
    }
    
    if (!musicData) return;

    // Получаем целевой трек
    const targetTrack = Array.isArray(musicData) ? musicData[Math.min(trackIndex, musicData.length - 1)] : musicData;
    
    // Если уже играет тот же трек, не перезапускаем
    const currentTrack = this.getCurrentMusicTrack();
    
    if (this.musicBus && currentTrack?.url === targetTrack?.url) {
      return;
    }

    // Stop current music with fast fade-out (300ms instead of 1000ms for game-like responsiveness)
    if (this.musicBus) {
      this.fadeMusicBus(this.musicBus.volume(), 0, 300, () => {
        this.musicBus?.stop(); // НЕ unload - сохраняем кэш!
        this.musicBus = null;
        this.startNewMusic(musicData, trackIndex);
      });
    } else {
      this.startNewMusic(musicData, trackIndex);
    }
  }

  private startNewMusic(musicData: Track | Track[], trackIndex: number): void {
    let currentTrack: Track;
    
    if (Array.isArray(musicData)) {
      this.currentMusicPlaylist = musicData;
      this.currentMusicTrackIndex = Math.min(trackIndex, musicData.length - 1);
      currentTrack = musicData[this.currentMusicTrackIndex];
    } else {
      this.currentMusicPlaylist = [musicData];
      this.currentMusicTrackIndex = 0;
      currentTrack = musicData;
    }

    // Check if currentTrack exists and has a valid URL
    if (!currentTrack || !currentTrack.url) {
      console.warn('No valid track data found, skipping music initialization');
      return;
    }

    const effectiveVolume = this.calculateEffectiveVolume(this.musicVolume);
    const isLooping = !this.currentMusicPlaylist || this.currentMusicPlaylist.length === 1;
    
    // 🚀 Проверяем кэш для мгновенного старта
    const cached = this.musicCache.get(currentTrack.url);
    if (cached) {
      console.log('⚡ Используем закэшированный трек:', currentTrack.title);
      // Переиспользуем закэшированный Howl
      this.musicBus = cached;
      
      // Сбрасываем состояние
      this.musicBus.off(); // Удаляем старые listeners
      this.musicBus.seek(0); // Сброс позиции
      this.musicBus.loop(isLooping);
      this.musicBus.volume(0); // Начинаем с 0 для fade-in
      
      // Устанавливаем новые listeners
      this.musicBus.on('play', () => {
        this.startTimeTracking();
        this.onPlaybackStateChange?.(true);
      });
      this.musicBus.on('pause', () => {
        this.stopTimeTracking();
        this.onPlaybackStateChange?.(false);
      });
      this.musicBus.on('stop', () => {
        this.stopTimeTracking();
        this.onPlaybackStateChange?.(false);
      });
      this.musicBus.on('end', () => {
        this.stopTimeTracking();
        this.onPlaybackStateChange?.(false);
        if (this.currentMusicPlaylist && this.currentMusicPlaylist.length > 1) {
          this.nextMusicTrack();
        }
        this.onTrackEnd?.();
      });
      
      // Мгновенный старт с fade-in
      this.musicBus.play();
      this.fadeMusicBus(0, effectiveVolume, 500);
    } else {
      // Создаем новый Howl с html5 для быстрой загрузки
      console.log('📥 Загружаем новый трек:', currentTrack.title);
      this.musicBus = new Howl({
        src: [currentTrack.url],
        loop: isLooping,
        volume: 0, // Start at 0 for fade-in
        html5: true, // Стриминг для быстрой загрузки
        preload: true,
        onload: () => {
          console.log('✅ Трек загружен:', currentTrack.title);
          this.fadeMusicBus(0, effectiveVolume, 500);
        },
        onplay: () => {
          this.startTimeTracking();
          this.onPlaybackStateChange?.(true);
        },
        onpause: () => {
          this.stopTimeTracking();
          this.onPlaybackStateChange?.(false);
        },
        onstop: () => {
          this.stopTimeTracking();
          this.onPlaybackStateChange?.(false);
        },
        onend: () => {
          this.stopTimeTracking();
          this.onPlaybackStateChange?.(false);
          if (this.currentMusicPlaylist && this.currentMusicPlaylist.length > 1) {
            this.nextMusicTrack();
          }
          this.onTrackEnd?.();
        }
      });
      
      // Кэшируем для следующего использования
      this.musicCache.set(currentTrack.url, this.musicBus);
      this.musicBus.play();
    }
    
    // Notify about track change (playback state will be handled by onplay event)
    this.onTrackChange?.(this.currentMusicTrackIndex, this.currentMusicPlaylist!);
  }

  /**
   * Sound Design Bus Management
   */
  public async playSoundDesign(route: string): Promise<void> {
    if (!this.isSfxEnabled) return;

    // Проверяем есть ли специфичный звуковой дизайн для маршрута
    let sfxUrl = this.routeMapping.soundDesign[route as keyof typeof this.routeMapping.soundDesign];
    
    // Если нет специфичного звука, используем звук главной страницы как фоновый
    if (!sfxUrl) {
      sfxUrl = this.routeMapping.soundDesign['/'];
    }
    
    if (!sfxUrl || sfxUrl === this.currentSfxTrack) return;

    // Stop current SFX with fast fade-out (300ms for game-like responsiveness)
    if (this.soundDesignBus) {
      this.fadeSfxBus(this.soundDesignBus.volume(), 0, 300, () => {
        this.soundDesignBus?.stop(); // НЕ unload - сохраняем кэш!
        this.soundDesignBus = null;
        this.startNewSoundDesign(sfxUrl);
      });
    } else {
      this.startNewSoundDesign(sfxUrl);
    }
  }

  private startNewSoundDesign(sfxUrl: string): void {
    this.currentSfxTrack = sfxUrl;
    const effectiveVolume = this.calculateEffectiveVolume(this.sfxVolume) * 0.15; // Lower base volume for ambients

    // 🚀 Проверяем кэш для мгновенного старта
    const cached = this.sfxCache.get(sfxUrl);
    if (cached) {
      console.log('⚡ Используем закэшированный SFX:', sfxUrl);
      // Переиспользуем закэшированный Howl
      this.soundDesignBus = cached;
      
      // Сбрасываем состояние
      this.soundDesignBus.off(); // Удаляем старые listeners
      this.soundDesignBus.seek(0); // Сброс позиции
      this.soundDesignBus.loop(true);
      this.soundDesignBus.volume(0); // Начинаем с 0 для fade-in
      
      // Мгновенный старт с fade-in
      this.soundDesignBus.play();
      this.fadeSfxBus(0, effectiveVolume, 500);
    } else {
      // Создаем новый Howl с html5 для быстрой загрузки
      console.log('📥 Загружаем новый SFX:', sfxUrl);
      this.soundDesignBus = new Howl({
        src: [sfxUrl],
        loop: true,
        volume: 0, // Start at 0 for fade-in
        html5: true, // Стриминг для быстрой загрузки
        preload: true,
        onload: () => {
          console.log('✅ SFX загружен:', sfxUrl);
          this.fadeSfxBus(0, effectiveVolume, 500);
        }
      });
      
      // Кэшируем для следующего использования
      this.sfxCache.set(sfxUrl, this.soundDesignBus);
      this.soundDesignBus.play();
    }
  }

  /**
   * Route Change - updates both buses
   */
  public async changeRoute(route: string): Promise<void> {
    // Update both buses for new route
    await Promise.all([
      this.playMusic(route),
      this.playSoundDesign(route)
    ]);
  }

  /**
   * Track Navigation
   */
  public nextMusicTrack(): void {
    if (!this.currentMusicPlaylist || this.currentMusicPlaylist.length <= 1) return;
    
    const nextIndex = (this.currentMusicTrackIndex + 1) % this.currentMusicPlaylist.length;
    this.playMusicTrack(nextIndex);
  }

  public prevMusicTrack(): void {
    if (!this.currentMusicPlaylist || this.currentMusicPlaylist.length <= 1) return;
    
    const prevIndex = this.currentMusicTrackIndex === 0 
      ? this.currentMusicPlaylist.length - 1 
      : this.currentMusicTrackIndex - 1;
    this.playMusicTrack(prevIndex);
  }

  public playMusicTrack(trackIndex: number): void {
    if (!this.currentMusicPlaylist || trackIndex >= this.currentMusicPlaylist.length) return;
    
    this.currentMusicTrackIndex = trackIndex;
    const track = this.currentMusicPlaylist[trackIndex];
    
    if (this.musicBus) {
      this.fadeMusicBus(this.musicBus.volume(), 0, 300, () => {
        this.musicBus?.stop();
        this.startNewMusic(this.currentMusicPlaylist!, trackIndex);
      });
    }
  }

  /**
   * Volume Control
   */
  public setMasterVolume(volume: number): void {
    this.masterVolume = volume;
    this.updateBusVolumes();
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = volume;
    this.updateBusVolumes();
  }

  public setSfxVolume(volume: number): void {
    this.sfxVolume = volume;
    this.updateBusVolumes();
  }

  private updateBusVolumes(): void {
    if (this.musicBus) {
      const musicVolume = this.calculateEffectiveVolume(this.musicVolume);
      this.musicBus.volume(musicVolume);
    }
    
    if (this.soundDesignBus) {
      const sfxVolume = this.calculateEffectiveVolume(this.sfxVolume) * 0.15;
      this.soundDesignBus.volume(sfxVolume);
    }
  }

  /**
   * Enable/Disable Buses
   */
  public setMusicEnabled(enabled: boolean): void {
    this.isMusicEnabled = enabled;
    
    if (!enabled && this.musicBus) {
      this.fadeMusicBus(this.musicBus.volume(), 0, 300, () => {
        this.musicBus?.stop();
      });
    }
  }

  public setSfxEnabled(enabled: boolean): void {
    this.isSfxEnabled = enabled;
    
    if (!enabled && this.soundDesignBus) {
      this.fadeSfxBus(this.soundDesignBus.volume(), 0, 300, () => {
        this.soundDesignBus?.stop();
      });
    }
  }

  /**
   * Global Stop/Pause
   */
  public async stopAll(): Promise<void> {
    const promises = [];
    
    if (this.musicBus) {
      promises.push(new Promise<void>(resolve => {
        this.fadeMusicBus(this.musicBus!.volume(), 0, 300, () => {
          this.musicBus?.stop();
          resolve();
        });
      }));
    }
    
    if (this.soundDesignBus) {
      promises.push(new Promise<void>(resolve => {
        this.fadeSfxBus(this.soundDesignBus!.volume(), 0, 300, () => {
          this.soundDesignBus?.stop();
          resolve();
        });
      }));
    }
    
    await Promise.all(promises);
  }

  /**
   * State Getters
   */
  public getCurrentMusicTrack(): Track | null {
    return this.currentMusicPlaylist ? this.currentMusicPlaylist[this.currentMusicTrackIndex] : null;
  }

  public getCurrentPlaylist(): Track[] | null {
    return this.currentMusicPlaylist;
  }

  public getCurrentTrackIndex(): number {
    return this.currentMusicTrackIndex;
  }

  public isPlaying(): boolean {
    return (this.musicBus?.playing() || false) || (this.soundDesignBus?.playing() || false);
  }

  /**
   * 🎵 Управление воспроизведением музыки
   */
  public pauseMusic(): void {
    if (this.musicBus?.playing()) {
      this.musicBus.pause();
      this.stopTimeTracking();
      this.onPlaybackStateChange?.(false);
    }
  }

  public stopMusic(): void {
    if (this.musicBus) {
      this.musicBus.stop();
      this.stopTimeTracking();
      this.onPlaybackStateChange?.(false);
    }
  }

  public resumeMusic(): void {
    if (this.musicBus && !this.musicBus.playing()) {
      this.musicBus.play();
      this.startTimeTracking();
      this.onPlaybackStateChange?.(true);
    }
  }

  public toggleMusicPause(): void {
    if (this.musicBus?.playing()) {
      this.pauseMusic();
    } else {
      this.resumeMusic();
    }
  }

  public getCurrentTime(): number {
    return this.musicBus?.seek() as number || 0;
  }

  public getDuration(): number {
    return this.musicBus?.duration() || 0;
  }

  /**
   * Time Tracking for Music Bus
   */
  private startTimeTracking(): void {
    if (this.timeTrackingInterval) {
      clearInterval(this.timeTrackingInterval);
    }
    
    this.timeTrackingInterval = setInterval(() => {
      if (this.musicBus && this.musicBus.playing()) {
        const currentTime = this.musicBus.seek() as number;
        const duration = this.musicBus.duration();
        this.onTimeUpdate?.(currentTime, duration);
      }
    }, 100); // Update every 100ms
  }

  private stopTimeTracking(): void {
    if (this.timeTrackingInterval) {
      clearInterval(this.timeTrackingInterval);
      this.timeTrackingInterval = undefined;
    }
  }

  /**
   * Event Listeners
   */
  public setTimeUpdateCallback(callback: (time: number, duration: number) => void): void {
    this.onTimeUpdate = callback;
  }

  public setTrackEndCallback(callback: () => void): void {
    this.onTrackEnd = callback;
  }

  public setPlaybackStateCallback(callback: (isPlaying: boolean) => void): void {
    this.onPlaybackStateChange = callback;
  }

  public setTrackChangeCallback(callback: (trackIndex: number, playlist: Track[]) => void): void {
    this.onTrackChange = callback;
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.clearMusicFade();
    this.clearSfxFade();
    this.stopTimeTracking();
    this.musicBus?.unload();
    this.soundDesignBus?.unload();
    this.musicBus = null;
    this.soundDesignBus = null;
    
    // Очистка кэша
    this.musicCache.forEach(howl => howl.unload());
    this.sfxCache.forEach(howl => howl.unload());
    this.musicCache.clear();
    this.sfxCache.clear();
    this.isPreloaded = false;
    
    this.isInitialized = false;
  }
}

// Export singleton instance
export const audioEngine = new HowlerAudioEngine();