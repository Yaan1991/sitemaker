import { useState } from "react";
import { motion } from "framer-motion";
import { useRoute } from "wouter";
import SEOHead from "@/components/SEOHead";
import AutoSlider from "@/components/AutoSlider";
import ProjectCard from "@/components/ProjectCard";
import { projects, getProjectsByCategory, projectCategories } from "@/data/projects";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "theatre", label: "Театр" },
  { id: "film", label: "Кино" },
  { id: "audio", label: "Аудиоспектакли" },
];

export default function Projects() {
  const [, params] = useRoute("/projects/:category?");
  const [activeCategory, setActiveCategory] = useState(params?.category || "theatre");

  const categoryProjects = getProjectsByCategory(activeCategory);
  const categoryData = projectCategories[activeCategory as keyof typeof projectCategories];

  const slides = categoryProjects.map((project) => (
    <ProjectCard key={project.id} {...project} />
  ));

  return (
    <>
      <SEOHead
        title={`${categoryData?.title || "Проекты"} — Ян Кузьмичёв`}
        description={`${categoryData?.description || "Проекты композитора, саунд-дизайнера и звукорежиссёра Яна Кузьмичёва"}`}
        url={`https://yankuzmichev.ru/projects/${activeCategory}`}
      />

      <section className="py-20 px-6 min-h-screen">
        <div className="container mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Проекты
          </motion.h1>

          {/* Project Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="glass-effect rounded-xl p-2 border border-border">
              <div className="flex space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={cn(
                      "px-6 py-3 rounded-lg font-semibold transition-all duration-300",
                      activeCategory === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setActiveCategory(tab.id)}
                    data-testid={`tab-${tab.id}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Projects Slider */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {slides.length > 0 ? (
              <AutoSlider slides={slides} />
            ) : (
              <div className="text-center text-muted-foreground py-20">
                <p>Проекты в этой категории скоро появятся</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
