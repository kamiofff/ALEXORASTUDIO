export type Language = 'uk' | 'ru' | 'en';

export type UserRole = 'OWNER' | 'MANAGER' | 'IT_EMPLOYEE';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  status: 'active' | 'blocked';
  avatar_url: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  assigned_to: string | null;
  created_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  title_uk: string | null;
  title_ru: string | null;
  title_en: string | null;
  description_uk: string | null;
  description_ru: string | null;
  description_en: string | null;
  category_uk: string | null;
  category_ru: string | null;
  category_en: string | null;
  technologies: string[];
  image_url: string | null;
  project_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title_uk: string | null;
  title_ru: string | null;
  title_en: string | null;
  description_uk: string | null;
  description_ru: string | null;
  description_en: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  client_name: string | null;
  company: string | null;
  position_uk: string | null;
  position_ru: string | null;
  position_en: string | null;
  text_uk: string | null;
  text_ru: string | null;
  text_en: string | null;
  rating: number;
  avatar_url: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
}

export interface Faq {
  id: string;
  question_uk: string | null;
  question_ru: string | null;
  question_en: string | null;
  answer_uk: string | null;
  answer_ru: string | null;
  answer_en: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  hero_title_uk: string | null;
  hero_title_ru: string | null;
  hero_title_en: string | null;
  hero_subtitle_uk: string | null;
  hero_subtitle_ru: string | null;
  hero_subtitle_en: string | null;
  seo_title_uk: string | null;
  seo_title_ru: string | null;
  seo_title_en: string | null;
  seo_description_uk: string | null;
  seo_description_ru: string | null;
  seo_description_en: string | null;
  owner_name: string | null;
  city: string | null;
  email: string | null;
  telegram: string | null;
  phone: string | null;
  updated_at: string;
}

export interface ContactFormData {
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  consent: boolean;
}
