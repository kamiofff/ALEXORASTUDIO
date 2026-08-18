import { useState, useEffect, type FormEvent } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
} from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

import type {
  ContactFormData,
  Service,
} from '@/types';

type Status =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

interface FormErrors {
  first_name?: string;
  email?: string;
  phone?: string;
  message?: string;
  consent?: string;
}

export function ContactForm() {
  const { t, lang } = useLanguage();

  const [status, setStatus] =
    useState<Status>('idle');

  const [errorMsg, setErrorMsg] =
    useState<string | null>(null);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [services, setServices] =
    useState<Service[]>([]);

  const [form, setForm] =
    useState<ContactFormData>({
      first_name: '',
      last_name: '',
      company: '',
      email: '',
      phone: '',
      service: '',
      message: '',
      consent: false,
    });

  /*
   * Загружаем активные услуги
   */
  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', {
        ascending: true,
      })
      .then(({ data, error }) => {
        if (error) {
          console.error(
            'Ошибка загрузки услуг:',
            error
          );

          setServices([]);
          return;
        }

        setServices(
          (data as Service[]) ?? []
        );
      });
  }, []);

  const titleKey =
    `title_${lang}` as const;

  /*
   * Валидация
   */
  const validate = (): boolean => {
    const e: FormErrors = {};

    if (
      !form.first_name.trim() ||
      form.first_name.trim().length < 2
    ) {
      e.first_name =
        t.form.errorRequired;
    }

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      e.email =
        t.form.errorEmail;
    }

    if (
      form.phone &&
      !/^[+\d\s\-()]{7,20}$/.test(
        form.phone
      )
    ) {
      e.phone =
        t.form.errorPhone;
    }

    if (
      form.message &&
      form.message.trim().length > 0 &&
      form.message.trim().length < 10
    ) {
      e.message =
        t.form.errorMessage;
    }

    if (!form.consent) {
      e.consent =
        t.form.errorConsent;
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  /*
   * Отправка заявки
   *
   * Сайт
   * ↓
   * create-website-customer
   * ↓
   * Supabase customers
   * ↓
   * CRM → Клиенты
   */
  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (status === 'loading') {
      return;
    }

    if (!validate()) {
      return;
    }

    setStatus('loading');
    setErrorMsg(null);

    try {
      /*
       * Получаем URL Supabase Edge Function
       */
      const supabaseUrl =
        import.meta.env
          .VITE_SUPABASE_URL;

      if (!supabaseUrl) {
        throw new Error(
          'VITE_SUPABASE_URL не настроен'
        );
      }

      const functionUrl =
        `${supabaseUrl}/functions/v1/create-website-customer`;

      /*
       * Информация о заявке.
       *
       * service и message находятся
       * в поле client_info CRM.
       */
      const clientInfo = [
        form.service
          ? `Послуга: ${form.service}`
          : null,

        form.message
          ? `Повідомлення: ${form.message}`
          : null,
      ]
        .filter(Boolean)
        .join('\n');

      const response =
        await fetch(functionUrl, {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${
                import.meta.env
                  .VITE_SUPABASE_ANON_KEY
              }`,
          },

          body: JSON.stringify({
            first_name:
              form.first_name.trim(),

            last_name:
              form.last_name.trim(),

            company:
              form.company.trim(),

            email:
              form.email.trim(),

            phone:
              form.phone.trim(),

            messenger:
              '@studioalexora',

            client_info:
              clientInfo,
          }),
        });

      const responseBody =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        console.error(
          'CREATE WEBSITE CUSTOMER ERROR:',
          responseBody
        );

        throw new Error(
          responseBody.error ||
            `HTTP ${response.status}`
        );
      }

      /*
       * Успешная отправка
       */
      setStatus('success');

      setForm({
        first_name: '',
        last_name: '',
        company: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        consent: false,
      });

      setErrors({});
    } catch (err) {
      console.error(
        'CONTACT FORM ERROR:',
        err
      );

      if (!navigator.onLine) {
        setErrorMsg(
          t.form.errorNetwork
        );
      } else {
        setErrorMsg(
          t.form.error
        );
      }

      setStatus('error');
    }
  };

  /*
   * Изменение поля
   */
  const handleChange = (
    field: keyof ContactFormData,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (
      errors[
        field as keyof FormErrors
      ]
    ) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  /*
   * Успешная отправка
   */
  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-8 text-center">
        <CheckCircle2
          className="mx-auto text-cyan-400 mb-4"
          size={48}
        />

        <p className="text-white text-lg leading-relaxed mb-6">
          {t.form.success}
        </p>

        <button
          onClick={() =>
            setStatus('idle')
          }
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {t.form.sendAnother}
        </button>
      </div>
    );
  }

  /*
   * Стили input
   */
  const inputClass = (
    field: keyof FormErrors
  ) =>
    `w-full rounded-xl bg-white/5 border ${
      errors[field]
        ? 'border-red-500/50'
        : 'border-white/10'
    } px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all`;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 space-y-4"
    >
      {/* Имя + фамилия */}
      <div className="grid sm:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            {t.form.firstName}{' '}
            <span className="text-cyan-400">
              *
            </span>
          </label>

          <input
            type="text"
            value={form.first_name}
            onChange={(e) =>
              handleChange(
                'first_name',
                e.target.value
              )
            }
            placeholder={
              t.form.firstNamePlaceholder
            }
            className={inputClass(
              'first_name'
            )}
            disabled={
              status === 'loading'
            }
          />

          {errors.first_name && (
            <p className="mt-1 text-xs text-red-400">
              {errors.first_name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            {t.form.lastName}
          </label>

          <input
            type="text"
            value={form.last_name}
            onChange={(e) =>
              handleChange(
                'last_name',
                e.target.value
              )
            }
            placeholder={
              t.form.lastNamePlaceholder
            }
            className={inputClass(
              'last_name'
            )}
            disabled={
              status === 'loading'
            }
          />
        </div>

      </div>

      {/* Компания */}
      <div>
        <label className="block text-sm text-gray-300 mb-1.5">
          {t.form.company}
        </label>

        <input
          type="text"
          value={form.company}
          onChange={(e) =>
            handleChange(
              'company',
              e.target.value
            )
          }
          placeholder={
            t.form.companyPlaceholder
          }
          className={inputClass(
            'company'
          )}
          disabled={
            status === 'loading'
          }
        />
      </div>

      {/* Email + телефон */}
      <div className="grid sm:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            {t.form.email}
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              handleChange(
                'email',
                e.target.value
              )
            }
            placeholder={
              t.form.emailPlaceholder
            }
            className={inputClass(
              'email'
            )}
            disabled={
              status === 'loading'
            }
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            {t.form.phone}
          </label>

          <input
            type="tel"
            value={form.phone}
            onChange={(e) =>
              handleChange(
                'phone',
                e.target.value
              )
            }
            placeholder={
              t.form.phonePlaceholder
            }
            className={inputClass(
              'phone'
            )}
            disabled={
              status === 'loading'
            }
          />

          {errors.phone && (
            <p className="mt-1 text-xs text-red-400">
              {errors.phone}
            </p>
          )}
        </div>

      </div>

      {/* Услуга */}
      <div>
        <label className="block text-sm text-gray-300 mb-1.5">
          {t.form.service}
        </label>

        <select
          value={form.service}
          onChange={(e) =>
            handleChange(
              'service',
              e.target.value
            )
          }
          className={inputClass(
            'service'
          )}
          disabled={
            status === 'loading'
          }
        >
          <option
            value=""
            className="bg-[#0a0e14]"
          >
            {t.form.servicePlaceholder}
          </option>

          {services.map((s) => (
            <option
              key={s.id}
              value={
                s[titleKey] ??
                s.title_en ??
                ''
              }
              className="bg-[#0a0e14]"
            >
              {s[titleKey] ??
                s.title_en}
            </option>
          ))}
        </select>
      </div>

      {/* Сообщение */}
      <div>
        <label className="block text-sm text-gray-300 mb-1.5">
          {t.form.message}
        </label>

        <textarea
          value={form.message}
          onChange={(e) =>
            handleChange(
              'message',
              e.target.value
            )
          }
          placeholder={
            t.form.messagePlaceholder
          }
          rows={4}
          className={`${inputClass(
            'message'
          )} resize-none`}
          disabled={
            status === 'loading'
          }
        />

        {errors.message && (
          <p className="mt-1 text-xs text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      {/* Согласие */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">

          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) =>
              handleChange(
                'consent',
                e.target.checked
              )
            }
            className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-400/30"
            disabled={
              status === 'loading'
            }
          />

          <span className="text-sm text-gray-400">
            {t.form.consent}
          </span>

        </label>

        {errors.consent && (
          <p className="mt-1 text-xs text-red-400">
            {errors.consent}
          </p>
        )}
      </div>

      {/* Ошибка */}
      {status === 'error' &&
        errorMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">

            <AlertCircle
              className="text-red-400 shrink-0"
              size={18}
            />

            <p className="text-sm text-red-300">
              {errorMsg}
            </p>

          </div>
        )}

      {/* Кнопка */}
      <button
        type="submit"
        disabled={
          status === 'loading'
        }
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />

            {t.form.sending}
          </>
        ) : (
          <>
            <Send size={18} />

            {t.form.submit}
          </>
        )}
      </button>
    </form>
  );
}
