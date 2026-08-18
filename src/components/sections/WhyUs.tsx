import { User, Cpu, Smartphone, MessageSquare, Workflow, LifeBuoy } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';

export function WhyUs() {
  const { t } = useLanguage();

  const features = [
    { icon: User, title: t.whyUs.individual, desc: t.whyUs.individualDesc },
    { icon: Cpu, title: t.whyUs.modernTech, desc: t.whyUs.modernTechDesc },
    { icon: Smartphone, title: t.whyUs.responsive, desc: t.whyUs.responsiveDesc },
    { icon: MessageSquare, title: t.whyUs.fastComm, desc: t.whyUs.fastCommDesc },
    { icon: Workflow, title: t.whyUs.automation, desc: t.whyUs.automationDesc },
    { icon: LifeBuoy, title: t.whyUs.support, desc: t.whyUs.supportDesc },
  ];

  return (
    <Section id="about" className="bg-gradient-to-b from-[#070a0f] to-[#0a0e14]">
      <SectionHeader title={t.whyUs.title} subtitle={t.whyUs.subtitle} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.05]">
              <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-400/10 transition-transform duration-300 group-hover:scale-105">
                <feature.icon className="text-cyan-400" size={26} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
