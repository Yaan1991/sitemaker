import { Link, useLocation } from "wouter";
import { useLanguage } from "@/i18n/useLanguage";

export default function Footer() {
  const [location] = useLocation();
  const { t, lang, prefix } = useLanguage();
  const isPetrovyProject = location === "/project/petrovy-saratov-drama" || location === "/en/project/petrovy-saratov-drama";
  const isHomoHominiProject = location === "/project/homo-homini-short" || location === "/en/project/homo-homini-short";
  const isMaProject = location === "/project/ma-short-film" || location === "/en/project/ma-short-film";
  
  return (
    <footer 
      className="py-12 px-6 border-t border-border"
      style={isPetrovyProject ? {
        position: 'relative',
        zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(2px)'
      } : isHomoHominiProject ? {
        position: 'relative',
        zIndex: 15,
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(2px)'
      } : isMaProject ? {
        position: 'relative',
        zIndex: 15,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(2px)'
      } : {}}
    >
      <div className="container mx-auto text-center">
        <h3 className="text-xl font-bold mb-2">{t.siteName}</h3>
        <p className="text-muted-foreground">{t.footerSubtitle}</p>
        <p className="text-muted-foreground text-sm mt-6">
          {t.footerCopyright}
        </p>
        <p className="text-muted-foreground text-sm mt-3">
          <Link
            href={`${prefix}/tools/cue-sheets`}
            className="hover:text-foreground transition-colors"
            data-testid="link-cue-sheets"
          >
            {lang === "en" ? "Cue Sheets — app for QLab" : "Cue Sheets — приложение для QLab"}
          </Link>
        </p>
      </div>
    </footer>
  );
}
