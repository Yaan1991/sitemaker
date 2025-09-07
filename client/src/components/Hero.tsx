import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
const heroDesktop = "/images/hero.webp";
const heroMobile = "/images/hero_mobile.webp";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 768px)" srcSet={heroMobile} />
          <img
            src={heroDesktop}
            alt="Ян Кузьмичёв за звуковым пультом"
            className="w-full h-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-russo font-bold mb-6"
        >Ян Кузьмичёв</motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground mb-8 font-light"
        >Композитор; Саунд-дизайнер; Звукорежиссер</motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onClick={() => {
            const element = document.getElementById('main-projects');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white transition-all duration-300 animate-pulse-neon"
          data-testid="button-view-works"
        >
          Смотреть работы
        </motion.button>
      </div>
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
}
