import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import SEOHead from "@/components/SEOHead";

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
              <h2 className="text-4xl font-bold text-white mb-8">
                Композитор • Саунд‑дизайнер • Звукорежиссёр
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">Я соединяю музыку, звук и технологии, чтобы создавать проекты, которые работают безупречно — от идеи до последнего сигнала в QLab</p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Специализируюсь на создании многослойных партитур, которые не просто сопровождают 
                действие, но становятся неотъемлемой частью художественного высказывания. 
                Работаю с широким спектром жанров — от нуар-джаза до экспериментальных эмбиентов.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
