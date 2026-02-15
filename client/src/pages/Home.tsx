import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import Hero from "@/components/Hero";
import SEOHead from "@/components/SEOHead";
import ProjectSection from "@/components/CollapsibleProjectSection";
import SectionNavigation from "@/components/SectionNavigation";
import { useLanguage } from "@/i18n/useLanguage";

export default function Home() {
  const [location] = useLocation();
  const { lang, t, prefix } = useLanguage();
  const isEn = lang === 'en';

  const projectCategories = [
    {
      title: t.homeTheatreTitle,
      projects: [
        {
          id: "idiot-saratov-drama",
          title: isEn ? "The Idiot" : "Идиот",
          year: "2024",
          description: isEn ? "A production based on Dostoevsky set in Saratov 1999, combining live theatre with cinematography." : "Постановка по Достоевскому в Саратове 1999 года, объединяющая живое театральное действие с киносъёмкой.",
          image: "/images/idiot_main.webp",
          director: isEn ? "Ivan Komarov" : "Иван Комаров",
          role: isEn ? "Composer, Sound Designer: Ian Kuzmichev" : "Композитор, саунд-дизайнер: Ян Кузьмичёв",
          theater: isEn ? "Slonov Drama Theatre" : "Театр драмы им. Слонова",
          city: isEn ? "Saratov" : "г. Саратов"
        },
        {
          id: "mayakovsky-moscow-estrada", 
          title: isEn ? "Mayakovsky. Myself" : "Маяковский. Я сам",
          year: "2024",
          description: isEn ? "A performance exploring the poet's self-destruction through the tragic triangle of Mayakovsky, Lilya and Osip Brik." : "Спектакль-исследование внутреннего механизма саморазрушения поэта через трагический треугольник Маяковский - Лили и Осип Брик.",
          image: "/images/mayakovsky_main.webp",
          director: isEn ? "Semyon Shomin" : "Семён Шомин",
          role: isEn ? "Composer, Sound Designer: Ian Kuzmichev" : "Композитор, саунд-дизайнер: Ян Кузьмичёв",
          theater: isEn ? "Artlife LLC" : "ООО \"Артлайф\"",
          city: isEn ? "Moscow" : "г. Москва"
        },
        {
          id: "petrovy-saratov-drama",
          title: isEn ? "The Petrovs In and Around the Flu" : "Петровы в гриппе и вокруг него", 
          year: "2025",
          description: isEn ? "Theatre as a comic book, where space simultaneously tells the story of the Petrovs and reflects on theatre as a space of delirium." : "Театр как комикс, где пространство одновременно рассказывает историю Петровых и размышляет о театре как о пространстве бреда.",
          image: "/images/petrovy_main.webp",
          director: isEn ? "Ivan Komarov" : "Иван Комаров",
          role: isEn ? "Composer, Sound Designer: Ian Kuzmichev" : "Композитор, саунд-дизайнер: Ян Кузьмичёв",
          theater: isEn ? "Slonov Drama Theatre" : "Театр драмы им. Слонова", 
          city: isEn ? "Saratov" : "г. Саратов"
        }
      ]
    },
    {
      title: t.homeFilmTitle,
      projects: [
        {
          id: "homo-homini-short",
          title: "Homo Homini",
          year: "2025", 
          description: isEn ? "13 compositions + full post-production." : "13 композиций + полный пост.",
          image: "/images/homohomini_main.webp",
          director: isEn ? "Ivan Komarov" : "Иван Комаров",
          role: isEn ? "Composer, Sound Designer: Ian Kuzmichev" : "Композитор, саунд-дизайнер: Ян Кузьмичёв"
        },
        {
          id: "ma-short-film",
          title: isEn ? "Ma" : "Ма",
          year: "2023",
          description: isEn ? "Mixing, foley, ambiences." : "Сведение, шумы, амбиенты.",
          image: "/images/ma_film_main.webp",
          director: isEn ? "Valentina Besolova" : "Валентина Бесолова",
          role: isEn ? "Sound Engineer: Ian Kuzmichev" : "Звукорежиссёр: Ян Кузьмичёв"
        }
      ]
    },
    {
      title: t.homeAudioTitle,
      projects: [
        {
          id: "son-o-hlebe-zotov",
          title: isEn ? "Dream of Bread" : "Сон о Хлебе",
          year: "2024",
          description: isEn ? "Original music, spatial sound." : "Оригинальная музыка, пространственный звук.",
          image: "/images/son_o_hlebe_main.webp",
          director: isEn ? "Timur Sharafutdinov" : "Тимур Шарафутдинов",
          role: isEn ? "Composer, Sound Designer: Ian Kuzmichev" : "Композитор, саунд-дизайнер: Ян Кузьмичёв",
          theater: isEn ? "Zotov Centre" : "Центр Зотова",
          city: isEn ? "Moscow" : "г. Москва"
        },
        {
          id: "pogruzhenie-promenad-telegram",
          title: isEn ? "Immersion. Promenade" : "Погружение. Променад",
          year: "2021",
          description: isEn ? "Site-specific audio performance" : "Сайт-специфик аудиоспектакль",
          image: "/images/pogruzhenie_main.webp",
          director: isEn ? "Ivan Komarov" : "Иван Комаров",
          role: isEn ? "Composer, Sound Designer: Ian Kuzmichev" : "Композитор, саунд-дизайнер: Ян Кузьмичёв",
          theater: isEn ? "Centre for Theatre Mastery" : "Центр театрального мастерства",
          city: isEn ? "Nizhny Novgorod" : "г. Нижний Новгород"
        }
      ]
    }
  ];

  // Hash-based scroll handler with bounded retries and cleanup
  useEffect(() => {
    const hash = (location.split('#')[1] || '').trim();
    if (!hash) return;
    
    let attempts = 0;
    let timeoutId: number | undefined;
    
    const tryScroll = () => {
      const el = document.getElementById(hash);
      if (el) { 
        el.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
        return; 
      }
      if (attempts++ < 20) {
        timeoutId = window.setTimeout(tryScroll, 50);
      }
    };
    
    timeoutId = window.setTimeout(tryScroll, 0);
    return () => { 
      if (timeoutId) clearTimeout(timeoutId); 
    };
  }, [location]);

  return (
    <>
      <SEOHead />
      <div className="min-h-screen">
        <Hero />
        
        {/* Section Navigation */}
        <SectionNavigation />
        
        {/* Main Projects Section */}
        <ProjectSection categories={projectCategories} />
        
        {/* About Section */}
        <section className="py-32 px-6 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              <div className="mx-4">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            </div>
          </div>
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-4xl font-russo font-bold text-white mb-8">
                {t.siteSubtitle}
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">{t.homeAboutText1}</p>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">{t.homeAboutText2}</p>
              
              <div className="text-center">
                <Link
                  href={`${prefix}/contact`}
                  className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white transition-all duration-300 animate-pulse-neon"
                  data-testid="button-contact-home"
                >
                  {t.homeContactButton}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
