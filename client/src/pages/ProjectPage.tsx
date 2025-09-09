import { motion } from "framer-motion";
import { useRoute } from "wouter";
import { projects } from "@/data/projects";
import SEOHead from "@/components/SEOHead";
import { ExternalLink, ArrowLeft, VolumeX, Volume2, Play, Pause, SkipBack, SkipForward, Square } from "lucide-react";
import { Link } from "wouter";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useAudio } from "@/contexts/AudioContext";
import { useState, useEffect, useRef } from "react";

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






// Компонент автосмены фото
// Карусель комиксных изображений для Петровых
function ComicImageCarousel({ project }: { project: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Используем comicImages из проекта
  const images = project.comicImages ? [
    project.comicImages.cover,
    project.comicImages.boy,
    project.comicImages.tram,
    project.comicImages.phone,
    project.comicImages.phone2
  ] : [project.image];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Смена каждые 3 секунды для динамичности

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="comic-image-carousel">
      {images.map((image, index) => (
        <img
          key={`${image}-${index}`}
          src={image}
          alt={`Комикс кадр ${index + 1}`}
          className={index === currentIndex ? 'active' : ''}
          data-testid="img-project"
          onError={(e) => console.log('Ошибка загрузки комикс изображения:', image)}
          onLoad={() => console.log('Комикс изображение загружено:', image)}
        />
      ))}
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
    url: '/audio/petrovy_lonely_theme.mp3'
  },
  {
    id: 'petrovy_mad_theme', 
    title: 'Приехали в гости',
    url: '/audio/petrovy_mad_theme.mp3'
  },
  {
    id: 'petrovy_theme_of_sick',
    title: 'Болезнь Петрова младшего',
    url: '/audio/petrovy_theme_of_sick.mp3'
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
    // Добавляем недостающие состояния из глобального плеера
    isPlaying,
    currentTime,
    duration
  } = useAudio();
  
  // Используем состояние напрямую из глобального контекста
  const localIsPlaying = isPlaying;
  const localCurrentTime = currentTime;
  const localDuration = duration;
  
  // Фотографии для спектакля "Идиот" (4 фото)
  const idiotPhotos = [
    "/images/idiot.webp",
    "/images/idiot3_1756479054514.webp",
    "/images/idiot4_1756479054514.webp",
    "/images/idiot5_1756479169274.webp"
  ];
  
  const project = projects.find(p => p.id === projectId);

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
  
  // Intersection Observer для смены фона при скроллинге (только для Петровых)
  useEffect(() => {
    if (project?.id !== "petrovy-saratov-drama" || !project.comicImages) return;

    const sections = document.querySelectorAll('[data-section]');
    const imageMapping: { [key: string]: string } = {
      'concept': project.comicImages.cover,
      'creative-task': project.comicImages.boy,
      'technical-task': project.comicImages.phone,
      'key-solutions': project.comicImages.tram,
      'result': project.comicImages.phone2 || project.comicImages.phone,
    };

    // Устанавливаем начальное изображение
    setCurrentBackgroundImage(project.comicImages.cover);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute('data-section');
            if (sectionName && imageMapping[sectionName]) {
              setCurrentBackgroundImage(imageMapping[sectionName]);
            }
          }
        });
      },
      { threshold: 0.3 } // Изображение меняется когда секция на 30% видна
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [project?.id, project?.comicImages]);

  // Автоматическое воспроизведение для Петровых в гриппе при заходе на страницу
  useEffect(() => {
    if (project?.id === "petrovy-saratov-drama") {
      // Небольшая задержка чтобы страница загрузилась полностью
      const timer = setTimeout(() => {
        const player = (window as any).projectPlayer;
        if (player) {
          player.setPlaylist(petrovyTracks);
          player.setCurrentTrack(petrovyTracks[0]); // Автоматически играем первый трек (тема одиночества)
          player.togglePlayPause();
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [project?.id]);
  
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
      
      <div 
        className={`min-h-screen pt-24 pb-12 ${
          project.id === "idiot-saratov-drama" ? "vhs-container" : 
          project.id === "mayakovsky-moscow-estrada" ? "projector-container" :
          project.id === "petrovy-saratov-drama" ? "comic-container" : ""
        }`}
        style={project.id === "petrovy-saratov-drama" && currentBackgroundImage ? {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${currentBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transition: 'background-image 0.8s ease-in-out'
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
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
          <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Заголовок и информация для проекта Идиот */}
              {project.id === "idiot-saratov-drama" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <NeonTitle text="ИДИОТ" />
                  <p className="text-xl font-medium text-gray-300 mt-4 mb-6">
                    Театр им. Слонова • 2024
                  </p>
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
                  <p className="text-xl font-medium mt-4 mb-6" style={{color: '#8B4513'}}>
                    «Артлайф» • 2024
                  </p>
                </motion.div>
              )}

              {/* Заголовок и информация для проекта Петровы */}
              {project.id === "petrovy-saratov-drama" && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-8"
                >
                  <h1 
                    className="petrovy-title" 
                    data-text="ПЕТРОВЫ В ГРИППЕ"
                    data-testid="text-title"
                  >
                    ПЕТРОВЫ В ГРИППЕ
                  </h1>
                  <div className="petrovy-subtitle">и вокруг него</div>
                  <p className="text-xl font-medium text-gray-300 mt-4 mb-6">
                    Саратовский театр драмы • 2025
                  </p>
                </motion.div>
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
                  /* Фото с эффектом проектора для Маяковского */
                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto rounded-lg projector-enhanced"
                      data-testid="img-project"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 to-transparent rounded-lg" />
                  </div>
                ) : project.id === "petrovy-saratov-drama" ? (
                  /* Убираем отдельную галерею для Петровых, будем использовать изображения как фон разделов */
                  <></>
                ) : (
                  /* Обычное фото для других проектов */
                  <>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto rounded-lg shadow-2xl"
                      data-testid="img-project"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                  </>
                )}
              </motion.div>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {project.id !== "idiot-saratov-drama" && project.id !== "mayakovsky-moscow-estrada" && project.id !== "petrovy-saratov-drama" && (
                  <>
                    <div className="text-sm idiot-primary font-medium tracking-wide uppercase mb-2">
                      {categoryNames[project.category]} • {project.year}
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-title">
                      {project.title}
                    </h1>
                  </>
                )}
                
                <p className={`text-xl leading-relaxed ${
                  project.id === "mayakovsky-moscow-estrada" ? "text-gray-800" :
                  project.id === "petrovy-saratov-drama" ? "text-gray-300" : "text-gray-300"
                }`}>
                  {project.fullDescription}
                </p>
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

              {/* Case Study for Petrovy */}
              {project.id === "petrovy-saratov-drama" && (
                <div className="mt-8">
                  
                  {/* Постановочная команда и роль в проекте в две колонки */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
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
                  
                  <div className="space-y-6 text-gray-300 leading-relaxed">
                    <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-green-500/30" data-section="concept">
                      <h4 className="text-xl font-semibold text-green-400 mb-3">Концепция</h4>
                      <p>
                        Театр как комикс, где пространство одновременно рассказывает историю Петровых и размышляет о театре как о пространстве бреда. 
                        Постановка балансирует между бытовым реализмом и абсурдом.
                      </p>
                    </div>

                    <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-green-500/30" data-section="creative-task">
                      <h4 className="text-xl font-semibold text-green-400 mb-3">Творческая задача</h4>
                      <p>
                        Написать 12 композиций разных жанров, создав звуковую партитуру как равноправный драматургический пласт, 
                        который поможет удержать зрителя в лабиринте абсурдного повествования.
                      </p>
                      
                      <div className="mt-4">
                        <p className="font-medium text-white mb-2">Выполненные работы:</p>
                        <ul className="list-none space-y-0 ml-4">
                          <li>• Создание 12 полноценных композиций разных жанров</li>
                          <li>• Разработка лейтмотивной системы для персонажей и сцен</li>
                          <li>• Создание атмосферных эмбиентов и дроун-текстур</li>
                          <li>• Работа с ИИ для создания оперного кавера</li>
                          <li>• Программирование и автоматизация в QLab</li>
                          <li>• Звукорежиссура и FOH-инженеринг</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-green-500/30" data-section="technical-task">
                      <h4 className="text-xl font-semibold text-green-400 mb-3">Техническая задача</h4>
                      <p>
                        Создать четкую партитуру в QLab с точной синхронизацией, настроить автоматизацию через MIDI и OSC-протоколы 
                        для управления всеми звуковыми элементами спектакля.
                      </p>
                    </div>

                    <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-green-500/30" data-section="key-solutions">
                      <h4 className="text-xl font-semibold text-green-400 mb-3">Ключевые решения</h4>
                      
                      <div className="space-y-4">
                        <p>
                          <strong className="text-white">Жанровая мозаика:</strong> музыка следует логике спектакля, 
                          переключаясь от сентиментального неоклассицизма до тревожных эмбиентов и мультяшной гротескности.
                        </p>
                        
                        <p>
                          <strong className="text-white">Ироничные ИИ-эксперименты:</strong> оперная обработка песни «Ноль» 
                          подчеркнула комиксную природу постановки.
                        </p>
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg" data-section="result">
                      <h4 className="text-xl font-semibold text-green-400 mb-3">Результат</h4>
                      <p>
                        Спектакль, где каждый элемент звуковой партитуры работает на создание целостного художественного высказывания.<br/>
                        Мой вклад: создание полноценной музыкальной драматургии, экспериментальные ИИ-решения, техническая реализация сложной звуковой архитектуры спектакля.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* Regular Details for other projects */}
              {project.id !== "idiot-saratov-drama" && project.id !== "mayakovsky-moscow-estrada" && project.id !== "petrovy-saratov-drama" && project.details && (
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-2xl font-russo font-bold text-white mb-6">Детали проекта</h3>
                  
                  <div className="space-y-4">
                    {project.details.director && (
                      <div>
                        <span className="text-sm text-primary font-medium">Режиссёр:</span>
                        <span className="text-gray-300 ml-2">{project.details.director}</span>
                      </div>
                    )}
                    
                    {project.details.genre && (
                      <div>
                        <span className="text-sm text-primary font-medium">Жанр:</span>
                        <span className="text-gray-300 ml-2">{project.details.genre}</span>
                      </div>
                    )}
                    
                    {project.details.duration && (
                      <div>
                        <span className="text-sm text-primary font-medium">Продолжительность:</span>
                        <span className="text-gray-300 ml-2">{project.details.duration}</span>
                      </div>
                    )}

                    {project.details.technical && project.details.technical.length > 0 && (
                      <div>
                        <span className="text-sm text-primary font-medium block mb-2">Технические решения:</span>
                        <div className="flex flex-wrap gap-2">
                          {project.details.technical.map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-pink-500/20 idiot-primary text-sm rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.details.cast && project.details.cast.length > 0 && (
                      <div>
                        <span className="text-sm text-primary font-medium">В ролях:</span>
                        <span className="text-gray-300 ml-2">{project.details.cast.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Music Section for Idiot Project */}
          {project.id === "idiot-saratov-drama" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-4xl mx-auto mt-12 mb-8"
            >
              <h3 className="text-3xl font-bold text-white mb-8 text-center idiot-title">
                Музыка из спектакля
              </h3>
              
              <div className="winamp-player p-6">
                
                {/* Winamp-style player interface */}
                <div className="space-y-4">
                  
                  {/* Top row: Display and Equalizer */}
                  <div className="flex justify-between items-stretch gap-4">
                    <div className="w-48 sm:w-64 md:w-80">
                      <div className="winamp-display mb-2 h-8 flex items-center">
                        {isProjectPlayerReady ? (
                          <div className="overflow-hidden whitespace-nowrap w-full">
                            <div className={`${
                              (currentProjectPlaylist?.[currentProjectTrack]?.title || 'Не выбран').length > 25 
                                ? 'animate-marquee' 
                                : 'animate-pulse'
                            }`}>
                              ♪ {currentProjectPlaylist?.[currentProjectTrack]?.title || 'Не выбран'} ♪
                            </div>
                          </div>
                        ) : (
                          '*** ЗАГРУЗКА... ***'
                        )}
                      </div>
                      <div className="flex items-center">
                        <div className="track-info overflow-hidden whitespace-nowrap w-full">
                          <span className={`text-xs sm:text-sm ${
                            'Битрейт: 128 kbps • 44 kHz • Stereo • Композитор: Ян Кузьмичёв'.length > 35 
                              ? 'animate-marquee' 
                              : ''
                          }`}>
                            Битрейт: 128 kbps • 44 kHz • Stereo • Композитор: Ян Кузьмичёв
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleGlobalAudio();
                          }}
                          className={`winamp-button text-xs px-2 py-1 ml-2 ${isGlobalAudioEnabled ? 'active' : ''}`}
                          title={isGlobalAudioEnabled ? "Выключить плеер" : "Включить плеер"}
                        >
                          {isGlobalAudioEnabled ? 'PWR' : 'OFF'}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-24 sm:w-28 md:w-32">
                      <div className="winamp-time text-xs sm:text-base">
                        {formatTime(localCurrentTime)} / {formatTime(localDuration)}
                      </div>
                      <Equalizer isPlaying={localIsPlaying && isGlobalAudioEnabled} />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${localDuration > 0 ? (localCurrentTime / localDuration) * 100 : 0}%` }}
                    />
                  </div>

                  {/* Control buttons */}
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      type="button"
                      onClick={handlePrevTrack}
                      className="winamp-button"
                      disabled={!isGlobalAudioEnabled}
                      title="Предыдущий трек"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isGlobalAudioEnabled) {
                          toggleGlobalAudio();
                          // Запускаем трек через небольшую задержку после включения звука
                          setTimeout(() => {
                            const player = (window as any).projectPlayer;
                            if (player) player.playTrack(0);
                          }, 200);
                        } else {
                          handleTogglePlayPause(e);
                        }
                      }}
                      className={`winamp-button ${localIsPlaying ? 'active' : ''}`}
                      title={localIsPlaying ? "Пауза" : "Воспроизвести"}
                    >
                      {localIsPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button 
                      type="button"
                      onClick={handleStopAudio}
                      className="winamp-button"
                      disabled={!isGlobalAudioEnabled}
                      title="Стоп"
                    >
                      <Square className="w-4 h-4" />
                    </button>

                    <button 
                      type="button"
                      onClick={handleNextTrack}
                      className="winamp-button"
                      disabled={!isGlobalAudioEnabled}
                      title="Следующий трек"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}


          {/* Music Section for Mayakovsky Project */}
          {project.id === "mayakovsky-moscow-estrada" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-4xl mx-auto mt-12 mb-8"
            >
              <h3 className="text-3xl font-bold mb-8 text-center mayak-heading">
                Музыка из спектакля
              </h3>
              
              <div style={{backgroundColor: 'rgba(245, 222, 179, 0.1)'}} className="rounded-xl p-6 border border-amber-900/30 projector-chromatic">
                
                {/* Winamp-style player interface */}
                <div className="space-y-4">
                  
                  {/* Top row: Display and Equalizer */}
                  <div className="flex justify-between items-stretch gap-4">
                    <div className="w-48 sm:w-64 md:w-80">
                      <div style={{backgroundColor: '#8B4513', color: '#F5DEB3'}} className="mb-2 h-8 flex items-center border-2 border-amber-900/50 rounded font-mono text-sm px-3 shadow-inner">
                        {isProjectPlayerReady ? (
                          <div className="overflow-hidden whitespace-nowrap w-full">
                            <div className={`${
                              (currentProjectPlaylist?.[currentProjectTrack]?.title || 'Не выбран').length > 25 
                                ? 'animate-marquee' 
                                : 'animate-pulse'
                            }`}>
                              ♪ {currentProjectPlaylist?.[currentProjectTrack]?.title || 'Не выбран'} ♪
                            </div>
                          </div>
                        ) : (
                          '*** ЗАГРУЗКА... ***'
                        )}
                      </div>
                      <div className="flex items-center">
                        <div style={{backgroundColor: '#654321', color: '#F5DEB3'}} className="overflow-hidden whitespace-nowrap w-full border border-amber-900/50 rounded text-xs px-2 py-1 font-mono shadow-inner">
                          <span className={`${
                            'Битрейт: 128 kbps • 44 kHz • Stereo • Композитор: Ян Кузьмичёв'.length > 35 
                              ? 'animate-marquee' 
                              : ''
                          }`}>
                            Битрейт: 128 kbps • 44 kHz • Stereo • Композитор: Ян Кузьмичёв
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleGlobalAudio();
                          }}
                          className={`text-xs px-2 py-1 ml-2 border-2 rounded font-mono font-bold transition-all duration-200 ${
                            isGlobalAudioEnabled 
                              ? 'bg-red-600 border-red-500 text-white shadow-lg' 
                              : 'bg-amber-900 border-amber-800 text-amber-200 hover:bg-amber-800'
                          }`}
                          title={isGlobalAudioEnabled ? "Выключить плеер" : "Включить плеер"}
                        >
                          {isGlobalAudioEnabled ? 'PWR' : 'OFF'}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-24 sm:w-28 md:w-32">
                      <div style={{backgroundColor: '#8B4513', color: '#F5DEB3'}} className="text-xs sm:text-base border-2 border-amber-900/50 rounded px-2 py-1 text-center font-mono shadow-inner">
                        {formatTime(localCurrentTime)} / {formatTime(localDuration)}
                      </div>
                      <div className="flex items-end gap-1 p-2 border border-amber-900/50 rounded shadow-inner" style={{backgroundColor: '#654321'}}>
                        {Array(10).fill(0).map((_, index) => (
                          <div
                            key={index}
                            className="w-2 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-sm transition-all duration-100"
                            style={{ 
                              height: `${localIsPlaying && isGlobalAudioEnabled ? Math.random() * 100 : 0}%`,
                              minHeight: '2px'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{backgroundColor: '#654321'}} className="border border-amber-900/50 rounded p-1 shadow-inner">
                    <div 
                      className="h-2 bg-gradient-to-r from-red-600 to-orange-500 rounded transition-all duration-100 relative overflow-hidden"
                      style={{ width: `${localDuration ? (localCurrentTime / localDuration) * 100 : 0}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </div>
                  </div>

                  {/* Control buttons */}
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevTrack}
                      className="px-3 py-2 bg-amber-900 border-2 border-amber-800 text-amber-200 rounded font-mono hover:bg-amber-800 transition-colors duration-200 disabled:opacity-50"
                      disabled={!isGlobalAudioEnabled}
                      title="Предыдущий трек"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleTogglePlayPause}
                      className="px-4 py-2 bg-red-600 border-2 border-red-500 text-white rounded font-mono hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                      disabled={!isGlobalAudioEnabled}
                      title={localIsPlaying ? "Пауза" : "Воспроизведение"}
                    >
                      {localIsPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleStopAudio}
                      className="px-3 py-2 bg-amber-900 border-2 border-amber-800 text-amber-200 rounded font-mono hover:bg-amber-800 transition-colors duration-200 disabled:opacity-50"
                      disabled={!isGlobalAudioEnabled}
                      title="Стоп"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextTrack}
                      className="px-3 py-2 bg-amber-900 border-2 border-amber-800 text-amber-200 rounded font-mono hover:bg-amber-800 transition-colors duration-200 disabled:opacity-50"
                      disabled={!isGlobalAudioEnabled}
                      title="Следующий трек"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Music Section for Petrovy Project */}
          {project.id === "petrovy-saratov-drama" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-4xl mx-auto mt-12 mb-8"
            >
              <h3 className="text-3xl font-bold mb-8 text-center text-green-400">
                Музыка из спектакля
              </h3>
              
              <div className="bg-black/90 rounded-xl p-6 border border-green-500/30">
                
                {/* Comic-style player interface */}
                <div className="space-y-4">
                  
                  {/* Top row: Display and Equalizer */}
                  <div className="flex justify-between items-stretch gap-4">
                    <div className="w-48 sm:w-64 md:w-80">
                      <div className="bg-green-900 text-green-100 mb-2 h-8 flex items-center border-2 border-green-500/50 rounded font-mono text-sm px-3 shadow-inner">
                        {isProjectPlayerReady ? (
                          <div className="overflow-hidden whitespace-nowrap w-full">
                            <div className={`${
                              (currentProjectPlaylist?.[currentProjectTrack]?.title || 'Не выбран').length > 25 
                                ? 'animate-marquee' 
                                : 'animate-pulse'
                            }`}>
                              ♪ {currentProjectPlaylist?.[currentProjectTrack]?.title || 'Не выбран'} ♪
                            </div>
                          </div>
                        ) : (
                          '*** ЗАГРУЗКА... ***'
                        )}
                      </div>
                      <div className="flex items-center">
                        <div className="track-info overflow-hidden whitespace-nowrap w-full">
                          <span className={`text-xs sm:text-sm text-gray-300 ${
                            'Битрейт: 128 kbps • 44 kHz • Stereo • Композитор: Ян Кузьмичёв'.length > 35 
                              ? 'animate-marquee' 
                              : ''
                          }`}>
                            Битрейт: 128 kbps • 44 kHz • Stereo • Композитор: Ян Кузьмичёв
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleGlobalAudio();
                          }}
                          className={`px-2 py-1 ml-2 text-xs rounded border-2 font-mono transition-colors duration-200 ${
                            isGlobalAudioEnabled 
                              ? 'bg-green-600 border-green-500 text-white hover:bg-green-700'
                              : 'bg-green-900 border-green-800 text-green-200 hover:bg-green-800'
                          }`}
                          title={isGlobalAudioEnabled ? "Выключить плеер" : "Включить плеер"}
                        >
                          {isGlobalAudioEnabled ? 'PWR' : 'OFF'}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-24 sm:w-28 md:w-32">
                      <div className="bg-green-900 text-green-100 text-xs sm:text-base border-2 border-green-500/50 rounded px-2 py-1 text-center font-mono shadow-inner">
                        {formatTime(localCurrentTime)} / {formatTime(localDuration)}
                      </div>
                      <div className="flex items-end gap-1 p-2 border border-green-500/50 rounded shadow-inner bg-black">
                        {Array(10).fill(0).map((_, index) => (
                          <div
                            key={index}
                            className="w-2 bg-gradient-to-t from-green-600 via-green-400 to-yellow-300 rounded-sm transition-all duration-100"
                            style={{ 
                              height: `${localIsPlaying && isGlobalAudioEnabled ? Math.random() * 100 : 0}%`,
                              minHeight: '2px'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="bg-black border border-green-500/50 rounded p-1 shadow-inner">
                    <div 
                      className="h-2 bg-gradient-to-r from-green-600 to-yellow-400 rounded transition-all duration-100 relative overflow-hidden"
                      style={{ width: `${localDuration ? (localCurrentTime / localDuration) * 100 : 0}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </div>
                  </div>

                  {/* Control buttons */}
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevTrack}
                      className="px-3 py-2 bg-green-900 border-2 border-green-800 text-green-200 rounded font-mono hover:bg-green-800 transition-colors duration-200 disabled:opacity-50"
                      disabled={!isGlobalAudioEnabled}
                      title="Предыдущий трек"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleTogglePlayPause}
                      className="px-4 py-2 bg-green-600 border-2 border-green-500 text-white rounded font-mono hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                      disabled={!isGlobalAudioEnabled}
                      title={localIsPlaying ? "Пауза" : "Воспроизведение"}
                    >
                      {localIsPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleStopAudio}
                      className="px-3 py-2 bg-green-900 border-2 border-green-800 text-green-200 rounded font-mono hover:bg-green-800 transition-colors duration-200 disabled:opacity-50"
                      disabled={!isGlobalAudioEnabled}
                      title="Стоп"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextTrack}
                      className="px-3 py-2 bg-green-900 border-2 border-green-800 text-green-200 rounded font-mono hover:bg-green-800 transition-colors duration-200 disabled:opacity-50"
                      disabled={!isGlobalAudioEnabled}
                      title="Следующий трек"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Links and Awards - Centered at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-4xl mx-auto mt-12 space-y-6"
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