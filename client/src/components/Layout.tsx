import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { AudioMixer } from "./AudioMixer";
import { FloatingControlsGroup } from "./FloatingControlsGroup";
import { useAudio } from "@/contexts/AudioContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { changeRoute } = useAudio();
  const previousLocationRef = useRef<string>(location);

  useEffect(() => {
    if (previousLocationRef.current !== location) {
      window.scrollTo(0, 0);
      changeRoute(location);
      previousLocationRef.current = location;
    }
  }, [location, changeRoute]);

  // Юридические страницы (privacy для магазинов приложений и т.п.) и лендинги
  // приложений Kuzmichev Tools (/tools/*) — со своим оформлением, без сайтового хедера/футера.
  const isStandalone =
    location.startsWith("/legal/") ||
    location.startsWith("/en/legal/") ||
    location === "/tools" ||
    location === "/en/tools" ||
    location.startsWith("/tools/") ||
    location.startsWith("/en/tools/");
  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-16 pb-32"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {/* Sticky контейнер для floating кнопок - всегда над футером */}
      <div className="sticky bottom-6 pb-6 pointer-events-none" style={{zIndex: 200}}>
        <div className="pointer-events-auto">
          <FloatingControlsGroup />
        </div>
      </div>
      
      <Footer />
      {/* Профессиональная аудиосистема через HowlerAudioEngine */}
      <AudioMixer />
    </div>
  );
}
