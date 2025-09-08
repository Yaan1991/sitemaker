import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useAudio } from "@/contexts/AudioContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { fadeOutCurrentAudio, setCurrentPage, currentPage } = useAudio();

  // Автоматически скроллим к верху и управляем аудио при изменении страницы
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Если это смена страницы (не первая загрузка)
    if (currentPage !== location) {
      // Плавно затухаем текущее аудио перед сменой страницы
      fadeOutCurrentAudio().then(() => {
        setCurrentPage(location);
      });
    } else {
      setCurrentPage(location);
    }
  }, [location, currentPage, fadeOutCurrentAudio, setCurrentPage]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pt-16"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
