import { useEffect, useState } from 'react';
import { Star, Send, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { supabase } from '@/lib/supabase';

interface Review {
  id: string;
  name: string;
  company: string | null;
  text_uk: string | null;
  text_ru: string | null;
  text_en: string | null;
  avatar_url: string | null;
  rating: number;
  is_visible: boolean;
  sort_order: number;
}

export function Reviews() {
  const { t, lang } = useLanguage();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    company: '',
    text: '',
    rating: 5,
  });

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setLoading(true);

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('REVIEWS LOAD ERROR:', error);
    }

    if (!error && data) {
      setReviews(data as Review[]);
    }

    setLoading(false);
  }

  function getReviewText(review: Review) {
    if (lang === 'uk') {
      return review.text_uk || review.text_ru || review.text_en || '';
    }

    if (lang === 'ru') {
      return review.text_ru || review.text_uk || review.text_en || '';
    }

    return review.text_en || review.text_uk || review.text_ru || '';
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  function openForm() {
    setShowForm(true);
    setSuccess(false);
    setError('');
  }

  function closeForm() {
    if (sending) return;

    setShowForm(false);
    setError('');
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();

    setError('');
    setSuccess(false);

    const name = form.name.trim();
    const company = form.company.trim();
    const text = form.text.trim();

    if (!name) {
      setError(
        lang === 'uk'
          ? 'Введіть ваше імʼя'
          : lang === 'ru'
            ? 'Введите ваше имя'
            : 'Enter your name'
      );
      return;
    }

    if (!text) {
      setError(
        lang === 'uk'
          ? 'Напишіть відгук'
          : lang === 'ru'
            ? 'Напишите отзыв'
            : 'Write your review'
      );
      return;
    }

    if (text.length < 10) {
      setError(
        lang === 'uk'
          ? 'Відгук має містити щонайменше 10 символів'
          : lang === 'ru'
            ? 'Отзыв должен содержать минимум 10 символов'
            : 'Review must contain at least 10 characters'
      );
      return;
    }

    setSending(true);

    const { error: insertError } = await supabase
      .from('reviews')
      .insert({
        name,
        company: company || null,
        text_uk: text,
        text_ru: text,
        text_en: text,
        avatar_url: null,
        rating: form.rating,
        is_visible: false,
        sort_order: 999,
      });

    setSending(false);

    if (insertError) {
      console.error('REVIEW INSERT ERROR:', insertError);

      setError(
        lang === 'uk'
          ? 'Не вдалося надіслати відгук. Спробуйте ще раз.'
          : lang === 'ru'
            ? 'Не удалось отправить отзыв. Попробуйте ещё раз.'
            : 'Failed to submit the review. Please try again.'
      );

      return;
    }

    setForm({
      name: '',
      company: '',
      text: '',
      rating: 5,
    });

    setSuccess(true);
  }

  return (
    <Section id="reviews" className="bg-[#070a0f]">
      <SectionHeader
        title={t.reviews.title}
        subtitle={t.reviews.subtitle}
      />

      {/* REVIEWS */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {lang === 'uk'
            ? 'Відгуків поки немає.'
            : lang === 'ru'
              ? 'Отзывов пока нет.'
              : 'No reviews yet.'}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <Reveal key={review.id} delay={index * 70}>
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-cyan-400/30 hover:-translate-y-1">
                
                {/* STARS */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={16}
                      className={
                        starIndex < Number(review.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      }
                    />
                  ))}
                </div>

                {/* TEXT */}
                <p className="text-gray-300 leading-relaxed mb-6">
                  “{getReviewText(review)}”
                </p>

                {/* AUTHOR */}
                <div className="flex items-center gap-3 mt-auto">
                  {review.avatar_url ? (
                    <img
                      src={review.avatar_url}
                      alt={review.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-sm font-semibold text-cyan-400">
                      {getInitials(review.name)}
                    </div>
                  )}

                  <div>
                    <div className="font-medium text-white">
                      {review.name}
                    </div>

                    {review.company && (
                      <div className="text-sm text-gray-500">
                        {review.company}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      {/* LEAVE REVIEW BUTTON */}
      <div className="flex justify-center mt-10">
        <button
          type="button"
          onClick={openForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-400 hover:-translate-y-0.5 hover:shadow-cyan-400/30"
        >
          <Star size={18} />

          {lang === 'uk'
            ? 'Залишити відгук'
            : lang === 'ru'
              ? 'Оставить отзыв'
              : 'Leave a review'}
        </button>
      </div>

      {/* REVIEW MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeForm}
          />

          {/* MODAL */}
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1018] p-6 shadow-2xl">
            
            {/* CLOSE */}
            <button
              type="button"
              onClick={closeForm}
              disabled={sending}
              className="absolute right-4 top-4 rounded-lg p-1 text-gray-500 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              <X size={22} />
            </button>

            <h3 className="pr-8 text-2xl font-semibold text-white mb-2">
              {lang === 'uk'
                ? 'Залишити відгук'
                : lang === 'ru'
                  ? 'Оставить отзыв'
                  : 'Leave a review'}
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              {lang === 'uk'
                ? 'Ваш відгук буде перевірений перед публікацією.'
                : lang === 'ru'
                  ? 'Ваш отзыв будет проверен перед публикацией.'
                  : 'Your review will be checked before publication.'}
            </p>

            <form onSubmit={submitReview} className="space-y-5">

              {/* NAME */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  {lang === 'uk'
                    ? 'Ваше імʼя'
                    : lang === 'ru'
                      ? 'Ваше имя'
                      : 'Your name'}
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder={
                    lang === 'uk'
                      ? 'Ваше імʼя'
                      : lang === 'ru'
                        ? 'Ваше имя'
                        : 'Your name'
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-cyan-400/50 focus:bg-white/[0.07]"
                />
              </div>

              {/* COMPANY */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  {lang === 'uk'
                    ? 'Компанія'
                    : lang === 'ru'
                      ? 'Компания'
                      : 'Company'}
                  <span className="ml-1 text-gray-600">
                    ({lang === 'uk' ? 'необовʼязково' : lang === 'ru' ? 'необязательно' : 'optional'})
                  </span>
                </label>

                <input
                  type="text"
                  value={form.company}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  placeholder="ALEXORA STUDIO"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-cyan-400/50 focus:bg-white/[0.07]"
                />
              </div>

              {/* RATING */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  {lang === 'uk'
                    ? 'Оцінка'
                    : lang === 'ru'
                      ? 'Оценка'
                      : 'Rating'}
                </label>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      type="button"
                      key={rating}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          rating,
                        }))
                      }
                      className="rounded-lg p-1 transition hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={
                          rating <= form.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* TEXT */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  {lang === 'uk'
                    ? 'Ваш відгук'
                    : lang === 'ru'
                      ? 'Ваш отзыв'
                      : 'Your review'}
                </label>

                <textarea
                  value={form.text}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }))
                  }
                  rows={5}
                  maxLength={1000}
                  placeholder={
                    lang === 'uk'
                      ? 'Розкажіть про досвід роботи з нами...'
                      : lang === 'ru'
                        ? 'Расскажите о вашем опыте работы с нами...'
                        : 'Tell us about your experience working with us...'
                  }
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-cyan-400/50 focus:bg-white/[0.07]"
                />

                <div className="mt-1 text-right text-xs text-gray-600">
                  {form.text.length}/1000
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  {lang === 'uk'
                    ? 'Дякуємо! Відгук надіслано на перевірку.'
                    : lang === 'ru'
                      ? 'Спасибо! Отзыв отправлен на проверку.'
                      : 'Thank you! Your review has been submitted for approval.'}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={sending}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={17} />

                {sending
                  ? lang === 'uk'
                    ? 'Надсилання...'
                    : lang === 'ru'
                      ? 'Отправка...'
                      : 'Sending...'
                  : lang === 'uk'
                    ? 'Надіслати відгук'
                    : lang === 'ru'
                      ? 'Отправить отзыв'
                      : 'Submit review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Section>
  );
}