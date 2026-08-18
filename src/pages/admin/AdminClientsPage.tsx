import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Customer } from '@/types';
import { AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState } from '@/components/admin/AdminUi';

export function AdminClientsPage() {
  const { t } = useLanguage();
  const [clients, setClients] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    supabase.from('customers').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setClients((data as Customer[]) ?? []); setLoading(false); });
  }, []);

  if (loading) return <AdminLoading />;

  const filters = [
    { key: 'all', label: t.admin.clients.filterAll },
    { key: 'new', label: t.admin.clients.filterNew },
    { key: 'in_progress', label: t.admin.clients.filterInProgress },
    { key: 'active', label: t.admin.clients.filterActive },
  ];

  const filtered = filter === 'all' ? clients : clients.filter(c => c.status === filter);

  const statusColor = (status: string) => {
    if (status === 'new') return 'bg-cyan-500/10 text-cyan-400';
    if (status === 'in_progress') return 'bg-amber-500/10 text-amber-400';
    if (status === 'active') return 'bg-green-500/10 text-green-400';
    return 'bg-gray-500/10 text-gray-400';
  };

  return (
    <div>
      <AdminPageHeader title={t.admin.clients.title} subtitle={t.admin.clients.subtitle} />

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.key
                ? 'bg-cyan-500 text-white'
                : 'border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState message={t.admin.clients.noClients} />
      ) : (
        <AdminCard className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs text-gray-500">
                  <th className="px-4 py-3 font-medium">{t.admin.clients.name}</th>
                  <th className="px-4 py-3 font-medium">{t.admin.clients.company}</th>
                  <th className="px-4 py-3 font-medium">{t.admin.clients.email}</th>
                  <th className="px-4 py-3 font-medium">{t.admin.clients.phone}</th>
                  <th className="px-4 py-3 font-medium">{t.admin.clients.source}</th>
                  <th className="px-4 py-3 font-medium">{t.admin.clients.status}</th>
                  <th className="px-4 py-3 font-medium">{t.admin.clients.createdAt}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-sm text-white">
                      {c.first_name} {c.last_name ?? ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{c.company ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{c.email ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{c.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {c.source === 'ALEXORA STUDIO website' ? (
                        <span className="text-xs text-cyan-400">Website</span>
                      ) : c.source ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}
    </div>
  );
}
