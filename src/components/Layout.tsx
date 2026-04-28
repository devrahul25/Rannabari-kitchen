import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import FloatingCart from './FloatingCart';
import PageTransition from './PageTransition';
import SEOHead from './SEOHead';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const location = useLocation();
  const { totalItems } = useCart();
  const isCartPage = location.pathname === '/cart';
  const showFloatingCart = totalItems > 0 && !isCartPage;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50 text-stone-900">
      <SEOHead />
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
}
