import React, { useEffect, useState } from 'react';
import { Search, Globe, Plus, Trash2, X, ExternalLink, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { api, SeoSetting } from '../../services/api';

const CHAR_LIMITS = {
  meta_title: 60,
  meta_description: 160,
  meta_keywords: 200,
};

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const color = len > max ? 'text-red-500' : len > max * 0.9 ? 'text-yellow-500' : 'text-stone-400';
  return <span className={`text-xs ${color}`}>{len}/{max}</span>;
}

interface EditState {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
}

export default function AdminSEO() {
  const [pages, setPages] = useState<SeoSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditState>({ meta_title: '', meta_description: '', meta_keywords: '', og_image: '' });
  const [saving, setSaving] = useState(false);

  // Add new page modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPage, setNewPage] = useState({ page_path: '', page_label: '' });

  useEffect(() => { load(); }, []);

  const load = () => {
    setLoading(true);
    api.getSeoSettings()
      .then(setPages)
      .catch(() => toast.error('Failed to load SEO settings'))
      .finally(() => setLoading(false));
  };

  const startEdit = (page: SeoSetting) => {
    setEditingId(page.id);
    setEditState({
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || '',
      og_image: page.og_image || '',
    });
  };

  const cancelEdit = () => { setEditingId(null); };

  const handleSave = async (id: number) => {
    setSaving(true);
    try {
      const updated = await api.updateSeoSetting(id, {
        meta_title: editState.meta_title || undefined,
        meta_description: editState.meta_description || undefined,
        meta_keywords: editState.meta_keywords || undefined,
        og_image: editState.og_image || undefined,
      });
      setPages((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
      toast.success('SEO settings saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async (id: number) => {
    if (!confirm('Clear all SEO fields for this page? Default values will be used.')) return;
    setSaving(true);
    try {
      const updated = await api.updateSeoSetting(id, { meta_title: undefined, meta_description: undefined, meta_keywords: undefined, og_image: undefined });
      setPages((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
      toast.success('Reset to defaults');
    } catch {
      toast.error('Failed to reset');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPage = async () => {
    if (!newPage.page_path || !newPage.page_label) {
      toast.error('Path and label are required');
      return;
    }
    try {
      const created = await api.createSeoSetting({ page_path: newPage.page_path, page_label: newPage.page_label });
      setPages((prev) => [...prev, created]);
      setShowAddModal(false);
      setNewPage({ page_path: '', page_label: '' });
      toast.success('Page added');
    } catch (e: any) {
      toast.error(e.message || 'Failed to add page');
    }
  };

  const handleDelete = async (id: number, label: string) => {
    if (!confirm(`Delete SEO entry for "${label}"? This cannot be undone.`)) return;
    try {
      await api.deleteSeoSetting(id);
      setPages((prev) => prev.filter((p) => p.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = pages.filter((p) =>
    p.page_label.toLowerCase().includes(search.toLowerCase()) ||
    p.page_path.toLowerCase().includes(search.toLowerCase())
  );

  const isSet = (p: SeoSetting) => !!(p.meta_title || p.meta_description || p.meta_keywords || p.og_image);

  return (
    <div className="p-8 w-full">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">SEO Settings</h1>
          <p className="text-stone-500 text-sm mt-1">Manage meta titles, descriptions, keywords and OG images per page</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
        >
          <Plus size={16} />
          Add Custom Page
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-500">Total Pages</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{pages.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-500">Configured</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{pages.filter(isSet).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-500">Using Defaults</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pages.filter((p) => !isSet(p)).length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search pages…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Pages list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((page) => (
            <div key={page.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
              {/* Page header row */}
              <div className="flex items-center justify-between px-5 py-4 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                    <Globe size={16} className="text-orange-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm">{page.page_label}</span>
                      {isSet(page) ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Configured</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 font-medium">Default</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-stone-400 font-mono">{page.page_path}</span>
                      <a
                        href={page.page_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-300 hover:text-orange-500 transition-colors"
                        title="Open page"
                      >
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {editingId !== page.id && (
                    <>
                      <button
                        onClick={() => startEdit(page)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 text-stone-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(page.id, page.page_label)}
                        className="p-1.5 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Inline edit form */}
              {editingId === page.id && (
                <div className="border-t border-stone-100 px-5 py-5 bg-stone-50 space-y-4">
                  {/* Meta Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-stone-700">Meta Title</label>
                      <CharCount value={editState.meta_title} max={CHAR_LIMITS.meta_title} />
                    </div>
                    <input
                      type="text"
                      value={editState.meta_title}
                      onChange={(e) => setEditState((s) => ({ ...s, meta_title: e.target.value }))}
                      placeholder="Leave blank to use default"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                    <p className="text-xs text-stone-400 mt-1">Recommended: 50–60 characters</p>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-stone-700">Meta Description</label>
                      <CharCount value={editState.meta_description} max={CHAR_LIMITS.meta_description} />
                    </div>
                    <textarea
                      value={editState.meta_description}
                      onChange={(e) => setEditState((s) => ({ ...s, meta_description: e.target.value }))}
                      placeholder="Leave blank to use default"
                      rows={3}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white resize-none"
                    />
                    <p className="text-xs text-stone-400 mt-1">Recommended: 120–160 characters</p>
                  </div>

                  {/* Meta Keywords */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-stone-700">Meta Keywords</label>
                      <CharCount value={editState.meta_keywords} max={CHAR_LIMITS.meta_keywords} />
                    </div>
                    <input
                      type="text"
                      value={editState.meta_keywords}
                      onChange={(e) => setEditState((s) => ({ ...s, meta_keywords: e.target.value }))}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                  </div>

                  {/* OG Image */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">OG Image URL</label>
                    <input
                      type="url"
                      value={editState.og_image}
                      onChange={(e) => setEditState((s) => ({ ...s, og_image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                    {editState.og_image && (
                      <img
                        src={editState.og_image}
                        alt="OG preview"
                        className="mt-2 h-24 w-auto rounded-lg border border-stone-200 object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                  </div>

                  {/* SERP Preview */}
                  {(editState.meta_title || editState.meta_description) && (
                    <div className="bg-white border border-stone-200 rounded-lg p-4">
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">SERP Preview</p>
                      <p className="text-blue-600 text-base font-medium leading-tight truncate">
                        {editState.meta_title || '(default title)'}
                      </p>
                      <p className="text-green-700 text-xs mt-0.5">baboshomekitchen.in{page.page_path}</p>
                      <p className="text-stone-600 text-sm mt-1 line-clamp-2">
                        {editState.meta_description || '(default description)'}
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => handleSave(page.id)}
                      disabled={saving}
                      className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 transition-colors"
                    >
                      <Save size={14} />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-2 bg-white border border-stone-200 text-stone-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReset(page.id)}
                      disabled={saving}
                      className="flex items-center gap-2 bg-white border border-stone-200 text-stone-500 px-4 py-2 rounded-lg text-sm font-medium hover:border-red-300 hover:text-red-600 transition-colors ml-auto"
                    >
                      <RotateCcw size={14} />
                      Reset to Default
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Page Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-stone-900">Add Custom Page</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Page Path</label>
                <input
                  type="text"
                  value={newPage.page_path}
                  onChange={(e) => setNewPage((p) => ({ ...p, page_path: e.target.value }))}
                  placeholder="/your-page-path"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Page Label</label>
                <input
                  type="text"
                  value={newPage.page_label}
                  onChange={(e) => setNewPage((p) => ({ ...p, page_label: e.target.value }))}
                  placeholder="My Page"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 border border-stone-200 text-stone-600 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPage}
                className="flex-1 bg-orange-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                Add Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
