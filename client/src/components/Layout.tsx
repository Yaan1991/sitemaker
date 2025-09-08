import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { GlobalAudioPlayer } from "./GlobalAudioPlayer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  // Автоматически скроллим к верху при изменении страницы
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

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
      <GlobalAudioPlayer />
    </div>
  );
}
