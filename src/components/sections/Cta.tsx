import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

export function Cta() {
  const { t } = useLanguage();

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Section className="bg-[#070a0f]">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-cyan-500/10 p-8 md:p-16 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t.cta.title}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            {t.cta.subtitle}
          </p>
          <Button size="lg" onClick={scrollToContact}>
            {t.cta.button}
            <ArrowRight size={18} />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
