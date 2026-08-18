import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { supabase } from '@/lib/supabase';
import type { Service, Language } from '@/types';

export function Services() {
  const { t, lang } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setServices((data as Service[]) ?? []);
        setLoading(false);
      });
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const titleKey = `title_${lang}` as const;
  const descKey = `description_${lang}` as const;

  const renderIcon = (iconName: string | null) => {
    if (!iconName) return <LucideIcons.Code2 className="text-cyan-400" size={28} />;
    const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[iconName];
    return Icon ? <Icon className="text-cyan-400" size={28} /> : <LucideIcons.Code2 className="text-cyan-400" size={28} />;
  };

  if (loading) {
    return (
      <Section id="services">
        <SectionHeader title={t.services.title} subtitle={t.services.subtitle} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section id="services" className="bg-[#070a0f]">
      <SectionHeader title={t.services.title} subtitle={t.services.subtitle} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service, i) => (
          <Reveal key={service.id} delay={i * 50}>
            <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/[0.06] hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/5 group-hover:to-blue-600/5 transition-all duration-500" />

              <div className="relative">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 transition-transform duration-300 group-hover:scale-110">
                  {renderIcon(service.icon)}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {service[titleKey] ?? service.title_en}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {service[descKey] ?? service.description_en}
                </p>

                <button
                  onClick={scrollToContact}
                  className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {t.services.orderCta}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
