import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { initDb, closeDb, getDb } from './db.js';
import authRouter from './routes/auth.js';
import menusRouter from './routes/menus.js';
import galleryRouter from './routes/gallery.js';
import ordersRouter from './routes/orders.js';
import seoRouter from './routes/seo.js';

const app = express();
const PORT = process.env.PORT || 3003;
const IS_PROD = process.env.NODE_ENV === 'production';

// In production: redirect non-www to www (skip API calls to avoid cross-origin issues)
if (IS_PROD) {
  app.use((req, res, next) => {
    const host = req.headers.host || '';
    if (host === 'baboshomekitchen.in' && !req.path.startsWith('/api/')) {
      return res.redirect(301, `https://www.baboshomekitchen.in${req.url}`);
    }
    next();
  });
}

// In production: serve static assets BEFORE CORS middleware so browser module
// requests (which include an Origin header) are not blocked by CORS checks.
if (IS_PROD) {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));
}

// Allow dev origins + production domain
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://jobs.jaiveeru.site',
  'https://baboshomekitchen.in',
  'https://www.baboshomekitchen.in',
  'https://babos.jaiveeru.site',
];
app.use(cors({
  // In production everything comes from the same domain via LiteSpeed proxy —
  // echoing the Origin header back is safe (auth is protected by JWT).
  // In dev, restrict to known local origins.
  origin: IS_PROD
    ? true
    : (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) cb(null, true);
        else cb(null, false);
      },
  credentials: true,
}));

app.use(express.json({ limit: '5mb' }));

// Serve uploaded gallery images as static files (dev mode; prod handled above)
if (!IS_PROD) {
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));
}

app.use('/api/auth', authRouter);
app.use('/api/menus', menusRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/seo', seoRouter);

// PDF Generation endpoint
app.post('/api/generate-pdf', async (req, res) => {
  const { html } = req.body;
  if (!html) {
    res.status(400).json({ error: 'HTML content required' });
    return;
  }
  
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      printBackground: true,
    });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
    res.send(Buffer.from(pdf));
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  } finally {
    if (browser) await browser.close();
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// In production: SPA fallback with server-side meta tag injection
if (IS_PROD) {
  const distPath = path.join(process.cwd(), 'dist');
  const indexHtmlPath = path.join(distPath, 'index.html');

  const escHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  app.use((req, res) => {
    try {
      let html = fs.readFileSync(indexHtmlPath, 'utf-8');
      const db = getDb();

      if (db) {
        const row = db.prepare('SELECT * FROM seo_settings WHERE page_path = ?').get(req.path) as {
          meta_title: string | null;
          meta_description: string | null;
          meta_keywords: string | null;
          og_image: string | null;
        } | undefined;

        if (row) {
          if (row.meta_title) {
            const t = escHtml(row.meta_title);
            html = html.replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`);
            html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/i, `$1${t}$2`);
            html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/i, `$1${t}$2`);
          }
          if (row.meta_description) {
            const d = escHtml(row.meta_description);
            html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/i, `$1${d}$2`);
            html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/i, `$1${d}$2`);
            html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/i, `$1${d}$2`);
          }
          if (row.meta_keywords) {
            const k = escHtml(row.meta_keywords);
            html = html.replace(/(<meta\s+name="keywords"\s+content=")[^"]*(")/i, `$1${k}$2`);
          }
          if (row.og_image) {
            const img = escHtml(row.og_image);
            html = html.replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/i, `$1${img}$2`);
            html = html.replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/i, `$1${img}$2`);
          }
        }

        // Always update canonical, og:url and twitter:url to match the actual page path
        const canonicalUrl = `https://baboshomekitchen.in${req.path === '/' ? '' : req.path}`;
        html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${canonicalUrl}$2`);
        html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/i, `$1${canonicalUrl}$2`);
        html = html.replace(/(<meta\s+name="twitter:url"\s+content=")[^"]*(")/i, `$1${canonicalUrl}$2`);
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (_) {
      // Fallback to raw static file
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

initDb()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Babo's Kitchen API running on http://localhost:${PORT} [${IS_PROD ? 'production' : 'development'}]`);
    });

    const shutdown = () => {
      closeDb();
      server.close(() => process.exit(0));
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
