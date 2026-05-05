import Database from 'better-sqlite3';

const db = new Database('./database.sqlite');

function mapRow(row) {
  const tag = (row.tag || '') || '';
  const tags = tag ? tag.split(',').map((t) => t.trim()).filter(Boolean) : [];
  const daysStr = (row.available_days || '') || '';
  const availableDays = daysStr ? daysStr.split(',').map((d) => d.trim()).filter(Boolean) : [];
  const isTiffin = row.is_tiffin === 1 || row.is_tiffin === '1' || row.is_tiffin === true;
  const { tag: _t, available_days: _d, is_tiffin: _i, ...rest } = row;
  return { ...rest, tags, availableDays, isTiffin };
}

try {
  const row = db.prepare('SELECT * FROM menus LIMIT 1').get();
  console.log('Raw Row:', row);
  if (row) {
    const mapped = mapRow(row);
    console.log('Mapped Row:', mapped);
  }
} catch (err) {
  console.error('Test error:', err);
} finally {
  db.close();
}
