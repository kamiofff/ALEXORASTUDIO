import { useEffect, useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SiteSettings } from '@/types';
import { AdminPageHeader, AdminCard, AdminLoading } from '@/components/admin/AdminUi';
import { AdminInput } from '@/components/admin/AdminFields';

export function AdminSettingsPage() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('*').limit(1).maybeSingle()
      .then(({ data }) => { setSettings(data as SiteSettings | null); setLoading(false); });
  }, []);

  const update = (field: keyof SiteSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await supabase.from('site_settings').update({
      hero_title_uk: settings.hero_title_uk,
      hero_title_ru: settings.hero_title_ru,
      hero_title_en: settings.hero_title_en,
      hero_subtitle_uk: settings.hero_subtitle_uk,
      hero_subtitle_ru: settings.hero_subtitle_ru,
      hero_subtitle_en: settings.hero_subtitle_en,
      seo_title_uk: settings.seo_title_uk,
      seo_title_ru: settings.seo_title_ru,
      seo_title_en: settings.seo_title_en,
      seo_description_uk: settings.seo_description_uk,
      seo_description_ru: settings.seo_description_ru,
      seo_description_en: settings.seo_description_en,
      owner_name: settings.owner_name,
      city: settings.city,
      email: settings.email,
      telegram: settings.telegram,
      phone: settings.phone,
    }).eq('id', settings.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <AdminLoading />;
  if (!settings) return <div className="text-gray-500">{t.admin.common.noData}</div>;

  return (
    <div>
      <AdminPageHeader title={t.admin.settings.title} subtitle={t.admin.settings.subtitle} />

      <div className="space-y-6 max-w-4xl">
        {/* Hero */}
        <AdminCard>
          <h2 className="text-lg font-semibold text-white mb-4">{t.admin.settings.heroSection}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <AdminInput label={t.admin.settings.fields.heroTitleUk} value={settings.hero_title_uk ?? ''} onChange={e => update('hero_title_uk', e.target.value)} />
              <AdminInput label={t.admin.settings.fields.heroTitleRu} value={settings.hero_title_ru ?? ''} onChange={e => update('hero_title_ru', e.target.value)} />
              <AdminInput label={t.admin.settings.fields.heroTitleEn} value={settings.hero_title_en ?? ''} onChange={e => update('hero_title_en', e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <AdminInput label={t.admin.settings.fields.heroSubtitleUk} value={settings.hero_subtitle_uk ?? ''} onChange={e => update('hero_subtitle_uk', e.target.value)} />
              <AdminInput label={t.admin.settings.fields.heroSubtitleRu} value={settings.hero_subtitle_ru ?? ''} onChange={e => update('hero_subtitle_ru', e.target.value)} />
              <AdminInput label={t.admin.settings.fields.heroSubtitleEn} value={settings.hero_subtitle_en ?? ''} onChange={e => update('hero_subtitle_en', e.target.value)} />
            </div>
          </div>
        </AdminCard>

        {/* SEO */}
        <AdminCard>
          <h2 className="text-lg font-semibold text-white mb-4">{t.admin.settings.seoSection}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <AdminInput label={t.admin.settings.fields.seoTitleUk} value={settings.seo_title_uk ?? ''} onChange={e => update('seo_title_uk', e.target.value)} />
              <AdminInput label={t.admin.settings.fields.seoTitleRu} value={settings.seo_title_ru ?? ''} onChange={e => update('seo_title_ru', e.target.value)} />
              <AdminInput label={t.admin.settings.fields.seoTitleEn} value={settings.seo_title_en ?? ''} onChange={e => update('seo_title_en', e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <AdminInput label={t.admin.settings.fields.seoDescriptionUk} value={settings.seo_description_uk ?? ''} onChange={e => update('seo_description_uk', e.target.value)} />
              <AdminInput label={t.admin.settings.fields.seoDescriptionRu} value={settings.seo_description_ru ?? ''} onChange={e => update('seo_description_ru', e.target.value)} />
              <AdminInput label={t.admin.settings.fields.seoDescriptionEn} value={settings.seo_description_en ?? ''} onChange={e => update('seo_description_en', e.target.value)} />
            </div>
          </div>
        </AdminCard>

        {/* Contacts */}
        <AdminCard>
          <h2 className="text-lg font-semibold text-white mb-4">{t.admin.settings.contactsSection}</h2>
          <div className="grid grid-cols-2 gap-3">
            <AdminInput label={t.admin.settings.fields.ownerName} value={settings.owner_name ?? ''} onChange={e => update('owner_name', e.target.value)} />
            <AdminInput label={t.admin.settings.fields.city} value={settings.city ?? ''} onChange={e => update('city', e.target.value)} />
            <AdminInput label={t.admin.settings.fields.email} value={settings.email ?? ''} onChange={e => update('email', e.target.value)} />
            <AdminInput label={t.admin.settings.fields.telegram} value={settings.telegram ?? ''} onChange={e => update('telegram', e.target.value)} />
            <AdminInput label={t.admin.settings.fields.phone} value={settings.phone ?? ''} onChange={e => update('phone', e.target.value)} />
          </div>
        </AdminCard>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-medium text-white hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            {saving ? t.admin.settings.saving : t.admin.settings.save}
          </button>
          {saved && <span className="text-sm text-green-400">{t.admin.settings.saved}</span>}
        </div>
      </div>
    </div>
  );
}
