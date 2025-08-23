import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import CategoryPreview from "@/components/CategoryPreview";
import SEOHead from "@/components/SEOHead";
import { projectCategories } from "@/data/projects";

export default function Home() {
  const categories = Object.entries(projectCategories);

  return (
    <>
      <SEOHead />
      <div className="min-h-screen">
        <Hero />
        
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
