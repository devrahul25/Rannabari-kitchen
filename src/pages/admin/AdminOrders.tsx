import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Download,
  Users,
  ChevronDown,
  ChevronUp,
  Phone,
  User,
  MapPin,
  Calendar,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Archive,
  ArchiveRestore,
  Pencil,
  Trash2,
  Plus,
  Minus,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { api, Order, OrderUser } from '../../services/api';
import { useMenuData } from '../../context/MenuDataContext';
import AdminOrderInvoice from './AdminOrderInvoice';

function formatDate(iso: string) {
  // SQLite CURRENT_TIMESTAMP is UTC but has no timezone marker.
  // Normalise to ISO-8601 with 'Z' so browsers parse it as UTC correctly.
  const normalized = iso.includes('T') ? iso : iso.replace(' ', 'T') + 'Z';
  return new Date(normalized).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function escapeCSV(val: string | number | null | undefined): string {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

interface Filters {
  year: string;
  month: string;
  category: string; // delivery type
  status: string;
  itemCategory: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({ year: 'all', month: 'all', category: 'all', status: 'all', itemCategory: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [editItems, setEditItems] = useState<import('../../services/api').OrderItem[]>([]);
  const [addItemId, setAddItemId] = useState<string>('');
  const [itemSearch, setItemSearch] = useState('');
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const itemsPerPage = 10;

  const { menuItems } = useMenuData();

  useEffect(() => {
    loadOrders(activeTab);
  }, [activeTab]);

  const loadOrders = (tab: 'active' | 'archived' = activeTab) => {
    setLoading(true);
    (tab === 'archived' ? api.getArchivedOrders() : api.getOrders())
      .then(setOrders)
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  // Extract unique years from orders
  const years = Array.from(new Set(orders.map((o) => new Date(o.created_at).getFullYear()))).sort((a, b) => b - a);

  // Apply filters
  const filtered = orders.filter((o) => {
    // Search
    const matchesSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) || o.customer_mobile.includes(search);
    if (!matchesSearch) return false;

    // Year filter
    if (filters.year !== 'all') {
      const orderYear = new Date(o.created_at).getFullYear();
      if (orderYear !== parseInt(filters.year)) return false;
    }

    // Month filter
    if (filters.month !== 'all') {
      const orderMonth = new Date(o.created_at).getMonth();
      if (orderMonth !== parseInt(filters.month)) return false;
    }

    // Category (delivery type) filter
    if (filters.category !== 'all' && o.delivery_type !== filters.category) return false;

    // Item category filter
    if (filters.itemCategory !== 'all') {
      const orderItemIds = new Set(o.items.map(i => String(i.id)));
      const hasCategory = menuItems.some(
        m => orderItemIds.has(String(m.id)) && m.category === filters.itemCategory
      );
      if (!hasCategory) return false;
    }

    // Status filter
    if (filters.status !== 'all' && o.status !== filters.status) return false;

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedOrders = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, search]);

  const handleExportUsers = async () => {
    try {
      const users: OrderUser[] = await api.getOrderUsers();
      const headers = ['Name', 'Mobile'];
      const rows = users.map(u => [escapeCSV(u.name), escapeCSV(u.mobile)].join(','));
      const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `babos_customers_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Exported ${users.length} unique customer${users.length !== 1 ? 's' : ''}`);
    } catch {
      toast.error('Failed to export users');
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: 'pending' | 'delivered' | 'rejected') => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      toast.success(`Order #${orderId} marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update order status');
    }
  };

  const handleArchive = async (orderId: number, archive: boolean) => {
    try {
      await api.archiveOrder(orderId, archive ? 1 : 0);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setExpandedId(null);
      toast.success(archive ? `Order #${orderId} archived` : `Order #${orderId} restored to active`);
    } catch {
      toast.error('Failed to update order');
    }
  };

  const updateEditItemQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setEditItems((prev) => prev.filter((_, i) => i !== index));
    } else {
      setEditItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity: newQty } : item)));
    }
  };

  const handleAddItemToEdit = () => {
    if (!addItemId) return;
    const menuItem = menuItems.find((m) => String(m.id) === addItemId);
    if (!menuItem) return;
    setEditItems((prev) => {
      const existing = prev.findIndex((i) => String(i.id) === addItemId);
      if (existing >= 0) {
        return prev.map((item, i) => (i === existing ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 }];
    });
    setAddItemId('');
  };

  const handleSaveEdit = async () => {
    if (!editOrder) return;
    const subtotal = editItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(price) ? 0 : price * item.quantity);
    }, 0);
    try {
      await api.updateOrderItems(editOrder.id, editItems, subtotal);
      setOrders((prev) =>
        prev.map((o) => (o.id === editOrder.id ? { ...o, items: editItems, subtotal } : o))
      );
      setEditOrder(null);
      setItemSearch('');
      toast.success(`Order #${editOrder.id} updated`);
    } catch {
      toast.error('Failed to update order');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
            <CheckCircle size={12} />
            Delivered
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">
            <XCircle size={12} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">
            <AlertCircle size={12} />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="p-8 w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Orders</h1>
          <p className="text-stone-500 text-sm mt-1">Customer orders submitted from the cart</p>
        </div>
        <button
          onClick={handleExportUsers}
          className="flex items-center gap-2 bg-white border border-stone-200 hover:border-orange-300 hover:text-orange-600 text-stone-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Users size={16} />
          Export Unique Customers
          <Download size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setActiveTab('active'); setExpandedId(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'active'
              ? 'bg-orange-600 text-white'
              : 'bg-white border border-stone-200 text-stone-600 hover:border-orange-300 hover:text-orange-600'
          }`}
        >
          <ShoppingBag size={15} />
          Active Orders
        </button>
        <button
          onClick={() => { setActiveTab('archived'); setExpandedId(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'archived'
              ? 'bg-stone-700 text-white'
              : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-800'
          }`}
        >
          <Archive size={15} />
          Archived
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-500">Total Orders</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {orders.filter((o) => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-500">Delivered</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {orders.filter((o) => o.status === 'delivered').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-500">Total Revenue</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">
            ₹{orders.reduce((s, o) => s + (o.subtotal || 0), 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-xl border border-stone-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-stone-400" />
          <h3 className="font-semibold text-stone-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* Year */}
          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Month */}
          <select
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Months</option>
            {[
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ].map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>

          {/* Category (Delivery Type) */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Types</option>
            <option value="delivery">Delivery</option>
            <option value="takeaway">Takeaway</option>
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Item Category */}
          <select
            value={filters.itemCategory}
            onChange={(e) => setFilters({ ...filters, itemCategory: e.target.value })}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">All Categories</option>
            {['Starters', 'Main Course', 'Chatni', 'Sweets', 'Desserts', 'Combo'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        {(search || filters.year !== 'all' || filters.month !== 'all' || filters.category !== 'all' || filters.status !== 'all' || filters.itemCategory !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setFilters({ year: 'all', month: 'all', category: 'all', status: 'all', itemCategory: 'all' });
            }}
            className="mt-3 text-xs text-orange-600 hover:text-orange-700 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-400 bg-white rounded-xl border border-stone-200">
          <ShoppingBag size={48} className="mx-auto mb-4 opacity-40" />
          <p className="font-medium">{search || filters.year !== 'all' || filters.month !== 'all' || filters.category !== 'all' || filters.status !== 'all' ? 'No matching orders' : 'No orders yet'}</p>
          <p className="text-sm">Orders will appear here once customers submit from the cart</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedOrders.map((order) => (
            <div key={order.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
              {/* Row header */}
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-stone-50 transition-colors"
              >
                <span className="text-xs font-mono text-stone-400 w-10 shrink-0">#{order.id}</span>

                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-stone-900 truncate">
                    <User size={13} className="text-stone-400 shrink-0" />
                    {order.customer_name}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-stone-500">
                    <Phone size={13} className="text-stone-400 shrink-0" />
                    {order.customer_mobile}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-stone-500">
                    <Calendar size={13} className="text-stone-400 shrink-0" />
                    {order.delivery_date} · {order.delivery_time}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {getStatusBadge(order.status)}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.delivery_type === 'delivery' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {order.delivery_type === 'delivery' ? 'Delivery' : 'Takeaway'}
                  </span>
                  <span className="text-sm font-bold text-stone-900">₹{order.subtotal}</span>
                  {expandedId === order.id ? (
                    <ChevronUp size={16} className="text-stone-400" />
                  ) : (
                    <ChevronDown size={16} className="text-stone-400" />
                  )}
                </div>
              </button>

              {/* Expanded details */}
              {expandedId === order.id && (
                <div className="border-t border-stone-100 px-5 py-4 bg-stone-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2 text-sm">
                      <h4 className="font-semibold text-stone-700 mb-2">Customer Details</h4>
                      <div className="flex items-start gap-2 text-stone-600">
                        <User size={14} className="mt-0.5 shrink-0 text-stone-400" />
                        <span>{order.customer_name}</span>
                      </div>
                      <div className="flex items-start gap-2 text-stone-600">
                        <Phone size={14} className="mt-0.5 shrink-0 text-stone-400" />
                        <span>{order.customer_mobile}</span>
                      </div>
                      {order.address && (
                        <div className="flex items-start gap-2 text-stone-600">
                          <MapPin size={14} className="mt-0.5 shrink-0 text-stone-400" />
                          <span className="break-all">{order.address}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2 text-stone-600">
                        <Clock size={14} className="mt-0.5 shrink-0 text-stone-400" />
                        <span>Submitted: {formatDate(order.created_at)}</span>
                      </div>
                    </div>

                    <div className="text-sm">
                      <h4 className="font-semibold text-stone-700 mb-2">Order Items</h4>
                      <div className="space-y-1.5">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-stone-600">
                            <span>
                              {item.quantity}× {item.name}
                            </span>
                            <span className="font-medium text-stone-800">
                              ₹{(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200">
                          <span>Subtotal</span>
                          <span>₹{order.subtotal}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-stone-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-stone-600">Status:</span>
                      <button
                        onClick={() => handleStatusChange(order.id, 'pending')}
                        disabled={order.status === 'pending'}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 cursor-default'
                            : 'bg-white border border-stone-200 text-stone-600 hover:border-yellow-400 hover:text-yellow-700'
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, 'delivered')}
                        disabled={order.status === 'delivered'}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-white border border-stone-200 text-stone-600 hover:border-green-400 hover:text-green-700'
                        }`}
                      >
                        Delivered
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, 'rejected')}
                        disabled={order.status === 'rejected'}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          order.status === 'rejected'
                            ? 'bg-red-100 text-red-700 cursor-default'
                            : 'bg-white border border-stone-200 text-stone-600 hover:border-red-400 hover:text-red-700'
                        }`}
                      >
                        Rejected
                      </button>
                    </div>

                    <button
                      onClick={() => setInvoiceOrder(order)}
                      className="flex items-center gap-2 bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                    >
                      <FileText size={14} />
                      Generate Invoice
                    </button>
                    <button
                      onClick={() => { setEditOrder(order); setEditItems([...order.items]); setAddItemId(''); setItemSearch(''); }}
                      disabled={order.status === 'delivered'}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        order.status === 'delivered'
                          ? 'bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed'
                          : 'bg-white border border-stone-200 text-stone-600 hover:border-blue-400 hover:text-blue-600'
                      }`}
                      title={order.status === 'delivered' ? 'Cannot edit a delivered order' : 'Edit items'}
                    >
                      <Pencil size={14} />
                      Edit Items
                    </button>
                    {activeTab === 'active' ? (
                      <button
                        onClick={() => handleArchive(order.id, true)}
                        className="flex items-center gap-2 bg-white border border-stone-200 text-stone-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:border-stone-400 hover:text-stone-800 transition-colors"
                      >
                        <Archive size={14} />
                        Archive
                      </button>
                    ) : (
                      <button
                        onClick={() => handleArchive(order.id, false)}
                        className="flex items-center gap-2 bg-white border border-stone-200 text-stone-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:border-orange-400 hover:text-orange-600 transition-colors"
                      >
                        <ArchiveRestore size={14} />
                        Unarchive
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between bg-white rounded-xl border border-stone-200 px-5 py-3">
              <div className="text-sm text-stone-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of{' '}
                {filtered.length} orders
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                  {(() => {
                    // Show at most 5 page buttons: always show first, last, current ±1, with ellipsis gaps
                    const pages: (number | '...')[] = [];
                    const delta = 1;
                    const left = currentPage - delta;
                    const right = currentPage + delta;
                    let last = 0;
                    for (let p = 1; p <= totalPages; p++) {
                      if (p === 1 || p === totalPages || (p >= left && p <= right)) {
                        if (last && p - last > 1) pages.push('...');
                        pages.push(p);
                        last = p;
                      }
                    }
                    return pages.map((page, idx) =>
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="w-8 text-center text-stone-400 text-sm select-none">…</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page as number)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-orange-600 text-white'
                              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    );
                  })()}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Invoice Modal */}
      {invoiceOrder && <AdminOrderInvoice order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}

      {/* Edit Items Modal */}
      {editOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditOrder(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <div>
                <h2 className="text-base font-bold text-stone-900">Edit Order #{editOrder.id}</h2>
                <p className="text-xs text-stone-400 mt-0.5">{editOrder.customer_name} · {editOrder.customer_mobile}</p>
              </div>
              <button
                onClick={() => setEditOrder(null)}
                className="w-8 h-8 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-2">
              {editItems.length === 0 && (
                <p className="text-stone-400 text-sm text-center py-6">No items — add one below.</p>
              )}
              {editItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{item.name}</p>
                    <p className="text-xs text-stone-400">{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => updateEditItemQty(i, item.quantity - 1)}
                      className={`w-7 h-7 rounded-md flex items-center justify-center border transition-colors ${
                        item.quantity === 1
                          ? 'border-red-200 bg-white text-red-500 hover:bg-red-50'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-orange-300'
                      }`}
                    >
                      {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                    </button>
                    <span className="w-7 text-center text-sm font-bold text-stone-900">{item.quantity}</span>
                    <button
                      onClick={() => updateEditItemQty(i, item.quantity + 1)}
                      className="w-7 h-7 rounded-md border border-stone-200 bg-white text-stone-600 flex items-center justify-center hover:border-orange-300 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-stone-800 w-16 text-right shrink-0">
                    ₹{(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}

              {/* Add item — searchable */}
              <div className="pt-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search menu item to add…"
                    value={itemSearch}
                    onChange={(e) => { setItemSearch(e.target.value); setAddItemId(''); setShowItemDropdown(true); }}
                    onFocus={() => setShowItemDropdown(true)}
                    onBlur={() => setTimeout(() => setShowItemDropdown(false), 150)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  {showItemDropdown && itemSearch.length > 0 && (() => {
                    const results = menuItems.filter((m) =>
                      m.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
                      m.category.toLowerCase().includes(itemSearch.toLowerCase())
                    ).slice(0, 8);
                    if (results.length === 0) return (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg py-2 px-3 text-sm text-stone-400">
                        No items found
                      </div>
                    );
                    return (
                      <ul className="absolute z-10 w-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg overflow-y-auto max-h-48">
                        {results.map((m) => (
                          <li
                            key={m.id}
                            onMouseDown={() => {
                              setAddItemId(String(m.id));
                              setItemSearch(m.name);
                              setShowItemDropdown(false);
                            }}
                            className="flex items-center justify-between px-3 py-2 text-sm hover:bg-orange-50 cursor-pointer"
                          >
                            <span className="font-medium text-stone-800 truncate mr-2">{m.name}</span>
                            <span className="text-stone-400 shrink-0">{m.price}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  })()}
                </div>
                <button
                  onClick={() => { handleAddItemToEdit(); setItemSearch(''); }}
                  disabled={!addItemId}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={14} />
                  Add to Order
                </button>
              </div>

              {/* Running total */}
              <div className="flex justify-between items-center pt-3 border-t border-stone-200 font-bold text-stone-900">
                <span>New Subtotal</span>
                <span>
                  ₹{editItems.reduce((sum, item) => {
                    const p = parseFloat(item.price.replace(/[^0-9.]/g, ''));
                    return sum + (isNaN(p) ? 0 : p * item.quantity);
                  }, 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-stone-100">
              <button
                onClick={() => setEditOrder(null)}
                className="flex-1 px-4 py-2.5 border border-stone-200 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
