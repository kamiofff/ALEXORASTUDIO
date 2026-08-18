import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/types';

const languages: { code: Language; label: string }[] = [
  { code: 'uk', label: 'UA' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`flex items-center gap-1 ${compact ? '' : 'rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md'}`}>
      {languages.map((l, i) => (
        <div key={l.code} className="flex items-center">
          <button
            onClick={() => setLang(l.code)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
              lang === l.code
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            aria-label={`Switch to ${l.label}`}
          >
            {l.label}
          </button>
          {i < languages.length - 1 && !compact && (
            <span className="text-gray-600 text-xs mx-0.5">|</span>
          )}
        </div>
      ))}
    </div>
  );
}
