import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AudioProvider } from "./contexts/AudioContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectPage from "./pages/ProjectPage";
import Works from "./pages/Works";
import Contact from "./pages/Contact";
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
        <Route path="/works" component={Works} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AudioProvider>
          <TooltipProvider>
            <Helmet>
              <html lang="ru" className="scroll-smooth dark" />
              <title>Ян Кузьмичёв — композитор, саунд‑дизайнер, звукорежиссёр</title>
              <meta name="description" content="14+ лет опыта, 100+ проектов в театре, кино и аудио. Музыка и звук для пространства." />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
              <link href="https://fonts.googleapis.com/css2?family=Russo+One&family=Oswald:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Person",
                  "name": "Ян Кузьмичёв",
                  "jobTitle": ["Композитор", "Саунд-дизайнер", "Звукорежиссёр"],
                  "url": "https://yankuzmichev.ru",
                  "email": "kuzmichevyan@gmail.com",
                  "telephone": "+7 (919) 764-37-45",
                  "sameAs": [
                    "https://t.me/iankzmcv",
                    "https://band.link/zDZyK"
                  ],
                  "knowsAbout": ["Композиция", "Саунд-дизайн", "Звукорежиссура", "Театр", "Кино", "Аудиоспектакли"],
                  "yearsOfExperience": "14"
                })}
              </script>
            </Helmet>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AudioProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
