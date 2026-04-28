import React, { useState, useRef } from 'react';
import { Upload, Download, CheckCircle2, AlertCircle, FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useMenuData } from '../../context/MenuDataContext';
import { MenuItemInput } from '../../services/api';

const CSV_HEADERS = ['name', 'description', 'price', 'portion', 'category', 'dietary', 'tag', 'img'];

const SAMPLE_CSV = `name,description,price,portion,category,dietary,tag,img
Kosha Mangsho,"Slow-cooked mutton in rich Bengali spices, best with luchi.",₹900,"500 ML, Serves 2",Main Course,Non Veg,"Signature,Popular",https://images.unsplash.com/photo-1631452180519-c014fe946bc0?q=80&w=800
Cholar Dal,"Split chickpea dal cooked with coconut and spices.",₹300,"400 ML, Serves 2",Main Course,Veg,,https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800
Sandesh,"Classic Bengali sweet made from cottage cheese.",₹120,"4 Pcs, Serves 2",Desserts,Veg,Popular,https://images.unsplash.com/photo-1605197132819-d29314451009?q=80&w=800
`;

function parseCSV(text: string): { rows: MenuItemInput[]; errors: string[] } {
  const lines = text.trim().split('\n').filter((l) => l.trim());
  if (lines.length < 2) return { rows: [], errors: ['CSV must have a header row and at least one data row'] };

  const rawHeaders = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const errors: string[] = [];

  // Validate headers
  const missingHeaders = CSV_HEADERS.filter((h) => !['tag', 'img', 'description', 'portion'].includes(h) && !rawHeaders.includes(h));
  if (missingHeaders.length > 0) {
    errors.push(`Missing required columns: ${missingHeaders.join(', ')}`);
    return { rows: [], errors };
  }

  const rows: MenuItemInput[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVLine(lines[i]);
    if (values.length === 0) continue;

    const row: Record<string, string> = {};
    rawHeaders.forEach((h, idx) => {
      row[h] = (values[idx] || '').trim().replace(/^"(.*)"$/, '$1');
    });

    const rowNum = i + 1;
    if (!row.name) { errors.push(`Row ${rowNum}: "name" is required`); continue; }
    if (!row.price) { errors.push(`Row ${rowNum}: "price" is required`); continue; }
    if (!row.category) { errors.push(`Row ${rowNum}: "category" is required`); continue; }
    if (!row.dietary) { errors.push(`Row ${rowNum}: "dietary" is required`); continue; }

    const validCategories = ['starters', 'main course', 'combos', 'chatni', 'sweets', 'desserts'];
    if (!validCategories.includes(row.category.toLowerCase())) {
      errors.push(`Row ${rowNum}: category must be Starters, Main Course, Combos, Chatni, or Sweets (got "${row.category}")`);
      continue;
    }
    const validDietary = ['veg', 'non veg'];
    if (!validDietary.includes(row.dietary.toLowerCase())) {
      errors.push(`Row ${rowNum}: dietary must be Veg or Non Veg (got "${row.dietary}")`);
      continue;
    }
    const tagList = row.tag ? row.tag.split(',').map((t) => t.trim()).filter(Boolean) : [];
    const invalidTags = tagList.filter((t) => !['signature', 'popular'].includes(t.toLowerCase()));
    if (invalidTags.length > 0) {
      errors.push(`Row ${rowNum}: tag must be Signature, Popular, or "Signature,Popular" (got "${row.tag}")`);
      continue;
    }

    rows.push({
      name: row.name,
      description: row.description || '',
      price: row.price.startsWith('₹') ? row.price : `₹${row.price}`,
      portion: row.portion || '',
      category: capitalizeCategory(row.category),
      dietary: capitalizeDietary(row.dietary),
      tags: tagList.map(capitalizeFirst),
      img: row.img || '',
    });
  }

  return { rows, errors };
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function capitalizeCategory(c: string): string {
  const map: Record<string, string> = { 'starters': 'Starters', 'main course': 'Main Course', 'combos': 'Combos', 'chatni': 'Chatni', 'sweets': 'Sweets', 'desserts': 'Desserts' };
  return map[c.toLowerCase()] || c;
}

function capitalizeDietary(d: string): string {
  const map: Record<string, string> = { 'veg': 'Veg', 'non veg': 'Non Veg' };
  return map[d.toLowerCase()] || d;
}

export default function AdminCSVImport() {
  const { importItems, menuItems } = useMenuData();
  const fileRef = useRef<HTMLInputElement>(null);

  const [parsed, setParsed] = useState<MenuItemInput[] | null>(null);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [mode, setMode] = useState<'append' | 'replace'>('append');
  const [importing, setImporting] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { rows, errors } = parseCSV(text);
      setParsed(rows);
      setParseErrors(errors);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImport = async () => {
    if (!parsed || parsed.length === 0) return;

    setImporting(true);
    try {
      await importItems(parsed, mode);
      const action = mode === 'replace' ? 'replaced all dishes with' : 'imported';
      toast.success(`Successfully ${action} ${parsed.length} dish${parsed.length !== 1 ? 'es' : ''}`);
      setParsed(null);
      setFileName('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'babos_menu_sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setParsed(null);
    setParseErrors([]);
    setFileName('');
  };

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Import CSV</h1>
        <p className="text-stone-500 text-sm mt-1">Bulk upload menu items from a CSV file</p>
      </div>

      {/* Format Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <FileText size={16} />
          CSV Format Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-1">Required Columns:</p>
            <ul className="space-y-0.5 text-blue-700">
              <li><code className="bg-blue-100 px-1 rounded">name</code> — Dish name</li>
              <li><code className="bg-blue-100 px-1 rounded">price</code> — e.g. <code>₹600</code> or <code>600</code></li>
              <li><code className="bg-blue-100 px-1 rounded">category</code> — Starters / Main Course / Combos / Chatni / Sweets</li>
              <li><code className="bg-blue-100 px-1 rounded">dietary</code> — Veg / Non Veg</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Optional Columns:</p>
            <ul className="space-y-0.5 text-blue-700">
              <li><code className="bg-blue-100 px-1 rounded">description</code> — Summary text</li>
              <li><code className="bg-blue-100 px-1 rounded">portion</code> — e.g. <code>4 Pcs, Serves 2</code></li>
              <li><code className="bg-blue-100 px-1 rounded">tag</code> — Signature / Popular (or empty)</li>
              <li><code className="bg-blue-100 px-1 rounded">img</code> — Full image URL</li>
            </ul>
          </div>
        </div>
        <button
          onClick={handleDownloadSample}
          className="mt-4 flex items-center gap-2 text-blue-700 hover:text-blue-900 text-sm font-medium transition-colors"
        >
          <Download size={15} />
          Download Sample CSV
        </button>
      </div>

      {/* Upload Area */}
      {!parsed && (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-stone-300 hover:border-orange-400 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors group"
        >
          <div className="w-14 h-14 bg-stone-100 group-hover:bg-orange-100 rounded-full flex items-center justify-center mb-4 transition-colors">
            <Upload size={24} className="text-stone-400 group-hover:text-orange-500 transition-colors" />
          </div>
          <p className="font-medium text-stone-700 mb-1">Click to upload CSV file</p>
          <p className="text-sm text-stone-400">Supports .csv files</p>
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
        </div>
      )}

      {/* Parse Errors */}
      {parseErrors.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
            <AlertCircle size={16} />
            {parseErrors.length} error{parseErrors.length !== 1 ? 's' : ''} found
          </div>
          <ul className="space-y-1 text-sm text-red-700">
            {parseErrors.map((e, i) => <li key={i}>• {e}</li>)}
          </ul>
          {parsed && parsed.length > 0 && (
            <p className="text-sm text-red-600 mt-2">{parsed.length} valid row{parsed.length !== 1 ? 's' : ''} can still be imported.</p>
          )}
        </div>
      )}

      {/* Preview */}
      {parsed && parsed.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <CheckCircle2 size={18} />
              {parsed.length} row{parsed.length !== 1 ? 's' : ''} ready to import
              {fileName && <span className="text-stone-500 font-normal text-sm ml-1">from {fileName}</span>}
            </div>
            <button onClick={reset} className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors">
              <RefreshCw size={14} />
              Change file
            </button>
          </div>

          {/* Import Mode */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4">
            <p className="text-sm font-medium text-stone-700 mb-3">Import Mode</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  value="append"
                  checked={mode === 'append'}
                  onChange={() => setMode('append')}
                  className="accent-orange-500"
                />
                <div>
                  <span className="text-sm font-medium text-stone-900">Append</span>
                  <p className="text-xs text-stone-500">Add to existing {menuItems.length} dishes</p>
                </div>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  value="replace"
                  checked={mode === 'replace'}
                  onChange={() => setMode('replace')}
                  className="accent-orange-500"
                />
                <div>
                  <span className="text-sm font-medium text-stone-900">Replace All</span>
                  <p className="text-xs text-red-500">Deletes all {menuItems.length} existing dishes</p>
                </div>
              </label>
            </div>
          </div>

          {/* Preview Table */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-stone-100 text-sm font-medium text-stone-600">Preview</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    {['Name', 'Category', 'Dietary', 'Tag', 'Portion', 'Price', 'Image'].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-stone-500 font-medium text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {parsed.map((row, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-stone-900 text-xs">{row.name}</div>
                        <div className="text-stone-400 text-xs truncate max-w-[160px]">{row.description}</div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-stone-600">{row.category}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.dietary === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{row.dietary}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        {row.tags && row.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {row.tags.map((t) => (
                              <span key={t} className="px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">{t}</span>
                            ))}
                          </div>
                        ) : <span className="text-stone-300 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-stone-600">{row.portion || '—'}</td>
                      <td className="px-4 py-2.5 text-xs font-semibold text-stone-900">{row.price}</td>
                      <td className="px-4 py-2.5">
                        {row.img ? (
                          <img src={row.img} alt={row.name} className="w-8 h-8 rounded object-cover" referrerPolicy="no-referrer" />
                        ) : <span className="text-stone-300 text-xs">No image</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={reset} className="px-4 py-2.5 border border-stone-200 rounded-lg text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Upload size={15} />
              {importing ? 'Importing...' : `Import ${parsed.length} Dish${parsed.length !== 1 ? 'es' : ''}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
