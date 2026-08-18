import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#070a0f] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl md:text-9xl font-bold text-white/10">404</h1>
        <h2 className="text-2xl font-semibold text-white mt-4 mb-2">
          {t.errors.pageNotFound}
        </h2>
        <p className="text-gray-500 mb-8">{t.errors.pageNotFoundDesc}</p>
        <Link to="/">
          <Button>
            <Home size={18} />
            {t.errors.backHome}
          </Button>
        </Link>
      </div>
    </div>
  );
}
