import { motion } from "framer-motion";

const navigationItems = [
  { label: "Театр", href: "#theatre" },
  { label: "Кино", href: "#cinema" },
  { label: "Аудио", href: "#audioplays" }
];

export default function SectionNavigation() {
  const handleClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 100; // отступ от верха
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="pt-32 pb-32 px-6 relative"
    >
      <div className="container mx-auto max-w-4xl">
        <nav className="flex items-center justify-center">
          <div className="flex items-center gap-8 md:gap-12">
            {navigationItems.map((item, index) => (
              <div key={item.href} className="flex items-center">
                <button
                  onClick={() => handleClick(item.href)}
                  className="text-lg md:text-xl text-yellow-400 hover:text-yellow-300 transition-colors duration-300 font-medium tracking-wide uppercase"
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </button>
                {index < navigationItems.length - 1 && (
                  <span className="ml-8 md:ml-12 text-gray-600">•</span>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Нижний разделитель */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
        <div className="flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          <div className="mx-4">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        </div>
      </div>
    </motion.section>
  );
}