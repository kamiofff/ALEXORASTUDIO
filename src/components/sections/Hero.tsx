import { ArrowRight, LayoutGrid, Code2, Sparkles, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

export function Hero() {
  const { t } = useLanguage();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { label: t.hero.stat1, icon: LayoutGrid },
    { label: t.hero.stat2, icon: TrendingUp },
    { label: t.hero.stat3, icon: Code2 },
    { label: t.hero.stat4, icon: Sparkles },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] opacity-30" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: text */}
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-sm text-cyan-300 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                </span>
                {t.hero.badge}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white">
                {t.hero.title}
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 text-lg text-gray-400 max-w-xl leading-relaxed">
                {t.hero.subtitle}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => scrollTo('contact')}>
                  {t.hero.discussCta}
                  <ArrowRight size={18} />
                </Button>
                <Button variant="outline" size="lg" onClick={() => scrollTo('portfolio')}>
                  {t.hero.portfolioCta}
                </Button>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-2">
                    <stat.icon className="text-cyan-400" size={20} />
                    <span className="text-sm text-gray-400">{stat.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: visual */}
          <Reveal delay={300} className="hidden lg:block">
            <div className="relative">
              {/* Main glass card */}
              <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="space-y-3 font-mono text-sm">
                  <div className="text-gray-500">// ALEXORA STUDIO</div>
                  <div><span className="text-purple-400">const</span> <span className="text-cyan-400">studio</span> <span className="text-gray-400">=</span> <span className="text-amber-400">{'{'}</span></div>
                  <div className="pl-4"><span className="text-green-400">services</span><span className="text-gray-400">:</span> <span className="text-amber-400">['Websites', 'CRM', 'Automation']</span><span className="text-gray-400">,</span></div>
                  <div className="pl-4"><span className="text-green-400">stack</span><span className="text-gray-400">:</span> <span className="text-amber-400">['React', 'TS', 'Supabase']</span><span className="text-gray-400">,</span></div>
                  <div className="pl-4"><span className="text-green-400">approach</span><span className="text-gray-400">:</span> <span className="text-amber-400">'custom'</span><span className="text-gray-400">,</span></div>
                  <div><span className="text-amber-400">{'}'}</span></div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-6 -right-6 rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md p-4 shadow-xl animate-[float_4s_ease-in-out_infinite]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-cyan-400" size={20} />
                  <div>
                    <div className="text-xs text-gray-400">Growth</div>
                    <div className="text-sm font-semibold text-white">+40%</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-md p-4 shadow-xl animate-[float_5s_ease-in-out_infinite_0.5s]">
                <div className="flex items-center gap-2">
                  <Code2 className="text-cyan-400" size={20} />
                  <div>
                    <div className="text-xs text-gray-400">Built with</div>
                    <div className="text-sm font-semibold text-white">React + TS</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  );
}
