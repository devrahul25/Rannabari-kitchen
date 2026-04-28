import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, ChevronRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FloatingCart() {
  const { cart, totalItems } = useCart();
  const location = useLocation();
  const [dismissedAt, setDismissedAt] = useState(0);
  const [itemDetailOpen, setItemDetailOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => setItemDetailOpen((e as CustomEvent).detail.open);
    document.addEventListener('itemDetailToggle', handler);
    return () => document.removeEventListener('itemDetailToggle', handler);
  }, []);

  if (totalItems === 0 || location.pathname === '/cart' || (dismissedAt > 0 && totalItems === dismissedAt) || itemDetailOpen) {
    return null;
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md bg-[#25D366] text-white rounded-2xl shadow-2xl z-40 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="flex items-center justify-between p-4">
        <Link to="/cart" className="flex items-center gap-3 flex-1 hover:opacity-90 transition-opacity">
          <div className="bg-white/20 p-2 rounded-full relative">
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-white text-stone-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg">₹{calculateTotal()}</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="flex items-center gap-1 font-medium hover:opacity-90 transition-opacity">
            <span className="whitespace-nowrap">View Cart</span>
            <ChevronRight size={20} />
          </Link>
          <button
            onClick={() => setDismissedAt(totalItems)}
            className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-1"
            aria-label="Close cart"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
