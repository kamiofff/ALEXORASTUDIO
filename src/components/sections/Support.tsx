import { Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

export function Support() {
  const { t } = useLanguage();

  return (
    <Section id="support" className="bg-gradient-to-b from-[#070a0f] to-[#0a0e14]">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/5 via-blue-600/5 to-transparent p-8 md:p-16">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -z-10" />

          <div className="max-w-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 mb-6">
              <Send className="text-cyan-400" size={28} />
            </div>

            <SectionHeader title={t.support.title} subtitle={t.support.subtitle} />

            <p className="text-gray-400 mb-8 -mt-6">{t.support.description}</p>

            <a href="https://t.me/studioalexora" target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                <Send size={18} />
                {t.support.openSupport}
              </Button>
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
