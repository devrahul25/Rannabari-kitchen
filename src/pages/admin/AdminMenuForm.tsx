import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Image } from 'lucide-react';
import { toast } from 'sonner';
import { useMenuData } from '../../context/MenuDataContext';
import { MenuItemInput } from '../../services/api';

const CATEGORIES = ['Starters', 'Main Course', 'Combos', 'Chatni', 'Sweets', 'Desserts', 'Breakfast', 'Lunch', 'Dinner'];
const DIETARY = ['Veg', 'Non Veg'];
const TAG_OPTIONS = ['Signature', 'Popular'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EMPTY_FORM: MenuItemInput = {
  name: '',
  description: '',
  price: '',
  portion: '',
  category: 'Main Course',
  dietary: 'Veg',
  tags: [],
  img: '',
  availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  isTiffin: false,
};

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white';

export default function AdminMenuForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { menuItems, addItem, updateItem } = useMenuData();

  const [form, setForm] = useState<MenuItemInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const loadedRef = React.useRef(false);
  const [errors, setErrors] = useState<Partial<Record<keyof MenuItemInput, string>>>({});

  const set = (key: Exclude<keyof MenuItemInput, 'tags'>, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const toggleDay = (day: string) => {
    setForm((prev) => {
      const current = prev.availableDays || [];
      return {
        ...prev,
        availableDays: current.includes(day)
          ? current.filter((d) => d !== day)
          : [...current, day],
      };
    });
  };

  useEffect(() => {
    if (isEdit && id && !loadedRef.current) {
      const item = menuItems.find((m) => String(m.id) === id);
      if (item) {
        setForm({
          name: item.name,
          description: item.description || '',
          price: item.price,
          portion: item.portion || '',
          category: item.category,
          dietary: item.dietary,
          tags: item.tags || [],
          img: item.img || '',
          availableDays: item.availableDays || [],
          isTiffin: item.isTiffin || false,
        });
        loadedRef.current = true;
      }
    }
  }, [isEdit, id, menuItems]);

  const validate = (): boolean => {
    const e: Partial<Record<keyof MenuItemInput, string>> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.price.trim()) e.price = 'Price is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.dietary) e.dietary = 'Dietary type is required';
    if (form.img && !/^https?:\/\/.+/.test(form.img.trim())) e.img = 'Must be a valid URL starting with http(s)://';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload: MenuItemInput = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: String(form.price).startsWith('₹') ? String(form.price).trim() : `₹${String(form.price).trim()}`,
        portion: form.portion.trim(),
        category: form.category,
        dietary: form.dietary,
        tags: Array.isArray(form.tags) ? form.tags : [],
        img: form.img.trim(),
        availableDays: Array.isArray(form.availableDays) ? form.availableDays : [],
        isTiffin: Boolean(form.isTiffin),
      };

      console.log('SUBMITTING PAYLOAD:', payload);

      if (isEdit && id) {
        await updateItem(Number(id), payload);
        toast.success('Dish updated successfully');
      } else {
        await addItem(payload);
        toast.success('Dish added successfully');
      }
      navigate('/admin/menu');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin/menu" className="w-9 h-9 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 text-stone-600 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{isEdit ? 'Edit Dish' : 'Add Dish'}</h1>
          <p className="text-stone-500 text-sm mt-0.5">{isEdit ? 'Update dish details' : 'Add a new dish to the menu'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
        
        {/* Name */}
        <FormField label="Dish Name" required>
          <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Mutton Biriyani" className={inputCls} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </FormField>

        {/* Description */}
        <FormField label="Description / Summary">
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Brief description of the dish..."
            rows={3}
            className={inputCls}
          />
        </FormField>

        {/* Price + Portion */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Price" required>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">₹</span>
              <input
                type="text"
                value={form.price.replace(/^₹/, '')}
                onChange={(e) => set('price', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="600"
                className={`${inputCls} pl-7`}
              />
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </FormField>

          <FormField label="Item Info / Portion">
            <input
              type="text"
              value={form.portion}
              onChange={(e) => set('portion', e.target.value)}
              placeholder="e.g. 4 Pcs, Serves 2"
              className={inputCls}
            />
          </FormField>
        </div>

        {/* Category + Dietary + Tag */}
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Category" required>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </FormField>

          <FormField label="Dietary" required>
            <select value={form.dietary} onChange={(e) => set('dietary', e.target.value)} className={inputCls}>
              {DIETARY.map((d) => <option key={d}>{d}</option>)}
            </select>
            {errors.dietary && <p className="text-red-500 text-xs mt-1">{errors.dietary}</p>}
          </FormField>

          <FormField label="Tags / Badges">
            <div className="flex gap-6 pt-1">
              {TAG_OPTIONS.map((tag) => (
                <label key={tag} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.tags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="accent-orange-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-sm text-stone-700">{tag}</span>
                </label>
              ))}
            </div>
          </FormField>
        </div>

        {/* Image URL */}
        <FormField label="Image URL">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Image size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={form.img}
                onChange={(e) => set('img', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={`${inputCls} pl-9`}
              />
            </div>
            {form.img && /^https?:\/\/.+/.test(form.img) && (
              <img src={form.img} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0" referrerPolicy="no-referrer" />
            )}
          </div>
          {errors.img && <p className="text-red-500 text-xs mt-1">{errors.img}</p>}
        </FormField>

        {/* Available Days */}
        <FormField label="Available Days (When can people order this?)" required>
          <div className="flex flex-wrap gap-4 pt-1 bg-stone-50 p-4 rounded-lg border border-stone-100">
            {DAYS_OF_WEEK.map((day) => (
              <label key={day} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.availableDays?.includes(day)}
                  onChange={() => toggleDay(day)}
                  className="accent-orange-500 w-4 h-4 rounded cursor-pointer"
                />
                <span className={`text-sm font-medium ${form.availableDays?.includes(day) ? 'text-stone-900' : 'text-stone-400'}`}>
                  {day}
                </span>
              </label>
            ))}
          </div>
          {form.availableDays?.length === 0 && <p className="text-red-500 text-xs mt-1">Please select at least one day.</p>}
        </FormField>

        {/* Tiffin Service Toggle */}
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-orange-900">Tiffin Service</p>
            <p className="text-xs text-orange-700">Mark this dish to show in the "Tiffin Service" menu mode.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={form.isTiffin} 
              onChange={(e) => setForm(prev => ({ ...prev, isTiffin: e.target.checked }))}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
          <Link to="/admin/menu" className="px-4 py-2.5 border border-stone-200 rounded-lg text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Save size={15} />
            {saving ? 'Saving...' : isEdit ? 'Update Dish' : 'Add Dish'}
          </button>
        </div>
      </form>
    </div>
  );
}
