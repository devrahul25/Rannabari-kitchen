import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChefHat, ShoppingCart } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';
import { useCart } from '../context/CartContext';

const navLinks = [
  { name: 'Menu', path: '/menu' },
  { name: 'Catering', path: '/catering' },
  { name: 'Custom Orders', path: '/custom-orders' },
  { name: 'About', path: '/about' },
  { name: 'How It Works', path: '/how-it-works' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <img src="https://babos.jaiveeru.site/uploads/gallery/logo-d.svg" alt="Babo's Home Kitchen" className="h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-orange-600 ${
                  location.pathname === link.path ? 'text-orange-600 border-b-2 border-orange-600 pb-1' : 'text-stone-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile & Desktop Cart + Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link
              to="/cart"
              className={`relative -top-0.5 lg:top-0 text-sm font-medium transition-colors hover:text-orange-600 flex items-center gap-1 ${
                location.pathname === '/cart' ? 'text-orange-600' : 'text-stone-600'
              }`}
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="hidden lg:block">
              <WhatsAppButton text="Order on WhatsApp" />
            </div>
            
            

            <button
              className="lg:hidden p-2 -mr-2 text-stone-600 hover:text-orange-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-3 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-orange-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 px-3">
              <WhatsAppButton text="Order on WhatsApp" className="w-full justify-center" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
