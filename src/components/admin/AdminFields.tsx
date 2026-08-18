import { type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

export function AdminInput({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div>
      {label && <label className="block text-sm text-gray-300 mb-1.5">{label}</label>}
      <input
        {...props}
        className={`w-full rounded-xl bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all ${props.className ?? ''}`}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function AdminTextarea({ label, error, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <div>
      {label && <label className="block text-sm text-gray-300 mb-1.5">{label}</label>}
      <textarea
        {...props}
        className={`w-full rounded-xl bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all resize-none ${props.className ?? ''}`}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function AdminCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-400/30"
      />
      <span className="text-sm text-gray-300">{label}</span>
    </label>
  );
}
