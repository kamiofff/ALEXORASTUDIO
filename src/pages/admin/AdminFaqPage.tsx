import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Faq } from '@/types';
import { AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState } from '@/components/admin/AdminUi';
import { Modal } from '@/components/admin/Modal';
import { AdminInput, AdminTextarea, AdminCheckbox } from '@/components/admin/AdminFields';

type FormData = Omit<Faq, 'id' | 'created_at'>;

const emptyForm: FormData = {
  question_uk: '', question_ru: '', question_en: '',
  answer_uk: '', answer_ru: '', answer_en: '',
  sort_order: 0, is_visible: true,
};

export function AdminFaqPage() {
  const { t } = useLanguage();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    supabase.from('faqs').select('*').order('sort_order', { ascending: true })
      .then(({ data }) => { setFaqs((data as Faq[]) ?? []); setLoading(false); });
  };

  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (f: Faq) => { setEditing(f); setForm({ ...f }); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    if (editing) {
      await supabase.from('faqs').update(form).eq('id', editing.id);
    } else {
      await supabase.from('faqs').insert(form);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.faq.confirmDelete)) return;
    await supabase.from('faqs').delete().eq('id', id);
    load();
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader title={t.admin.faq.title} />
      <div className="mb-6">
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:from-cyan-400 hover:to-blue-500 transition-all">
          <Plus size={18} /> {t.admin.faq.add}
        </button>
      </div>

      {faqs.length === 0 ? (
        <AdminEmptyState message={t.admin.common.noData} />
      ) : (
        <div className="space-y-3">
          {faqs.map((f) => (
            <AdminCard key={f.id} className="!p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white">{f.question_en ?? f.question_uk}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{f.answer_en ?? f.answer_uk}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs ${f.is_visible ? 'text-green-400' : 'text-gray-600'}`}>
                    {f.is_visible ? '✓' : '✗'}
                  </span>
                  <button onClick={() => openEdit(f)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                    <Pencil size={14} /> {t.admin.faq.edit}
                  </button>
                  <button onClick={() => handleDelete(f.id)} className="inline-flex items-center justify-center rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t.admin.faq.edit : t.admin.faq.add}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-3 gap-3">
            <AdminInput label={t.admin.faq.fields.questionUk} value={form.question_uk ?? ''} onChange={e => setForm({...form, question_uk: e.target.value})} />
            <AdminInput label={t.admin.faq.fields.questionRu} value={form.question_ru ?? ''} onChange={e => setForm({...form, question_ru: e.target.value})} />
            <AdminInput label={t.admin.faq.fields.questionEn} value={form.question_en ?? ''} onChange={e => setForm({...form, question_en: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <AdminTextarea label={t.admin.faq.fields.answerUk} rows={3} value={form.answer_uk ?? ''} onChange={e => setForm({...form, answer_uk: e.target.value})} />
            <AdminTextarea label={t.admin.faq.fields.answerRu} rows={3} value={form.answer_ru ?? ''} onChange={e => setForm({...form, answer_ru: e.target.value})} />
            <AdminTextarea label={t.admin.faq.fields.answerEn} rows={3} value={form.answer_en ?? ''} onChange={e => setForm({...form, answer_en: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4 items-end">
            <AdminInput label={t.admin.faq.fields.sortOrder} type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: Number(e.target.value)})} />
            <AdminCheckbox label={t.admin.faq.fields.isVisible} checked={form.is_visible} onChange={v => setForm({...form, is_visible: v})} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-medium text-white hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all">
              {saving ? <Loader2 size={16} className="animate-spin" /> : t.admin.faq.save}
            </button>
            <button onClick={() => setModalOpen(false)} className="rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-400 hover:text-white transition-all">
              {t.admin.faq.cancel}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
