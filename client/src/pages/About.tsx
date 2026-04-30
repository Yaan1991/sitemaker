import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteBreadcrumbs from "@/components/SiteBreadcrumbs";
import portraitImage from "@assets/me3_1757711551642.webp";
import backgroundImage from "@assets/aboutmebg_1757711551642.webp";
import { useLanguage } from "@/i18n/useLanguage";

export default function About() {
  const { t, prefix } = useLanguage();

  return (
    <>
      <SEOHead
        title={`${t.aboutTitle} — ${t.siteName}`}
        description={t.aboutBio1}
        url={`https://iansound.pro${prefix}/about`}
      />

      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <section className="relative z-10 py-20 px-6 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <div className="absolute inset-0 bg-black/40 rounded-xl -z-10" />
          <SiteBreadcrumbs pageType="about" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={portraitImage}
              alt={t.siteName}
              className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
              loading="lazy"
              decoding="async"
            />

            <div className="max-w-3xl mx-auto relative z-10 bg-black/50 rounded-xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2 text-white">{t.aboutTitle}</h1>
                <p className="text-lg text-cyan-400">{t.aboutSubtitle}</p>
              </div>

              <a
                href="https://disk.yandex.ru/d/zxDOVZvLJUCGdw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full md:w-auto md:mx-auto px-6 py-3 mb-10 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-400 hover:text-cyan-300 transition-all duration-300"
                data-testid="link-download-photos"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">{t.aboutDownloadPhotos}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>{t.aboutBio1}</p>
                <p>{t.aboutBio2}</p>
                <p>{t.aboutBio3}</p>
                <p>{t.aboutBio4}</p>
                <p>{t.aboutBio5}</p>
                <p>{t.aboutBio6}</p>
                <p className="text-white font-medium">{t.aboutBio7}</p>
              </div>

              <div className="mt-10 text-center">
                <Link
                  href={`${prefix}/`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold glass-effect text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                  data-testid="button-back-home"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.aboutBackHome}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
