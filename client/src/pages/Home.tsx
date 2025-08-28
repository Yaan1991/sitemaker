import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import SEOHead from "@/components/SEOHead";
import MainProjectSlider from "@/components/MainProjectSlider";

export default function Home() {
  return (
    <>
      <SEOHead />
      <div className="min-h-screen">
        <Hero />
        
        {/* Simple About Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-4xl font-cinzel font-bold text-white mb-8">
                Композитор • Саунд‑дизайнер • Звукорежиссёр
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">Я соединяю музыку, звук и технологии, чтобы создавать проекты, которые работают безупречно — от идеи до воплощения и автоматизации.</p>
              <p className="text-lg text-gray-400 leading-relaxed">Работаю в широком спектре жанров — от нуар-джаза и нео-классики до экспериментальных эмбиентов и пост-рока.Помимо театральных и кинопроектов, создаю джинглы и саунд-дизайн для брендов, разрабатываю аудиопрограммы и автоматизацию в QLab, совмещая творчество и технологии.Активно использую нейросети и ИИ-инструменты для генерации, анализа и обработки звука, расширяя границы традиционного саунд-дизайна.</p>
            </motion.div>
          </div>
        </section>
        
        {/* Main Projects Section */}
        <MainProjectSlider />
      </div>
    </>
  );
}
