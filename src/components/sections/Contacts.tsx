import { Mail, Send, Phone, MapPin, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { ContactForm } from '@/components/sections/ContactForm';

export function Contacts() {
  const { t } = useLanguage();

  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: 'studioalexora@gmail.com',
      href: 'mailto:studioalexora@gmail.com',
    },
    {
      icon: Send,
      label: 'Telegram',
      value: '@studioalexora',
      href: 'https://t.me/studioalexora',
    },
    {
      icon: Phone,
      label: t.form.phone,
      value: '+380 (77) 116 76 00',
      href: 'tel:+380771167600',
    },
    {
      icon: MapPin,
      label: t.contact.city,
      value: 'Київ, Україна',
      href: null,
    },
  ];

  return (
    <Section id="contact" className="bg-[#0a0e14]">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: info */}
        <div>
          <SectionHeader title={t.contact.title} subtitle={t.contact.subtitle} center={false} />

          <Reveal delay={200}>
            <div className="space-y-4 mt-8">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 shrink-0">
                    <item.icon className="text-cyan-400" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">{item.label}</div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm text-white hover:text-cyan-400 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-sm text-white">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 shrink-0">
                  <User className="text-cyan-400" size={20} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">{t.contact.owner}</div>
                  <span className="text-sm text-white">Коновалов М.О.</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right: form */}
        <Reveal delay={300}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
