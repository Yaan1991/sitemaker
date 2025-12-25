import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteBreadcrumbs from "@/components/SiteBreadcrumbs";

export default function Presskit() {
  const competencies = [
    "Полный цикл производства: от разработки концепции и полевых записей до финальной реализации, программирования и автоматизации",
    "Технологические инновации: первопроходец в применении OSC/MIDI протоколов и полной автоматизации театральных шоу в России",
    "Пространственный звук: создание иммерсивных саундскейпов для театра и event-проектов",
    "Кино/гейм-эстетика: привнесение кинематографической и игровой звуковой эстетики в театральное пространство",
    "AI-интеграция: активное использование нейросетевых технологий в композиции и саунд-дизайне",
    "Жанровая универсальность: от рока и джаза до классического минимализма"
  ];

  const career = [
    {
      period: "2011–2016",
      place: "Школа современной пьесы (Театр на Трубной), Москва",
      role: "С 2013 — начальник звукового департамента"
    },
    {
      period: "2017–2021",
      place: "Центр им. Вс. Мейерхольда, Москва",
      role: "Штатный специалист, параллельно — приглашённый художник в театрах России и за рубежом"
    },
    {
      period: "2021–н.в.",
      place: "Свободный художник",
      role: "Реализация проектов для ведущих театров, культурных институций и коммерческих брендов"
    }
  ];

  const achievements = [
    "Красный диплом ГИТИС (2015)",
    "Многие спектакли отмечены премией «Золотая маска» и другими театральными наградами",
    "Регулярные высокие оценки звука и музыки от критиков и профессионального сообщества",
    "Более 100 реализованных проектов"
  ];

  return (
    <>
      <SEOHead
        title="Пресскит — Ян Кузьмичёв"
        description="Пресс-материалы о композиторе и саунд-дизайнере Яне Кузьмичёве. Биография, ключевые компетенции, карьера и фотографии для прессы."
        url="https://iansound.pro/presskit"
      />

      <section className="relative z-10 py-20 px-6 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <SiteBreadcrumbs pageType="presskit" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-black/50 rounded-xl p-8 backdrop-blur-sm">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  ЯН КУЗЬМИЧЁВ
                </h1>
                <p className="text-xl text-cyan-400">
                  Композитор | Саунд-дизайнер | Звукорежиссёр
                </p>
              </div>

              <a
                href="https://disk.yandex.ru/d/zxDOVZvLJUCGdw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full md:w-auto md:mx-auto px-8 py-4 mb-12 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 hover:text-cyan-300 transition-all duration-300"
                data-testid="link-download-photos"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">Скачать фото для прессы</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="space-y-12">
                <section>
                  <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-3">
                    О художнике
                  </h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      Ян Кузьмичёв — мультидисциплинарный специалист в области звука и музыки, работающий на стыке театра, кино и новых технологий. Родился 7 января 1991 года в Саратове. В 2015 году окончил ГИТИС с красным дипломом по специальности «Звукорежиссура живых и театрализованных представлений».
                    </p>
                    <p>
                      За свою карьеру реализовал более 100 проектов в качестве композитора, саунд-дизайнера и звукорежиссёра. Работал с ведущими театрами России (Центр им. Вс. Мейерхольда, МХТ им. Чехова, Театр Наций, Современник, Театр Пушкина, Театр Практика и др.) и крупнейшими брендами (Van Cleef & Arpels, Porsche, Panasonic и др.).
                    </p>
                    <p>
                      С 2021 года — свободный художник, работающий исключительно на проектной основе.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-3">
                    Ключевые компетенции
                  </h2>
                  <ul className="space-y-3">
                    {competencies.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <span className="text-cyan-400 mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-3">
                    Карьера
                  </h2>
                  <div className="space-y-6">
                    {career.map((item, index) => (
                      <div key={index} className="border-l-2 border-cyan-500/50 pl-4">
                        <div className="text-cyan-400 font-semibold mb-1">{item.period}</div>
                        <div className="text-white font-medium mb-1">{item.place}</div>
                        <div className="text-gray-400 text-sm">{item.role}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-3">
                    Достижения
                  </h2>
                  <ul className="space-y-3">
                    {achievements.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <span className="text-cyan-400 mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="pt-6 border-t border-gray-700">
                  <h2 className="text-2xl font-bold mb-6 text-white">
                    Контакт для прессы
                  </h2>
                  <div className="text-gray-300">
                    <p className="mb-2">
                      <span className="text-gray-500">Email:</span>{" "}
                      <a href="mailto:kuzmichevyan@gmail.com" className="text-cyan-400 hover:text-cyan-300" data-testid="link-press-email">
                        kuzmichevyan@gmail.com
                      </a>
                    </p>
                    <p>
                      <span className="text-gray-500">Telegram:</span>{" "}
                      <a href="https://t.me/iankzmcv" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300" data-testid="link-press-telegram">
                        @iankzmcv
                      </a>
                    </p>
                  </div>
                </section>
              </div>

              <div className="mt-12 text-center">
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
