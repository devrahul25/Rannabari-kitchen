import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { api, MenuItem, MenuItemInput } from '../services/api';

const PREFERRED_FILTER_ORDER = ['Breakfast', 'Lunch', 'Dinner', 'Starters', 'Main Course', 'Combos', 'Chatni', 'Sweets', 'Signature', 'Popular'];

interface MenuDataContextType {
  menuItems: MenuItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addItem: (data: MenuItemInput) => Promise<MenuItem>;
  updateItem: (id: number, data: MenuItemInput) => Promise<MenuItem>;
  deleteItem: (id: number) => Promise<void>;
  importItems: (items: MenuItemInput[], mode: 'append' | 'replace') => Promise<void>;
}

const MenuDataContext = createContext<MenuDataContextType | undefined>(undefined);

export function MenuDataProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMenus();
      setMenuItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const categories = useMemo(() => {
    const found = new Set<string>();
    menuItems.forEach((item) => {
      if (item.dietary) found.add(item.dietary);
      if (item.category) found.add(item.category);
      item.tags?.forEach((t) => found.add(t));
    });
    const ordered = PREFERRED_FILTER_ORDER.filter((f) => found.has(f));
    found.forEach((f) => { if (!PREFERRED_FILTER_ORDER.includes(f)) ordered.push(f); });
    return ordered;
  }, [menuItems]);

  const addItem = useCallback(async (data: MenuItemInput) => {
    const created = await api.createMenu(data);
    setMenuItems((prev) => [...prev, created]);
    return created;
  }, []);

  const updateItem = useCallback(async (id: number, data: MenuItemInput) => {
    const updated = await api.updateMenu(id, data);
    setMenuItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, []);

  const deleteItem = useCallback(async (id: number) => {
    await api.deleteMenu(id);
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const importItems = useCallback(async (items: MenuItemInput[], mode: 'append' | 'replace') => {
    const result = await api.importMenus(items, mode);
    setMenuItems(result.menus);
  }, []);

  return (
    <MenuDataContext.Provider value={{ menuItems, categories, loading, error, refresh: fetchMenus, addItem, updateItem, deleteItem, importItems }}>
      {children}
    </MenuDataContext.Provider>
  );
}

export function useMenuData() {
  const ctx = useContext(MenuDataContext);
  if (!ctx) throw new Error('useMenuData must be used within MenuDataProvider');
  return ctx;
}
