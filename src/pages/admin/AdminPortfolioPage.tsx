import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PortfolioProject } from '@/types';
import { AdminPageHeader, AdminCard, AdminLoading, AdminEmptyState } from '@/components/admin/AdminUi';
import { Modal } from '@/components/admin/Modal';
import { AdminInput, AdminTextarea, AdminCheckbox } from '@/components/admin/AdminFields';

type FormData = Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at'>;

const emptyForm: FormData = {
  title_uk: '', title_ru: '', title_en: '',
  description_uk: '', description_ru: '', description_en: '',
  category_uk: '', category_ru: '', category_en: '',
  technologies: [], image_url: '', project_url: '',
  featured: false, sort_order: 0,
};

export function AdminPortfolioPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioProject | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState('');

  const load = () => {
    supabase.from('portfolio_projects').select('*').order('sort_order', { ascending: true })
      .then(({ data }) => { setProjects((data as PortfolioProject[]) ?? []); setLoading(false); });
  };

  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setTechInput(''); setModalOpen(true); };
  const openEdit = (p: PortfolioProject) => {
    setEditing(p);
    setForm({ ...p, technologies: p.technologies ?? [] });
    setTechInput((p.technologies ?? []).join(', '));
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, technologies: techInput.split(',').map(s => s.trim()).filter(Boolean) };
    if (editing) {
      await supabase.from('portfolio_projects').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('portfolio_projects').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.portfolio.confirmDelete)) return;
    await supabase.from('portfolio_projects').delete().eq('id', id);
    load();
  };

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader title={t.admin.portfolio.title} />
      <div className="mb-6">
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:from-cyan-400 hover:to-blue-500 transition-all">
          <Plus size={18} /> {t.admin.portfolio.add}
        </button>
      </div>

      {projects.length === 0 ? (
        <AdminEmptyState message={t.portfolio.noProjects} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <AdminCard key={p.id} className="!p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{p.title_en ?? p.title_uk}</h3>
                  <p className="text-xs text-gray-500">{p.category_en ?? p.category_uk}</p>
                </div>
                {p.featured && <span className="text-xs text-cyan-400 shrink-0">★</span>}
              </div>
              {p.image_url && (
                <img src={p.image_url} alt="" loading="lazy" className="w-full h-32 object-cover rounded-lg mb-3" />
              )}
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                  <Pencil size={14} /> {t.admin.portfolio.edit}
                </button>
                <button onClick={() => handleDelete(p.id)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t.admin.portfolio.edit : t.admin.portfolio.add}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-3 gap-3">
            <AdminInput label={t.admin.portfolio.fields.titleUk} value={form.title_uk ?? ''} onChange={e => setForm({...form, title_uk: e.target.value})} />
            <AdminInput label={t.admin.portfolio.fields.titleRu} value={form.title_ru ?? ''} onChange={e => setForm({...form, title_ru: e.target.value})} />
            <AdminInput label={t.admin.portfolio.fields.titleEn} value={form.title_en ?? ''} onChange={e => setForm({...form, title_en: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <AdminTextarea label={t.admin.portfolio.fields.descriptionUk} rows={2} value={form.description_uk ?? ''} onChange={e => setForm({...form, description_uk: e.target.value})} />
            <AdminTextarea label={t.admin.portfolio.fields.descriptionRu} rows={2} value={form.description_ru ?? ''} onChange={e => setForm({...form, description_ru: e.target.value})} />
            <AdminTextarea label={t.admin.portfolio.fields.descriptionEn} rows={2} value={form.description_en ?? ''} onChange={e => setForm({...form, description_en: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <AdminInput label={t.admin.portfolio.fields.categoryUk} value={form.category_uk ?? ''} onChange={e => setForm({...form, category_uk: e.target.value})} />
            <AdminInput label={t.admin.portfolio.fields.categoryRu} value={form.category_ru ?? ''} onChange={e => setForm({...form, category_ru: e.target.value})} />
            <AdminInput label={t.admin.portfolio.fields.categoryEn} value={form.category_en ?? ''} onChange={e => setForm({...form, category_en: e.target.value})} />
          </div>
          <AdminInput label={t.admin.portfolio.fields.technologies} value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="React, TypeScript, Supabase" />
          <AdminInput label={t.admin.portfolio.fields.imageUrl} value={form.image_url ?? ''} onChange={e => setForm({...form, image_url: e.target.value})} />
          <AdminInput label={t.admin.portfolio.fields.projectUrl} value={form.project_url ?? ''} onChange={e => setForm({...form, project_url: e.target.value})} />
          <div className="grid grid-cols-2 gap-4 items-end">
            <AdminInput label={t.admin.portfolio.fields.sortOrder} type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: Number(e.target.value)})} />
            <AdminCheckbox label={t.admin.portfolio.fields.featured} checked={form.featured} onChange={v => setForm({...form, featured: v})} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-medium text-white hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all">
              {saving ? <Loader2 size={16} className="animate-spin" /> : t.admin.portfolio.save}
            </button>
            <button onClick={() => setModalOpen(false)} className="rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-400 hover:text-white transition-all">
              {t.admin.portfolio.cancel}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
