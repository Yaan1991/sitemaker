import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import CategoryPreview from "@/components/CategoryPreview";
import SEOHead from "@/components/SEOHead";
import { projectCategories } from "@/data/projects";
import { homeProjects } from "@/data/home-projects";
import { Link } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const categories = Object.entries(projectCategories);

  useEffect(() => {
    // Initialize Swiper after component mounts
    if (typeof window !== 'undefined' && (window as any).Swiper) {
      const swiper = new (window as any).Swiper('.projects-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
        },
      });

      return () => {
        if (swiper) {
          swiper.destroy();
        }
      };
    }
  }, []);

  return (
    <>
      <SEOHead />
      <div className="min-h-screen">
        <Hero />
        
        {/* Projects Section */}
        <section id="projects" className="projects-section">
          <div className="container mx-auto px-6">
            <h2 className="section-title text-4xl font-bold text-center text-white mb-12">Проекты</h2>

            <div className="swiper projects-swiper">
              <div className="swiper-wrapper">
                {homeProjects.map((project) => (
                  <div key={project.slug} className="swiper-slide">
                    <div className="projects-card relative overflow-hidden rounded-2xl shadow-2xl group">
                      <img
                        src={project.thumb}
                        alt={project.alt}
                        className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-25 hover:bg-opacity-40 transition-all duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-bold mb-2 line-clamp-2">{project.title}</h3>
                          <p className="text-sm text-gray-200 mb-4 line-clamp-2">{project.subtitle}</p>
                          <div className="flex gap-2">
                            <Link
                              href={project.url}
                              className="btn btn-primary px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                            >
                              Подробнее
                            </Link>
                            {project.press && (
                              <a
                                href={project.press}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-black transition-colors duration-200 text-sm font-medium"
                              >
                                В СМИ
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="swiper-pagination"></div>
              <div className="swiper-button-prev" aria-label="Предыдущие проекты"></div>
              <div className="swiper-button-next" aria-label="Следующие проекты"></div>
            </div>

            <div className="projects-cta text-center mt-12">
              <Link href="/works" className="btn btn-outline inline-block px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 text-lg font-medium">
                Смотреть все проекты
              </Link>
            </div>
          </div>
        </section>
        
        {/* Category Preview Cards */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {categories.map(([category, data]) => (
                <CategoryPreview
                  key={category}
                  title={data.title}
                  description={data.description}
                  image={data.image}
                  category={category}
                />
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
