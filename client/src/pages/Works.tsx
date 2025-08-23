import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import { worksTimeline } from "@/data/works";

export default function Works() {
  return (
    <>
      <SEOHead
        title="Полный список работ — Ян Кузьмичёв"
        description="Хронологический список всех работ композитора, саунд-дизайнера и звукорежиссёра Яна Кузьмичёва за 14+ лет карьеры."
        url="https://yankuzmichev.ru/works"
      />

      <section className="py-20 px-6 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Полный список работ
          </motion.h1>

          <div className="space-y-8">
            {worksTimeline.map((yearData, yearIndex) => (
              <motion.div
                key={yearData.year}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: yearIndex * 0.1 }}
                className="glass-effect rounded-xl p-6 border border-border"
              >
                <h2 className="text-2xl font-bold text-primary mb-4">{yearData.year}</h2>
                <div className="space-y-3">
                  {yearData.works.map((work, workIndex) => (
                    <div
                      key={workIndex}
                      className="border-l-2 border-muted-foreground pl-4"
                    >
                      <h3 className="font-semibold text-foreground">{work.title}</h3>
                      <p className="text-muted-foreground">
                        {work.role}
                        {work.venue && ` • ${work.venue}`}
                      </p>
                      {work.description && (
                        <p className="text-sm text-muted-foreground mt-1">{work.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: worksTimeline.length * 0.1 }}
              className="text-center text-muted-foreground text-sm"
            >
              * Показаны основные проекты. Полный список включает 100+ работ в театре, кино и аудио
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
