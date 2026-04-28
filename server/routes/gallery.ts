import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateAdmin, AuthRequest } from '../middleware/auth.js';

const GALLERY_DIR = path.join(process.cwd(), 'public', 'uploads', 'gallery');
fs.mkdirSync(GALLERY_DIR, { recursive: true });

// Store file in memory so we control when/where it's written
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, jpeg, png, gif, webp, svg) and PDF are allowed'));
    }
  },
});

const router = Router();

// List all images (public — no auth required)
router.get('/public', (_req: Request, res: Response): void => {
  try {
    const files = fs
      .readdirSync(GALLERY_DIR)
      .filter((f) => /\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i.test(f))
      .map((filename) => {
        const stat = fs.statSync(path.join(GALLERY_DIR, filename));
        return {
          filename,
          url: `/uploads/gallery/${encodeURIComponent(filename)}`,
          size: stat.size,
          createdAt: stat.birthtime.toISOString(),
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json(files);
  } catch {
    res.status(500).json({ error: 'Failed to list gallery files' });
  }
});

// List all images (admin only)
router.get('/', authenticateAdmin, (_req: Request, res: Response): void => {
  try {
    const files = fs
      .readdirSync(GALLERY_DIR)
      .filter((f) => /\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i.test(f))
      .map((filename) => {
        const stat = fs.statSync(path.join(GALLERY_DIR, filename));
        return {
          filename,
          url: `/uploads/gallery/${encodeURIComponent(filename)}`,
          size: stat.size,
          createdAt: stat.birthtime.toISOString(),
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json(files);
  } catch {
    res.status(500).json({ error: 'Failed to list gallery files' });
  }
});

// Upload image (admin only)
// Returns 409 if same filename exists and ?replace=true not set
router.post('/upload', authenticateAdmin, (req: AuthRequest, res: Response): void => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: `Upload error: ${err.message}` });
      return;
    }
    if (err) {
      res.status(400).json({ error: (err as Error).message });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    // Sanitize: keep only safe characters in filename
    const safeName = path
      .basename(req.file.originalname)
      .replace(/[^a-zA-Z0-9._-]/g, '_');
    const destPath = path.join(GALLERY_DIR, safeName);
    const replace = req.query.replace === 'true';

    if (fs.existsSync(destPath) && !replace) {
      res.status(409).json({ error: 'File already exists', filename: safeName });
      return;
    }

    fs.writeFileSync(destPath, req.file.buffer);
    res.json({
      filename: safeName,
      url: `/uploads/gallery/${encodeURIComponent(safeName)}`,
      size: req.file.buffer.length,
      createdAt: new Date().toISOString(),
    });
  });
});

// Delete image (admin only)
router.delete('/:filename', authenticateAdmin, (req: AuthRequest, res: Response): void => {
  const safeName = path.basename(decodeURIComponent(req.params.filename));
  const filePath = path.join(GALLERY_DIR, safeName);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'File not found' });
    return;
  }

  fs.unlinkSync(filePath);
  res.json({ success: true });
});

export default router;
