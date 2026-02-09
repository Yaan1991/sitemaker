import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteBreadcrumbs from "@/components/SiteBreadcrumbs";
import portraitImage from "@assets/me3_1757711551642.webp";
import backgroundImage from "@assets/aboutmebg_1757711551642.webp";

export default function About() {
  return (
    <>
      <SEOHead
        title="Обо мне — Ян Кузьмичёв"
        description="Ян Кузьмичёв — композитор, саунд-дизайнер и звукорежиссёр, который создаёт звук, становящийся частью истории. Более 100 проектов. МХТ, Театр Наций, Современник, Van Cleef & Arpels, Porsche."
        url="https://iansound.pro/about"
      />

      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <section className="relative z-10 py-20 px-6 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <div className="absolute inset-0 bg-black/40 rounded-xl -z-10" />
          <SiteBreadcrumbs pageType="about" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={portraitImage}
              alt="Ян Кузьмичёв"
              className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
            />

            <div className="max-w-3xl mx-auto relative z-10 bg-black/50 rounded-xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2 text-white">О себе</h1>
                <p className="text-lg text-cyan-400">Композитор | Саунд-дизайнер | Звукорежиссёр</p>
              </div>

              <a
                href="https://disk.yandex.ru/d/zxDOVZvLJUCGdw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full md:w-auto md:mx-auto px-6 py-3 mb-10 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 hover:text-cyan-300 transition-all duration-300"
                data-testid="link-download-photos"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">Скачать фото для прессы</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  Ян Кузьмичёв — композитор, саунд-дизайнер и звукорежиссёр, который создаёт звук, становящийся частью истории.
                </p>
                <p>
                  Выпускник ГИТИСа с красным дипломом (2015). За 13 лет профессиональной карьеры — более 100 реализованных проектов, от камерных спектаклей до масштабных мультимедийных шоу.
                </p>
                <p>
                  Мои клиенты — ведущие театры России и зарубежья: МХТ им. Чехова, Центр им. Вс. Мейерхольда, Театр Наций, Современник, Театр Пушкина, РАМТ, Национальный театр Будапешта, а также драматические театры Саратова, Нижнего Новгорода, Красноярска, Омска, Твери, Казани, Махачкалы, Алматы и других городов.
                </p>
                <p>
                  Корпоративные проекты для Van Cleef & Arpels, Porsche, Panasonic, выставочные пространства ВДНХ и Центра Зотов.
                </p>
                <p>
                  Я создаю оригинальную музыку и иммерсивные звуковые ландшафты, которые усиливают драматургию и погружают зрителя в атмосферу спектакля. Работаю на стыке традиций и инноваций: от живых оркестров до AI-композиции, от аналоговых синтезаторов до полной автоматизации звука через OSC/MIDI протоколы.
                </p>
                <p>
                  Первопроходец театральной автоматизации в России — разрабатываю и внедряю системы полностью автоматизированного управления звуком для спектаклей, синхронизированные с светом, видео и сценическими механизмами.
                </p>
                <p className="text-white font-medium">
                  Если вашему проекту нужен звук, который работает как полноценный драматургический инструмент — давайте обсудим сотрудничество.
                </p>
              </div>

              <div className="mt-10 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold glass-effect text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                  data-testid="button-back-home"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Вернуться на главную
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
