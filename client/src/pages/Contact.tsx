import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";
import { SiTelegram, SiBandcamp } from "react-icons/si";
import SEOHead from "@/components/SEOHead";
import SiteBreadcrumbs from "@/components/SiteBreadcrumbs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Contact() {
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);

  const contacts = [
    {
      icon: <Phone className="w-8 h-8" />,
      label: "Телефон",
      value: "+7 (919) 764-37-45",
      href: "tel:+79197643745",
      collapsibleDesktop: true,
    },
    {
      icon: <SiTelegram className="w-8 h-8" />,
      label: "Telegram",
      value: "Написать в Telegram",
      href: "https://t.me/iankzmcv",
      external: true,
    },
    {
      icon: <SiBandcamp className="w-8 h-8" />,
      label: "Bandlink",
      value: "Слушать работы",
      href: "https://band.link/zDZyK",
      external: true,
    },
  ];

  return (
    <>
      <SEOHead
        title="Контакты — Ян Кузьмичёв"
        description="Свяжитесь с композитором, саунд-дизайнером и звукорежиссёром Яном Кузьмичёвым. Телефон, Telegram, музыкальные работы."
        url="https://yankuzmichev.ru/contact"
      />

      <section className="py-20 px-6 min-h-screen">
        <div className="container mx-auto max-w-2xl">
          <SiteBreadcrumbs pageType="contact" />
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Контакты
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {contacts.map((contact, index) => (
              <div key={index}>
                {contact.collapsibleDesktop ? (
                  <>
                    {/* Desktop: Collapsible phone */}
                    <div className="hidden md:block">
                      <Collapsible
                        open={isPhoneOpen}
                        onOpenChange={setIsPhoneOpen}
                        className="glass-effect rounded-xl border border-border overflow-hidden"
                      >
                        <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors duration-300">
                          <div className="flex items-center gap-4">
                            <div className="text-primary">
                              {contact.icon}
                            </div>
                            <div className="text-left">
                              <p className="text-muted-foreground text-sm">{contact.label}</p>
                              <p className="text-foreground font-medium">Нажмите, чтобы показать</p>
                            </div>
                          </div>
                          <ChevronDown 
                            className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                              isPhoneOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-6 pb-6">
                          <a
                            href={contact.href}
                            className="text-primary hover:text-white transition-colors duration-300 text-lg font-medium"
                            data-testid={`contact-${contact.label.toLowerCase()}`}
                          >
                            {contact.value}
                          </a>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                    {/* Mobile: Direct link */}
                    <a
                      href={contact.href}
                      className="md:hidden glass-effect rounded-xl p-6 border border-border flex items-center gap-4 hover:bg-white/5 transition-all duration-300 group"
                      data-testid={`contact-${contact.label.toLowerCase()}-mobile`}
                    >
                      <div className="text-primary group-hover:text-white transition-colors duration-300">
                        {contact.icon}
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">{contact.label}</p>
                        <p className="text-foreground group-hover:text-primary transition-colors duration-300 font-medium">
                          {contact.value}
                        </p>
                      </div>
                    </a>
                  </>
                ) : (
                  <a
                    href={contact.href}
                    target={contact.external ? "_blank" : undefined}
                    rel={contact.external ? "noopener noreferrer" : undefined}
                    className="glass-effect rounded-xl p-6 border border-border flex items-center gap-4 hover:bg-white/5 transition-all duration-300 group"
                    data-testid={`contact-${contact.label.toLowerCase()}`}
                  >
                    <div className="text-primary group-hover:text-white transition-colors duration-300">
                      {contact.icon}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">{contact.label}</p>
                      <p className="text-foreground group-hover:text-primary transition-colors duration-300 font-medium">
                        {contact.value}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
