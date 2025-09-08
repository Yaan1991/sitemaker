import { motion } from "framer-motion";
import { useRoute } from "wouter";
import { projects } from "@/data/projects";
import SEOHead from "@/components/SEOHead";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useAudio } from "@/contexts/AudioContext";
import { useState, useEffect } from "react";

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

// Компонент автосмены фото
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

export default function ProjectPage() {
  const [, params] = useRoute("/project/:id");
  const projectId = params?.id;
  const [isMainPlayerPlaying, setIsMainPlayerPlaying] = useState(false);
  const { isGlobalAudioEnabled, toggleGlobalAudio } = useAudio();
  
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

  return (
    <>
      <SEOHead 
        title={`${project.title} — ${project.year} | Ян Кузьмичёв`}
        description={project.fullDescription}
      />
      
      <div className={`min-h-screen pt-24 pb-12 ${project.id === "idiot-saratov-drama" ? "vhs-container" : ""}`}>
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

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              
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
                  
                  {/* Кнопка слушать музыку */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    onClick={toggleGlobalAudio}
                    className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white transition-all duration-300 animate-pulse-neon shadow-lg"
                    data-testid="button-listen-music"
                    title={isGlobalAudioEnabled ? "Выключить музыку из спектакля" : "Включить музыку из спектакля"}
                  >
                    {isGlobalAudioEnabled ? "🔇 Выключить звук" : "🎵 Включить звук"}
                  </motion.button>
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
                {project.id !== "idiot-saratov-drama" && (
                  <>
                    <div className="text-sm text-primary font-medium tracking-wide uppercase mb-2">
                      {categoryNames[project.category]} • {project.year}
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-title">
                      {project.title}
                    </h1>
                  </>
                )}
                <p className="text-xl text-gray-300 leading-relaxed">
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
                      <p className="text-primary font-medium">
                        Композитор, саунд-дизайнер, звукорежиссер, промт-инжинер
                      </p>
                    </div>
                  </div>
                  
                  <div className="glass-effect rounded-xl p-6 space-y-6">

                    <div className="space-y-6 text-gray-300 leading-relaxed">
                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Концепция</h4>
                        <p>
                          Постановка Достоевского, перенесенная в Саратов 1999 года. Спектакль сочетает 
                          театр и «живое кино» — два оператора снимают действие, зритель видит параллельно 
                          сцену и экранную версию в эстетике 90-х.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Творческая задача</h4>
                        <p>
                          Создать звук с кино-эстетикой для театра, чтобы зритель поверил в происходящее 
                          на экране, как в сериалах 90-х в духе Twin Peaks и «Секретных материалов».
                        </p>
                        
                        <div className="mt-4">
                          <p className="font-medium text-white mb-2">Задачи:</p>
                          <ul className="list-none space-y-1 ml-4">
                            <li>• Оригинальная музыка</li>
                            <li>• Работа с микрофонами</li>
                            <li>• Полевые записи</li>
                            <li>• Работа с ИИ-инструментами</li>
                            <li>• Аутентичные саундскейпы и эффекты</li>
                            <li>• Создание звуковой партитуры, карты проекта</li>
                            <li>• Автоматизация звуковой консоли в QLab</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-primary mb-3">Ключевые решения</h4>
                        
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


                      <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg">
                        <h4 className="text-xl font-semibold text-primary mb-3">Результат</h4>
                        <p>
                          Эффект полного погружения - зритель видит спектакль и его экранную версию одновременно.<br/>
                          Мой вклад: создание целого аудиомира - от городских записей до музыкальной партитуры.
                        </p>
                      </div>





                      
                      <p>
                        <strong className="text-primary">Финальный результат — эффект кино в театре. </strong> 
                        Зритель мог смотреть одновременно спектакль и экранную версию с крупными планами. 
                        Звук создавал эффект присутствия: бытовая музыка звучала реалистично из окон и 
                        бумбоксов, шум города оживал, а саундтрек вёл драматургию. Без моих записей города, 
                        без этой музыки и без экспериментов с голосами спектакль звучал бы совсем иначе.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* Regular Details for other projects */}
              {project.id !== "idiot-saratov-drama" && project.details && (
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
                              className="px-2 py-1 bg-primary/20 text-primary text-sm rounded"
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

            {/* Sidebar - 1 column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              
              {/* Roles */}
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Роль в проекте</h3>
                <div className="flex flex-wrap gap-2">
                  {project.role.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Venue */}
              {project.venue && (
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Место проведения</h3>
                  <p className="text-gray-300">{project.venue}</p>
                </div>
              )}

              {/* Links */}
              {project.links && project.links.length > 0 && (
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Ссылки</h3>
                  <div className="space-y-2">
                    {project.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target={link.external ? "_blank" : "_self"}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 block"
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
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Награды</h3>
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
      </div>
    </>
  );
}