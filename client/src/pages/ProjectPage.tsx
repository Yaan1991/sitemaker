import { motion } from "framer-motion";
import { useRoute } from "wouter";
import { projects } from "@/data/projects";
import SEOHead from "@/components/SEOHead";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useAudio } from "@/contexts/AudioContext";
import { useState } from "react";

export default function ProjectPage() {
  const [, params] = useRoute("/project/:id");
  const projectId = params?.id;
  const [isMainPlayerPlaying, setIsMainPlayerPlaying] = useState(false);
  const { isGlobalAudioEnabled, toggleGlobalAudio } = useAudio();
  
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
      
      <div className="min-h-screen pt-24 pb-12">
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
              
              {/* Project Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto rounded-lg shadow-2xl"
                  data-testid="img-project"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                
                {/* Кнопка слушать музыку для проекта Идиот */}
                {project.id === "idiot-saratov-drama" && (
                  <div className="absolute bottom-4 right-4">
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      onClick={toggleGlobalAudio}
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white transition-all duration-300 animate-pulse-neon shadow-lg"
                      data-testid="button-listen-music"
                      title={isGlobalAudioEnabled ? "Выключить музыку из спектакля" : "Включить музыку из спектакля"}
                    >
                      {isGlobalAudioEnabled ? "Выкл. звук" : "Вкл. звук"}
                    </motion.button>
                  </div>
                )}
              </motion.div>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-sm text-primary font-medium tracking-wide uppercase mb-2">
                  {categoryNames[project.category]} • {project.year}
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-title">
                  {project.title}
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {project.fullDescription}
                </p>
              </motion.div>

              {/* Case Study for Idiot */}
              {project.id === "idiot-saratov-drama" && (
                <div className="mt-8">
                  <h3 className="text-2xl font-russo font-bold text-white mb-6">Детальный кейс</h3>
                  
                  <div className="glass-effect rounded-xl p-6 space-y-6">
                    <div>
                      <h4 className="text-xl font-semibold text-primary mb-4">Творческая команда</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                        <div><span className="text-primary font-medium">Режиссёр:</span> Иван Комаров</div>
                        <div><span className="text-primary font-medium">Художник:</span> Ольга Кузнецова</div>
                        <div><span className="text-primary font-medium">Художник по свету:</span> Максим Бирюков</div>
                        <div><span className="text-primary font-medium">Композитор, саунд-дизайнер:</span> Ян Кузьмичёв</div>
                      </div>
                    </div>

                    <div className="space-y-6 text-gray-300 leading-relaxed">
                      <p>
                        Постановка по роману Достоевского, радикально переосмысленная Иваном Комаровым. 
                        Всё действие перенесено в 1999 год — и не абстрактно, а конкретно в Саратов, 
                        со всеми его реалиями.
                      </p>
                      
                      <div className="my-6">
                        <img 
                          src="/images/idiot2_1756479054514.webp" 
                          alt="Многослойное пространство спектакля" 
                          className="w-full rounded-lg shadow-lg"
                        />
                      </div>

                      <p>
                        На сцене — живая и подвижная конструкция: три комнаты, заборы, многослойное 
                        пространство. Особенность спектакля — сочетание театра и «живого кино»: два 
                        оператора снимают происходящее, а зритель видит параллельно спектакль и его 
                        экранную версию в духе 90-х.
                      </p>

                      <div className="my-6">
                        <img 
                          src="/images/idiot5_1756479169274.webp" 
                          alt="Общий план сцены с экраном" 
                          className="w-full rounded-lg shadow-lg"
                        />
                      </div>
                      <p>
                        От меня ждали не просто звука, а киношного звука — чтобы зритель поверил 
                        в происходящее на экране, как в хорошем сериале 90-х. Я вдохновлялся эстетикой 
                        Twin Peaks, Секретных материалов и культовыми тв-проектами 90-х.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div>
                          <img 
                            src="/images/idiot1_1756479054514.webp" 
                            alt="Сцена из спектакля Идиот" 
                            className="w-full rounded-lg shadow-lg"
                          />
                        </div>
                        <div>
                          <img 
                            src="/images/idiot3_1756479054514.webp" 
                            alt="Атмосферная сцена в кровати" 
                            className="w-full rounded-lg shadow-lg"
                          />
                        </div>
                      </div>

                      <p>
                        Работа началась с первых репетиций: режиссёр присылал мне видео и черновые 
                        сценарии. Первой композицией стала тема Настасьи Филипповны в жанре нуар-джаза — 
                        именно от неё развернулась вся музыкальная драматургия.
                      </p>
                      <p>
                        Затем я приехал в Саратов на две недели и в сжатые сроки создал основную партитуру. 
                        Параллельно я записывал звуки города: старые красные трамваи, шаги, двери, шум толпы. 
                        Эти полевые записи стали основой звукового мира спектакля.
                      </p>
                      <p>
                        Важно было добиться реализма: если зритель видит на экране трамвай, он должен его 
                        узнать. Поэтому я записывал всё сам — от скрипа дверей до объявлений остановок 
                        и сигнала трамвая.
                      </p>

                      <div className="my-6">
                        <img 
                          src="/images/idiot4_1756479054514.webp" 
                          alt="Световое решение спектакля" 
                          className="w-full rounded-lg shadow-lg"
                        />
                      </div>

                      <p className="bg-primary/10 border border-primary/30 p-4 rounded-lg">
                        <strong className="text-primary">Ключевая находка:</strong> использование нейросетей для 
                        клонирования голоса актёра Александра Островного. Его герой, князь Мышкин, по сюжету 
                        говорит на немецком. Актёр языка не знал, и я придумал решение: записал голос, 
                        обработал через ИИ, и в спектакле прозвучал чистый немецкий язык голосом актёра.
                      </p>
                      <p>
                        Музыкальный пласт включал 10 оригинальных композиций в жанрах нуар-джаз и пост-рок, 
                        вдохновлённых композиторами золотой эпохи телевидения и эстетикой Дэвида Линча.
                        Дополняли их мировые хиты 90-х, которые в спектакле звучали как бытовая музыка — 
                        из магнитофонов, телевизоров, автомобильных радиоприёмников.
                      </p>

                      
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