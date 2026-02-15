import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { projects } from "@/data/projects";
import SEOHead from "@/components/SEOHead";
import { ExternalLink, ArrowLeft, VolumeX, Volume2, Play, Pause, SkipBack, SkipForward, Square } from "lucide-react";
import { Link } from "wouter";
// import { AudioPlayer } from "@/components/AudioPlayer"; // ОТКЛЮЧЕНО: заменено на HowlerAudioEngine
import { useAudio } from "@/contexts/AudioContext";
import SiteBreadcrumbs from "@/components/SiteBreadcrumbs";
import { WinampPlayer } from "@/components/WinampPlayer";
import { useState, useEffect, useRef } from "react";
import hhBackgroundVideo from "@assets/hhbgrndvideo.mp4";
import maBackgroundVideo from "@assets/mabgrndvideo.mp4";
import { useLanguage } from "@/i18n/useLanguage";
import { projectTranslationsEn } from "@/i18n/projectsEn";

// Компонент неонового текста с мигающей "О"
function NeonTitle({ text }: { text: string }) {
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

function MayakTitle({ text, lang }: { text: string; lang: 'ru' | 'en' }) {
  const isEn = lang === 'en';
  return (
    <div className="inline-block text-center">
      <h1 className="mayak-heading font-bold mb-2 adaptive-title" style={{fontFamily: 'Jost, sans-serif'}}>
        {isEn ? 'MAYAKOVSKY' : 'МАЯКОВСКИЙ'}
      </h1>
      <h2 className="text-4xl lg:text-6xl font-bold" style={{
        fontFamily: 'Bad Script, cursive',
        color: '#8B4513',
        textShadow: '2px 2px 4px rgba(139, 69, 19, 0.3)'
      }}>
        {isEn ? 'Myself' : 'Я сам'}
      </h2>
    </div>
  );
}

// Canvas анимация параллакс-фона для Петровых
function initParallaxBackground(canvasId: string): () => void {
  // Проверяем глобальный флаг
  if ((window as any).isCanvasInitialized) return () => {};
  
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return () => {};

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  // Помечаем как инициализированный
  (window as any).isCanvasInitialized = true;
  
  // Для очистки при размонтировании
  let animationFrameId: number | null = null;

  // Настройки из рабочего скрипта
  const imageUrls = [
    '/images/petrovy2.webp', // 1
    '/images/petrovy1.webp', // 0
    '/images/petrovy5.webp', // 4
    '/images/petrovy3.webp', // 2
    '/images/petrovy6.webp', // 5
    '/images/petrovy4.webp', // 3
    '/images/petrovy7.webp'  // 6
  ];
  
  const baseSpeed = 2;
  const speed = 0.5;
  const direction = -1;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Копируем рабочий класс ImageStrip
  class ImageStrip {
    images: HTMLImageElement[] = [];
    positions: Array<{x: number, width: number, imageIndex: number}> = [];
    isLoaded: boolean = false;

    constructor() {
      this.loadImages();
    }

    async loadImages() {
      try {
        this.images = await Promise.all(
          imageUrls.map(url => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = reject;
              img.src = url;
            });
          })
        );
        this.setupPositions();
        this.isLoaded = true;
      } catch (error) {
        console.error('Ошибка загрузки изображений фона:', error);
      }
    }

    setupPositions() {
      this.positions = [];
      // Начинаем справа от экрана
      let currentX = canvas.width;
      
      for (let i = 0; i < this.images.length; i++) {
        const img = this.images[i];
        const scale = canvas.height / img.height;
        const width = img.width * scale;
        
        this.positions.push({
          x: currentX,
          width: width,
          imageIndex: i
        });
        
        currentX += width;
      }
    }

    update() {
      if (!this.isLoaded) return;
      
      const moveSpeed = baseSpeed * speed * direction;
      
      this.positions.forEach(pos => {
        pos.x += moveSpeed;
      });
      
      if (direction === -1) {
        const firstPos = this.positions[0];
        if (firstPos && firstPos.x + firstPos.width < 0) {
          const lastPos = this.positions[this.positions.length - 1];
          firstPos.x = lastPos.x + lastPos.width;
          const removed = this.positions.shift();
          if (removed) this.positions.push(removed);
        }
      }
    }

    draw() {
      if (!this.isLoaded || !ctx) return;
      
      ctx.globalAlpha = 0.8; // Более яркий эффект для видимости
      
      this.positions.forEach(pos => {
        if (pos.x + pos.width > 0 && pos.x < canvas.width) {
          const img = this.images[pos.imageIndex];
          const scale = canvas.height / img.height;
          const height = canvas.height;
          
          ctx.drawImage(img, pos.x, 0, pos.width, height);
        }
      });
      
      ctx.globalAlpha = 1.0;
    }
  }

  const imageStrip = new ImageStrip();

  function animate() {
    if (!ctx) return;
    
    // НЕ рисуем черный фон - пусть будет прозрачно!
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    imageStrip.update();
    imageStrip.draw();
    
    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  // Возвращаем cleanup функцию
  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener("resize", resizeCanvas);
    (window as any).isCanvasInitialized = false;
  };
}






// Компонент автосмены фото
// Карусель комиксных изображений для Петровых с плавным движением
function ComicImageCarousel({ project }: { project: any }) {
  const { lang } = useLanguage();
  const images = project.comicImages ? [
    project.comicImages.cover,
    project.comicImages.boy,
    project.comicImages.tram,
    project.comicImages.phone,
    project.comicImages.phone2
  ] : [project.image];

  const duplicatedImages = [...images, ...images];

  return (
    <div className="comic-image-carousel">
      <div className="comic-images-container">
        {duplicatedImages.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt={lang === 'en' ? `Comic frame ${(index % images.length) + 1}` : `Комикс кадр ${(index % images.length) + 1}`}
            data-testid="img-project"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            onLoad={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoCarousel({ photos }: { photos: string[] }) {
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
          alt={lang === 'en' ? `Scene from the performance ${index + 1}` : `Кадр из спектакля ${index + 1}`}
          className={index === currentIndex ? 'active' : ''}
          data-testid="img-project"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          onLoad={() => {}}
        />
      ))}
    </div>
  );
}

// Компонент эквалайзера в стиле Winamp
function Equalizer({ isPlaying }: { isPlaying: boolean }) {
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


function getIdiotTracks(isEn: boolean) {
  return [
    {
      id: 'nastasya',
      title: isEn ? 'Nastasya Filippovna\'s Theme' : 'Тема Настасьи Филипповны',
      url: '/audio/nastasya.mp3'
    },
    {
      id: 'myshkin',
      title: isEn ? 'Myshkin\'s Theme' : 'Тема Мышкина',
      url: '/audio/myshkin.mp3'
    },
    {
      id: 'nastasya_nightmare',
      title: isEn ? 'Nastasya Filippovna\'s Nightmare' : 'Кошмар Настасьи Филипповны',
      url: '/audio/nastasya_nightmare.mp3'
    },
    {
      id: 'city',
      title: isEn ? 'City Theme' : 'Тема города',
      url: '/audio/city.mp3'
    }
  ];
}

function getMayakTracks(isEn: boolean) {
  return [
    {
      id: 'letters',
      title: isEn ? 'Letters' : 'Письма',
      url: '/audio/mayak_letters.mp3'
    },
    {
      id: 'lilya_theme',
      title: isEn ? 'Mayakovsky & Lilya\'s Theme' : 'Тема Маяковского и Лили',
      url: '/audio/mayak_lilya_theme.mp3'
    },
    {
      id: 'gori_gori',
      title: isEn ? 'Burn, Burn' : 'Гори-гори',
      url: '/audio/mayak_gori_gori.mp3'
    }
  ];
}

function getPetrovyTracks(isEn: boolean) {
  return [
    {
      id: 'petrovy_lonely_theme',
      title: isEn ? 'Loneliness Theme' : 'Тема одиночества',
      url: '/audio/Petrovy_lonely_theme.mp3'
    },
    {
      id: 'petrovy_mad_theme', 
      title: isEn ? 'Guests Arrived' : 'Приехали в гости',
      url: '/audio/Petrovy_mad_theme.mp3'
    },
    {
      id: 'petrovy_theme_of_sick',
      title: isEn ? 'Young Petrov\'s Illness' : 'Болезнь Петрова младшего',
      url: '/audio/Petrovy_theme_of_sick.mp3'
    }
  ];
}


export default function ProjectPage() {
  const [location] = useLocation();
  const projectMatch = location.match(/^(?:\/en)?\/project\/(.+)$/);
  const projectId = projectMatch?.[1];
  const [currentBackgroundImage, setCurrentBackgroundImage] = useState('');
  const { lang, t, prefix } = useLanguage();
  const isEn = lang === 'en';
  
  const { 
    isGlobalAudioEnabled, 
    toggleGlobalAudio,
    currentProjectPlaylist,
    currentProjectTrack,
    isProjectPlayerReady,
    setCurrentProjectPlaylist,
    setCurrentProjectTrack,
    setIsProjectPlayerReady,
    // Добавляем недостающие состояния из глобального плеера
    isPlaying,
    currentTime,
    duration
  } = useAudio();
  
  // Используем состояние напрямую из глобального контекста
  const localIsPlaying = isPlaying;
  const localCurrentTime = currentTime;
  const localDuration = duration;
  
  // Убираем неиспользуемые локальные состояния
  
  // Фотографии для спектакля "Идиот" (6 фото, начиная с обложки)
  const idiotPhotos = [
    "/images/idiot.webp",                 // обложка (круг света) - ПЕРВАЯ
    "/images/idiot3_1756479054514.webp",  // idiot1 (спальня)
    "/images/idiot4_1756479054514.webp",  // idiot2 (девушка)  
    "/images/idiot5_1756479169274.webp",  // idiot3 (трамвай/экраны)
    "/images/idiot6.webp",                // idiot4 (комната с ТВ)
    "/images/idiot7.webp"                 // idiot5 (сцена с дымом)
  ];

  // Фотографии для спектакля "Петровы в гриппе и вокруг него" (5 фото)
  const petrovyPhotos = [
    "/images/petrovy.webp",
    "/images/petrovygal1.webp",
    "/images/petrovygal2.webp", 
    "/images/petrovygal3.webp",
    "/images/petrovygal4.webp"
  ];

  // Фотографии для фильма "Homo Homini" (6 кадров из фильма)
  const homoHominiPhotos = [
    "/images/homo-homini-cover.webp",  // обложка (два персонажа)
    "/images/homo-homini-1.webp",      // блондинка с грустным лицом
    "/images/homo-homini-2.webp",      // маска демона-они с молотком
    "/images/homo-homini-3.webp",      // мужчина в интерьере
    "/images/homo-homini-4.webp",      // экшн-сцена с неоновыми мечами
    "/images/homo-homini-5.webp"       // сцена на кухне
  ];

  // Фотографии для фильма "Ма" (6 кадров из фильма)
  const maPhotos = [
    "/images/ma-cover.webp",  // обложка 
    "/images/ma-1.webp",      // девушка в машине
    "/images/ma-2.webp",      // интерьер с окнами
    "/images/ma-3.webp",      // вид из машины
    "/images/ma-4.webp",      // собака
    "/images/ma-5.webp"       // лицо в темноте
  ];

  // Фотографии для спектакля "Маяковский. Я сам" (6 кадров из спектакля)
  const mayakPhotos = [
    "/images/mayakcover.webp",  // обложка (актер в желтом на сцене)
    "/images/mayakgal1.webp",   // актер в белой рубашке с галстуком
    "/images/mayakgal2.webp",   // сцена с газетой и красным занавесом
    "/images/mayakgal3.webp",   // актер в желтом с проекцией на фоне
    "/images/mayakgal4.webp",   // сцена с двумя персонажами у кровати
    "/images/mayakgal5.webp"    // два актера на кровати в интимной сцене
  ];
  
  const rawProject = projects.find(p => p.id === projectId);

  const project = rawProject && lang === 'en' && projectId && projectTranslationsEn[projectId]
    ? (() => {
        const tr = projectTranslationsEn[projectId];
        return {
          ...rawProject,
          title: tr.title || rawProject.title,
          description: tr.description,
          fullDescription: tr.fullDescription,
          role: tr.role,
          venue: tr.venue || rawProject.venue,
          links: tr.links || rawProject.links,
          tracks: tr.tracks || rawProject.tracks,
          details: tr.details
            ? { ...rawProject.details, ...tr.details }
            : rawProject.details,
        };
      })()
    : rawProject;

  // 🎵 Установка плейлиста для проектов с музыкой
  useEffect(() => {
    if (!projectId) return;
    
    // Устанавливаем плейлист в зависимости от проекта
    if (projectId === "idiot-saratov-drama") {
      setCurrentProjectPlaylist(getIdiotTracks(isEn));
      setCurrentProjectTrack(0);
      setIsProjectPlayerReady(true);
    } else if (projectId === "petrovy-saratov-drama") {
      setCurrentProjectPlaylist(getPetrovyTracks(isEn));
      setCurrentProjectTrack(0);
      setIsProjectPlayerReady(true);
    } else if (projectId === "mayakovsky-moscow-estrada") {
      setCurrentProjectPlaylist(getMayakTracks(isEn));
      setCurrentProjectTrack(0);
      setIsProjectPlayerReady(true);
    } else {
      // Сбрасываем плейлист для проектов без музыки
      setCurrentProjectPlaylist(null);
      setIsProjectPlayerReady(false);
    }

    // Очистка при размонтировании
    return () => {
      setCurrentProjectPlaylist(null);
      setIsProjectPlayerReady(false);
    };
  }, [projectId, isEn, setCurrentProjectPlaylist, setCurrentProjectTrack, setIsProjectPlayerReady]);

  // Автоматическое воспроизведение для Homo Homini ТОЛЬКО при первом заходе на страницу
  useEffect(() => {
    if (project?.id === "homo-homini-short") {
      // Флаг для предотвращения повторного автозапуска
      const hasAutoStarted = sessionStorage.getItem('homo-homini-auto-started');
      
      if (!hasAutoStarted) {
        const timer = setTimeout(() => {
          const player = (window as any).projectPlayer;
          if (player && isGlobalAudioEnabled && !isPlaying) {
            player.playTrack(0); // Запускаем первый трек
            sessionStorage.setItem('homo-homini-auto-started', 'true');
          }
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [project?.id, isGlobalAudioEnabled]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{t.projectNotFound}</h1>
          <Link 
            href={`${prefix}/`} 
            className="text-primary hover:text-primary/80 transition-colors duration-200"
          >
            {t.projectBackHome}
          </Link>
        </div>
      </div>
    );
  }

  const categoryNames = {
    theatre: t.projectsCatTheatre,
    film: t.projectsCatFilm, 
    audio: t.projectsCatAudio
  };



  // Функции управления плеером
  const handleTogglePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const player = (window as any).projectPlayer;
    if (player) player.togglePlayPause();
  };
  
  const handleNextTrack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const player = (window as any).projectPlayer;
    if (player) player.nextTrack();
  };
  
  const handlePrevTrack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const player = (window as any).projectPlayer;
    if (player) player.prevTrack();
  };
  
  // Убираем проблемные функции - используем существующие
  
  // Canvas анимация для Петровых - НЕЗАВИСИМО от аудио
  useEffect(() => {
    if (project?.id !== "petrovy-saratov-drama") return;

    // Сброс флага на случай если он заблокирован
    (window as any).isCanvasInitialized = false;

    let cleanupFn: (() => void) | null = null;

    // Одноразовая инициализация Canvas
    const initCanvas = () => {
      const canvas = document.getElementById('petrovy-bg-canvas');
      if (canvas) {
        cleanupFn = initParallaxBackground('petrovy-bg-canvas');
      }
    };

    // Запускаем один раз после небольшой задержки
    const timer = setTimeout(initCanvas, 200);

    return () => {
      clearTimeout(timer);
      // Очищаем анимацию и event listeners
      if (cleanupFn) cleanupFn();
      (window as any).isCanvasInitialized = false;
    };
  }, [project?.id]);

  // Автоматическое воспроизведение для Петровых ТОЛЬКО при первом заходе на страницу
  useEffect(() => {
    if (project?.id === "petrovy-saratov-drama") {
      // Флаг для предотвращения повторного автозапуска
      const hasAutoStarted = sessionStorage.getItem('petrovy-auto-started');
      
      if (!hasAutoStarted) {
        const timer = setTimeout(() => {
          const player = (window as any).projectPlayer;
          if (player && isGlobalAudioEnabled && !isPlaying) {
            player.playTrack(0); // Запускаем первый трек
            sessionStorage.setItem('petrovy-auto-started', 'true');
          }
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [project?.id, isGlobalAudioEnabled]); // УБРАЛИ isPlaying из зависимостей!
  
  const handleStopAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const player = (window as any).projectPlayer;
    if (player) player.stopAudio();
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <SEOHead 
        title={`${project.title} — ${project.year} | ${t.siteName}`}
        description={project.fullDescription}
      />
      
      {/* Хлебные крошки перенесены внутрь контейнера */}
      
      {/* Canvas фон для Петровых */}
      {project.id === "petrovy-saratov-drama" && (
        <canvas
          id="petrovy-bg-canvas"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1, // Canvas фон
            pointerEvents: 'none'
          }}
        />
      )}
      
      {/* Видео-фон для Homo Homini */}
      {project.id === "homo-homini-short" && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              zIndex: 1,
              filter: 'brightness(0.4) contrast(1.1)',
              pointerEvents: 'none'
            }}
          >
            <source src={hhBackgroundVideo} type="video/mp4" />
          </video>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />
        </>
      )}

      {project.id === "ma-short-film" && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              zIndex: 1,
              filter: 'brightness(0.4) contrast(1.1)',
              pointerEvents: 'none'
            }}
          >
            <source src={maBackgroundVideo} type="video/mp4" />
          </video>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.6)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />
        </>
      )}
      
      <div 
        className={`min-h-screen pt-24 pb-12 ${
          project.id === "idiot-saratov-drama" ? "vhs-container" : 
          project.id === "mayakovsky-moscow-estrada" ? "projector-container" :
          project.id === "petrovy-saratov-drama" ? "comic-container petrovy-animated-bg" : ""
        }`}
        style={project.id === "petrovy-saratov-drama" ? {
          position: 'relative',
          zIndex: 50  // Основной контент впереди полупрозрачного слоя
        } : project.id === "homo-homini-short" ? {
          position: 'relative',
          zIndex: 10  // Контент поверх видео-фона
        } : (project.id === "ma-short-film" || project.id === "homo-homini-short") ? {
          position: 'relative',
          zIndex: 10  // Контент поверх видео-фона
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-6">
          
          {/* 🍞 Навигация по сайту (хлебные крошки) */}
          <SiteBreadcrumbs currentProject={projectId} />
          
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 relative" 
            style={{zIndex: 50}}
          >
            <Link 
              href={`${prefix}/`}
              className="inline-flex items-center gap-2 text-gray-300 hover:text-primary transition-colors duration-200"
              data-testid="link-back"
            >
              <ArrowLeft className="w-5 h-5" />
              {t.projectBackToProjects}
            </Link>
          </motion.div>

          {/* Локальный плеер для проектов с музыкой уже встроен ниже в специальном разделе для Идиота */}

          {/* Main Content - Centered */}
          <div className="max-w-4xl mx-auto space-y-8 relative" style={{zIndex: 10}}>
              
              {/* Заголовок и информация для проекта Идиот */}
              {project.id === "idiot-saratov-drama" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <NeonTitle text={isEn ? 'THE IDIOT' : 'ИДИОТ'} />
                  <p className="text-xl font-medium text-gray-300 mt-4 mb-2">
                    {isEn ? 'Slonov Drama Theatre • 2024' : 'Театр драмы им. Слонова • 2024'}
                  </p>
                  <p className="text-sm text-gray-400 mb-6">{isEn ? 'Saratov' : 'г. Саратов'}</p>
                </motion.div>
              )}

              {/* Заголовок и информация для проекта Маяковский */}
              {project.id === "mayakovsky-moscow-estrada" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <MayakTitle text="" lang={lang} />
                  <p className="text-xl font-medium mt-4 mb-2" style={{color: '#8B4513'}}>
                    {isEn ? '"Artlife" • 2024' : '«Артлайф» • 2024'}
                  </p>
                  <p className="text-sm mb-6" style={{color: '#8B4513', opacity: 0.7}}>{isEn ? 'Moscow' : 'г. Москва'}</p>
                </motion.div>
              )}

              {/* Заголовок и информация для проекта Петровы */}
              {project.id === "petrovy-saratov-drama" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-8 relative"
                  style={{zIndex: 50}}
                >
                  <h1 
                    className="petrovy-title" 
                    data-text={isEn ? 'THE PETROVS IN THE FLU' : 'ПЕТРОВЫ В ГРИППЕ'}
                    data-testid="text-title"
                  >
                    {isEn ? 'THE PETROVS IN THE FLU' : 'ПЕТРОВЫ В ГРИППЕ'}
                  </h1>
                  <div className="petrovy-subtitle">{isEn ? 'and around it' : 'и вокруг него'}</div>
                  <p className="text-xl font-medium text-gray-300 mt-4 mb-2">{isEn ? 'Slonov Drama Theatre • 2025' : 'Театр драмы им. Слонова • 2025'}</p>
                  <p className="text-sm text-gray-400 mb-6">{isEn ? 'Saratov' : 'г. Саратов'}</p>
                </motion.div>
              )}

              {/* Заголовок и информация для проекта Homo Homini */}
              {project.id === "homo-homini-short" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-6xl lg:text-7xl font-bold mb-4" style={{color: '#FFD700', textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'}}>
                    HOMO HOMINI
                  </h1>
                  <p className="text-lg text-gray-400 mb-6" style={{letterSpacing: '0.1em'}}>
                    {isEn ? 'man to man' : 'человек человеку'}
                  </p>
                  <p className="text-xl font-medium text-gray-300 mt-4 mb-2">{isEn ? 'Short film • 2025' : 'Короткометражный фильм • 2025'}</p>
                  <p className="text-sm text-gray-400 mb-6">{isEn ? 'Director: Ivan Komarov' : 'Режиссёр: Иван Комаров'}</p>
                </motion.div>
              )}

              {/* Заголовок и информация для проекта Ма */}
              {project.id === "ma-short-film" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-6xl lg:text-7xl font-bold mb-4" style={{color: '#E0E0E0', textShadow: '0 0 15px rgba(224, 224, 224, 0.3)'}}>
                    {isEn ? 'MA' : 'МА'}
                  </h1>
                  <p className="text-xl font-medium text-gray-300 mt-4 mb-2">{isEn ? 'Short film • 2024' : 'Короткометражный фильм • 2024'}</p>
                  <p className="text-sm text-gray-400 mb-6">{isEn ? 'Director: Valentina Besolova' : 'Режиссёр: Валентина Бесолова'}</p>
                </motion.div>
              )}

              {/* Заголовок и информация для проекта Сон о Хлебе */}
              {project.id === "son-o-hlebe-zotov" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-5xl lg:text-7xl font-bold mb-4" style={{color: '#4A90E2', textShadow: '0 0 20px rgba(74, 144, 226, 0.4)'}}>
                    {isEn ? 'DREAM OF BREAD' : 'СОН О ХЛЕБЕ'}
                  </h1>
                  <p className="text-xl font-medium text-gray-300 mt-4 mb-2">{isEn ? 'Zotov Centre • 2024' : 'Центр «Зотов» • 2024'}</p>
                  <p className="text-sm text-gray-400 mb-6">{isEn ? 'Director: Timur Sharafutdinov' : 'Режиссёр: Тимур Шарафутдинов'}</p>
                </motion.div>
              )}

              {/* Заголовок и информация для проекта Погружение. Променад */}
              {project.id === "pogruzhenie-promenad-telegram" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-5xl lg:text-7xl font-bold mb-4" style={{color: '#D2691E', textShadow: '0 0 20px rgba(210, 105, 30, 0.4)'}}>
                    {isEn ? 'IMMERSION. PROMENADE' : 'ПОГРУЖЕНИЕ. ПРОМЕНАД'}
                  </h1>
                  <p className="text-xl font-medium text-gray-300 mt-4 mb-2">{isEn ? 'Centre for Theatre Mastery (Nizhny Novgorod) • 2021' : 'Центр театрального мастерства (Нижний Новгород) • 2021'}</p>
                  <p className="text-sm text-gray-400 mb-6">{isEn ? 'Director: Ivan Komarov' : 'Режиссёр: Иван Комаров'}</p>
                </motion.div>
              )}

              {/* Полупрозрачный фон на всю ширину для заголовка и фото */}
              {project.id === "petrovy-saratov-drama" && (
                <div 
                  className="fixed left-0 w-screen"
                  style={{
                    top: '0px', // Начинается от самого верха
                    height: '100vh', // На всю высоту страницы
                    backgroundColor: 'rgba(0,0,0,0.375)',
                    backdropFilter: 'blur(2px)',
                    zIndex: 5, // Полупрозрачный слой
                    pointerEvents: 'none'
                  }}
                />
              )}



              {/* Project Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {/* Автосмена фото для проекта Идиот */}
                {project.id === "idiot-saratov-drama" ? (
                  <div className="relative">
                    <PhotoCarousel photos={idiotPhotos} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                  </div>
                ) : project.id === "mayakovsky-moscow-estrada" ? (
                  /* Галерея фотографий для Маяковского с красной тематикой */
                  <div className="relative">
                    <PhotoCarousel photos={mayakPhotos} />
                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent rounded-lg" />
                  </div>
                ) : project.id === "petrovy-saratov-drama" ? (
                  /* Галерея фотографий для Петровых */
                  <div className="relative" style={{zIndex: 50}}>
                    <PhotoCarousel photos={petrovyPhotos} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-lg" />
                  </div>
                ) : project.id === "homo-homini-short" ? (
                  /* Галерея фотографий для Homo Homini */
                  <div className="relative">
                    <PhotoCarousel photos={homoHominiPhotos} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                  </div>
                ) : project.id === "ma-short-film" ? (
                  /* Галерея фотографий для Ма */
                  <div className="relative">
                    <PhotoCarousel photos={maPhotos} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                  </div>
                ) : (
                  /* Обычное фото для других проектов */
                  (<>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto rounded-lg shadow-2xl"
                      data-testid="img-project"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                  </>)
                )}
              </motion.div>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {project.id !== "idiot-saratov-drama" && project.id !== "mayakovsky-moscow-estrada" && project.id !== "petrovy-saratov-drama" && project.id !== "homo-homini-short" && project.id !== "ma-short-film" && project.id !== "son-o-hlebe-zotov" && project.id !== "pogruzhenie-promenad-telegram" && (
                  <>
                    <div className="text-sm idiot-primary font-medium tracking-wide uppercase mb-2">
                      {categoryNames[project.category]} • {project.year}
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-title">
                      {project.title}
                    </h1>
                  </>
                )}
                
                {project.id !== "homo-homini-short" && project.id !== "ma-short-film" && project.id !== "son-o-hlebe-zotov" && project.id !== "pogruzhenie-promenad-telegram" && (
                  <p className={`text-xl leading-relaxed relative ${
                    project.id === "mayakovsky-moscow-estrada" ? "text-gray-800" :
                    project.id === "petrovy-saratov-drama" ? "text-gray-300" : "text-gray-300"
                  }`} style={project.id === "petrovy-saratov-drama" ? {zIndex: 60} : {}}>
                    {project.fullDescription}
                  </p>
                )}
              </motion.div>

              {/* Case Study for Idiot */}
              {project.id === "idiot-saratov-drama" && (
                <div className="mt-8 vhs-glitch">
                  
                  
                  
                  {/* Постановочная команда и роль в проекте в две колонки */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
                    <div>
                      <h4 className="text-white font-medium mb-3">{isEn ? 'Production Team' : 'Постановочная команда'}</h4>
                      <div className="text-gray-300 space-y-1">
                        <p>{isEn ? 'Director: Ivan Komarov' : 'Режиссёр: Иван Комаров'}</p>
                        <p>{isEn ? 'Set Designer: Olga Kuznetsova' : 'Художник: Ольга Кузнецова'}</p>
                        <p>{isEn ? 'Lighting Designer: Maxim Biryukov' : 'Художник по свету: Максим Бирюков'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-3">{isEn ? 'Role in Project' : 'Роль в проекте'}</h4>
                      <p className="idiot-primary font-semibold text-lg">
                        {isEn ? 'Composer, Sound Designer, Sound Engineer, Prompt Engineer' : 'Композитор, саунд-дизайнер, звукорежиссер, промт-инжинер'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="glass-effect rounded-xl p-6 space-y-6">

                    <div className="space-y-6 text-gray-300 leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold idiot-heading mb-3">{isEn ? 'Concept' : 'Концепция'}</h4>
                        <p>
                          {isEn ? 'A Dostoevsky production set in Saratov, 1999. The performance combines theatre and "live cinema" — two camera operators film the action, while the audience simultaneously sees the stage and the screen version in 90s aesthetics.' : 'Постановка Достоевского, перенесенная в Саратов 1999 года. Спектакль сочетает театр и «живое кино» — два оператора снимают действие, зритель видит параллельно сцену и экранную версию в эстетике 90-х.'}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold idiot-heading mb-3">{isEn ? 'Creative Challenge' : 'Творческая задача'}</h4>
                        <p>
                          {isEn ? 'Create cinematic-aesthetic sound for theatre, so the audience believes what\'s happening on screen, as in 90s series like Twin Peaks and The X-Files.' : 'Создать звук с кино-эстетикой для театра, чтобы зритель поверил в происходящее на экране, как в сериалах 90-х в духе Twin Peaks и «Секретных материалов».'}
                        </p>
                        
                        <div className="mt-4">
                          <p className="font-medium text-white mb-2">{isEn ? 'Completed Work:' : 'Выполненные работы:'}</p>
                          <ul className="list-none space-y-0 ml-4">
                            <li>• {isEn ? 'Composing original music' : 'Написание оригинальной музыки'}</li>
                            <li>• {isEn ? 'Working with microphones and sound recording' : 'Работа с микрофонами и звукозаписью'}</li>
                            <li>• {isEn ? 'Creating field recordings' : 'Создание полевых записей'}</li>
                            <li>• {isEn ? 'Working with AI tools for sound processing' : 'Работа с ИИ-инструментами для обработки звука'}</li>
                            <li>• {isEn ? 'Creating authentic soundscapes and effects' : 'Создание аутентичных саундскейпов и эффектов'}</li>
                            <li>• {isEn ? 'Creating the sound score and project map' : 'Создание звуковой партитуры и карты проекта'}</li>
                            <li>• {isEn ? 'Sound console automation in QLab' : 'Автоматизация звуковой консоли в QLab'}</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold idiot-heading mb-3">{isEn ? 'Key Solutions' : 'Ключевые решения'}</h4>
                        
                        <div className="space-y-4">
                          <p>
                            <strong className="text-white">{isEn ? 'Field Recordings:' : 'Полевые записи:'}</strong> {isEn ? 'personally recorded the sounds of Saratov: trams, footsteps, doors, city noise. These recordings became the foundation of the performance\'s sound world.' : 'лично записал звуки Саратова: трамваи, шаги, двери, городской шум. Эти записи стали основой звукового мира спектакля.'}
                          </p>
                          
                          <p>
                            <strong className="text-white">{isEn ? 'Neural Networks for Speech:' : 'Нейросети для речи:'}</strong> {isEn ? 'cloned the actor\'s voice for Prince Myshkin\'s German lines, achieving clean pronunciation without an accent in the character\'s voice.' : 'клонировал голос актёра для немецких реплик князя Мышкина, получив чистое произношение без акцента голосом персонажа.'}
                          </p>
                          
                          <p>
                            <strong className="text-white">{isEn ? 'Musical Dramaturgy:' : 'Музыкальная драматургия:'}</strong> {isEn ? '10 original compositions driving the narrative and creating atmosphere.' : '10 оригинальных композиций двигающих повествование и создающих атмосферу.'}
                          </p>
                        </div>
                      </div>


                      <div className="bg-pink-500/10 border border-pink-500/30 p-4 rounded-lg">
                        <h4 className="text-xl font-semibold idiot-heading mb-3">{isEn ? 'Result' : 'Результат'}</h4>
                        <p>
                          {isEn ? 'Full immersion effect — the audience sees the performance and its screen version simultaneously.' : 'Эффект полного погружения - зритель видит спектакль и его экранную версию одновременно.'}<br/>
                          {isEn ? 'My contribution: creating an entire audio world — from city recordings to the musical score.' : 'Мой вклад: создание целого аудиомира - от городских записей до музыкальной партитуры.'}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              )}


              {project.id === "mayakovsky-moscow-estrada" && (
                <div className="mt-8 projector-glitch">
                  
                  {/* Постановочная команда и роль в проекте в две колонки */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
                    <div>
                      <h4 className="mayak-primary font-medium mb-3">{isEn ? 'Production Team' : 'Постановочная команда'}</h4>
                      <div className="text-gray-800 space-y-1">
                        <p>{isEn ? 'Director, adaptation author: Semyon Shomin' : 'Режиссёр, автор инсценировки: Семён Шомин'}</p>
                        <p>{isEn ? 'Set Designer: Tatyana Zarubina' : 'Художник-постановщик: Татьяна Зарубина'}</p>
                        <p>{isEn ? 'Movement Director: Igor Sharoyko' : 'Режиссёр по пластике: Игорь Шаройко'}</p>
                        <p>{isEn ? 'Lighting Designer: Maxim Biryukov' : 'Художник по свету: Максим Бирюков'}</p>
                        <p>{isEn ? 'Video Designer: Dmitry Sobolev' : 'Художник по видео: Дмитрий Соболев'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="mayak-primary font-medium mb-3">{isEn ? 'Role in Project' : 'Роль в проекте'}</h4>
                      <p className="mayak-primary font-semibold text-lg">
                        {isEn ? 'Sound Designer, Composer, Sound Engineer, Prompt Engineer' : 'Саунд-дизайнер, композитор, звукорежиссёр, промт-инжинер'}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{backgroundColor: 'rgba(245, 222, 179, 0.1)'}} className="rounded-xl p-6 space-y-6 border border-amber-900/20">

                    <div className="space-y-6 text-gray-800 leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold mayak-heading mb-3">{isEn ? 'Concept' : 'Концепция'}</h4>
<p className="text-gray-800">
                          {isEn ? 'The performance begins "a second before" — before the shot, Mayakovsky recalls his biography. The production reveals the poet as a living person with passions and suffering, not just a "product of his time". Minimal sets and visual effects, emphasis on psychology. A three-layered sound dramaturgy was created: reality, poetic layer, and abstraction.' : 'Спектакль начинается «за секунду до» - перед выстрелом Маяковский вспоминает свою биографию. Постановка раскрывает поэта как живого человека со страстями и страданиями, а не просто «продукт времени». Минимум декораций и визуальных спецэффектов, акцент на психологизме. Создана трёхслойная звуковая драматургия: реальность, поэтический слой и абстракция.'}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold mayak-heading mb-3">{isEn ? 'Creative Challenge' : 'Творческая задача'}</h4>
<p className="text-gray-800">
                          {isEn ? 'Create a sound score where the audience intuitively feels the switching between life, poetic text, and the hero\'s inner monologue.' : 'Создать звуковую партитуру, где зритель интуитивно чувствует переключение между жизнью, поэтическим текстом и внутренним монологом героя.'}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold mayak-heading mb-3">{isEn ? 'Technical Challenge' : 'Техническая задача'}</h4>
<p className="text-gray-800">
                          {isEn ? 'Ensure flexible architecture for touring — the performance must sound stable at any venue with different consoles and acoustic conditions.' : 'Обеспечить гибкую архитектуру для антрепризы - спектакль должен стабильно звучать на любых площадках с разными консолями и акустическими условиями.'}
                        </p>
                        
                        <div className="mt-4">
                          <p className="font-medium mayak-primary mb-2">{isEn ? 'Completed Work:' : 'Выполненные работы:'}</p>
                          <ul className="list-none space-y-0 ml-4">
                            <li>• {isEn ? 'Creating a three-layered sound concept' : 'Создание трёхслойной звуковой концепции'}</li>
                            <li>• {isEn ? 'Composing 6 original pieces' : 'Написание 6 оригинальных композиций'}</li>
                            <li>• {isEn ? 'Rearranging musical material' : 'Переаранжировка музыкального материала'}</li>
                            <li>• {isEn ? 'Field recordings of actors and everyday sounds' : 'Полевые записи актёров и бытовых звуков'}</li>
                            <li>• {isEn ? 'Working with AI tools for special effects' : 'Работа с ИИ-инструментами для спецэффектов'}</li>
                            <li>• {isEn ? 'Designing adaptive technical architecture' : 'Проектирование адаптивной технической архитектуры'}</li>
                            <li>• {isEn ? 'Programming in QLab 5 + OSC automation' : 'Программирование в QLab 5 + OSC-автоматизация'}</li>
                            <li>• {isEn ? 'Preparing the system for different venues' : 'Подготовка системы под разные площадки'}</li>
                            <li>• {isEn ? 'Working as the production sound engineer' : 'Работа в качестве выпускающего звукорежиссёра'}</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold mayak-heading mb-3">{isEn ? 'Key Solutions' : 'Ключевые решения'}</h4>
                        <div className="space-y-4">
<p className="text-gray-800">
                            <strong className="mayak-primary">{isEn ? 'Dynamic Sound Transformation:' : 'Динамическая трансформация звука:'}</strong> {isEn ? 'music and voices transform in real time from natural to completely different forms, creating a perception shift effect.' : 'музыка и голоса в реальном времени превращаются из естественных в совершенно иные формы, создавая эффект смены восприятия.'}
                          </p>
                          
<p className="text-gray-800">
                            <strong className="mayak-primary">{isEn ? 'Touring Architecture:' : 'Антрепризная архитектура:'}</strong> {isEn ? 'automatic adaptation from surround to stereo, from Yamaha Rivage to M32/X32 with ready-made templates.' : 'автоматическая адаптация от surround к стерео, от Yamaha Rivage к M32/X32 с готовыми шаблонами.'}
                          </p>
                          
<p className="text-gray-800">
                            <strong className="mayak-primary">{isEn ? 'Live Recordings:' : 'Живые записи:'}</strong> {isEn ? 'recorded actors and everyday sounds on a Zoom recorder, which became part of the performance\'s sound layer.' : 'на Zoom-рекордер записывал актёров и бытовые звуки, ставшие частью слоя спектакля.'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                        <h4 className="text-xl font-semibold mayak-heading mb-3">{isEn ? 'Result' : 'Результат'}</h4>
                        <p>
                          {isEn ? 'A rich sound score with an immersion effect. The performance tours successfully, sounding stable at different venues.' : 'Насыщенная звуковая партитура с эффектом погружения. Спектакль успешно гастролирует, стабильно звучит на разных площадках.'}<br/>
                          {isEn ? 'My contribution: building three-layered sound dramaturgy, creating musical compositions, designing a flexible technical system.' : 'Мой вклад: построение трёхслойной звуковой драматургии, создание музыкальных композиций, проектирование гибкой технической системы.'}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Music Section for Idiot Project */}
              {project.id === "idiot-saratov-drama" && (
                <WinampPlayer 
                  projectId={project.id}
                  title={isEn ? 'Music from the Performance' : 'Музыка из спектакля'} 
                  className="idiot-themed"
                />
              )}

              {/* Case Study for Petrovy */}
              {project.id === "petrovy-saratov-drama" && (
                <div className="mt-8 relative" style={{zIndex: 30}}>
                  
                  {/* Постановочная команда и роль в проекте в две колонки */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm relative" style={{zIndex: 30}}>
                    <div>
                      <h4 className="text-white font-medium mb-3">{isEn ? 'Production Team' : 'Постановочная команда'}</h4>
                      <div className="text-gray-300 space-y-1">
                        <p>{isEn ? 'Director, adaptation author: Ivan Komarov' : 'Режиссёр, автор инсценировки: Иван Комаров'}</p>
                        <p>{isEn ? 'Set Designer: Olga Kuznetsova' : 'Художник-постановщик: Ольга Кузнецова'}</p>
                        <p>{isEn ? 'Lighting Designer: Maxim Biryukov' : 'Художник по свету: Максим Бирюков'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-3">{isEn ? 'Role in Project' : 'Роль в проекте'}</h4>
                      <p className="text-green-400 font-semibold text-lg">
                        {isEn ? 'Composer, Sound Designer, Sound Engineer, Prompt Engineer' : 'Композитор, саунд-дизайнер, звукорежиссёр, промт-инженер'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-8 text-gray-300 leading-relaxed relative" style={{zIndex: 30}}>
                    <div className="p-6 relative" style={{zIndex: 30}}>
                      <h4 className="text-2xl font-bold text-green-400 mb-4">{isEn ? 'Concept' : 'Концепция'}</h4>
                      <p className="text-lg">
                        {isEn ? 'Theatre as a comic book, where the space simultaneously tells the story of the Petrovs and reflects on theatre as a space of delirium. The production balances between everyday realism and absurdity. A precise score was created in QLab with exact synchronization, automation configured via MIDI and OSC protocols to control all sound elements of the performance.' : 'Театр как комикс, где пространство одновременно рассказывает историю Петровых и размышляет о театре как о пространстве бреда. Постановка балансирует между бытовым реализмом и абсурдом. Создана четкая партитура в QLab с точной синхронизацией, настроена автоматизация через MIDI и OSC-протоколы для управления всеми звуковыми элементами спектакля.'}
                      </p>
                    </div>

                    <div className="p-6 relative" style={{zIndex: 30}}>
                      <h4 className="text-2xl font-bold text-green-400 mb-4">{isEn ? 'Technical Challenge' : 'Техническая задача'}</h4>
                      <p className="text-lg">
                        {isEn ? 'Create a precise score in QLab with exact synchronization, configure automation via MIDI and OSC protocols to control all sound elements of the performance.' : 'Создать четкую партитуру в QLab с точной синхронизацией, настроить автоматизацию через MIDI и OSC-протоколы для управления всеми звуковыми элементами спектакля.'}
                      </p>
                    </div>

                    <div className="p-6 relative" style={{zIndex: 30}}>
                      <h4 className="text-2xl font-bold text-green-400 mb-4">{isEn ? 'Creative Challenge' : 'Творческая задача'}</h4>
                      <p className="text-lg mb-4">
                        {isEn ? 'Compose 12 pieces in different genres, creating a sound score as an equal dramaturgical layer that helps keep the audience in the labyrinth of absurd narration.' : 'Написать 12 композиций разных жанров, создав звуковую партитуру как равноправный драматургический пласт, который поможет удержать зрителя в лабиринте абсурдного повествования.'}
                      </p>
                      
                      <div className="mt-6">
                        <p className="text-xl font-semibold text-white mb-3">{isEn ? 'Completed Work:' : 'Выполненные работы:'}</p>
                        <ul className="list-none space-y-2 ml-6 text-lg">
                          <li>• {isEn ? 'Creating 12 full compositions in various genres' : 'Создание 12 полноценных композиций разных жанров'}</li>
                          <li>• {isEn ? 'Developing a leitmotif system for characters and scenes' : 'Разработка лейтмотивной системы для персонажей и сцен'}</li>
                          <li>• {isEn ? 'Creating atmospheric ambients and drone textures' : 'Создание атмосферных эмбиентов и дроун-текстур'}</li>
                          <li>• {isEn ? 'Working with AI to create an opera cover' : 'Работа с ИИ для создания оперного кавера'}</li>
                          <li>• {isEn ? 'Programming and automation in QLab' : 'Программирование и автоматизация в QLab'}</li>
                          <li>• {isEn ? 'Working as the production sound engineer' : 'Работа в качестве выпускающего звукорежиссера'}</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-6 relative" style={{zIndex: 30}}>
                      <h4 className="text-2xl font-bold text-green-400 mb-4">{isEn ? 'Key Solutions' : 'Ключевые решения'}</h4>
                      
                      <div className="space-y-6 text-lg">
                        <p>
                          <strong className="text-white text-xl">{isEn ? 'Genre Mosaic:' : 'Жанровая мозаика:'}</strong> {isEn ? 'music follows the logic of the performance, switching from sentimental neoclassicism to anxious ambients and cartoonish grotesqueness.' : 'музыка следует логике спектакля, переключаясь от сентиментального неоклассицизма до тревожных эмбиентов и мультяшной гротескности.'}
                        </p>
                        
                        <p>
                          <strong className="text-white text-xl">{isEn ? 'Ironic AI Experiments:' : 'Ироничные ИИ-эксперименты:'}</strong> {isEn ? 'an opera arrangement of the song "Nol" emphasized the comic-book nature of the production.' : 'оперная обработка песни «Ноль» подчеркнула комиксную природу постановки.'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-lg">
                      <h4 className="text-2xl font-bold text-green-400 mb-4">{isEn ? 'Result' : 'Результат'}</h4>
                      <p className="text-lg">
                        {isEn ? 'A performance where every element of the sound score works to create a unified artistic statement.' : 'Спектакль, где каждый элемент звуковой партитуры работает на создание целостного художественного высказывания.'}<br/>
                        <strong className="text-white">{isEn ? 'My contribution:' : 'Мой вклад:'}</strong> {isEn ? 'creating full musical dramaturgy, experimental AI solutions, technical implementation of the performance\'s complex sound architecture.' : 'создание полноценной музыкальной драматургии, экспериментальные ИИ-решения, техническая реализация сложной звуковой архитектуры спектакля.'}
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* Music Section for Petrovy Project */}
              {project.id === "petrovy-saratov-drama" && (
                <WinampPlayer 
                  projectId={project.id}
                  title={isEn ? 'Music from the Performance' : 'Музыка из спектакля'} 
                  className="petrovy-themed"
                />
              )}

          </div>



          {/* Music Section for Mayakovsky Project */}
          {project.id === "mayakovsky-moscow-estrada" && (
            <WinampPlayer 
              projectId={project.id} 
              title={isEn ? 'Music from the Performance' : 'Музыка из спектакля'} 
              className="mayak-themed"
            />
          )}


          {/* Case Study for Homo Homini */}
          {project.id === "homo-homini-short" && (
            <div className="mt-8">
              
              {/* Описание без заголовка */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mb-8"
                >
                  <div className="glass-effect rounded-xl p-6">
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {isEn ? 'A short drama with elements of black comedy. 13 original compositions were created and full sound post-production was completed including the final mix in 5.1. Sound design balances between realism and Asian action film stylization. The premiere took place at the "Koroche" film festival in Kaliningrad.' : 'Короткометражная драма с элементами чёрной комедии. Создано 13 оригинальных композиций и проведен полный пост-продакшн звука включая финальный микс в 5.1. Саунд-дизайн балансирует между реализмом и стилизацией под азиатские боевики. Премьера состоялась на кинофестивале «Короче» в Калининграде.'}
                    </p>
                  </div>
                </motion.div>

                {/* Съёмочная группа и роль в проекте в две колонки */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-white font-medium mb-3">{isEn ? 'Film Crew' : 'Съёмочная группа'}</h4>
                    <div className="text-gray-300 space-y-2">
                      <p><strong>{isEn ? 'Director, screenwriter:' : 'Режиссёр, сценарист:'}</strong> {isEn ? 'Ivan Komarov' : 'Иван Комаров'}</p>
                      <p><strong>{isEn ? 'Producers:' : 'Продюсеры:'}</strong> {isEn ? 'Eleonora Klementyeva, Ivan Komarov, Elena Erbakova' : 'Элеонора Клементьева, Иван Комаров, Елена Ербакова'}</p>
                      <p><strong>{isEn ? 'Cinematographer:' : 'Оператор:'}</strong> {isEn ? 'Lotos Suni Park' : 'Лотос Суни Парк'}</p>
                      <p><strong>{isEn ? 'Art Directors:' : 'Художники:'}</strong> {isEn ? 'Galina Protsanova, Anna Khrustaleva' : 'Галина Процанова, Анна Хрусталева'}</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 font-medium mb-2">{isEn ? 'Starring:' : 'В главных ролях:'}</p>
                      <p className="text-gray-300 text-sm">{isEn ? 'Semyon Shteinberg, Elena Erbakova, Anton Kuznetsov, Alyona Babenko, Alexander Panov, Batraz Zaseev, Efim Belosorochka' : 'Семён Штейнберг, Елена Ербакова, Антон Кузнецов, Алёна Бабенко, Александр Панов, Батраз Засеев, Ефим Белосорочка'}</p>
                    </div>
                  </div>
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-white font-medium mb-3">{isEn ? 'Role in Project' : 'Роль в проекте'}</h4>
                    <p className="text-yellow-400 font-semibold text-lg">
                      {isEn ? 'Composer, Sound Designer, Post-Production Sound Engineer, Songwriter, Prompt Engineer' : 'Композитор, саунд-дизайнер, звукорежиссёр пост-продакшена, сонграйтер, промт-инженер'}
                    </p>
                  </div>
                </motion.div>

                {/* Концепция */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-8"
                >
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-xl font-semibold mb-3" style={{color: '#FFD700'}}>{isEn ? 'Concept' : 'Концепция'}</h4>
                    <p className="text-gray-300 leading-relaxed">
                      {isEn ? 'A film about a man turning his life into a cinematic quote. The hero finds strength for revenge in a foreign culture, balancing between authenticity and convention.' : 'Фильм о человеке, превращающем свою жизнь в кинематографическую цитату. Герой находит в чужой культуре силу для мести, балансируя между подлинностью и условностью.'}
                    </p>
                  </div>
                </motion.div>

                {/* Творческие и технические задачи */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-xl font-bold mb-4" style={{color: '#FFD700'}}>{isEn ? 'Creative Challenge' : 'Творческая задача'}</h4>
                    <p className="text-gray-300">
                      {isEn ? 'Compose 13 pieces as the hero\'s emotional score, create two-level sound design (realism + stylization), make sound the film\'s second dramaturgy.' : 'Написать 13 композиций как эмоциональную партитуру героя, создать двухуровневый саунд-дизайн (реализм + стилизация), сделать звук второй драматургией фильма.'}
                    </p>
                  </div>
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-xl font-bold mb-4" style={{color: '#FFD700'}}>{isEn ? 'Technical Challenge' : 'Техническая задача'}</h4>
                    <p className="text-gray-300">
                      {isEn ? 'Complete the full sound post-production cycle: from editing to the final mix in stereo and 5.1, ensuring technical quality for film festival screening.' : 'Провести полный цикл пост-продакшна звука: от монтажа до финального микса в стерео и 5.1, обеспечить техническое качество для кинофестивального показа.'}
                    </p>
                  </div>
                </motion.div>

                {/* Выполненные работы */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mb-8"
                >
                  <div className="glass-effect rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>{isEn ? 'Completed Work' : 'Выполненные работы'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-gray-300">
                        <li>• {isEn ? 'Composing 13 original pieces' : 'Написание 13 оригинальных композиций'}</li>
                        <li>• {isEn ? 'Songwriting' : 'Сонграйтинг'}</li>
                        <li>• {isEn ? 'Creating a 70s Japanese song using AI' : 'Создание японской песни 70-х с помощью ИИ'}</li>
                        <li>• {isEn ? 'Field recordings of everyday sounds and locations' : 'Полевые записи бытовых звуков и локаций'}</li>
                      </ul>
                      <ul className="space-y-2 text-gray-300">
                        <li>• {isEn ? 'Creating stylized sound design for fight scenes' : 'Создание стилизованного саунд-дизайна для боевых сцен'}</li>
                        <li>• {isEn ? 'Sound editing, mixing, and mastering' : 'Монтаж, сведение и мастеринг звука'}</li>
                        <li>• {isEn ? 'Preparing final mixes in stereo and 5.1' : 'Подготовка финальных миксов в стерео и 5.1'}</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Ключевые решения */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mb-8"
                >
                  <div className="glass-effect rounded-xl p-6 space-y-6">
                    <h3 className="text-2xl font-bold" style={{color: '#FFD700'}}>{isEn ? 'Key Solutions' : 'Ключевые решения'}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">{isEn ? 'Emotional Score' : 'Эмоциональная партитура'}</h4>
                        <p className="text-gray-300">{isEn ? 'Music follows Savva\'s inner states — from comedy to drama and action, becoming his "second voice".' : 'Музыка следует за внутренними состояниями Саввы — от комичности до драмы и экшена, становясь его «вторым голосом».'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">{isEn ? 'Collaborative Japanese Song' : 'Коллаборативная японская песня'}</h4>
                        <p className="text-gray-300">{isEn ? 'The director wrote lyrics that were translated into Japanese and transformed using AI into an authentic 70s Japanese chanson composition with female vocals.' : 'Режиссёр написал текст, который был переведён на японский и с помощью ИИ превращён в аутентичную композицию в стиле японского шансона 70-х с женским вокалом.'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">{isEn ? 'Two-Level Sound Design' : 'Двухуровневый саунд-дизайн'}</h4>
                        <p className="text-gray-300">{isEn ? 'Realistic everyday scenes contrast with Asian action film-styled revenge episodes.' : 'Реалистичные бытовые сцены контрастируют со стилизованными под азиатские боевики эпизодами мести.'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Результат */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="mb-8"
                >
                  <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-xl">
                    <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>{isEn ? 'Result' : 'Результат'}</h3>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      {isEn ? 'The film received a cohesive sound image with expressive dramaturgy. The premiere took place at the "Koroche" film festival in Kaliningrad. This is a film project where I took on the entire sound production layer.' : 'Фильм получил цельный звуковой образ с выразительной драматургией. Премьера состоялась на кинофестивале «Короче» в Калининграде. Это кинопроект, где я взял на себя весь пласт звукового производства.'}
                    </p>
                    <p className="text-yellow-400 font-semibold mt-4">
                      <strong>{isEn ? 'My contribution:' : 'Мой вклад:'}</strong> {isEn ? 'creating the complete sound score of the film, innovative use of AI for generating an authentic Japanese song, full sound post-production cycle.' : 'создание полной звуковой партитуры фильма, инновационное использование ИИ для генерации аутентичной японской песни, полный цикл пост-продакшна звука.'}
                    </p>
                  </div>
                </motion.div>

              </div>
            )}

          {/* Case Study for Ma */}
          {project.id === "ma-short-film" && (
            <div className="mt-8">
              
              {/* Описание без заголовка */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mb-8"
                >
                  <div className="glass-effect rounded-xl p-6">
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {isEn ? 'A short drama about a mother and daughter coping with loss. A film almost without dialogue, where landscape and everyday life speak instead of words. Set in North Ossetia, in the village of Dargavs. Sound material restoration was performed, and some scenes without pre-recorded sound were re-dubbed.' : 'Короткометражная драма о матери и дочери, переживающих утрату. Кино почти без диалогов, где пейзаж и быт говорят вместо слов. Действие происходит в Северной Осетии, в селе Даргавс. Проведена реставрация звукового материала, переозвучена часть сцен без предзаписанного звука.'}
                    </p>
                  </div>
                </motion.div>

                {/* Съёмочная группа и роль в проекте в две колонки */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-white font-medium mb-3">{isEn ? 'Film Crew' : 'Съёмочная группа'}</h4>
                    <div className="text-gray-300 space-y-2">
                      <p><strong>{isEn ? 'Director:' : 'Режиссёр:'}</strong> {isEn ? 'Valentina Besolova' : 'Валентина Бесолова'}</p>
                      <p><strong>{isEn ? 'Cinematographer:' : 'Оператор:'}</strong> {isEn ? 'Vladimir Dydykin' : 'Владимир Дыдыкин'}</p>
                      <p><strong>{isEn ? 'Set Designer:' : 'Художник-постановщик:'}</strong> {isEn ? 'Karina Dzabieva' : 'Карина Дзабиева'}</p>
                      <p><strong>{isEn ? 'Editing:' : 'Монтаж:'}</strong> {isEn ? 'Anton Perevedencev, Valentina Besolova' : 'Антон Переведенцев, Валентина Бесолова'}</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 font-medium mb-2">{isEn ? 'Cast:' : 'В ролях:'}</p>
                      <p className="text-gray-300 text-sm">{isEn ? 'Zita Latsoeva (Zarema), Milana Konieva (Sabina), Alan Albegov (Alik)' : 'Зита Лацоева (Зарема), Милана Кониева (Сабина), Алан Албегов (Алик)'}</p>
                    </div>
                  </div>
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-white font-medium mb-3">{isEn ? 'Role in Project' : 'Роль в проекте'}</h4>
                    <p className="text-cyan-400 font-semibold text-lg">
                      {isEn ? 'Post-Production Sound Engineer' : 'Звукорежиссёр пост-продакшна'}
                    </p>
                  </div>
                </motion.div>

                {/* Концепция */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-8"
                >
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-xl font-semibold mb-3" style={{color: '#67E8F9'}}>{isEn ? 'Concept' : 'Концепция'}</h4>
                    <p className="text-gray-300 leading-relaxed">
                      {isEn ? 'The film is built around the relationship of a mother and daughter left alone after the death of their son and brother. An intimate drama about experiencing loss, where silence and everyday gestures replace words and music.' : 'Фильм построен вокруг отношений матери и дочери, оставшихся вдвоём после смерти сына и брата. Это камерная драма о переживании утраты, где тишина и повседневные жесты заменяют слова и музыку.'}
                    </p>
                  </div>
                </motion.div>

                {/* Творческие и технические задачи */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-xl font-bold mb-4" style={{color: '#67E8F9'}}>{isEn ? 'Creative Challenge' : 'Творческая задача'}</h4>
                    <p className="text-gray-300">
                      {isEn ? 'Create a sound world where silence and everyday sounds work instead of music. Build dramaturgy through micro-dynamics of the environment and spatial transitions.' : 'Создать звуковой мир, где тишина и бытовые звуки работают вместо музыки. Построить драматургию через микродинамику среды и пространственные переходы.'}
                    </p>
                  </div>
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-xl font-bold mb-4" style={{color: '#67E8F9'}}>{isEn ? 'Technical Challenge' : 'Техническая задача'}</h4>
                    <p className="text-gray-300">
                      {isEn ? 'Perform full restoration of sound material, create foley for scenes without on-set recorded sound, ensure precise sound synchronization with camera shots.' : 'Провести полную реставрацию звукового материала, создать фоли для сцен без записанного на площадке звука, обеспечить точную синхронизацию звука с планами камеры.'}
                    </p>
                  </div>
                </motion.div>

                {/* Выполненные работы */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mb-8"
                >
                  <div className="glass-effect rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-4" style={{color: '#67E8F9'}}>{isEn ? 'Completed Work' : 'Выполненные работы'}</h3>
                    <div className="space-y-2 text-gray-300">
                      <p>• {isEn ? 'Source material restoration in iZotope RX' : 'Реставрация исходного материала в iZotope RX'}</p>
                      <p>• {isEn ? 'Creating complete foley (footsteps, clothing, objects)' : 'Создание полного foley (шаги, одежда, предметы)'}</p>
                      <p>• {isEn ? 'Creating atmospheric environment layers' : 'Создание атмосферных слоев среды'}</p>
                      <p>• {isEn ? 'Spatial processing for camera shots' : 'Пространственная обработка под планы камеры'}</p>
                      <p>• {isEn ? 'Final mixing and mastering in stereo' : 'Финальное сведение и мастеринг в стерео'}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Ключевые решения */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mb-8"
                >
                  <div className="glass-effect rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-4" style={{color: '#67E8F9'}}>{isEn ? 'Key Solutions' : 'Ключевые решения'}</h3>
                    <p className="text-gray-300 leading-relaxed">
                      <strong className="text-cyan-300">{isEn ? 'Sound Realism:' : 'Звуковой реализм:'}</strong> {isEn ? 'sound changes depending on camera position. Each shot has its own sound depth and spatiality, creating a presence effect and helping the viewer immerse in the atmosphere of the North Caucasus.' : 'звук меняется в зависимости от расположения камеры. Каждый план имеет свою звуковую глубину и пространственность, что создаёт эффект присутствия и помогает зрителю погрузиться в атмосферу Северного Кавказа.'}
                    </p>
                  </div>
                </motion.div>

                {/* Результат */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="mb-8"
                >
                  <div className="bg-gray-500/10 border border-gray-500/30 p-6 rounded-xl">
                    <h3 className="text-2xl font-bold mb-4" style={{color: '#67E8F9'}}>{isEn ? 'Result' : 'Результат'}</h3>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      {isEn ? 'A living, authentic sound layer was created without overloading. In the absence of music, sound leads the viewer, helping to read the characters\' desires and feel the space of the North Caucasus.' : 'Создан живой, достоверный звуковой слой без перегрузки. В отсутствие музыки именно звук ведёт зрителя, помогая прочитать желания героев и ощутить пространство Северного Кавказа.'}
                    </p>
                    <p className="text-gray-200 font-semibold mt-4">
                      <strong className="text-cyan-300">{isEn ? 'My contribution:' : 'Мой вклад:'}</strong> {isEn ? 'full sound post-production from restoration to stereo master, creating sound dramaturgy based on natural sounds without musical accompaniment.' : 'полный пост-продакшн звука от реставрации до стерео-мастера, создание звуковой драматургии на основе естественных звуков без музыкального сопровождения.'}
                    </p>
                  </div>
                </motion.div>

              </div>
            )}

          {/* Case Study for Son o Hlebe - Data-driven approach */}
          {project.id === "son-o-hlebe-zotov" && (
            <div className="mt-8">
              
              {/* Описание проекта */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <div className="glass-effect rounded-xl p-6">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {project.fullDescription}
                  </p>
                </div>
              </motion.div>

              {/* Постановочная команда и роль в проекте */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              >
                <div className="glass-effect rounded-xl p-6">
                  <h4 className="text-white font-medium mb-3">{isEn ? 'Production Team' : 'Постановочная команда'}</h4>
                  <div className="text-gray-300 space-y-2">
                    {project.details?.director && <p><strong>{isEn ? 'Director:' : 'Режиссёр:'}</strong> {project.details.director}</p>}
                    {project.details?.producer && <p>{project.details.producer}</p>}
                    {project.details?.premiere && <p><strong>{isEn ? 'Premiere:' : 'Премьера:'}</strong> {project.details.premiere}</p>}
                  </div>
                  {project.details?.cast && project.details.cast.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 font-medium mb-2">{isEn ? 'Cast:' : 'В ролях:'}</p>
                      <p className="text-gray-300 text-sm">{project.details.cast.join(', ')}</p>
                    </div>
                  )}
                </div>
                <div className="glass-effect rounded-xl p-6">
                  <h4 className="text-white font-medium mb-3">{isEn ? 'Role in Project' : 'Роль в проекте'}</h4>
                  <p className="text-blue-400 font-semibold text-lg">
                    {project.role.join(', ')}
                  </p>
                </div>
              </motion.div>

              {/* Моя работа */}
              {project.details?.technical && project.details.technical.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mb-8"
                >
                  <div className="glass-effect rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-4" style={{color: '#4A90E2'}}>{isEn ? 'My Work' : 'Моя работа'}</h3>
                    <div className="space-y-2 text-gray-300">
                      {project.details.technical.map((item, index) => (
                        <p key={index}>• {item}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          )}

          {/* Case Study for Pogruzhenie Promenad - Same structure as Son o Hlebe */}
          {project.id === "pogruzhenie-promenad-telegram" && (
            <div className="mt-8">
              
              {/* Описание проекта */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <div className="glass-effect rounded-xl p-6">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {project.fullDescription}
                  </p>
                </div>
              </motion.div>

              {/* Постановочная команда и роль в проекте */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              >
                <div className="glass-effect rounded-xl p-6">
                  <h4 className="text-white font-medium mb-3">{isEn ? 'Production Team' : 'Постановочная команда'}</h4>
                  <div className="text-gray-300 space-y-2">
                    {project.details?.director && <p><strong>{isEn ? 'Director:' : 'Режиссёр:'}</strong> {project.details.director}</p>}
                    {project.details?.producer && <p>{project.details.producer}</p>}
                    {project.details?.premiere && <p><strong>{isEn ? 'Premiere:' : 'Премьера:'}</strong> {project.details.premiere}</p>}
                  </div>
                  {project.details?.cast && project.details.cast.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 font-medium mb-2">{isEn ? 'Cast:' : 'В ролях:'}</p>
                      <p className="text-gray-300 text-sm">{project.details.cast.join(', ')}</p>
                    </div>
                  )}
                </div>
                <div className="glass-effect rounded-xl p-6">
                  <h4 className="text-white font-medium mb-3">{isEn ? 'Role in Project' : 'Роль в проекте'}</h4>
                  <p className="font-semibold text-lg" style={{color: '#D2691E'}}>
                    {project.role.join(', ')}
                  </p>
                </div>
              </motion.div>

              {/* Моя работа */}
              {project.details?.technical && project.details.technical.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mb-8"
                >
                  <div className="glass-effect rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-4" style={{color: '#D2691E'}}>{isEn ? 'My Work' : 'Моя работа'}</h3>
                    <div className="space-y-2 text-gray-300">
                      {project.details.technical.map((item, index) => (
                        <p key={index}>• {item}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          )}

          {/* Links and Awards - Centered at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-4xl mx-auto mt-12 space-y-6 relative"
            style={{zIndex: 50}}
          >
            {/* Links */}
            {project.links && project.links.length > 0 && (
              <div className="glass-effect rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-4">{t.projectLinks}</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {project.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target={link.external ? "_blank" : "_self"}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={`inline-flex items-center gap-2 transition-colors duration-200 px-4 py-2 rounded-lg border ${
                        project.id === "mayakovsky-moscow-estrada" 
                          ? "text-red-600 hover:text-red-400 bg-red-500/10 border-red-500/30" 
                          : project.id === "petrovy-saratov-drama"
                          ? "text-green-400 hover:text-green-300 bg-green-500/10 border-green-500/30"
                          : project.id === "homo-homini-short"
                          ? "text-yellow-400 hover:text-yellow-300 bg-yellow-500/10 border-yellow-500/30"
                          : project.id === "ma-short-film"
                          ? "text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border-cyan-500/30"
                          : project.id === "son-o-hlebe-zotov"
                          ? "text-blue-400 hover:text-blue-300 bg-blue-500/10 border-blue-500/30"
                          : project.id === "pogruzhenie-promenad-telegram"
                          ? "text-orange-400 hover:text-orange-300 bg-orange-500/10 border-orange-500/30"
                          : "idiot-primary hover:text-pink-400 bg-pink-500/10 border-pink-500/30"
                      }`}
                      data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                      {link.external && <ExternalLink className="w-4 h-4" />}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Awards */}
            {project.awards && project.awards.length > 0 && (
              <div className="glass-effect rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-4">{t.projectAwards}</h3>
                <ul className="space-y-2">
                  {project.awards.map((award, index) => (
                    <li key={index} className="text-gray-300">
                      • {award}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
    </>
  );
}