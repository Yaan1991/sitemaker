import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import about from "@assets/about.jpg";
const aboutImage = "/images/about.jpg";
const studio01Image = "/images/studio_01.jpg";
const studio02Image = "/images/studio_02.jpg";

export default function About() {
  return (
    <>
      <SEOHead
        title="Обо мне — Ян Кузьмичёв"
        description="14+ лет опыта в создании звуковых решений для театра, кино и аудиоспектаклей. Композитор, саунд-дизайнер, звукорежиссёр."
        url="https://yankuzmichev.ru/about"
      />
      <section className="py-20 px-6 min-h-screen">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h1 className="text-4xl font-russo font-bold mb-8">Обо мне</h1>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Меня зовут Ян Кузьмичёв. Я композитор, саунд-дизайнер и звукорежиссёр. Уже больше 
                  четырнадцати лет я работаю со звуком в театре, кино, аудиоспектаклях и бренд-проектах. 
                  Для меня звук — это не только ремесло, но и способ создавать атмосферу, в которой 
                  история оживает.
                </p>
                <p>
                  Мой путь начался с увлечения звукозаписью ещё в школьные годы, а профессию я получил 
                  в ГИТИСе, окончив его с красным дипломом по специальности «Звукорежиссура массовых 
                  и театрализованных представлений». С тех пор я успел реализовать более ста проектов: 
                  от спектаклей в МХТ им. Чехова, Театре Наций и «Современнике» до крупных постановок 
                  в Саратове, Омске, Новосибирске и Красноярске. Международные работы проходили 
                  в Венгрии, Казахстане и Узбекистане.
                </p>
                <p>
                  Я пишу музыку и создаю звуковые концепции для самых разных жанров — от нуар-джаза 
                  и нео-классики до эмбиента и пост-рока. В моём портфолио — спектакли «Идиот», 
                  «Петровы в гриппе и вокруг него», «Маяковский. Я сам», «Танцы на праздник урожая», 
                  «Иранская конференция». Помимо театра и кино, я работаю с брендами — Van Cleef & Arpels, 
                  Porsche, Panasonic — и участвую в создании иммерсивных проектов, выставок и аудиоспектаклей.
                </p>
                <p>
                  Для меня важно соединять творчество и технологии. Я разрабатываю аудиопрограммы 
                  и автоматизацию в QLab, использую OSC/MIDI-протоколы, активно применяю нейросети 
                  и ИИ-инструменты для генерации и обработки звука. Благодаря этому я могу закрыть 
                  весь цикл задач — от написания музыки и саунд-дизайна до интеграции звука в проект.
                </p>
                <p>
                  В каждом проекте я стараюсь найти собственную звуковую драматургию — ту самую атмосферу, 
                  которая помогает зрителю или слушателю не только услышать историю, но и прожить её.
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
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

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <img
                src={about}
                alt="Ян Кузьмичёв в студии за звуковым пультом"
                className="w-full rounded-xl shadow-2xl"
              />

              
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
