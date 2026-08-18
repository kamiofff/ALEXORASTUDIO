import { useEffect, useState } from 'react';
import { Users, FolderKanban, Star, Wrench, Globe, UserPlus, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState } from '@/components/admin/AdminUi';
import type { Customer } from '@/types';

interface Stats {
  totalLeads: number;
  newLeads: number;
  inProgressLeads: number;
  activeClients: number;
  totalProjects: number;
  featuredProjects: number;
  totalReviews: number;
  totalServices: number;
  websiteLeads: number;
}

export function AdminDashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [leads, projects, reviews, services, websiteLeads, recent] = await Promise.all([
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('customers').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('customers').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('customers').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('portfolio_projects').select('*', { count: 'exact', head: true }),
        supabase.from('portfolio_projects').select('*', { count: 'exact', head: true }).eq('featured', true),
      ]);

      const [
        reviewsCount,
        servicesCount,
        websiteCount,
        recentData,
      ] = await Promise.all([
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('customers').select('*', { count: 'exact', head: true }).eq('source', 'ALEXORA STUDIO website'),
        supabase.from('customers').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        totalLeads: leads.count ?? 0,
        newLeads: projects.count ?? 0,
        inProgressLeads: reviews.count ?? 0,
        activeClients: services.count ?? 0,
        totalProjects: projects.count ?? 0,
        featuredProjects: reviews.count ?? 0,
        totalReviews: reviewsCount.count ?? 0,
        totalServices: servicesCount.count ?? 0,
        websiteLeads: websiteCount.count ?? 0,
      });
      setRecentLeads((recentData.data as Customer[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <AdminLoading />;

  const cards = [
    { label: t.admin.dashboard.totalLeads, value: stats?.totalLeads ?? 0, icon: Users, color: 'cyan' },
    { label: t.admin.dashboard.newLeads, value: stats?.newLeads ?? 0, icon: UserPlus, color: 'blue' },
    { label: t.admin.dashboard.inProgressLeads, value: stats?.inProgressLeads ?? 0, icon: Clock, color: 'amber' },
    { label: t.admin.dashboard.activeClients, value: stats?.activeClients ?? 0, icon: TrendingUp, color: 'green' },
    { label: t.admin.dashboard.totalProjects, value: stats?.totalProjects ?? 0, icon: FolderKanban, color: 'purple' },
    { label: t.admin.dashboard.totalReviews, value: stats?.totalReviews ?? 0, icon: Star, color: 'amber' },
    { label: t.admin.dashboard.totalServices, value: stats?.totalServices ?? 0, icon: Wrench, color: 'cyan' },
    { label: t.admin.dashboard.websiteLeads, value: stats?.websiteLeads ?? 0, icon: Globe, color: 'blue' },
  ];

  const colorMap: Record<string, string> = {
    cyan: 'from-cyan-500/10 to-cyan-500/5 text-cyan-400 border-cyan-400/20',
    blue: 'from-blue-500/10 to-blue-500/5 text-blue-400 border-blue-400/20',
    amber: 'from-amber-500/10 to-amber-500/5 text-amber-400 border-amber-400/20',
    green: 'from-green-500/10 to-green-500/5 text-green-400 border-green-400/20',
    purple: 'from-purple-500/10 to-purple-500/5 text-purple-400 border-purple-400/20',
  };

  return (
    <div>
      <AdminPageHeader title={t.admin.dashboard.title} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <AdminCard key={card.label} className="!p-5">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[card.color]} border mb-3`}>
              <card.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
          </AdminCard>
        ))}
      </div>

      <AdminCard>
        <h2 className="text-lg font-semibold text-white mb-4">
          {t.admin.dashboard.recentLeads}
        </h2>
        {recentLeads.length === 0 ? (
          <AdminEmptyState message={t.admin.dashboard.noLeads} />
        ) : (
          <div className="space-y-2">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {lead.first_name} {lead.last_name ?? ''}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {lead.email ?? '—'} · {lead.phone ?? '—'}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    lead.status === 'new'
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : lead.status === 'in_progress'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-green-500/10 text-green-400'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
