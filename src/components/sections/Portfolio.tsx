import { useEffect, useState, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { supabase } from '@/lib/supabase';
import type { PortfolioProject } from '@/types';

export function Portfolio() {
  const { t, lang } = useLanguage();

  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    supabase
      .from('portfolio_projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('Ошибка загрузки портфолио:', error);
          setProjects([]);
        } else {
          setProjects((data as PortfolioProject[]) ?? []);
        }

        setLoading(false);
      });
  }, []);

  const titleKey = `title_${lang}` as const;
  const descKey = `description_${lang}` as const;
  const catKey = `category_${lang}` as const;

  const categories = useMemo(() => {
    const set = new Set<string>();

    projects.forEach((project) => {
      const category =
        project[catKey] ?? project.category_en;

      if (category) {
        set.add(category);
      }
    });

    return Array.from(set);
  }, [projects, lang, catKey]);

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return projects;
    }

    return projects.filter((project) => {
      const category =
        project[catKey] ?? project.category_en;

      return category === filter;
    });
  }, [projects, filter, lang, catKey]);

  if (loading) {
    return (
      <Section id="portfolio">
        <SectionHeader
          title={t.portfolio.title}
          subtitle={t.portfolio.subtitle}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section
      id="portfolio"
      className="bg-[#0a0e14]"
    >
      <SectionHeader
        title={t.portfolio.title}
        subtitle={t.portfolio.subtitle}
      />

      {/* Filters */}
      {categories.length > 0 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-cyan-500 text-white'
                : 'border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            {t.portfolio.all}
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === category
                  ? 'bg-cyan-500 text-white'
                  : 'border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-2">
            {t.portfolio.noProjects}
          </p>

          <p className="text-xs text-gray-600">
            Demo projects will appear here.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <Reveal
              key={project.id}
              delay={i * 60}
            >
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-cyan-400/30 hover:-translate-y-1">

                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={
                        project[titleKey] ??
                        project.title_en ??
                        ''
                      }
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-transparent to-transparent" />

                  {/* DEMO badge */}
                  <span className="absolute top-3 left-3 rounded-full bg-cyan-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    DEMO
                  </span>

                  {project.featured && (
                    <span className="absolute top-3 right-3 rounded-full bg-cyan-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      ★
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">

                  <span className="text-xs font-medium text-cyan-400 mb-2 block">
                    {project[catKey] ??
                      project.category_en}
                  </span>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {project[titleKey] ??
                      project.title_en}
                  </h3>

                  <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
                    {project[descKey] ??
                      project.description_en}
                  </p>

                  {/* Technologies */}
                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies
                        .slice(0, 4)
                        .map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-xs text-gray-400"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* Demo label instead of external link */}
                  <div className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <span>
                      Demo project
                    </span>

                    <ArrowUpRight
                      size={14}
                      className="opacity-40"
                    />
                  </div>

                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}