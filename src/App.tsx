/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import HowItWorks from './pages/HowItWorks';
import Catering from './pages/Catering';
import About from './pages/About';
import Contact from './pages/Contact';
import CustomOrders from './pages/CustomOrders';
import Reviews from './pages/Reviews';
import Terms from './pages/Terms';
import Refund from './pages/Refund';
import Cart from './pages/Cart';
import Media from './pages/Media';
import { CartProvider } from './context/CartContext';
import { MenuDataProvider } from './context/MenuDataContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { SEOProvider } from './context/SEOContext';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenuList from './pages/admin/AdminMenuList';
import AdminMenuForm from './pages/admin/AdminMenuForm';
import AdminCSVImport from './pages/admin/AdminCSVImport';
import AdminGallery from './pages/admin/AdminGallery';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSEO from './pages/admin/AdminSEO';
import ProtectedAdminRoute from './pages/admin/ProtectedAdminRoute';
import UnderConstruction from './pages/UnderConstruction';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <SEOProvider>
    <MenuDataProvider>
      <CartProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Toaster position="top-center" richColors />
            <Routes>
              {/* Main public site */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="how-it-works" element={<HowItWorks />} />
                <Route path="catering" element={<Catering />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="custom-orders" element={<CustomOrders />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="terms" element={<Terms />} />
                <Route path="refund" element={<Refund />} />
                <Route path="cart" element={<Cart />} />
                <Route path="media" element={<Media />} />
                <Route path="brand" element={<UnderConstruction />} />
                <Route path="csr" element={<UnderConstruction />} />
                <Route path="partner" element={<UnderConstruction />} />
                <Route path="feed-a-child" element={<UnderConstruction />} />
                <Route path="faqs" element={<UnderConstruction />} />
              </Route>

              {/* Admin panel */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedAdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="menu" element={<AdminMenuList />} />
                  <Route path="menu/new" element={<AdminMenuForm />} />
                  <Route path="menu/edit/:id" element={<AdminMenuForm />} />
                  <Route path="import" element={<AdminCSVImport />} />
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="seo" element={<AdminSEO />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </CartProvider>
    </MenuDataProvider>
    </SEOProvider>
  );
}
