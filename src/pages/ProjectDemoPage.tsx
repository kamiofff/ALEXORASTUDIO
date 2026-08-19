import { ArrowLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface ProjectData {
  title: string;
  category: string;
  description: string;
  technologies: string[];
  features: string[];
  image: string;
}

const projects: Record<string, ProjectData> = {
  finflow: {
    title: 'FinFlow CRM',
    category: 'CRM Systems',
    description:
      'Современная CRM-система для управления клиентами, сделками, задачами и аналитикой финансовой компании.',
    technologies: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    features: [
      'Управление клиентами',
      'Контроль сделок',
      'Аналитика и статистика',
      'Задачи сотрудников',
      'Система уведомлений',
    ],
    image:
      'https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },

  shopnova: {
    title: 'ShopNova',
    category: 'E-commerce',
    description:
      'Современный интернет-магазин с каталогом товаров, корзиной, заказами и удобным пользовательским интерфейсом.',
    technologies: ['React', 'Supabase', 'Tailwind CSS', 'Stripe'],
    features: [
      'Каталог товаров',
      'Корзина',
      'Оформление заказа',
      'Управление товарами',
      'Адаптивный дизайн',
    ],
    image:
      'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },

  taskpilot: {
    title: 'TaskPilot',
    category: 'Web Applications',
    description:
      'Веб-приложение для управления задачами команды с Kanban-доской и контролем рабочего процесса.',
    technologies: ['React', 'TypeScript', 'Supabase', 'Vite'],
    features: [
      'Kanban-доска',
      'Управление задачами',
      'Командная работа',
      'Отслеживание статусов',
      'Тайм-трекинг',
    ],
    image:
      'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },

  autolead: {
    title: 'AutoLead Bot',
    category: 'Automation',
    description:
      'Telegram-бот для автоматического сбора заявок и передачи данных в CRM-систему.',
    technologies: ['Node.js', 'Telegram API', 'Supabase'],
    features: [
      'Автоматический сбор заявок',
      'Telegram-интеграция',
      'Передача данных в CRM',
      'Уведомления менеджеров',
      'Автоматизация обработки клиентов',
    ],
    image:
      'https://images.pexels.com/photos/887352/pexels-photo-887352.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },

  corpsite: {
    title: 'CorpSite Pro',
    category: 'Websites',
    description:
      'Корпоративный сайт IT-компании с современным дизайном, мультиязычностью и презентацией услуг.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    features: [
      'Современный UI/UX',
      'Адаптивная верстка',
      'Мультиязычность',
      'Презентация услуг',
      'SEO-оптимизированная структура',
    ],
    image:
      'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },

  'telegram-support': {
    title: 'Telegram Support',
    category: 'Telegram Bots',
    description:
      'Telegram-бот поддержки клиентов с базой знаний и системой обработки обращений.',
    technologies: ['Node.js', 'Telegram API', 'Supabase'],
    features: [
      'Приём обращений',
      'База знаний',
      'Автоматические ответы',
      'Эскалация запросов',
      'Интеграция с CRM',
    ],
    image:
      'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=1600',
  },
};

export function ProjectDemoPage() {
  const { slug } = useParams<{ slug: string }>();

  const project = slug ? projects[slug] : undefined;

  if (!project) {
    return (
      <main className="min-h-screen bg-[#070b11] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Проект не найден
          </h1>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
          >
            <ArrowLeft size={18} />
            Вернуться на главную
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070b11] text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={17} />
            Назад к проектам
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-sm text-cyan-400 mb-6">
              {project.category}
            </span>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              {project.title}
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-8">
              {project.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-[320px] md:h-[420px] object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#070b11]/70 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-2xl mb-10">
            <span className="text-cyan-400 text-sm font-medium">
              PROJECT FEATURES
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Возможности проекта
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.features.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <CheckCircle2
                  className="text-cyan-400 mb-4"
                  size={24}
                />

                <h3 className="text-white font-medium">
                  {feature}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo preview */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <div className="border-b border-white/10 px-6 py-4 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
            <span className="h-3 w-3 rounded-full bg-green-400/70" />

            <span className="ml-4 text-xs text-gray-500">
              {project.title} — ALEXORA STUDIO
            </span>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-5">
              <div className="h-32 rounded-2xl bg-cyan-500/10 border border-cyan-400/10" />
              <div className="h-32 rounded-2xl bg-blue-500/10 border border-blue-400/10" />
              <div className="h-32 rounded-2xl bg-purple-500/10 border border-purple-400/10" />

              <div className="md:col-span-2 h-64 rounded-2xl bg-white/[0.04] border border-white/10" />

              <div className="h-64 rounded-2xl bg-white/[0.04] border border-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-5">
          Хотите похожий проект?
        </h2>

        <p className="text-gray-400 mb-8">
          Расскажите нам о своей задаче — разработаем решение
          под ваш бизнес.
        </p>

        <Link
          to="/#contact"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 font-medium text-white hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          Обсудить проект
          <ArrowUpRight size={18} />
        </Link>
      </section>
    </main>
  );
}