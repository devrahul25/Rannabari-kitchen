import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Leaf, Beef, Flame, BookOpen, Cake, Star, TrendingUp, Plus } from 'lucide-react';
import { useMenuData } from '../../context/MenuDataContext';

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <div className="text-2xl font-bold text-stone-900">{value}</div>
        <div className="text-sm text-stone-500">{label}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { menuItems, loading } = useMenuData();

  const stats = {
    total: menuItems.length,
    veg: menuItems.filter((i) => i.dietary?.toLowerCase() === 'veg').length,
    nonVeg: menuItems.filter((i) => i.dietary?.toLowerCase() === 'non veg').length,
    starters: menuItems.filter((i) => i.category?.toLowerCase() === 'starters').length,
    mainCourse: menuItems.filter((i) => i.category?.toLowerCase() === 'main course').length,
    desserts: menuItems.filter((i) => i.category?.toLowerCase() === 'desserts').length,
    signature: menuItems.filter((i) => i.tags?.includes('Signature')).length,
    popular: menuItems.filter((i) => i.tags?.includes('Popular')).length,
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="text-stone-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
          <p className="text-stone-500 text-sm mt-1">Overview of your menu</p>
        </div>
        <Link
          to="/admin/menu/new"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Dish
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Dishes" value={stats.total} icon={UtensilsCrossed} color="bg-orange-100 text-orange-600" />
        <StatCard label="Veg" value={stats.veg} icon={Leaf} color="bg-green-100 text-green-600" />
        <StatCard label="Non-Veg" value={stats.nonVeg} icon={Beef} color="bg-red-100 text-red-600" />
        <StatCard label="Starters" value={stats.starters} icon={Flame} color="bg-yellow-100 text-yellow-600" />
        <StatCard label="Main Course" value={stats.mainCourse} icon={BookOpen} color="bg-blue-100 text-blue-600" />
        <StatCard label="Desserts" value={stats.desserts} icon={Cake} color="bg-pink-100 text-pink-600" />
        <StatCard label="Signature" value={stats.signature} icon={Star} color="bg-purple-100 text-purple-600" />
        <StatCard label="Popular" value={stats.popular} icon={TrendingUp} color="bg-teal-100 text-teal-600" />
      </div>

      {/* Recent Dishes */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold text-stone-900">Recent Dishes</h2>
          <Link to="/admin/menu" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            View all
          </Link>
        </div>
        <div className="divide-y divide-stone-100">
          {menuItems.slice(-5).reverse().map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-3">
              {item.img ? (
                <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed size={16} className="text-stone-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-900 truncate">{item.name}</div>
                <div className="text-xs text-stone-400">{item.category} · {item.dietary}</div>
              </div>
              <div className="text-sm font-semibold text-stone-900">{item.price}</div>
              {item.tags?.map(t => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
