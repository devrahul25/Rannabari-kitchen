import React, { useEffect, useRef, useState } from 'react';
import { Images, Upload, Copy, Trash2, Check, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import { api, GalleryImage } from '../../services/api';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState<{ file: File; filename: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      const data = await api.listGallery();
      setImages(data);
    } catch {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const uploadFile = async (file: File, replace = false) => {
    try {
      await api.uploadImage(file, replace);
      toast.success(`${file.name} uploaded`);
      await fetchImages();
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('409')) {
        setDuplicateInfo({ file, filename: file.name });
      } else {
        toast.error(err instanceof Error ? err.message : 'Upload failed');
      }
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    setUploading(true);
    for (const file of list) {
      await uploadFile(file);
    }
    setUploading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleReplaceConfirm = async () => {
    if (!duplicateInfo) return;
    const { file } = duplicateInfo;
    setDuplicateInfo(null);
    setUploading(true);
    await uploadFile(file, true);
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await api.deleteImage(target.filename);
      setImages((prev) => prev.filter((img) => img.filename !== target.filename));
      toast.success(`${target.filename} deleted`);
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleCopy = (url: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedUrl(url);
      toast.success('URL copied to clipboard');
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Gallery</h1>
        <p className="text-stone-500 text-sm mt-1">Upload and manage menu images. Copy URLs to use in dish entries.</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors mb-8 ${
          dragOver
            ? 'border-orange-400 bg-orange-50'
            : 'border-stone-300 hover:border-orange-400 bg-white hover:bg-orange-50'
        }`}
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${dragOver ? 'bg-orange-100' : 'bg-stone-100'}`}>
          <Upload size={24} className={`transition-colors ${dragOver ? 'text-orange-500' : 'text-stone-400'}`} />
        </div>
        <p className="font-medium text-stone-700 mb-1">
          {uploading ? 'Uploading…' : 'Drag & drop images or PDFs here, or click to select'}
        </p>
        <p className="text-sm text-stone-400">PNG, JPG, WEBP, GIF, SVG, PDF supported</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.svg,.pdf"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <Images size={48} className="mx-auto mb-4 opacity-40" />
          <p className="font-medium">No images yet</p>
          <p className="text-sm">Upload your first image above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {images.map((img) => (
            <div
              key={img.filename}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square bg-stone-100">
                <img
                  src={img.url}
                  alt={img.filename}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopy(img.url); }}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-orange-50 transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === img.url ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <Copy size={14} className="text-stone-700" />
                    )}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(img); }}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-stone-700 font-medium truncate" title={img.filename}>{img.filename}</p>
                <p className="text-xs text-stone-400">{formatBytes(img.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Duplicate modal */}
      {duplicateInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">File already exists</h3>
                <p className="text-sm text-stone-500 mt-1">
                  <span className="font-medium text-stone-700">{duplicateInfo.filename}</span> is already in the gallery. Do you want to replace it?
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDuplicateInfo(null)}
                className="px-4 py-2 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReplaceConfirm}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">Delete image?</h3>
                <p className="text-sm text-stone-500 mt-1">
                  <span className="font-medium text-stone-700">{deleteTarget.filename}</span> will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
