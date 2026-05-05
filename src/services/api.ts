export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  portion: string;
  category: string;
  dietary: string;
  tags: string[];        // e.g. ["Signature", "Popular"]
  img: string;
  availableDays: string[];
  isTiffin: boolean;
}

export type MenuItemInput = Omit<MenuItem, 'id'>;

export interface GalleryImage {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

export interface OrderItem {
  id: string | number;
  name: string;
  price: string;
  quantity: number;
}

export interface OrderSubmission {
  customer_name: string;
  customer_mobile: string;
  delivery_type: string;
  delivery_date: string;
  delivery_time: string;
  address?: string;
  items: OrderItem[];
  subtotal: number;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_mobile: string;
  delivery_type: string;
  delivery_date: string;
  delivery_time: string;
  address: string | null;
  items: OrderItem[];
  subtotal: number;
  created_at: string;
  status: 'pending' | 'delivered' | 'rejected';
  archived: 0 | 1;
}

export interface OrderUser {
  name: string;
  mobile: string;
}

export interface SeoSetting {
  id: number;
  page_path: string;
  page_label: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image: string | null;
  updated_at: string;
}

function getToken(): string | null {
  return sessionStorage.getItem('babos_admin_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({ error: 'Invalid server response' }));

  if (!res.ok) {
    if (res.status === 401) {
      sessionStorage.removeItem('babos_admin_token');
      sessionStorage.removeItem('babos_admin_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Public
  getMenus: () => request<MenuItem[]>('/menus'),

  // Auth
  login: (username: string, password: string) =>
    request<{ token: string; username: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // Admin — Menu CRUD
  createMenu: (data: MenuItemInput) =>
    request<MenuItem>('/menus', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateMenu: (id: number, data: MenuItemInput) =>
    request<MenuItem>(`/menus/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteMenu: (id: number) =>
    request<{ success: boolean }>(`/menus/${id}`, { method: 'DELETE' }),

  importMenus: (items: MenuItemInput[], mode: 'append' | 'replace') =>
    request<{ imported: number; total: number; menus: MenuItem[] }>('/menus/import', {
      method: 'POST',
      body: JSON.stringify({ items, mode }),
    }),

  // Gallery
  listGallery: () => request<GalleryImage[]>('/gallery'),
  
  listGalleryPublic: () => request<GalleryImage[]>('/gallery/public'),

  uploadImage: async (file: File, replace = false): Promise<GalleryImage> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`/api/gallery/upload${replace ? '?replace=true' : ''}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json().catch(() => ({ error: 'Invalid server response' }));
    if (!res.ok) {
      const err = new Error(data.error || `Upload failed (${res.status})`);
      (err as any).status = res.status;
      (err as any).data = data;
      throw err;
    }
    return data as GalleryImage;
  },

  deleteImage: (filename: string) =>
    request<{ success: boolean }>(`/gallery/${encodeURIComponent(filename)}`, { method: 'DELETE' }),

  // Orders
  submitOrder: (data: OrderSubmission) =>
    request<{ id: number; success: boolean }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getOrders: () => request<Order[]>('/orders'),

  getArchivedOrders: () => request<Order[]>('/orders?archived=1'),

  updateOrderStatus: (id: number, status: 'pending' | 'delivered' | 'rejected') =>
    request<{ success: boolean; status: string }>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  archiveOrder: (id: number, archived: 0 | 1) =>
    request<{ success: boolean }>(`/orders/${id}/archive`, {
      method: 'PATCH',
      body: JSON.stringify({ archived }),
    }),

  updateOrderItems: (id: number, items: OrderItem[], subtotal: number) =>
    request<{ success: boolean }>(`/orders/${id}/items`, {
      method: 'PATCH',
      body: JSON.stringify({ items, subtotal }),
    }),

  getOrderUsers: () => request<OrderUser[]>('/orders/users'),

  // SEO
  getSeoSettings: () => request<SeoSetting[]>('/seo'),

  updateSeoSetting: (id: number, data: Partial<Pick<SeoSetting, 'meta_title' | 'meta_description' | 'meta_keywords' | 'og_image'>>) =>
    request<SeoSetting>(`/seo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  createSeoSetting: (data: Pick<SeoSetting, 'page_path' | 'page_label'> & Partial<Pick<SeoSetting, 'meta_title' | 'meta_description' | 'meta_keywords' | 'og_image'>>) =>
    request<SeoSetting>('/seo', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteSeoSetting: (id: number) =>
    request<{ success: boolean }>(`/seo/${id}`, { method: 'DELETE' }),
};
