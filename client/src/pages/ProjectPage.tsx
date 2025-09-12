import { motion } from "framer-motion";
import { useRoute } from "wouter";
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

// Компонент заголовка для Маяковского с переливающимся красным цветом
function MayakTitle({ text }: { text: string }) {
  return (
    <div className="inline-block text-center">
      <h1 className="mayak-heading font-bold mb-2 adaptive-title" style={{fontFamily: 'Jost, sans-serif'}}>
        МАЯКОВСКИЙ
      </h1>
      <h2 className="text-4xl lg:text-6xl font-bold" style={{
        fontFamily: 'Bad Script, cursive',
        color: '#8B4513',
        textShadow: '2px 2px 4px rgba(139, 69, 19, 0.3)'
      }}>
        Я сам
      </h2>
    </div>
  );
}

// Canvas анимация параллакс-фона для Петровых
function initParallaxBackground(canvasId: string) {
  // Проверяем глобальный флаг
  if ((window as any).isCanvasInitialized) return;
  
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Помечаем как инициализированный
  (window as any).isCanvasInitialized = true;
  
  // Убираем тестовый прямоугольник - он больше не нужен

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
    
    requestAnimationFrame(animate);
  }

  animate();
}






// Компонент автосмены фото
// Карусель комиксных изображений для Петровых с плавным движением
function ComicImageCarousel({ project }: { project: any }) {
  // Используем comicImages из проекта
  const images = project.comicImages ? [
    project.comicImages.cover,
    project.comicImages.boy,
    project.comicImages.tram,
    project.comicImages.phone,
    project.comicImages.phone2
  ] : [project.image];

  // Дублируем изображения для бесконечной прокрутки
  const duplicatedImages = [...images, ...images];

  return (
    <div className="comic-image-carousel">
      <div className="comic-images-container">
        {duplicatedImages.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt={`Комикс кадр ${(index % images.length) + 1}`}
            data-testid="img-project"
            onError={(e) => console.log('Ошибка загрузки комикс изображения:', image)}
            onLoad={() => console.log('Комикс изображение загружено:', image)}
          />
        ))}
      </div>
    </div>
  );
}

function PhotoCarousel({ photos }: { photos: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000); // Смена каждые 4 секунды

    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <div className="photo-carousel vhs-enhanced rounded-lg shadow-2xl">
      {photos.map((photo, index) => (
        <img
          key={`${photo}-${index}`}
          src={photo}
          alt={`Кадр из спектакля ${index + 1}`}
          className={index === currentIndex ? 'active' : ''}
          data-testid="img-project"
          onError={(e) => console.log('Ошибка загрузки фото:', photo)}
          onLoad={() => console.log('Фото загружено:', photo)}
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


// Треки для спектакля "Идиот"
const idiotTracks = [
  {
    id: 'nastasya',
    title: 'Тема Настасьи Филипповны',
    url: '/audio/nastasya.mp3'
  },
  {
    id: 'myshkin',
    title: 'Тема Мышкина',
    url: '/audio/myshkin.mp3'
  },
  {
    id: 'nastasya_nightmare',
    title: 'Кошмар Настасьи Филипповны',
    url: '/audio/nastasya_nightmare.mp3'
  },
  {
    id: 'city',
    title: 'Тема города',
    url: '/audio/city.mp3'
  }
];

// Треки для спектакля "Маяковский. Я сам"
const mayakTracks = [
  {
    id: 'letters',
    title: 'Письма',
    url: '/audio/mayak_letters.mp3'
  },
  {
    id: 'lilya_theme',
    title: 'Тема Маяковского и Лили',
    url: '/audio/mayak_lilya_theme.mp3'
  },
  {
    id: 'gori_gori',
    title: 'Гори-гори',
    url: '/audio/mayak_gori_gori.mp3'
  }
];

// Треки для спектакля "Петровы в гриппе и вокруг него"
const petrovyTracks = [
  {
    id: 'petrovy_lonely_theme',
    title: 'Тема одиночества',
    url: '/audio/Petrovy_lonely_theme.mp3'
  },
  {
    id: 'petrovy_mad_theme', 
    title: 'Приехали в гости',
    url: '/audio/Petrovy_mad_theme.mp3'
  },
  {
    id: 'petrovy_theme_of_sick',
    title: 'Болезнь Петрова младшего',
    url: '/audio/Petrovy_theme_of_sick.mp3'
  }
];


export default function ProjectPage() {
  const [, params] = useRoute("/project/:id");
  const projectId = params?.id;
  const [currentBackgroundImage, setCurrentBackgroundImage] = useState('');
  
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
  
  const project = projects.find(p => p.id === projectId);

  // 🎵 Установка плейлиста для проектов с музыкой
  useEffect(() => {
    if (!projectId) return;
    
    // Устанавливаем плейлист в зависимости от проекта
    if (projectId === "idiot-saratov-drama") {
      setCurrentProjectPlaylist(idiotTracks);
      setCurrentProjectTrack(0);
      setIsProjectPlayerReady(true);
    } else if (projectId === "petrovy-saratov-drama") {
      setCurrentProjectPlaylist(petrovyTracks);
      setCurrentProjectTrack(0);
      setIsProjectPlayerReady(true);
    } else if (projectId === "mayakovsky-moscow-estrada") {
      setCurrentProjectPlaylist(mayakTracks);
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
  }, [projectId, setCurrentProjectPlaylist, setCurrentProjectTrack, setIsProjectPlayerReady]);

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
          <h1 className="text-4xl font-bold text-white mb-4">Проект не найден</h1>
          <Link 
            href="/" 
            className="text-primary hover:text-primary/80 transition-colors duration-200"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const categoryNames = {
    theatre: "Театр",
    film: "Кино", 
    audio: "Аудиоспектакли"
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

    // Одноразовая инициализация Canvas
    const initCanvas = () => {
      const canvas = document.getElementById('petrovy-bg-canvas');
      if (canvas) {
        initParallaxBackground('petrovy-bg-canvas');
      }
    };

    // Запускаем один раз после небольшой задержки
    const timer = setTimeout(initCanvas, 200);

    return () => {
      clearTimeout(timer);
      // Сбрасываем флаг при размонтировании
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
        title={`${project.title} — ${project.year} | Ян Кузьмичёв`}
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
              href="/"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-primary transition-colors duration-200"
              data-testid="link-back"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад
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
                  <NeonTitle text="ИДИОТ" />
                  <p className="text-xl font-medium text-gray-300 mt-4 mb-2">
                    Театр драмы им. Слонова • 2024
                  </p>
                  <p className="text-sm text-gray-400 mb-6">г. Саратов</p>
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
                  <MayakTitle text="" />
                  <p className="text-xl font-medium mt-4 mb-2" style={{color: '#8B4513'}}>
                    «Артлайф» • 2024
                  </p>
                  <p className="text-sm mb-6" style={{color: '#8B4513', opacity: 0.7}}>г. Москва</p>
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
                    data-text="ПЕТРОВЫ В ГРИППЕ"
                    data-testid="text-title"
                  >
                    ПЕТРОВЫ В ГРИППЕ
                  </h1>
                  <div className="petrovy-subtitle">и вокруг него</div>
                  <p className="text-xl font-medium text-gray-300 mt-4 mb-2">Театр драмы им. Слонова • 2025</p>
                  <p className="text-sm text-gray-400 mb-6">г. Саратов</p>
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
                    человек человеку
                  </p>
                  <p className="text-xl font-medium text-gray-300 mt-4 mb-2">Короткометражный фильм • 2025</p>
                  <p className="text-sm text-gray-400 mb-6">Режиссёр: Иван Комаров</p>
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
                    МА
                  </h1>
                  <p className="text-xl font-medium text-gray-300 mt-4 mb-2">Короткометражный фильм • 2024</p>
                  <p className="text-sm text-gray-400 mb-6">Режиссёр: Валентина Бесолова</p>
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
                {project.id !== "idiot-saratov-drama" && project.id !== "mayakovsky-moscow-estrada" && project.id !== "petrovy-saratov-drama" && project.id !== "homo-homini-short" && project.id !== "ma-short-film" && (
                  <>
                    <div className="text-sm idiot-primary font-medium tracking-wide uppercase mb-2">
                      {categoryNames[project.category]} • {project.year}
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-title">
                      {project.title}
                    </h1>
                  </>
                )}
                
                {project.id !== "homo-homini-short" && project.id !== "ma-short-film" && (
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
                      <h4 className="text-white font-medium mb-3">Постановочная команда</h4>
                      <div className="text-gray-300 space-y-1">
                        <p>Режиссёр: Иван Комаров</p>
                        <p>Художник: Ольга Кузнецова</p>
                        <p>Художник по свету: Максим Бирюков</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-3">Роль в проекте</h4>
                      <p className="idiot-primary font-semibold text-lg">
                        Композитор, саунд-дизайнер, звукорежиссер, промт-инжинер
                      </p>
                    </div>
                  </div>
                  
                  <div className="glass-effect rounded-xl p-6 space-y-6">

                    <div className="space-y-6 text-gray-300 leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold idiot-heading mb-3">Концепция</h4>
                        <p>
                          Постановка Достоевского, перенесенная в Саратов 1999 года. Спектакль сочетает 
                          театр и «живое кино» — два оператора снимают действие, зритель видит параллельно 
                          сцену и экранную версию в эстетике 90-х.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold idiot-heading mb-3">Творческая задача</h4>
                        <p>
                          Создать звук с кино-эстетикой для театра, чтобы зритель поверил в происходящее 
                          на экране, как в сериалах 90-х в духе Twin Peaks и «Секретных материалов».
                        </p>
                        
                        <div className="mt-4">
                          <p className="font-medium text-white mb-2">Выполненные работы:</p>
                          <ul className="list-none space-y-0 ml-4">
                            <li>• Написание оригинальной музыки</li>
                            <li>• Работа с микрофонами и звукозаписью</li>
                            <li>• Создание полевых записей</li>
                            <li>• Работа с ИИ-инструментами для обработки звука</li>
                            <li>• Создание аутентичных саундскейпов и эффектов</li>
                            <li>• Создание звуковой партитуры и карты проекта</li>
                            <li>• Автоматизация звуковой консоли в QLab</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold idiot-heading mb-3">Ключевые решения</h4>
                        
                        <div className="space-y-4">
                          <p>
                            <strong className="text-white">Полевые записи:</strong> лично записал звуки Саратова: 
                            трамваи, шаги, двери, городской шум. Эти записи стали основой звукового мира спектакля.
                          </p>
                          
                          <p>
                            <strong className="text-white">Нейросети для речи:</strong> клонировал голос актёра 
                            для немецких реплик князя Мышкина, получив чистое произношение без акцента голосом персонажа.
                          </p>
                          
                          <p>
                            <strong className="text-white">Музыкальная драматургия:</strong> 10 оригинальных композиций 
                            двигающих повествование и создающих атмосферу.
                          </p>
                        </div>
                      </div>


                      <div className="bg-pink-500/10 border border-pink-500/30 p-4 rounded-lg">
                        <h4 className="text-xl font-semibold idiot-heading mb-3">Результат</h4>
                        <p>
                          Эффект полного погружения - зритель видит спектакль и его экранную версию одновременно.<br/>
                          Мой вклад: создание целого аудиомира - от городских записей до музыкальной партитуры.
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
                      <h4 className="mayak-primary font-medium mb-3">Постановочная команда</h4>
                      <div className="text-gray-800 space-y-1">
                        <p>Режиссёр, автор инсценировки: Семён Шомин</p>
                        <p>Художник-постановщик: Татьяна Зарубина</p>
                        <p>Режиссёр по пластике: Игорь Шаройко</p>
                        <p>Художник по свету: Максим Бирюков</p>
                        <p>Художник по видео: Дмитрий Соболев</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="mayak-primary font-medium mb-3">Роль в проекте</h4>
                      <p className="mayak-primary font-semibold text-lg">
                        Саунд-дизайнер, композитор, звукорежиссёр, промт-инжинер
                      </p>
                    </div>
                  </div>
                  
                  <div style={{backgroundColor: 'rgba(245, 222, 179, 0.1)'}} className="rounded-xl p-6 space-y-6 border border-amber-900/20">

                    <div className="space-y-6 text-gray-800 leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold mayak-heading mb-3">Концепция</h4>
<p className="text-gray-800">
                          Спектакль начинается «за секунду до» - перед выстрелом Маяковский вспоминает свою биографию. 
                          Постановка раскрывает поэта как живого человека со страстями и страданиями, а не просто «продукт времени». 
                          Минимум декораций и визуальных спецэффектов, акцент на психологизме. Создана трёхслойная звуковая драматургия: 
                          реальность, поэтический слой и абстракция.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold mayak-heading mb-3">Творческая задача</h4>
<p className="text-gray-800">
                          Создать звуковую партитуру, где зритель интуитивно чувствует переключение между жизнью, 
                          поэтическим текстом и внутренним монологом героя.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold mayak-heading mb-3">Техническая задача</h4>
<p className="text-gray-800">
                          Обеспечить гибкую архитектуру для антрепризы - спектакль должен стабильно звучать на любых 
                          площадках с разными консолями и акустическими условиями.
                        </p>
                        
                        <div className="mt-4">
                          <p className="font-medium mayak-primary mb-2">Выполненные работы:</p>
                          <ul className="list-none space-y-0 ml-4">
                            <li>• Создание трёхслойной звуковой концепции</li>
                            <li>• Написание 6 оригинальных композиций</li>
                            <li>• Переаранжировка музыкального материала</li>
                            <li>• Полевые записи актёров и бытовых звуков</li>
                            <li>• Работа с ИИ-инструментами для спецэффектов</li>
                            <li>• Проектирование адаптивной технической архитектуры</li>
                            <li>• Программирование в QLab 5 + OSC-автоматизация</li>
                            <li>• Подготовка системы под разные площадки</li>
                            <li>• Работа в качестве выпускающего звукорежиссёра</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold mayak-heading mb-3">Ключевые решения</h4>
                        <div className="space-y-4">
<p className="text-gray-800">
                            <strong className="mayak-primary">Динамическая трансформация звука:</strong> музыка и голоса в реальном времени 
                            превращаются из естественных в совершенно иные формы, создавая эффект смены восприятия.
                          </p>
                          
<p className="text-gray-800">
                            <strong className="mayak-primary">Антрепризная архитектура:</strong> автоматическая адаптация от surround к стерео, 
                            от Yamaha Rivage к M32/X32 с готовыми шаблонами.
                          </p>
                          
<p className="text-gray-800">
                            <strong className="mayak-primary">Живые записи:</strong> на Zoom-рекордер записывал актёров и бытовые звуки, 
                            ставшие частью слоя спектакля.
                          </p>
                        </div>
                      </div>

                      <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                        <h4 className="text-xl font-semibold mayak-heading mb-3">Результат</h4>
                        <p>
                          Насыщенная звуковая партитура с эффектом погружения. Спектакль успешно гастролирует, стабильно звучит на разных площадках.<br/>
                          Мой вклад: построение трёхслойной звуковой драматургии, создание музыкальных композиций, проектирование гибкой технической системы.
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
                  title="Музыка из спектакля" 
                  className="idiot-themed"
                />
              )}

              {/* Case Study for Petrovy */}
              {project.id === "petrovy-saratov-drama" && (
                <div className="mt-8 relative" style={{zIndex: 30}}>
                  
                  {/* Постановочная команда и роль в проекте в две колонки */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm relative" style={{zIndex: 30}}>
                    <div>
                      <h4 className="text-white font-medium mb-3">Постановочная команда</h4>
                      <div className="text-gray-300 space-y-1">
                        <p>Режиссёр, автор инсценировки: Иван Комаров</p>
                        <p>Художник-постановщик: Ольга Кузнецова</p>
                        <p>Художник по свету: Максим Бирюков</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-3">Роль в проекте</h4>
                      <p className="text-green-400 font-semibold text-lg">
                        Композитор, саунд-дизайнер, звукорежиссёр, промт-инженер
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-8 text-gray-300 leading-relaxed relative" style={{zIndex: 30}}>
                    <div className="p-6 relative" style={{zIndex: 30}}>
                      <h4 className="text-2xl font-bold text-green-400 mb-4">Концепция</h4>
                      <p className="text-lg">
                        Театр как комикс, где пространство одновременно рассказывает историю Петровых и размышляет о театре как о пространстве бреда. 
                        Постановка балансирует между бытовым реализмом и абсурдом. Создана четкая партитура в QLab с точной синхронизацией, 
                        настроена автоматизация через MIDI и OSC-протоколы для управления всеми звуковыми элементами спектакля.
                      </p>
                    </div>

                    <div className="p-6 relative" style={{zIndex: 30}}>
                      <h4 className="text-2xl font-bold text-green-400 mb-4">Техническая задача</h4>
                      <p className="text-lg">
                        Создать четкую партитуру в QLab с точной синхронизацией, настроить автоматизацию через MIDI и OSC-протоколы 
                        для управления всеми звуковыми элементами спектакля.
                      </p>
                    </div>

                    <div className="p-6 relative" style={{zIndex: 30}}>
                      <h4 className="text-2xl font-bold text-green-400 mb-4">Творческая задача</h4>
                      <p className="text-lg mb-4">
                        Написать 12 композиций разных жанров, создав звуковую партитуру как равноправный драматургический пласт, 
                        который поможет удержать зрителя в лабиринте абсурдного повествования.
                      </p>
                      
                      <div className="mt-6">
                        <p className="text-xl font-semibold text-white mb-3">Выполненные работы:</p>
                        <ul className="list-none space-y-2 ml-6 text-lg">
                          <li>• Создание 12 полноценных композиций разных жанров</li>
                          <li>• Разработка лейтмотивной системы для персонажей и сцен</li>
                          <li>• Создание атмосферных эмбиентов и дроун-текстур</li>
                          <li>• Работа с ИИ для создания оперного кавера</li>
                          <li>• Программирование и автоматизация в QLab</li>
                          <li>• Работа в качестве выпускающего звукорежиссера</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-6 relative" style={{zIndex: 30}}>
                      <h4 className="text-2xl font-bold text-green-400 mb-4">Ключевые решения</h4>
                      
                      <div className="space-y-6 text-lg">
                        <p>
                          <strong className="text-white text-xl">Жанровая мозаика:</strong> музыка следует логике спектакля, 
                          переключаясь от сентиментального неоклассицизма до тревожных эмбиентов и мультяшной гротескности.
                        </p>
                        
                        <p>
                          <strong className="text-white text-xl">Ироничные ИИ-эксперименты:</strong> оперная обработка песни «Ноль» 
                          подчеркнула комиксную природу постановки.
                        </p>
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-lg">
                      <h4 className="text-2xl font-bold text-green-400 mb-4">Результат</h4>
                      <p className="text-lg">
                        Спектакль, где каждый элемент звуковой партитуры работает на создание целостного художественного высказывания.<br/>
                        <strong className="text-white">Мой вклад:</strong> создание полноценной музыкальной драматургии, экспериментальные ИИ-решения, техническая реализация сложной звуковой архитектуры спектакля.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* Music Section for Petrovy Project */}
              {project.id === "petrovy-saratov-drama" && (
                <WinampPlayer 
                  projectId={project.id}
                  title="Музыка из спектакля" 
                  className="petrovy-themed"
                />
              )}

          </div>



          {/* Music Section for Mayakovsky Project */}
          {project.id === "mayakovsky-moscow-estrada" && (
            <WinampPlayer 
              projectId={project.id} 
              title="Музыка из спектакля" 
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
                      Короткометражная драма с элементами чёрной комедии. Создано 13 оригинальных композиций и проведен полный пост-продакшн звука включая финальный микс в 5.1. Саунд-дизайн балансирует между реализмом и стилизацией под азиатские боевики. Премьера состоялась на кинофестивале «Короче» в Калининграде.
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
                    <h4 className="text-white font-medium mb-3">Съёмочная группа</h4>
                    <div className="text-gray-300 space-y-2">
                      <p><strong>Режиссёр, сценарист:</strong> Иван Комаров</p>
                      <p><strong>Продюсеры:</strong> Элеонора Клементьева, Иван Комаров, Елена Ербакова</p>
                      <p><strong>Оператор:</strong> Лотос Суни Парк</p>
                      <p><strong>Художники:</strong> Галина Процанова, Анна Хрусталева</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 font-medium mb-2">В главных ролях:</p>
                      <p className="text-gray-300 text-sm">Семён Штейнберг, Елена Ербакова, Антон Кузнецов, Алёна Бабенко, Александр Панов, Батраз Засеев, Ефим Белосорочка</p>
                    </div>
                  </div>
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-white font-medium mb-3">Роль в проекте</h4>
                    <p className="text-yellow-400 font-semibold text-lg">
                      Композитор, саунд-дизайнер, звукорежиссёр пост-продакшена, сонграйтер, промт-инженер
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
                    <h4 className="text-xl font-semibold mb-3" style={{color: '#FFD700'}}>Концепция</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Фильм о человеке, превращающем свою жизнь в кинематографическую цитату. Герой находит в чужой культуре силу для мести, балансируя между подлинностью и условностью.
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
                    <h4 className="text-xl font-bold mb-4" style={{color: '#FFD700'}}>Творческая задача</h4>
                    <p className="text-gray-300">
                      Написать 13 композиций как эмоциональную партитуру героя, создать двухуровневый саунд-дизайн (реализм + стилизация), сделать звук второй драматургией фильма.
                    </p>
                  </div>
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-xl font-bold mb-4" style={{color: '#FFD700'}}>Техническая задача</h4>
                    <p className="text-gray-300">
                      Провести полный цикл пост-продакшна звука: от монтажа до финального микса в стерео и 5.1, обеспечить техническое качество для кинофестивального показа.
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
                    <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>Выполненные работы</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-gray-300">
                        <li>• Написание 13 оригинальных композиций</li>
                        <li>• Сонграйтинг</li>
                        <li>• Создание японской песни 70-х с помощью ИИ</li>
                        <li>• Полевые записи бытовых звуков и локаций</li>
                      </ul>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Создание стилизованного саунд-дизайна для боевых сцен</li>
                        <li>• Монтаж, сведение и мастеринг звука</li>
                        <li>• Подготовка финальных миксов в стерео и 5.1</li>
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
                    <h3 className="text-2xl font-bold" style={{color: '#FFD700'}}>Ключевые решения</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Эмоциональная партитура</h4>
                        <p className="text-gray-300">Музыка следует за внутренними состояниями Саввы — от комичности до драмы и экшена, становясь его «вторым голосом».</p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Коллаборативная японская песня</h4>
                        <p className="text-gray-300">Режиссёр написал текст, который был переведён на японский и с помощью ИИ превращён в аутентичную композицию в стиле японского шансона 70-х с женским вокалом.</p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Двухуровневый саунд-дизайн</h4>
                        <p className="text-gray-300">Реалистичные бытовые сцены контрастируют со стилизованными под азиатские боевики эпизодами мести.</p>
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
                    <h3 className="text-2xl font-bold mb-4" style={{color: '#FFD700'}}>Результат</h3>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      Фильм получил цельный звуковой образ с выразительной драматургией. Премьера состоялась на кинофестивале «Короче» в Калининграде. Это кинопроект, где я взял на себя весь пласт звукового производства.
                    </p>
                    <p className="text-yellow-400 font-semibold mt-4">
                      <strong>Мой вклад:</strong> создание полной звуковой партитуры фильма, инновационное использование ИИ для генерации аутентичной японской песни, полный цикл пост-продакшна звука.
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
                      Короткометражная драма о матери и дочери, переживающих утрату. Кино почти без диалогов, где пейзаж и быт говорят вместо слов. Действие происходит в Северной Осетии, в селе Даргавс. Проведена реставрация звукового материала, переозвучена часть сцен без предзаписанного звука.
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
                    <h4 className="text-white font-medium mb-3">Съёмочная группа</h4>
                    <div className="text-gray-300 space-y-2">
                      <p><strong>Режиссёр:</strong> Валентина Бесолова</p>
                      <p><strong>Оператор:</strong> Владимир Дыдыкин</p>
                      <p><strong>Художник-постановщик:</strong> Карина Дзабиева</p>
                      <p><strong>Монтаж:</strong> Антон Переведенцев, Валентина Бесолова</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 font-medium mb-2">В ролях:</p>
                      <p className="text-gray-300 text-sm">Зита Лацоева (Зарема), Милана Кониева (Сабина), Алан Албегов (Алик)</p>
                    </div>
                  </div>
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-white font-medium mb-3">Роль в проекте</h4>
                    <p className="text-cyan-400 font-semibold text-lg">
                      Звукорежиссёр пост-продакшна
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
                    <h4 className="text-xl font-semibold mb-3" style={{color: '#67E8F9'}}>Концепция</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Фильм построен вокруг отношений матери и дочери, оставшихся вдвоём после смерти сына и брата. Это камерная драма о переживании утраты, где тишина и повседневные жесты заменяют слова и музыку.
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
                    <h4 className="text-xl font-bold mb-4" style={{color: '#67E8F9'}}>Творческая задача</h4>
                    <p className="text-gray-300">
                      Создать звуковой мир, где тишина и бытовые звуки работают вместо музыки. Построить драматургию через микродинамику среды и пространственные переходы.
                    </p>
                  </div>
                  <div className="glass-effect rounded-xl p-6">
                    <h4 className="text-xl font-bold mb-4" style={{color: '#67E8F9'}}>Техническая задача</h4>
                    <p className="text-gray-300">
                      Провести полную реставрацию звукового материала, создать фоли для сцен без записанного на площадке звука, обеспечить точную синхронизацию звука с планами камеры.
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
                    <h3 className="text-2xl font-bold mb-4" style={{color: '#67E8F9'}}>Выполненные работы</h3>
                    <div className="space-y-2 text-gray-300">
                      <p>• Реставрация исходного материала в iZotope RX</p>
                      <p>• Создание полного foley (шаги, одежда, предметы)</p>
                      <p>• Создание атмосферных слоев среды</p>
                      <p>• Пространственная обработка под планы камеры</p>
                      <p>• Финальное сведение и мастеринг в стерео</p>
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
                    <h3 className="text-2xl font-bold mb-4" style={{color: '#67E8F9'}}>Ключевые решения</h3>
                    <p className="text-gray-300 leading-relaxed">
                      <strong className="text-cyan-300">Звуковой реализм:</strong> звук меняется в зависимости от расположения камеры. Каждый план имеет свою звуковую глубину и пространственность, что создаёт эффект присутствия и помогает зрителю погрузиться в атмосферу Северного Кавказа.
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
                    <h3 className="text-2xl font-bold mb-4" style={{color: '#67E8F9'}}>Результат</h3>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      Создан живой, достоверный звуковой слой без перегрузки. В отсутствие музыки именно звук ведёт зрителя, помогая прочитать желания героев и ощутить пространство Северного Кавказа.
                    </p>
                    <p className="text-gray-200 font-semibold mt-4">
                      <strong className="text-cyan-300">Мой вклад:</strong> полный пост-продакшн звука от реставрации до стерео-мастера, создание звуковой драматургии на основе естественных звуков без музыкального сопровождения.
                    </p>
                  </div>
                </motion.div>

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
                <h3 className="text-lg font-semibold text-white mb-4">Ссылки</h3>
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
                <h3 className="text-lg font-semibold text-white mb-4">Награды</h3>
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