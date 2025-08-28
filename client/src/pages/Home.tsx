import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import CategoryPreview from "@/components/CategoryPreview";
import CategorySlider from "@/components/CategorySlider";
import SEOHead from "@/components/SEOHead";
import { projectCategories as originalCategories } from "@/data/projects";
import { projectCategories } from "@/data/home-projects";
import { Link } from "wouter";

export default function Home() {
  const originalCategoryEntries = Object.entries(originalCategories);

  return (
    <>
      <SEOHead />
      <div className="min-h-screen">
        <Hero />
        
        {/* Projects Section with Category Sliders */}
        <section id="projects" className="projects-section">
          <div className="container mx-auto px-6">
            <h2 className="section-title text-4xl font-bold text-center text-white mb-12">Проекты</h2>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mb-12">
              {Object.entries(projectCategories).map(([categoryKey, categoryData]) => (
                <CategorySlider
                  key={categoryKey}
                  category={categoryKey}
                  title={categoryData.title}
                  description={categoryData.description}
                  projects={categoryData.projects}
                />
              ))}
            </div>

            <div className="projects-cta text-center">
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
              {originalCategoryEntries.map(([category, data]) => (
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
