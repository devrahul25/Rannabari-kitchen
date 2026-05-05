import Database from 'better-sqlite3';

const db = new Database('./database.sqlite');

try {
  // Try to update item 1 to be a Tiffin item on Saturday
  const id = 1;
  const isTiffin = true;
  const availableDays = ['Friday', 'Saturday'];
  
  const result = db.prepare(
    'UPDATE menus SET available_days=?, is_tiffin=? WHERE id=?'
  ).run(availableDays.join(','), isTiffin ? 1 : 0, id);
  
  console.log('Update result:', result);
  
  const row = db.prepare('SELECT id, name, available_days, is_tiffin FROM menus WHERE id=?').get(id);
  console.log('Post-update row:', row);
} catch (err) {
  console.error('Update test error:', err);
} finally {
  db.close();
}
