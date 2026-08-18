import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export function AdminPageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export function AdminCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 ${className}`}>
      {children}
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="text-cyan-400 animate-spin" size={32} />
    </div>
  );
}

export function AdminEmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 text-gray-500">{message}</div>
  );
}
