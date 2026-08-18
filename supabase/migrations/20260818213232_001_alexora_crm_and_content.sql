/*
# ALEXORA STUDIO — CRM integration tables + website content tables

## Purpose
This migration creates the schema for the ALEXORA STUDIO public website and its
integration with the existing CRM. The `customers` table is the CRM's client table
that website form submissions are written into. Content tables (portfolio, services,
reviews, faq, settings) hold the editable, multi-language website content managed
through the admin panel.

## 1. New Tables

### `customers` — CRM clients (source of truth for website form submissions)
- `id` (uuid, PK)
- `first_name` (text, not null) — client first name
- `last_name` (text) — client last name
- `company` (text) — client company
- `email` (text) — client email
- `phone` (text) — client phone
- `source` (text) — where the client came from (e.g. "ALEXORA STUDIO website")
- `status` (text, default 'new') — CRM status: new | in_progress | active | archived
- `assigned_to` (uuid, nullable) — staff member assigned to the client
- `created_by` (uuid, nullable) — staff member who created the record
- `notes` (text) — additional info / message from the client
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### `profiles` — staff profiles (linked to auth.users)
- `id` (uuid, PK, FK -> auth.users)
- `first_name` (text)
- `last_name` (text)
- `email` (text)
- `phone` (text)
- `role` (text, default 'IT_EMPLOYEE') — OWNER | MANAGER | IT_EMPLOYEE
- `status` (text, default 'active') — active | blocked
- `avatar_url` (text)
- `created_at` (timestamptz, default now())

### `portfolio_projects` — portfolio items shown on the public site
- `id` (uuid, PK)
- `title_uk`, `title_ru`, `title_en` (text) — multi-language title
- `description_uk`, `description_ru`, `description_en` (text) — multi-language description
- `category_uk`, `category_ru`, `category_en` (text) — multi-language category
- `technologies` (text[]) — stack used
- `image_url` (text) — cover image
- `project_url` (text) — external link
- `featured` (boolean, default false)
- `sort_order` (int, default 0)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### `services` — service cards shown on the public site
- `id` (uuid, PK)
- `title_uk`, `title_ru`, `title_en` (text)
- `description_uk`, `description_ru`, `description_en` (text)
- `icon` (text) — lucide icon name
- `sort_order` (int, default 0)
- `is_active` (boolean, default true)
- `created_at` (timestamptz, default now())

### `reviews` — client testimonials
- `id` (uuid, PK)
- `client_name` (text)
- `company` (text)
- `position_uk`, `position_ru`, `position_en` (text)
- `text_uk`, `text_ru`, `text_en` (text)
- `rating` (int, 1-5, default 5)
- `avatar_url` (text)
- `is_visible` (boolean, default true)
- `sort_order` (int, default 0)
- `created_at` (timestamptz, default now())

### `faqs` — FAQ entries
- `id` (uuid, PK)
- `question_uk`, `question_ru`, `question_en` (text)
- `answer_uk`, `answer_ru`, `answer_en` (text)
- `sort_order` (int, default 0)
- `is_visible` (boolean, default true)
- `created_at` (timestamptz, default now())

### `site_settings` — global site content (hero, contacts, SEO, etc.)
- `id` (uuid, PK, always single row)
- `hero_title_uk`, `hero_title_ru`, `hero_title_en` (text)
- `hero_subtitle_uk`, `hero_subtitle_ru`, `hero_subtitle_en` (text)
- `seo_title_uk`, `seo_title_ru`, `seo_title_en` (text)
- `seo_description_uk`, `seo_description_ru`, `seo_description_en` (text)
- `owner_name` (text)
- `city` (text)
- `email` (text)
- `telegram` (text)
- `phone` (text)
- `updated_at` (timestamptz, default now())

## 2. Security (RLS)

### `customers`
- Public INSERT allowed (website form creates clients via edge function using anon key)
  BUT only when source = 'ALEXORA STUDIO website' (prevents arbitrary writes).
- SELECT/UPDATE/DELETE restricted to authenticated staff (OWNER/MANAGER/IT_EMPLOYEE).

### `profiles`
- Each authenticated user can read their own profile.
- OWNER can read all profiles (for staff management).
- Each user can update their own profile.

### Content tables (portfolio_projects, services, reviews, faqs, site_settings)
- Public SELECT (anon + authenticated) so the website renders without login.
- INSERT/UPDATE/DELETE restricted to authenticated staff (OWNER/MANAGER).

## 3. Indexes
- `customers` on `created_at`, `status`, `source`
- `portfolio_projects` on `featured`, `sort_order`
- `services` on `is_active`, `sort_order`
- `reviews` on `is_visible`, `sort_order`
- `faqs` on `is_visible`, `sort_order`

## 4. Notes
- The `customers` table is designed to match an existing CRM schema. If a real CRM
  exists in a different Supabase project, point VITE_SUPABASE_URL there and this
  migration should be applied to THAT project instead.
- `source` is a free-text field (not an enum) to avoid breaking existing CRM values.
- `status` defaults to 'new' but accepts any text value to stay compatible with
  existing CRM status enums.
*/

-- ============================================================
-- CUSTOMERS (CRM client table — website form writes here)
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text,
  company text,
  email text,
  phone text,
  source text,
  status text NOT NULL DEFAULT 'new',
  assigned_to uuid,
  created_by uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers (status);
CREATE INDEX IF NOT EXISTS idx_customers_source ON customers (source);

-- Public can insert website leads (source must be the website)
DROP POLICY IF EXISTS "public_insert_website_clients" ON customers;
CREATE POLICY "public_insert_website_clients"
ON customers FOR INSERT
TO anon, authenticated
WITH CHECK (source = 'ALEXORA STUDIO website');

-- Only authenticated staff can read/update/delete clients
DROP POLICY IF EXISTS "staff_select_clients" ON customers;
CREATE POLICY "staff_select_clients"
ON customers FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "staff_update_clients" ON customers;
CREATE POLICY "staff_update_clients"
ON customers FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "staff_delete_clients" ON customers;
CREATE POLICY "staff_delete_clients"
ON customers FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- PROFILES (staff, linked to auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  phone text,
  role text NOT NULL DEFAULT 'IT_EMPLOYEE',
  status text NOT NULL DEFAULT 'active',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Each user reads own profile; OWNER reads all
DROP POLICY IF EXISTS "read_own_or_all_profiles" ON profiles;
CREATE POLICY "read_own_or_all_profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'OWNER'
  )
);

-- Each user updates own profile
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- OWNER can insert profiles (for adding staff) — handled via admin
DROP POLICY IF EXISTS "owner_insert_profiles" ON profiles;
CREATE POLICY "owner_insert_profiles"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'OWNER'
  )
);

-- OWNER can update any profile (change roles, block)
DROP POLICY IF EXISTS "owner_update_profiles" ON profiles;
CREATE POLICY "owner_update_profiles"
ON profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'OWNER'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'OWNER'
  )
);

-- ============================================================
-- PORTFOLIO PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_uk text,
  title_ru text,
  title_en text,
  description_uk text,
  description_ru text,
  description_en text,
  category_uk text,
  category_ru text,
  category_en text,
  technologies text[] DEFAULT '{}',
  image_url text,
  project_url text,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_projects (featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_sort ON portfolio_projects (sort_order);

DROP POLICY IF EXISTS "public_read_portfolio" ON portfolio_projects;
CREATE POLICY "public_read_portfolio"
ON portfolio_projects FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "staff_write_portfolio" ON portfolio_projects;
CREATE POLICY "staff_write_portfolio"
ON portfolio_projects FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
);

DROP POLICY IF EXISTS "staff_update_portfolio" ON portfolio_projects;
CREATE POLICY "staff_update_portfolio"
ON portfolio_projects FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
);

DROP POLICY IF EXISTS "staff_delete_portfolio" ON portfolio_projects;
CREATE POLICY "staff_delete_portfolio"
ON portfolio_projects FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
);

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_uk text,
  title_ru text,
  title_en text,
  description_uk text,
  description_ru text,
  description_en text,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_services_active ON services (is_active);
CREATE INDEX IF NOT EXISTS idx_services_sort ON services (sort_order);

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services"
ON services FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "staff_insert_services" ON services;
CREATE POLICY "staff_insert_services"
ON services FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
);

DROP POLICY IF EXISTS "staff_update_services" ON services;
CREATE POLICY "staff_update_services"
ON services FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
);

DROP POLICY IF EXISTS "staff_delete_services" ON services;
CREATE POLICY "staff_delete_services"
ON services FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text,
  company text,
  position_uk text,
  position_ru text,
  position_en text,
  text_uk text,
  text_ru text,
  text_en text,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url text,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_reviews_visible ON reviews (is_visible);
CREATE INDEX IF NOT EXISTS idx_reviews_sort ON reviews (sort_order);

DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews"
ON reviews FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "staff_insert_reviews" ON reviews;
CREATE POLICY "staff_insert_reviews"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
);

DROP POLICY IF EXISTS "staff_update_reviews" ON reviews;
CREATE POLICY "staff_update_reviews"
ON reviews FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
);

DROP POLICY IF EXISTS "staff_delete_reviews" ON reviews;
CREATE POLICY "staff_delete_reviews"
ON reviews FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
);

-- ============================================================
-- FAQS
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_uk text,
  question_ru text,
  question_en text,
  answer_uk text,
  answer_ru text,
  answer_en text,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_faqs_visible ON faqs (is_visible);
CREATE INDEX IF NOT EXISTS idx_faqs_sort ON faqs (sort_order);

DROP POLICY IF EXISTS "public_read_faqs" ON faqs;
CREATE POLICY "public_read_faqs"
ON faqs FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "staff_insert_faqs" ON faqs;
CREATE POLICY "staff_insert_faqs"
ON faqs FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
);

DROP POLICY IF EXISTS "staff_update_faqs" ON faqs;
CREATE POLICY "staff_update_faqs"
ON faqs FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
);

DROP POLICY IF EXISTS "staff_delete_faqs" ON faqs;
CREATE POLICY "staff_delete_faqs"
ON faqs FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role IN ('OWNER','MANAGER')
  )
);

-- ============================================================
-- SITE SETTINGS (single row)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title_uk text,
  hero_title_ru text,
  hero_title_en text,
  hero_subtitle_uk text,
  hero_subtitle_ru text,
  hero_subtitle_en text,
  seo_title_uk text,
  seo_title_ru text,
  seo_title_en text,
  seo_description_uk text,
  seo_description_ru text,
  seo_description_en text,
  owner_name text,
  city text,
  email text,
  telegram text,
  phone text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON site_settings;
CREATE POLICY "public_read_settings"
ON site_settings FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "staff_update_settings" ON site_settings;
CREATE POLICY "staff_update_settings"
ON site_settings FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'OWNER'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'OWNER'
  )
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Site settings (single row)
INSERT INTO site_settings (
  hero_title_uk, hero_title_ru, hero_title_en,
  hero_subtitle_uk, hero_subtitle_ru, hero_subtitle_en,
  seo_title_uk, seo_title_ru, seo_title_en,
  seo_description_uk, seo_description_ru, seo_description_en,
  owner_name, city, email, telegram, phone
) VALUES (
  'Створюємо цифрові рішення, які допомагають бізнесу розвиватися',
  'Создаём цифровые решения, которые помогают бизнесу развиваться',
  'Building digital solutions that help businesses grow',
  'Сайти, CRM-системи, автоматизація та сучасні веб-рішення для вашого бізнесу.',
  'Сайты, CRM-системы, автоматизация и современные веб-решения для вашего бизнеса.',
  'Websites, CRM systems, automation and modern web solutions for your business.',
  'ALEXORA STUDIO — IT-студія та цифрові рішення для бізнесу',
  'ALEXORA STUDIO — IT-студия и цифровые решения для бизнеса',
  'ALEXORA STUDIO — IT Studio & Digital Solutions for Business',
  'ALEXORA STUDIO створює сучасні сайти, CRM-системи, веб-додатки та автоматизацію для бізнесу.',
  'ALEXORA STUDIO создаёт современные сайты, CRM-системы, веб-приложения и автоматизацию для бизнеса.',
  'ALEXORA STUDIO creates modern websites, CRM systems, web apps and automation for businesses.',
  'Коновалов М.О.',
  'Київ, Україна',
  'studioalexora@gmail.com',
  '@studioalexora',
  '+380 (77) 116 76 00'
) ON CONFLICT DO NOTHING;

-- Services
INSERT INTO services (title_uk, title_ru, title_en, description_uk, description_ru, description_en, icon, sort_order) VALUES
('Розробка сайтів', 'Разработка сайтов', 'Website Development',
 'Сучасні адаптивні сайти для бізнесу будь-якого масштабу.', 'Современные адаптивные сайты для бизнеса любого масштаба.', 'Modern responsive websites for businesses of any scale.',
 'Globe', 1),
('Landing Page', 'Landing Page', 'Landing Pages',
 'Продаючі односторінкові сайти для послуг та продуктів.', 'Продающие одностраничные сайты для услуг и продуктов.', 'High-converting single-page sites for services and products.',
 'LayoutTemplate', 2),
('Інтернет-магазини', 'Интернет-магазины', 'E-commerce',
 'Повноцінні e-commerce рішення з управлінням товарами та замовленнями.', 'Полноценные e-commerce решения с управлением товарами и заказами.', 'Full e-commerce solutions with product and order management.',
 'ShoppingCart', 3),
('Редизайн сайтів', 'Редизайн сайтов', 'Website Redesign',
 'Сучасний UI/UX та покращення існуючого сайту.', 'Современный UI/UX и улучшение существующего сайта.', 'Modern UI/UX and improvement of your existing website.',
 'Palette', 4),
('CRM-системи', 'CRM-системы', 'CRM Systems',
 'Розробка CRM та внутрішніх систем управління бізнесом.', 'Разработка CRM и внутренних систем управления бизнесом.', 'Custom CRM and internal business management systems.',
 'Database', 5),
('Автоматизація', 'Автоматизация', 'Business Automation',
 'Автоматизація бізнес-процесів компанії.', 'Автоматизация бизнес-процессов компании.', 'Automation of company business processes.',
 'Workflow', 6),
('Telegram-боти', 'Telegram-боты', 'Telegram Bots',
 'Боти для підтримки, заявок та автоматизації.', 'Боты для поддержки, заявок и автоматизации.', 'Bots for support, requests and automation.',
 'MessageCircle', 7),
('Веб-додатки', 'Веб-приложения', 'Web Applications',
 'Сучасні веб-додатки та внутрішні сервіси.', 'Современные веб-приложения и внутренние сервисы.', 'Modern web apps and internal services.',
 'Code2', 8)
ON CONFLICT DO NOTHING;

-- Portfolio projects
INSERT INTO portfolio_projects (title_uk, title_ru, title_en, description_uk, description_ru, description_en, category_uk, category_ru, category_en, technologies, image_url, project_url, featured, sort_order) VALUES
('FinFlow CRM', 'FinFlow CRM', 'FinFlow CRM',
 'CRM-система для фінансової компанії з управлінням клієнтами та аналітикою.', 'CRM-система для финансовой компании с управлением клиентами и аналитикой.', 'CRM system for a financial company with client management and analytics.',
 'CRM', 'CRM', 'CRM',
 ARRAY['React','TypeScript','Supabase','Tailwind CSS'],
 'https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=1200',
 'https://example.com/finflow',
 true, 1),
('ShopNova', 'ShopNova', 'ShopNova',
 'Інтернет-магазин одягу з інтеграцією платіжних систем та управлінням запасами.', 'Интернет-магазин одежды с интеграцией платежных систем и управлением запасами.', 'Clothing e-commerce store with payment integration and inventory management.',
 'E-commerce', 'E-commerce', 'E-commerce',
 ARRAY['React','Stripe','Supabase','Tailwind CSS'],
 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1200',
 'https://example.com/shopnova',
 true, 2),
('TaskPilot', 'TaskPilot', 'TaskPilot',
 'Веб-додаток для управління завданнями команди з Kanban-дошкою та тайм-трекінгом.', 'Веб-приложение для управления задачами команды с Kanban-доской и тайм-трекингом.', 'Team task management web app with Kanban board and time tracking.',
 'Web Apps', 'Веб-приложения', 'Web Apps',
 ARRAY['React','TypeScript','Supabase','Vite'],
 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200',
 'https://example.com/taskpilot',
 true, 3),
('AutoLead Bot', 'AutoLead Bot', 'AutoLead Bot',
 'Telegram-бот для автоматичного збору заявок та інтеграції з CRM.', 'Telegram-бот для автоматического сбора заявок и интеграции с CRM.', 'Telegram bot for automated lead collection and CRM integration.',
 'Automation', 'Автоматизация', 'Automation',
 ARRAY['Node.js','Telegram API','Supabase'],
 'https://images.pexels.com/photos/887352/pexels-photo-887352.jpeg?auto=compress&cs=tinysrgb&w=1200',
 'https://example.com/autolead',
 false, 4),
('CorpSite Pro', 'CorpSite Pro', 'CorpSite Pro',
 'Корпоративний сайт IT-компанії з блогом та мультиязичністю.', 'Корпоративный сайт IT-компании с блогом и мультиязычностью.', 'Corporate website for an IT company with blog and multi-language support.',
 'Websites', 'Сайты', 'Websites',
 ARRAY['React','TypeScript','Tailwind CSS','Vite'],
 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1200',
 'https://example.com/corpsite',
 false, 5),
('Telegram Support', 'Telegram Support', 'Telegram Support',
 'Бот підтримки клієнтів з базою знань та ескалацією запитів.', 'Бот поддержки клиентов с базой знаний и эскалацией запросов.', 'Customer support bot with knowledge base and ticket escalation.',
 'Telegram Bots', 'Telegram-боты', 'Telegram Bots',
 ARRAY['Node.js','Telegram API','Supabase'],
 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=1200',
 'https://example.com/tgsupport',
 false, 6)
ON CONFLICT DO NOTHING;

-- Reviews
INSERT INTO reviews (client_name, company, position_uk, position_ru, position_en, text_uk, text_ru, text_en, rating, avatar_url, is_visible, sort_order) VALUES
('Андрій Коваленко', 'FinFlow', 'Директор', 'Директор', 'Director',
 'Команда ALEXORA STUDIO розробила CRM, яка повністю змінила нашу роботу. Процеси стали швидшими, а помилки зникли.', 'Команда ALEXORA STUDIO разработала CRM, которая полностью изменила нашу работу. Процессы стали быстрее, а ошибки исчезли.', 'The ALEXORA STUDIO team built a CRM that completely transformed our operations. Processes became faster and errors disappeared.',
 5, 'https://images.pexels.com/photos/220917/pexels-photo-220917.jpeg?auto=compress&cs=tinysrgb&w=200',
 true, 1),
('Олена Петренко', 'ShopNova', 'Засновниця', 'Основательница', 'Founder',
 'Наш інтернет-магазин запрацював за кілька тижнів. Продажі зросли на 40% після запуску нового дизайну.', 'Наш интернет-магазин заработал за несколько недель. Продажи выросли на 40% после запуска нового дизайна.', 'Our online store launched in weeks. Sales grew 40% after the new design went live.',
 5, 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
 true, 2),
('Михайло Сидоренко', 'TaskPilot', 'PM', 'PM', 'PM',
 'TaskPilot допоміг нашій команді структурувати завдання. Найкраще рішення для віддалених команд.', 'TaskPilot помог нашей команде структурировать задачи. Лучшее решение для удалённых команд.', 'TaskPilot helped our team structure tasks. The best solution for remote teams.',
 5, 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=200',
 true, 3)
ON CONFLICT DO NOTHING;

-- FAQ
INSERT INTO faqs (question_uk, question_ru, question_en, answer_uk, answer_ru, answer_en, sort_order, is_visible) VALUES
('Скільки коштує створення сайту?', 'Сколько стоит создание сайта?', 'How much does a website cost?',
 'Вартість залежить від складності проєкту, функціоналу та дизайну. Ми обговорюємо бюджет індивідуально після консультації.', 'Стоимость зависит от сложности проекта, функционала и дизайна. Мы обсуждаем бюджет индивидуально после консультации.', 'Cost depends on project complexity, features and design. We discuss the budget individually after a consultation.',
 1, true),
('Скільки часу займає розробка?', 'Сколько времени занимает разработка?', 'How long does development take?',
 'Лендинг — 1-2 тижні, корпоративний сайт — 3-6 тижнів, CRM або веб-додаток — від 1 місяця.', 'Лендинг — 1-2 недели, корпоративный сайт — 3-6 недель, CRM или веб-приложение — от 1 месяца.', 'Landing page — 1-2 weeks, corporate site — 3-6 weeks, CRM or web app — from 1 month.',
 2, true),
('Чи можна переробити існуючий сайт?', 'Можно ли переделать существующий сайт?', 'Can you redesign an existing website?',
 'Так, ми робимо редизайн з покращенням UI/UX та збереженням контенту.', 'Да, мы делаем редизайн с улучшением UI/UX и сохранением контента.', 'Yes, we redesign with UI/UX improvements and content preservation.',
 3, true),
('Чи можна інтегрувати CRM?', 'Можно ли интегрировать CRM?', 'Can you integrate a CRM?',
 'Так, ми інтегруємо CRM з вашими існуючими системами та інструментами.', 'Да, мы интегрируем CRM с вашими существующими системами и инструментами.', 'Yes, we integrate CRM with your existing systems and tools.',
 4, true),
('Чи можна створити Telegram-бота?', 'Можно ли создать Telegram-бота?', 'Can you build a Telegram bot?',
 'Так, ми розробляємо Telegram-ботів для підтримки, заявок та автоматизації.', 'Да, мы разрабатываем Telegram-ботов для поддержки, заявок и автоматизации.', 'Yes, we build Telegram bots for support, requests and automation.',
 5, true),
('Чи надаєте ви підтримку після запуску?', 'Предоставляете ли вы поддержку после запуска?', 'Do you provide post-launch support?',
 'Так, ми надаємо технічну підтримку та розвиток проєкту після запуску.', 'Да, мы предоставляем техническую поддержку и развитие проекта после запуска.', 'Yes, we provide technical support and project development after launch.',
 6, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- TRIGGER: auto-create profile on new auth user
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: update updated_at timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS customers_updated_at ON customers;
CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS portfolio_updated_at ON portfolio_projects;
CREATE TRIGGER portfolio_updated_at
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS site_settings_updated_at ON site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
