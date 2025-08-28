import { motion } from "framer-motion";
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
              <h1 className="text-4xl font-bold mb-8">Обо мне</h1>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  14+ лет опыта в создании звуковых решений для театра, кино и аудиоспектаклей. 
                  За это время стал частью более чем 100 проектов — от камерных спектаклей до 
                  масштабных театральных постановок и кинофильмов.
                </p>
                <p>
                  Работаю на стыке музыки, саунд-дизайна и звукорежиссуры: от концепции и 
                  композиции до финального мастеринга. Использую передовые технологии — 
                  QLab, OSC/MIDI, пространственный звук, ИИ-инструменты — для создания 
                  уникальных звуковых миров.
                </p>
                <p>
                  Каждый проект — это возможность исследовать, как звук формирует пространство 
                  и влияет на восприятие зрителя. Технологии + искусство = новые возможности 
                  для творчества.
                </p>
              </div>
              <div className="mt-8">
                <a
                  href="https://band.link/zDZyK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-white transition-all duration-300"
                  data-testid="button-listen-works"
                >
                  Слушать работы
                </a>
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
