import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Rating } from '@/components/ui/Rating';
import { supabase } from '@/lib/supabase';
import type { Review, Language } from '@/types';

export function Reviews() {
  const { t, lang } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('reviews')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setReviews((data as Review[]) ?? []);
        setLoading(false);
      });
  }, []);

  const positionKey = `position_${lang}` as const;
  const textKey = `text_${lang}` as const;

  if (loading) {
    return (
      <Section id="reviews">
        <SectionHeader title={t.reviews.title} subtitle={t.reviews.subtitle} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </Section>
    );
  }

  if (reviews.length === 0) {
    return (
      <Section id="reviews">
        <SectionHeader title={t.reviews.title} subtitle={t.reviews.subtitle} />
        <p className="text-center text-gray-500 py-12">{t.reviews.noReviews}</p>
      </Section>
    );
  }

  return (
    <Section id="reviews" className="bg-[#070a0f]">
      <SectionHeader title={t.reviews.title} subtitle={t.reviews.subtitle} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, i) => (
          <Reveal key={review.id} delay={i * 80}>
            <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.05]">
              <Quote className="text-cyan-400/30 mb-4" size={36} />

              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                "{review[textKey] ?? review.text_en}"
              </p>

              <div className="flex items-center gap-3">
                {review.avatar_url ? (
                  <img
                    src={review.avatar_url}
                    alt={review.client_name ?? ''}
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-white/10 flex items-center justify-center text-cyan-400 font-semibold">
                    {review.client_name?.charAt(0) ?? '?'}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {review.client_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {review[positionKey] ?? review.position_en}
                        {review.company ? ` · ${review.company}` : ''}
                      </div>
                    </div>
                    <Rating value={review.rating} />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
