import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Service } from '@/types';
import { AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState } from '@/components/admin/AdminUi';
import { Modal } from '@/components/admin/Modal';
import { AdminInput, AdminTextarea, AdminCheckbox } from '@/components/admin/AdminFields';

type FormData = Omit<Service, 'id' | 'created_at'>;

const emptyForm: FormData = {
  title_uk: '', title_ru: '', title_en: '',
  description_uk: '', description_ru: '', description_en: '',
  icon: 'Code2', sort_order: 0, is_active: true,
};

export function AdminServicesPage() {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    supabase.from('services').select('*').order('sort_order', { ascending: true })
      .then(({ data }) => { setServices((data as Service[]) ?? []); setLoading(false); });
  };

  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm({ ...s }); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    if (editing) {
      await supabase.from('services').update(form).eq('id', editing.id);
    } else {
      await supabase.from('services').insert(form);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.services.confirmDelete)) return;
    await supabase.from('services').delete().eq('id', id);
    load();
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader title={t.admin.services.title} />
      <div className="mb-6">
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:from-cyan-400 hover:to-blue-500 transition-all">
          <Plus size={18} /> {t.admin.services.add}
        </button>
      </div>

      {services.length === 0 ? (
        <AdminEmptyState message={t.admin.common.noData} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <AdminCard key={s.id} className="!p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white">{s.title_en ?? s.title_uk}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{s.description_en ?? s.description_uk}</p>
                </div>
                <span className={`text-xs shrink-0 ${s.is_active ? 'text-green-400' : 'text-gray-600'}`}>
                  {s.is_active ? '✓' : '✗'}
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-3">Icon: {s.icon}</div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(s)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                  <Pencil size={14} /> {t.admin.services.edit}
                </button>
                <button onClick={() => handleDelete(s.id)} className="inline-flex items-center justify-center rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t.admin.services.edit : t.admin.services.add}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-3 gap-3">
            <AdminInput label={t.admin.services.fields.titleUk} value={form.title_uk ?? ''} onChange={e => setForm({...form, title_uk: e.target.value})} />
            <AdminInput label={t.admin.services.fields.titleRu} value={form.title_ru ?? ''} onChange={e => setForm({...form, title_ru: e.target.value})} />
            <AdminInput label={t.admin.services.fields.titleEn} value={form.title_en ?? ''} onChange={e => setForm({...form, title_en: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <AdminTextarea label={t.admin.services.fields.descriptionUk} rows={3} value={form.description_uk ?? ''} onChange={e => setForm({...form, description_uk: e.target.value})} />
            <AdminTextarea label={t.admin.services.fields.descriptionRu} rows={3} value={form.description_ru ?? ''} onChange={e => setForm({...form, description_ru: e.target.value})} />
            <AdminTextarea label={t.admin.services.fields.descriptionEn} rows={3} value={form.description_en ?? ''} onChange={e => setForm({...form, description_en: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AdminInput label={t.admin.services.fields.icon} value={form.icon ?? ''} onChange={e => setForm({...form, icon: e.target.value})} placeholder="Globe, Code2, ShoppingCart..." />
            <AdminInput label={t.admin.services.fields.sortOrder} type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: Number(e.target.value)})} />
          </div>
          <AdminCheckbox label={t.admin.services.fields.isActive} checked={form.is_active} onChange={v => setForm({...form, is_active: v})} />
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-medium text-white hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all">
              {saving ? <Loader2 size={16} className="animate-spin" /> : t.admin.services.save}
            </button>
            <button onClick={() => setModalOpen(false)} className="rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-400 hover:text-white transition-all">
              {t.admin.services.cancel}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
