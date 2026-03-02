import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/LoginPage';
import OTPPage from './pages/OTPPage';
import DashboardPage from './pages/DashboardPage';
import ContactsPage from './pages/ContactsPage';
import BlogsPage from './pages/BlogsPage';
import BlogFormPage from './pages/BlogFormPage';
import FAQsPage from './pages/FAQsPage';
import FAQFormPage from './pages/FAQFormPage';
import InstaPostsPage from './pages/InstaPostsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<OTPPage />} />

          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/new" element={<BlogFormPage />} />
            <Route path="/blogs/:id/edit" element={<BlogFormPage />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/faqs/new" element={<FAQFormPage />} />
            <Route path="/faqs/:id/edit" element={<FAQFormPage />} />
            <Route path="/insta-posts" element={<InstaPostsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
