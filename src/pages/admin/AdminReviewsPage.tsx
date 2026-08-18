import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Review } from '@/types';
import { AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState } from '@/components/admin/AdminUi';
import { Modal } from '@/components/admin/Modal';
import { AdminInput, AdminTextarea, AdminCheckbox } from '@/components/admin/AdminFields';
import { Rating } from '@/components/ui/Rating';

type FormData = Omit<Review, 'id' | 'created_at'>;

const emptyForm: FormData = {
  client_name: '', company: '',
  position_uk: '', position_ru: '', position_en: '',
  text_uk: '', text_ru: '', text_en: '',
  rating: 5, avatar_url: '', is_visible: true, sort_order: 0,
};

export function AdminReviewsPage() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    supabase.from('reviews').select('*').order('sort_order', { ascending: true })
      .then(({ data }) => { setReviews((data as Review[]) ?? []); setLoading(false); });
  };

  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (r: Review) => { setEditing(r); setForm({ ...r }); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    if (editing) {
      await supabase.from('reviews').update(form).eq('id', editing.id);
    } else {
      await supabase.from('reviews').insert(form);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.reviews.confirmDelete)) return;
    await supabase.from('reviews').delete().eq('id', id);
    load();
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader title={t.admin.reviews.title} />
      <div className="mb-6">
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:from-cyan-400 hover:to-blue-500 transition-all">
          <Plus size={18} /> {t.admin.reviews.add}
        </button>
      </div>

      {reviews.length === 0 ? (
        <AdminEmptyState message={t.reviews.noReviews} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <AdminCard key={r.id} className="!p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {r.avatar_url ? (
                    <img src={r.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-semibold text-sm">
                      {r.client_name?.charAt(0) ?? '?'}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-white">{r.client_name}</div>
                    <div className="text-xs text-gray-500">{r.company}</div>
                  </div>
                </div>
                <Rating value={r.rating} size={14} />
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{r.text_en ?? r.text_uk}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${r.is_visible ? 'text-green-400' : 'text-gray-600'}`}>
                  {r.is_visible ? '✓ visible' : '✗ hidden'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(r)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                    <Pencil size={14} /> {t.admin.reviews.edit}
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="inline-flex items-center justify-center rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t.admin.reviews.edit : t.admin.reviews.add}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-3">
            <AdminInput label={t.admin.reviews.fields.clientName} value={form.client_name ?? ''} onChange={e => setForm({...form, client_name: e.target.value})} />
            <AdminInput label={t.admin.reviews.fields.company} value={form.company ?? ''} onChange={e => setForm({...form, company: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <AdminInput label={t.admin.reviews.fields.positionUk} value={form.position_uk ?? ''} onChange={e => setForm({...form, position_uk: e.target.value})} />
            <AdminInput label={t.admin.reviews.fields.positionRu} value={form.position_ru ?? ''} onChange={e => setForm({...form, position_ru: e.target.value})} />
            <AdminInput label={t.admin.reviews.fields.positionEn} value={form.position_en ?? ''} onChange={e => setForm({...form, position_en: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <AdminTextarea label={t.admin.reviews.fields.textUk} rows={3} value={form.text_uk ?? ''} onChange={e => setForm({...form, text_uk: e.target.value})} />
            <AdminTextarea label={t.admin.reviews.fields.textRu} rows={3} value={form.text_ru ?? ''} onChange={e => setForm({...form, text_ru: e.target.value})} />
            <AdminTextarea label={t.admin.reviews.fields.textEn} rows={3} value={form.text_en ?? ''} onChange={e => setForm({...form, text_en: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <AdminInput label={t.admin.reviews.fields.rating} type="number" min={1} max={5} value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} />
            <AdminInput label={t.admin.reviews.fields.sortOrder} type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: Number(e.target.value)})} />
            <AdminInput label={t.admin.reviews.fields.avatarUrl} value={form.avatar_url ?? ''} onChange={e => setForm({...form, avatar_url: e.target.value})} />
          </div>
          <AdminCheckbox label={t.admin.reviews.fields.isVisible} checked={form.is_visible} onChange={v => setForm({...form, is_visible: v})} />
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-medium text-white hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all">
              {saving ? <Loader2 size={16} className="animate-spin" /> : t.admin.reviews.save}
            </button>
            <button onClick={() => setModalOpen(false)} className="rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-400 hover:text-white transition-all">
              {t.admin.reviews.cancel}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
