import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, UtensilsCrossed, AlertTriangle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useMenuData } from '../../context/MenuDataContext';
import { MenuItem } from '../../services/api';

const DIETARY_OPTIONS = ['All', 'Veg', 'Non Veg'];
const CATEGORY_OPTIONS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Starters', 'Main Course', 'Combos', 'Chatni', 'Sweets', 'Desserts'];
const TAG_OPTIONS = ['All', 'Signature', 'Popular', 'None'];
const DAY_OPTIONS = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function escapeCell(value: string | string[]): string {
  const str = Array.isArray(value) ? value.join(',') : (value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function DeleteConfirmModal({ item, onConfirm, onCancel }: { item: MenuItem; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <h3 className="font-bold text-stone-900">Delete Dish</h3>
        </div>
        <p className="text-stone-600 text-sm mb-6">
          Are you sure you want to delete <strong>{item.name}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-stone-200 rounded-lg text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMenuList() {
  const { menuItems, deleteItem, loading } = useMenuData();
  const [search, setSearch] = useState('');
  const [filterDietary, setFilterDietary] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterTag, setFilterTag] = useState('All');
  const [filterDay, setFilterDay] = useState('All');
  const [filterTiffin, setFilterTiffin] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);

  const filtered = menuItems.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    const matchDietary = filterDietary === 'All' || item.dietary === filterDietary;
    const matchCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchTag =
      filterTag === 'All' ||
      (filterTag === 'None' ? item.tags.length === 0 : item.tags.includes(filterTag));
    const matchDay = filterDay === 'All' || item.availableDays?.includes(filterDay);
    const matchTiffin = filterTiffin === 'All' || (filterTiffin === 'Tiffin' ? item.isTiffin : !item.isTiffin);
    return matchSearch && matchDietary && matchCategory && matchTag && matchDay && matchTiffin;
  });

  const handleExport = () => {
    const headers = ['name', 'description', 'price', 'portion', 'category', 'dietary', 'tag', 'img'];
    const rows = menuItems.map((item) =>
      [
        escapeCell(item.name),
        escapeCell(item.description),
        escapeCell(item.price),
        escapeCell(item.portion),
        escapeCell(item.category),
        escapeCell(item.dietary),
        escapeCell(item.tags),
        escapeCell(item.img),
        escapeCell(item.availableDays || []),
      ].join(',')
    );
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `babos_menus_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${menuItems.length} dishes`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-8">
      {deleteTarget && (
        <DeleteConfirmModal item={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Menu Items</h1>
          <p className="text-stone-500 text-sm mt-1">{menuItems.length} dishes total</p>
        </div>
        <Link
          to="/admin/menu/new"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Dish
        </Link>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-stone-200 hover:border-orange-300 hover:text-orange-600 text-stone-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <select
          value={filterDietary}
          onChange={(e) => setFilterDietary(e.target.value)}
          className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          {DIETARY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          {CATEGORY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          {TAG_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select
          value={filterDay}
          onChange={(e) => setFilterDay(e.target.value)}
          className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          {DAY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select
          value={filterTiffin}
          onChange={(e) => setFilterTiffin(e.target.value)}
          className="px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="All">All Menu Types</option>
          <option value="Regular">Regular Only</option>
          <option value="Tiffin">Tiffin Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <UtensilsCrossed size={40} className="mx-auto text-stone-300 mb-3" />
            <p className="text-stone-400 text-sm">No dishes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="text-left px-4 py-3 text-stone-500 font-medium w-12">Image</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Category</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Dietary</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Available Days</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Tag</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium w-24">Portion</th>
                  <th className="text-right px-4 py-3 text-stone-500 font-medium">Price</th>
                  <th className="text-right px-4 py-3 text-stone-500 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      {item.img ? (
                        <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
                          <UtensilsCrossed size={14} className="text-stone-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-900 truncate max-w-[180px]">{item.name}</div>
                      <div className="text-stone-400 text-xs truncate max-w-[180px]">{item.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">{item.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.dietary === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.dietary}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.isTiffin ? 'bg-orange-100 text-orange-700' : 'bg-stone-100 text-stone-600'}`}>
                        {item.isTiffin ? 'Tiffin' : 'Regular'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {item.availableDays && item.availableDays.length === 7 ? (
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold">Every Day</span>
                        ) : item.availableDays?.map(d => (
                          <span key={d} className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium">{d.slice(0,3)}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.tags && item.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">{t}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-stone-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-stone-600 text-xs">{item.portion}</td>
                    <td className="px-4 py-3 text-right font-semibold text-stone-900">{item.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/menu/edit/${item.id}`}
                          className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-orange-100 hover:text-orange-600 flex items-center justify-center text-stone-500 transition-colors"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-stone-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
