import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { MotionConfig } from "framer-motion";
import { AudioProvider } from "./contexts/AudioContext";
import { useLanguage } from "./i18n/useLanguage";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectPage from "./pages/ProjectPage";
import Contact from "./pages/Contact";
import PrivacyKuzmichevTuner from "./pages/PrivacyKuzmichevTuner";
import CueSheets from "./pages/CueSheets";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/projects" component={Projects} />
        <Route path="/projects/:category" component={Projects} />
        <Route path="/project/:id" component={ProjectPage} />
        <Route path="/contact" component={Contact} />
        <Route path="/en" component={Home} />
        <Route path="/en/about" component={About} />
        <Route path="/en/projects" component={Projects} />
        <Route path="/en/projects/:category" component={Projects} />
        <Route path="/en/project/:id" component={ProjectPage} />
        <Route path="/en/contact" component={Contact} />
        <Route path="/legal/kuzmichev-tuner-privacy" component={PrivacyKuzmichevTuner} />
        <Route path="/en/legal/kuzmichev-tuner-privacy" component={PrivacyKuzmichevTuner} />
        <Route path="/tools/cue-sheets" component={CueSheets} />
        <Route path="/en/tools/cue-sheets" component={CueSheets} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function DynamicHelmet() {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  return (
    <Helmet>
      <html lang={lang} className="scroll-smooth dark" />
      <title>{isEn ? 'Ian Kuzmichev — Composer, Sound Designer, Sound Engineer' : 'Ян Кузьмичёв — композитор, саунд‑дизайнер, звукорежиссёр'}</title>
      <meta name="description" content={isEn ? '15+ years of experience, 100+ projects in theatre, film and audio.' : '15+ лет опыта, 100+ проектов в театре, кино и аудио. Музыка и звук для пространства.'} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="theme-color" content="#00ffff" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Russo+One&family=Oswald:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": isEn ? "Ian Kuzmichev" : "Ян Кузьмичёв",
          "jobTitle": isEn ? ["Composer", "Sound Designer", "Sound Engineer"] : ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
          "url": "https://iansound.pro",
          "email": "kuzmichevyan@gmail.com",
          "telephone": "+7 (919) 764-37-45",
          "sameAs": [
            "https://t.me/iankzmcv",
            "https://band.link/zDZyK"
          ],
          "knowsAbout": isEn
            ? ["Composition", "Sound Design", "Sound Engineering", "Theatre", "Film", "Audio Performances"]
            : ["Композиция", "Саунд-дизайн", "Звукорежиссура", "Театр", "Кино", "Аудиоспектакли"],
          "yearsOfExperience": "14"
        })}
      </script>
    </Helmet>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MotionConfig reducedMotion="user">
          <AudioProvider>
            <TooltipProvider>
              <DynamicHelmet />
              <Router />
              <Toaster />
            </TooltipProvider>
          </AudioProvider>
        </MotionConfig>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
