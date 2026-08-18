import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Star,
  Wrench,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function AdminLayout() {
  const { t } = useLanguage();
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: '/admin/dashboard', label: t.admin.nav.dashboard, icon: LayoutDashboard, roles: ['OWNER', 'MANAGER', 'IT_EMPLOYEE'] as const },
    { href: '/admin/portfolio', label: t.admin.nav.portfolio, icon: FolderKanban, roles: ['OWNER', 'MANAGER'] as const },
    { href: '/admin/reviews', label: t.admin.nav.reviews, icon: Star, roles: ['OWNER', 'MANAGER'] as const },
    { href: '/admin/services', label: t.admin.nav.services, icon: Wrench, roles: ['OWNER', 'MANAGER'] as const },
    { href: '/admin/faq', label: t.admin.nav.faq, icon: HelpCircle, roles: ['OWNER', 'MANAGER'] as const },
    { href: '/admin/clients', label: t.admin.nav.clients, icon: Users, roles: ['OWNER', 'MANAGER'] as const },
    { href: '/admin/settings', label: t.admin.nav.settings, icon: Settings, roles: ['OWNER'] as const },
  ];

  const visibleItems = navItems.filter((item) =>
    profile && item.roles.includes(profile.role)
  );

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-[#070a0f] text-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0a0e14] fixed h-full">
        <div className="p-6 border-b border-white/5">
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold text-white">ALEXORA</span>
            <span className="text-[10px] font-medium tracking-[0.3em] text-cyan-400">
              STUDIO ADMIN
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                isActive(item.href)
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ExternalLink size={18} />
            {t.admin.nav.backToSite}
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
          >
            <LogOut size={18} />
            {t.admin.nav.logout}
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0e14] border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <div className="flex flex-col leading-none">
          <span className="text-base font-bold text-white">ALEXORA</span>
          <span className="text-[9px] font-medium tracking-[0.3em] text-cyan-400">
            STUDIO ADMIN
          </span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white p-2">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-30 bg-[#0a0e14]/95 backdrop-blur-xl" onClick={() => setSidebarOpen(false)}>
          <nav className="p-4 space-y-1" onClick={(e) => e.stopPropagation()}>
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  isActive(item.href)
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
            >
              <LogOut size={18} />
              {t.admin.nav.logout}
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
