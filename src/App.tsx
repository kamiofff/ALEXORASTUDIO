import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { PublicLayout } from '@/layouts/PublicLayout';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminPortfolioPage = lazy(() => import('@/pages/admin/AdminPortfolioPage').then(m => ({ default: m.AdminPortfolioPage })));
const AdminReviewsPage = lazy(() => import('@/pages/admin/AdminReviewsPage').then(m => ({ default: m.AdminReviewsPage })));
const AdminServicesPage = lazy(() => import('@/pages/admin/AdminServicesPage').then(m => ({ default: m.AdminServicesPage })));
const AdminFaqPage = lazy(() => import('@/pages/admin/AdminFaqPage').then(m => ({ default: m.AdminFaqPage })));
const AdminClientsPage = lazy(() => import('@/pages/admin/AdminClientsPage').then(m => ({ default: m.AdminClientsPage })));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

function AdminSuspense() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070a0f] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
      </div>
    }>
      <AdminLayout />
    </Suspense>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>

            {/* Admin login */}
            <Route path="/admin" element={<AdminLoginPage />} />

            {/* Admin panel */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminSuspense />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="portfolio" element={<ProtectedRoute roles={['OWNER', 'MANAGER']}><AdminPortfolioPage /></ProtectedRoute>} />
              <Route path="reviews" element={<ProtectedRoute roles={['OWNER', 'MANAGER']}><AdminReviewsPage /></ProtectedRoute>} />
              <Route path="services" element={<ProtectedRoute roles={['OWNER', 'MANAGER']}><AdminServicesPage /></ProtectedRoute>} />
              <Route path="faq" element={<ProtectedRoute roles={['OWNER', 'MANAGER']}><AdminFaqPage /></ProtectedRoute>} />
              <Route path="clients" element={<ProtectedRoute roles={['OWNER', 'MANAGER']}><AdminClientsPage /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute roles={['OWNER']}><AdminSettingsPage /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
