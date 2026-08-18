import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { supabase } from '@/lib/supabase';
import type { Faq, Language } from '@/types';

export function Faq() {
  const { t, lang } = useLanguage();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from('faqs')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setFaqs((data as Faq[]) ?? []);
        setLoading(false);
      });
  }, []);

  const qKey = `question_${lang}` as const;
  const aKey = `answer_${lang}` as const;

  if (loading) {
    return (
      <Section id="faq">
        <SectionHeader title={t.faq.title} subtitle={t.faq.subtitle} />
        <div className="max-w-3xl mx-auto space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section id="faq" className="bg-[#0a0e14]">
      <SectionHeader title={t.faq.title} subtitle={t.faq.subtitle} />

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => (
          <Reveal key={faq.id} delay={i * 50}>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden transition-colors hover:border-white/15">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-sm md:text-base font-medium text-white">
                  {faq[qKey] ?? faq.question_en}
                </span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-cyan-400 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">
                    {faq[aKey] ?? faq.answer_en}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
