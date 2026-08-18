import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Send, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { href: '/#home', label: t.nav.home },
    { href: '/#services', label: t.nav.services },
    { href: '/#portfolio', label: t.nav.portfolio },
    { href: '/#reviews', label: t.nav.reviews },
    { href: '/#support', label: t.nav.support },
    { href: '/#contacts', label: t.nav.contacts },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="border-t border-white/5 bg-[#070a0f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex flex-col leading-none mb-4">
              <span className="text-xl font-bold text-white">ALEXORA</span>
              <span className="text-xs font-medium tracking-[0.3em] text-cyan-400">
                STUDIO
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">{t.footer.tagline}</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              {t.footer.navigation}
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              {t.footer.contacts}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:studioalexora@gmail.com"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Mail size={16} className="shrink-0" />
                  studioalexora@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/studioalexora"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Send size={16} className="shrink-0" />
                  @studioalexora
                </a>
              </li>
              <li>
                <a
                  href="tel:+380771167600"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Phone size={16} className="shrink-0" />
                  +380 (77) 116 76 00
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              {t.footer.info}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <span className="font-medium text-gray-300">Коновалов М.О.</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={16} className="shrink-0" />
                Київ, Україна
              </li>
              <li className="pt-2">
                <LanguageSwitcher />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ALEXORA STUDIO. {t.footer.rights}.
          </p>
          <Link
            to="/admin"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
