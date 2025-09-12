import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteBreadcrumbs from "@/components/SiteBreadcrumbs";
import portraitImage from "@assets/me3_1757711551642.webp";
import backgroundImage from "@assets/aboutmebg_1757711551642.webp";

export default function About() {
  // Layout.tsx уже управляет сменой аудио при переходах между страницами

  return (
    <>
      <SEOHead
        title="Обо мне — Ян Кузьмичёв"
        description="Меня зовут Ян Кузьмичёв, я композитор, саунд-дизайнер и звукорежиссёр. С 2011 года я создаю звук для театра, кино, аудиоспектаклей и бренд-проектов."
        url="https://yankuzmichev.ru/about"
      />

      {/* Background Image */}
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
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 rounded-xl -z-10" />
          {/* Breadcrumbs */}
          <SiteBreadcrumbs pageType="about" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Portrait Image */}
            <img
              src={portraitImage}
              alt="Ян Кузьмичёв"
              className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
            />

            {/* Main Content */}
            <div className="max-w-3xl mx-auto relative z-10 bg-black/50 rounded-xl p-8">
              <h1 className="text-4xl font-bold mb-8 text-center text-white">Обо мне</h1>
              
              <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
                <p>
                  Меня зовут Ян Кузьмичёв, я композитор, саунд-дизайнер и звукорежиссёр. С 2011 года я создаю звук для театра, кино, аудиоспектаклей и бренд-проектов. Для меня работа со звуком - это не просто ремесло, а способ оживить историю и погрузить зрителя в нужную атмосферу.
                </p>
                <p>
                  Мой путь начался ещё в школьные годы с увлечения звукозаписью. В 2015-м я окончил ГИТИС с красным дипломом по специальности «Звукорежиссура массовых и театрализованных представлений». С тех пор реализовал более ста проектов: от спектаклей в МХТ им. Чехова, Театре Наций и Современнике до иммерсивных постановок, кино и аудиоспектаклей. Международные работы проходили в Венгрии, Казахстане и Узбекистане.
                </p>
                <p>
                  Я пишу музыку и разрабатываю звуковые концепции в самых разных жанрах - от нуар-джаза и неоклассики до эмбиента и пост-рока. Среди знаковых проектов: «Идиот», «Петровы в гриппе и вокруг него», «Маяковский. Я сам», «Танцы на праздник урожая», «Иранская конференция». Помимо театра и кино, я сотрудничал с брендами Van Cleef & Arpels, Porsche, Panasonic и создавал звук для выставок и иммерсивных форматов.
                </p>
                <p>
                  В работе я соединяю творчество и технологии: разрабатываю автоматизацию в QLab, использую протоколы OSC/MIDI, внедряю нейросети и ИИ-инструменты для генерации и обработки звука. Это позволяет вести проект на всех этапах - от написания музыки и саунд-дизайна до финальной интеграции.
                </p>
                <p>
                  Каждый раз я ищу собственную звуковую драматургию - ту атмосферу, в которой история становится переживанием, а звук помогает зрителю и слушателю прожить её.
                </p>
              </div>

              <div className="mt-8 text-center">
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
