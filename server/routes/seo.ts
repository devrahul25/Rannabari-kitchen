import { Router, Request, Response } from 'express';
import { getDb } from '../db.js';
import { authenticateAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

interface SeoRow {
  id: number;
  page_path: string;
  page_label: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image: string | null;
  updated_at: string;
}

// Public: Get all SEO settings (frontend uses this to populate meta tags)
router.get('/', (_req: Request, res: Response): void => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM seo_settings ORDER BY page_path').all() as SeoRow[];
    res.json(rows);
  } catch (err) {
    console.error('Get SEO error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Upsert SEO settings for a page
router.put('/:id', authenticateAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { meta_title, meta_description, meta_keywords, og_image } = req.body;

  try {
    const db = getDb();
    const result = db.prepare(`
      UPDATE seo_settings
      SET meta_title = ?, meta_description = ?, meta_keywords = ?, og_image = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      meta_title || null,
      meta_description || null,
      meta_keywords || null,
      og_image || null,
      id,
    );

    if ((result as { changes: number }).changes === 0) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    const updated = db.prepare('SELECT * FROM seo_settings WHERE id = ?').get(id) as SeoRow;
    res.json(updated);
  } catch (err) {
    console.error('Update SEO error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Add a custom page entry
router.post('/', authenticateAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const { page_path, page_label, meta_title, meta_description, meta_keywords, og_image } = req.body;
  if (!page_path || !page_label) {
    res.status(400).json({ error: 'page_path and page_label are required' });
    return;
  }
  try {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO seo_settings (page_path, page_label, meta_title, meta_description, meta_keywords, og_image)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(page_path, page_label, meta_title || null, meta_description || null, meta_keywords || null, og_image || null);
    const row = db.prepare('SELECT * FROM seo_settings WHERE id = ?').get(Number((result as { lastInsertRowid: bigint | number }).lastInsertRowid)) as SeoRow;
    res.status(201).json(row);
  } catch (err: any) {
    if (err?.message?.includes('UNIQUE')) {
      res.status(409).json({ error: 'A page with this path already exists' });
    } else {
      console.error('Create SEO error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Admin: Delete a custom page entry (only non-seeded ones are truly removable)
router.delete('/:id', authenticateAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  try {
    const db = getDb();
    db.prepare('DELETE FROM seo_settings WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete SEO error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
