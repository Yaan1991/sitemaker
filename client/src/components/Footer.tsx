import { useLocation } from "wouter";

export default function Footer() {
  const [location] = useLocation();
  const isPetrovyProject = location === "/project/petrovy-saratov-drama";
  const isHomoHominiProject = location === "/project/homo-homini-short";
  const isMaProject = location === "/project/ma-short-film";
  
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
        <h3 className="text-xl font-bold mb-2">Ян Кузьмичёв</h3>
        <p className="text-muted-foreground">Композитор • Саунд‑дизайнер • Звукорежиссёр</p>
        <p className="text-muted-foreground text-sm mt-6">
          © 2025 Ян Кузьмичёв. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
