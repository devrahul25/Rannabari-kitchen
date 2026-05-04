import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;

const DEFAULT_MENUS = [
  { name: "Bhetki Fish Fry", description: "A Kolkata legend! Four pieces of premium, boneless Bhetki (Barramundi) fillets, marinated in a zesty green herb paste. Double-coated in crispy breadcrumbs.", price: "₹600", portion: "4 Pcs, Serves 2", category: "Starters", dietary: "Non Veg", tag: "Popular", img: "https://images.unsplash.com/photo-1626804475297-41609ea0eb49?q=80&w=800&auto=format&fit=crop" },
  { name: "Prawn Cutlet", description: "Crispy cutlets made with prawns and spices, shallow-fried for a crunchy outside and juicy inside.", price: "₹750", portion: "3 Pcs, Serves 2", category: "Starters", dietary: "Non Veg", tag: null, img: "https://images.unsplash.com/photo-1599487405609-88091176882c?q=80&w=800&auto=format&fit=crop" },
  { name: "Aloo Posto", description: "Traditional Bengali dish of potatoes cooked with poppy seed paste, mildly spiced and creamy.", price: "₹350", portion: "400 ML, Serves 2", category: "Main Course", dietary: "Veg", tag: null, img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop" },
  { name: "Bhindi Torkari", description: "Okra cooked with light spices in a Bengali-style curry, simple, healthy, and perfect with rice or roti.", price: "₹250", portion: "400 ML, Serves 2", category: "Main Course", dietary: "Veg", tag: null, img: "https://images.unsplash.com/photo-1626509653294-1d0111f1816e?q=80&w=800&auto=format&fit=crop" },
  { name: "Dhokar Dalna", description: "Bengali delicacy of lentil cakes simmered in a spiced gravy, offering a unique texture and comforting flavor.", price: "₹400", portion: "500 ML, Serves 2", category: "Main Course", dietary: "Veg", tag: null, img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop" },
  { name: "Dum Aloo", description: "Baby potatoes slow-cooked in a spicy curry sauce, rich and flavorful, often served with luchi or rice.", price: "₹250", portion: "400 ML, Serves 2", category: "Main Course", dietary: "Veg", tag: null, img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop" },
  { name: "Echorer Torkari", description: "Raw jackfruit curry cooked with Bengali spices, known for its meat-like texture and delicious taste.", price: "₹350", portion: "500 ML, Serves 2", category: "Main Course", dietary: "Veg", tag: null, img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop" },
  { name: "Ghee Bhaat", description: "Steamed rice mixed with fragrant ghee, simple yet rich, often served as a comfort food with curries.", price: "₹300", portion: "750 ML, Serves 2", category: "Main Course", dietary: "Veg", tag: null, img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop" },
  { name: "Luchi", description: "Soft, deep-fried Bengali bread made from refined flour, served with curries like aloo dum or cholar dal.", price: "₹250", portion: "6 Pcs, Serves 2", category: "Main Course", dietary: "Veg", tag: null, img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop" },
  { name: "Mochar Ghonto", description: "Banana flower curry cooked with spices and sometimes coconut, a traditional Bengali dish with earthy flavor.", price: "₹360", portion: "400 ML, Serves 2", category: "Main Course", dietary: "Veg", tag: null, img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop" },
  { name: "Pandal Khichuri", description: "Bengali-style khichuri cooked with lentils, rice, ghee, and spices, often served during festivals.", price: "₹450", portion: "1000 ML, Min. 3 Plates", category: "Main Course", dietary: "Veg", tag: "Popular", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop" },
  { name: "Shukto", description: "Classic Bengali mixed vegetable curry with a mild bitter touch, served as a traditional starter dish.", price: "₹325", portion: "400 ML, Serves 2", category: "Main Course", dietary: "Veg", tag: null, img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop" },
  { name: "Chicken Biriyani", description: "Aromatic basmati rice cooked with tender chicken pieces, spices, and herbs, a flavorful Bengali biriyani classic.", price: "₹650", portion: "750 ML, Serves 2", category: "Main Course", dietary: "Non Veg", tag: "Popular", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop" },
  { name: "Deem Posto", description: "Eggs cooked in a rich poppy seed gravy, mildly spiced, creamy, and best enjoyed with steamed rice.", price: "₹360", portion: "400 ML, Serves 2", category: "Main Course", dietary: "Non Veg", tag: null, img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop" },
  { name: "Hilsa Bhapa", description: "Famous Bengali steamed hilsa fish cooked with mustard paste and spices, aromatic and a true delicacy.", price: "₹850", portion: "1 Pc, Serves 1", category: "Main Course", dietary: "Non Veg", tag: "Signature", img: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=800&auto=format&fit=crop" },
  { name: "Muri Ghonto", description: "Bengali fish head curry cooked with rice and spices, rich and flavorful, often served as a special delicacy.", price: "₹400", portion: "500 ML, Serves 2", category: "Main Course", dietary: "Non Veg", tag: null, img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800&auto=format&fit=crop" },
  { name: "Mutton Biriyani", description: "Fragrant biriyani rice cooked with tender mutton pieces and aromatic spices, a hearty and festive Bengali favorite.", price: "₹750", portion: "750 ML, Serves 2", category: "Main Course", dietary: "Non Veg", tag: "Signature", img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop" },
  { name: "Mutton Rezala", description: "Creamy Mughlai-style mutton curry with yogurt and mild spices, rich, royal, and best paired with luchi or rice.", price: "₹1900", portion: "1000 ML, Family Pack", category: "Main Course", dietary: "Non Veg", tag: null, img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?q=80&w=800&auto=format&fit=crop" },
  { name: "Rohu Fish Pulao", description: "Spiced pulao rice cooked with Rohu fish pieces, aromatic and flavorful, blending fish curry taste with rice.", price: "₹700", portion: "750 ML, Serves 2", category: "Main Course", dietary: "Non Veg", tag: null, img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop" },
  { name: "Rohu Kalia", description: "Rohu fish cooked in a rich, spicy Bengali gravy, slightly thick and perfect with steamed rice.", price: "₹650", portion: "3 Pcs, Serves 2", category: "Main Course", dietary: "Non Veg", tag: null, img: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=800&auto=format&fit=crop" },
  { name: "Mishti Doi", description: "Classic Bengali sweet yogurt, rich, creamy, and perfectly caramelized.", price: "₹150", portion: "250 ML, Serves 2", category: "Desserts", dietary: "Veg", tag: "Popular", img: "https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?q=80&w=800&auto=format&fit=crop" },
  { name: "Rosogolla", description: "Spongy cottage cheese balls soaked in light sugar syrup, a quintessential Bengali sweet.", price: "₹100", portion: "4 Pcs, Serves 2", category: "Desserts", dietary: "Veg", tag: null, img: "https://images.unsplash.com/photo-1605197132819-d29314451009?q=80&w=800&auto=format&fit=crop", available_days: "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDb(): any {
  return db;
}

export function closeDb(): void {
  if (db) {
    try { db.close(); } catch (_) {}
    db = null;
  }
}

export async function initDb(): Promise<void> {
  db = new Database('./database.sqlite');

  db.exec(`
    CREATE TABLE IF NOT EXISTS menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price TEXT NOT NULL,
      portion TEXT,
      category TEXT NOT NULL,
      dietary TEXT NOT NULL,
      tag TEXT,
      img TEXT,
      available_days TEXT,
      is_tiffin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_mobile TEXT NOT NULL,
      delivery_type TEXT NOT NULL,
      delivery_date TEXT NOT NULL,
      delivery_time TEXT NOT NULL,
      address TEXT,
      items_json TEXT NOT NULL,
      subtotal INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS seo_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_path TEXT UNIQUE NOT NULL,
      page_label TEXT NOT NULL,
      meta_title TEXT,
      meta_description TEXT,
      meta_keywords TEXT,
      og_image TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: add status column if it doesn't exist yet (existing DBs)
  try {
    db.exec("ALTER TABLE orders ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'");
  } catch (_) {
    // Column already exists — ignore
  }

  // Migration: add archived column if it doesn't exist yet
  try {
    db.exec('ALTER TABLE orders ADD COLUMN archived INTEGER NOT NULL DEFAULT 0');
  } catch (_) {
    // Column already exists — ignore
  }

  // Migration: add available_days column if it doesn't exist yet
  try {
    db.exec('ALTER TABLE menus ADD COLUMN available_days TEXT');
  } catch (_) {
    // Column already exists — ignore
  }

  // Migration: add is_tiffin column if it doesn't exist yet
  try {
    db.exec('ALTER TABLE menus ADD COLUMN is_tiffin INTEGER DEFAULT 0');
  } catch (_) {
    // Column already exists — ignore
  }

  // Migration: add is_tiffin column if it doesn't exist yet
  try {
    db.exec('ALTER TABLE menus ADD COLUMN is_tiffin INTEGER DEFAULT 0');
  } catch (_) {
    // Column already exists — ignore
  }

  // Migration: Backfill data for existing rows if needed
  try {
    // Set available_days to Everyday for items that have it as NULL
    db.prepare("UPDATE menus SET available_days = 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday' WHERE available_days IS NULL").run();
    // Set is_tiffin based on category for items that have it as 0/NULL and are in Tiffin categories
    db.prepare("UPDATE menus SET is_tiffin = 1 WHERE is_tiffin = 0 AND category IN ('Breakfast', 'Lunch', 'Dinner')").run();
  } catch (err) {
    console.error('Data backfill migration error:', err);
  }

  // Seed SEO pages if table is empty
  const seoCount = db.prepare('SELECT COUNT(*) as count FROM seo_settings').get() as { count: number };
  if (seoCount && seoCount.count === 0) {
    const seoPages = [
      { path: '/', label: 'Home' },
      { path: '/menu', label: 'Menu' },
      { path: '/about', label: 'About' },
      { path: '/contact', label: 'Contact' },
      { path: '/catering', label: 'Catering' },
      { path: '/how-it-works', label: 'How It Works' },
      { path: '/custom-orders', label: 'Custom Orders' },
      { path: '/reviews', label: 'Reviews' },
      { path: '/media', label: 'Media' },
      { path: '/cart', label: 'Cart' },
    ];
    const seoStmt = db.prepare('INSERT INTO seo_settings (page_path, page_label) VALUES (?, ?)');
    for (const p of seoPages) seoStmt.run(p.path, p.label);
  }

  // Migration: ensure all expected pages exist in seo_settings (idempotent)
  const ensureSeoPage = db.prepare('INSERT OR IGNORE INTO seo_settings (page_path, page_label) VALUES (?, ?)');
  const requiredPages = [
    { path: '/custom-orders', label: 'Custom Orders' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/media', label: 'Media' },
    { path: '/terms', label: 'Terms & Conditions' },
    { path: '/refund', label: 'Refund Policy' },
  ];
  for (const p of requiredPages) ensureSeoPage.run(p.path, p.label);

  // Seed default admin if not exists
  const adminExists = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin');
  if (!adminExists) {
    const hash = await bcrypt.hash('admin@babos', 10);
    db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', hash);
    console.log('Default admin created: username=admin, password=admin@babos');
  }

  // Seed default menus if table is empty
  const menuCount = db.prepare('SELECT COUNT(*) as count FROM menus').get() as { count: number };
  if (menuCount && menuCount.count === 0) {
    const stmt = db.prepare(
      'INSERT INTO menus (name, description, price, portion, category, dietary, tag, img, available_days, is_tiffin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    for (const menu of DEFAULT_MENUS) {
      const isTiffin = ['Breakfast', 'Lunch', 'Dinner'].includes(menu.category) ? 1 : 0;
      stmt.run(menu.name, menu.description, menu.price, menu.portion, menu.category, menu.dietary, menu.tag ?? null, menu.img, (menu as any).available_days || "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday", isTiffin);
    }
    console.log(`Seeded ${DEFAULT_MENUS.length} default menu items`);
  }
}
