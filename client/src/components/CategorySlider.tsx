import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { HomeProject } from "@/data/home-projects";

interface CategorySliderProps {
  category: string;
  title: string;
  description: string;
  projects: HomeProject[];
}

export default function CategorySlider({ category, title, description, projects }: CategorySliderProps) {
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Swiper for this specific category
    if (typeof window !== 'undefined' && (window as any).Swiper) {
      const swiper = new (window as any).Swiper(`.category-swiper-${category}`, {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: projects.length > 2,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: `.category-pagination-${category}`,
          clickable: true,
        },
        navigation: {
          nextEl: `.category-next-${category}`,
          prevEl: `.category-prev-${category}`,
        },
        breakpoints: {
          640: {
            slidesPerView: Math.min(2, projects.length),
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: Math.min(3, projects.length),
            spaceBetween: 20,
          },
        },
      });

      swiperRef.current = swiper;

      return () => {
        if (swiper) {
          swiper.destroy();
        }
      };
    }
  }, [category, projects.length]);

  return (
    <div className="category-card bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>

      <div className={`swiper category-swiper-${category} overflow-hidden`}>
        <div className="swiper-wrapper">
          {projects.map((project) => (
            <div key={project.slug} className="swiper-slide">
              <div className="project-slide relative overflow-hidden rounded-lg shadow-lg group">
                <img
                  src={project.thumb}
                  alt={project.alt}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-40 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h4 className="text-sm font-semibold mb-1 line-clamp-1">{project.title}</h4>
                    <p className="text-xs text-gray-200 mb-3 line-clamp-2">{project.subtitle}</p>
                    <div className="flex gap-2">
                      <Link
                        href={project.url}
                        className="px-3 py-1 bg-white text-black rounded text-xs font-medium hover:bg-gray-200 transition-colors"
                      >
                        Подробнее
                      </Link>
                      {project.press && (
                        <a
                          href={project.press}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 border border-white text-white rounded text-xs font-medium hover:bg-white hover:text-black transition-colors"
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

        {projects.length > 1 && (
          <>
            <div className={`swiper-pagination category-pagination-${category} mt-4`}></div>
            <div className={`swiper-button-prev category-prev-${category}`} aria-label={`Предыдущие проекты - ${title}`}></div>
            <div className={`swiper-button-next category-next-${category}`} aria-label={`Следующие проекты - ${title}`}></div>
          </>
        )}
      </div>
    </div>
  );
}