import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'database.sqlite');

// Ensure the database file exists
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, ''); // Create empty file if it doesn't exist
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

// Drop existing tables and recreate them with correct constraints
db.serialize(() => {
  // Drop existing tables in reverse order of dependencies
  db.run('DROP TABLE IF EXISTS messages');
  db.run('DROP TABLE IF EXISTS support_groups');
  db.run('DROP TABLE IF EXISTS health_reminders');
  db.run('DROP TABLE IF EXISTS periods');
  db.run('DROP TABLE IF EXISTS users');

  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Periods table with composite unique constraint
  db.run(`
    CREATE TABLE IF NOT EXISTS periods (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      UNIQUE(user_id, date)
    )
  `);

  // Health reminders table
  db.run(`
    CREATE TABLE IF NOT EXISTS health_reminders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      frequency TEXT NOT NULL,
      next_date DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Support groups table
  db.run(`
    CREATE TABLE IF NOT EXISTS support_groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      support_group_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (support_group_id) REFERENCES support_groups (id)
    )
  `);

  // Insert default support groups
  const defaultGroups = [
    {
      id: '1',
      name: 'Breast Cancer Warriors',
      description: 'Support group for breast cancer patients and survivors',
      category: 'Cancer Support',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514'
    },
    {
      id: '2',
      name: 'PCOS Sisters',
      description: 'Discussion and support for women with PCOS',
      category: 'Hormonal Health',
      imageUrl: 'https://images.unsplash.com/photo-1571624436279-b272aff752b5'
    },
    {
      id: '3',
      name: 'Endometriosis Support',
      description: 'Share experiences and find support for endometriosis',
      category: 'Chronic Conditions',
      imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b'
    }
  ];

  defaultGroups.forEach(group => {
    db.run(`
      INSERT OR IGNORE INTO support_groups (id, name, description, category, image_url)
      VALUES (?, ?, ?, ?, ?)
    `, [group.id, group.name, group.description, group.category, group.imageUrl]);
  });
});

// Helper function to promisify database operations
const dbAsync = {
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  },

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

export const statements = {
  // Users
  createUser: (id, email, password) => 
    dbAsync.run('INSERT INTO users (id, email, password) VALUES (?, ?, ?)', [id, email, password]),

  findUserByEmail: (email) =>
    dbAsync.get('SELECT * FROM users WHERE email = ?', [email]),

  findUserById: (id) =>
    dbAsync.get('SELECT * FROM users WHERE id = ?', [id]),

  // Periods
  upsertPeriod: (id, userId, date, notes) =>
    dbAsync.run(`
      INSERT INTO periods (id, user_id, date, notes)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, date) 
      DO UPDATE SET
        notes = excluded.notes,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND date = ?
    `, [id, userId, date, notes, userId, date]),

  getPeriodsByUserId: (userId) =>
    dbAsync.all('SELECT * FROM periods WHERE user_id = ? ORDER BY date DESC', [userId]),

  // Health Reminders
  createReminder: (id, userId, name, frequency, nextDate) =>
    dbAsync.run('INSERT INTO health_reminders (id, user_id, name, frequency, next_date) VALUES (?, ?, ?, ?, ?)',
      [id, userId, name, frequency, nextDate]),

  getRemindersByUserId: (userId) =>
    dbAsync.all('SELECT * FROM health_reminders WHERE user_id = ? ORDER BY next_date ASC', [userId]),

  // Support Groups
  getAllSupportGroups: () =>
    dbAsync.all('SELECT * FROM support_groups ORDER BY created_at DESC'),

  getSupportGroupById: (id) =>
    dbAsync.get('SELECT * FROM support_groups WHERE id = ?', [id]),

  // Messages
  createMessage: (id, userId, groupId, content) =>
    dbAsync.run('INSERT INTO messages (id, user_id, support_group_id, content) VALUES (?, ?, ?, ?)',
      [id, userId, groupId, content]),

  getMessageById: (id) =>
    dbAsync.get(`
      SELECT m.*, u.email as user_email
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.id = ?
    `, [id]),

  getMessagesBySupportGroupId: (groupId) =>
    dbAsync.all(`
      SELECT m.*, u.email as user_email
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.support_group_id = ?
      ORDER BY m.created_at ASC
    `, [groupId])
};

export default db;