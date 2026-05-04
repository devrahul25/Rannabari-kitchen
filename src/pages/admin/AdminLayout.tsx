import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Upload, LogOut, Images, ShoppingBag, Globe } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/menu', icon: UtensilsCrossed, label: 'Menu Items' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/import', icon: Upload, label: 'Import CSV' },
  { to: '/admin/gallery', icon: Images, label: 'Gallery' },
  { to: '/admin/seo', icon: Globe, label: 'SEO Settings' },
];

export default function AdminLayout() {
  const { logout, adminUsername } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-stone-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img src="/Logo-for-website.svg" alt="Rannabari Kitchen Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">Babo's Kitchen</div>
              <div className="text-stone-400 text-xs">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-700">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold uppercase">
              {adminUsername?.charAt(0) ?? 'A'}
            </div>
            <span className="text-stone-300 text-sm truncate">{adminUsername ?? 'Admin'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-stone-300 hover:bg-stone-800 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
