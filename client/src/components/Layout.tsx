import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import { AudioChoiceModal } from "./AudioChoiceModal";
import { GlobalAudioPlayer } from "./GlobalAudioPlayer";
import { useAudio } from "@/contexts/AudioContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { showWelcomeModal, handleWelcomeChoice } = useAudio();

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
      
      {/* Глобальный аудиоплеер */}
      <GlobalAudioPlayer />
      
      {/* Глобальное модальное окно приветствия */}
      <AudioChoiceModal
        isOpen={showWelcomeModal}
        onChoice={handleWelcomeChoice}
      />
    </div>
  );
}
