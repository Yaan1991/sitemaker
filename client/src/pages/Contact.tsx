import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
const telegramIcon = "/icons/icon_telegram.png";
const emailIcon = "/icons/icon_email.png";
const phoneIcon = "/icons/icon_phone.png";
const bandlinkIcon = "/icons/icon_bandlink.png";

const contactFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Некорректный email адрес"),
  message: z.string().min(10, "Сообщение должно содержать минимум 10 символов"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual form submission with Formspree or EmailJS
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Сообщение отправлено!",
        description: "Спасибо за ваше сообщение. Я свяжусь с вами в ближайшее время.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Произошла ошибка при отправке сообщения. Попробуйте ещё раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contacts = [
    {
      icon: emailIcon,
      label: "Email",
      value: "kuzmichevyan@gmail.com",
      href: "mailto:kuzmichevyan@gmail.com",
    },
    {
      icon: phoneIcon,
      label: "Телефон",
      value: "+7 (919) 764-37-45",
      href: "tel:+79197643745",
    },
    {
      icon: telegramIcon,
      label: "Telegram",
      value: "@iankzmcv",
      href: "https://t.me/iankzmcv",
      external: true,
    },
    {
      icon: bandlinkIcon,
      label: "Музыка",
      value: "Слушать работы",
      href: "https://band.link/zDZyK",
      external: true,
    },
  ];

  return (
    <>
      <SEOHead
        title="Контакты — Ян Кузьмичёв"
        description="Свяжитесь с композитором, саунд-дизайнером и звукорежиссёром Яном Кузьмичёвом. Email, телефон, Telegram."
        url="https://yankuzmichev.ru/contact"
      />

      <section className="py-20 px-6 min-h-screen">
        <div className="container mx-auto max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Контакты
          </motion.h1>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="glass-effect rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-6">Связаться со мной</h2>

                <div className="space-y-4">
                  {contacts.map((contact, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img
                        src={contact.icon}
                        alt={contact.label}
                        className="w-6 h-6 invert"
                      />
                      <div>
                        <p className="text-muted-foreground text-sm">{contact.label}</p>
                        <a
                          href={contact.href}
                          target={contact.external ? "_blank" : undefined}
                          rel={contact.external ? "noopener noreferrer" : undefined}
                          className="text-foreground hover:text-primary transition-colors duration-300"
                          data-testid={`contact-${contact.label.toLowerCase()}`}
                        >
                          {contact.value}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-effect rounded-xl p-6 border border-border"
            >
              <h2 className="text-xl font-semibold mb-6">Написать сообщение</h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ваше имя"
                            {...field}
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Сообщение</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Расскажите о вашем проекте..."
                            rows={5}
                            {...field}
                            data-testid="textarea-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-white transition-all duration-300"
                    data-testid="button-submit-contact"
                  >
                    {isSubmitting ? (
                      "Отправляется..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Отправить сообщение
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
