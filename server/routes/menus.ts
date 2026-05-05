import { Router, Request, Response } from 'express';
import { getDb } from '../db.js';
import { authenticateAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Map DB row (tag TEXT) → API shape (tags string[])
// Map DB row → API shape
function mapRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    price: row.price,
    portion: row.portion || '',
    category: row.category,
    dietary: row.dietary,
    img: row.img || '',
    tags: (row.tag || '').split(',').map((t: string) => t.trim()).filter(Boolean),
    availableDays: (row.available_days || '').split(',').map((d: string) => d.trim()).filter(Boolean),
    isTiffin: row.is_tiffin === 1 || row.is_tiffin === '1' || row.is_tiffin === true || row.is_tiffin === 'true',
  };
}

// Serialize tags[] → comma-separated DB string
function serializeTags(tags: unknown): string | null {
  if (Array.isArray(tags)) {
    const val = (tags as string[]).filter(Boolean).join(',');
    return val || null;
  }
  if (typeof tags === 'string') return tags || null;
  return null;
}

function serializeDays(days: unknown): string | null {
  if (Array.isArray(days)) {
    return (days as string[]).filter(Boolean).join(',') || null;
  }
  if (typeof days === 'string') return days || null;
  return null;
}

// Public: Get all menus
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM menus ORDER BY id ASC').all() as Record<string, unknown>[];
    res.json(rows.map((r) => mapRow(r)));
  } catch (err) {
    console.error('Get menus error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Create a menu
router.post('/', authenticateAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, description, price, portion, category, dietary, tags, img, availableDays, isTiffin } = req.body;

  if (!name || !price || !category || !dietary) {
    res.status(400).json({ error: 'name, price, category, and dietary are required' });
    return;
  }

  try {
    const db = getDb();
    const result = db.prepare(
      'INSERT INTO menus (name, description, price, portion, category, dietary, tag, img, available_days, is_tiffin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(
      name, 
      description || '', 
      price, 
      portion || '', 
      category, 
      dietary, 
      serializeTags(tags), 
      img || '', 
      serializeDays(availableDays), 
      (isTiffin === true || isTiffin === 'true' || isTiffin === 1) ? 1 : 0
    );
    const created = db.prepare('SELECT * FROM menus WHERE id = ?').get(Number(result.lastInsertRowid)) as Record<string, unknown>;
    res.status(201).json(mapRow(created));
  } catch (err) {
    console.error('Create menu error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update a menu
router.put('/:id', authenticateAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description, price, portion, category, dietary, tags, img, availableDays, isTiffin } = req.body;

  if (!name || !price || !category || !dietary) {
    res.status(400).json({ error: 'name, price, category, and dietary are required' });
    return;
  }

  try {
    const db = getDb();
    console.log(`Updating menu ${id}. Body:`, JSON.stringify(req.body));
    const existing = db.prepare('SELECT id FROM menus WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }

    const result = db.prepare(
      'UPDATE menus SET name=?, description=?, price=?, portion=?, category=?, dietary=?, tag=?, img=?, available_days=?, is_tiffin=? WHERE id=?'
    ).run(
      name, 
      description || '', 
      price, 
      portion || '', 
      category, 
      dietary, 
      serializeTags(tags), 
      img || '', 
      serializeDays(availableDays), 
      (isTiffin === true || isTiffin === 'true' || isTiffin === 1) ? 1 : 0, 
      id
    );
    console.log(`Update result for item ${id}:`, result);
    const updated = db.prepare('SELECT * FROM menus WHERE id = ?').get(id) as Record<string, unknown>;
    res.json(mapRow(updated));
  } catch (err) {
    console.error('Update menu error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete a menu
router.delete('/:id', authenticateAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const db = getDb();
    const existing = db.prepare('SELECT id FROM menus WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({ error: 'Menu item not found' });
      return;
    }

    db.prepare('DELETE FROM menus WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete menu error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Bulk import menus
router.post('/import', authenticateAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const { items, mode } = req.body as {
    items: Array<{ name: string; description?: string; price: string; portion?: string; category: string; dietary: string; tags?: string[]; img?: string; availableDays?: string[]; isTiffin?: boolean }>;
    mode: 'append' | 'replace';
  };

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'items array is required and must not be empty' });
    return;
  }

  for (const item of items) {
    if (!item.name || !item.price || !item.category || !item.dietary) {
      res.status(400).json({ error: `Invalid item "${item.name || '?'}": name, price, category, and dietary are required.` });
      return;
    }
  }

  try {
    const db = getDb();
    if (mode === 'replace') {
      db.prepare('DELETE FROM menus').run();
    }

    const stmt = db.prepare(
      'INSERT INTO menus (name, description, price, portion, category, dietary, tag, img, available_days, is_tiffin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    for (const item of items) {
      stmt.run(item.name, item.description || '', item.price, item.portion || '', item.category, item.dietary, serializeTags(item.tags), item.img || '', serializeDays(item.availableDays), item.isTiffin ? 1 : 0);
    }

    const allRows = db.prepare('SELECT * FROM menus ORDER BY id ASC').all() as Record<string, unknown>[];
    res.json({ imported: items.length, total: allRows.length, menus: allRows.map((r) => mapRow(r)) });
  } catch (err) {
    console.error('Import menus error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
