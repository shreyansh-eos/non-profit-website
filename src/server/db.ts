import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data and uploads directories exist
const dataDir = path.resolve(process.cwd(), 'data');
const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'aawaaz_setu.db');
export const db = new DatabaseSync(dbPath);

// Initialize database schema tables per specifications
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL,
      last_login TEXT
    );

    CREATE TABLE IF NOT EXISTS anonymous_stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT UNIQUE NOT NULL,
      access_token TEXT NOT NULL,
      title TEXT NOT NULL,
      story_content TEXT NOT NULL,
      author_name TEXT DEFAULT 'Anonymous Survivor',
      credit_preference TEXT DEFAULT 'Anonymous',
      category TEXT DEFAULT 'Anonymous Stories',
      status TEXT NOT NULL DEFAULT 'unread',
      consent_given INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS story_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      story_id INTEGER NOT NULL REFERENCES anonymous_stories(id) ON DELETE CASCADE,
      sender_type TEXT NOT NULL,
      message_content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      read_at TEXT
    );

    CREATE TABLE IF NOT EXISTS honourable_mentions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      content TEXT NOT NULL,
      image_urls TEXT,
      caption TEXT,
      quote TEXT,
      category TEXT NOT NULL DEFAULT 'Student Voices',
      author_name TEXT,
      status TEXT NOT NULL DEFAULT 'published',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      published_at TEXT
    );

    CREATE TABLE IF NOT EXISTS media_library (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_url TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      uploaded_at TEXT NOT NULL
    );
  `);

  // Seed default admin user if not exists
  const existingAdmin = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
  const salt = process.env.ADMIN_SALT || 'aawaaz_setu_secure_admin_salt_2026';
  const defaultPassword = process.env.ADMIN_PASSWORD || 'Bt@5632()';
  const hash = crypto.scryptSync(defaultPassword, salt, 64).toString('hex');

  if (!existingAdmin) {
    db.prepare(`
      INSERT INTO admin_users (username, password_hash, role, created_at)
      VALUES (?, ?, ?, ?)
    `).run('admin', hash, 'admin', new Date().toISOString());
  } else {
    // Keep password synchronized with the specified credential
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?').run(hash, 'admin');
  }

  // Seed initial Honourable Mentions if empty
  const mentionCount = (db.prepare('SELECT COUNT(*) as count FROM honourable_mentions').get() as { count: number })?.count || 0;
  if (mentionCount === 0) {
    const seedMentions = [
      {
        title: 'Breaking Campus Silence: The Power of Peer Solidarity at DTU',
        subtitle: 'How student-led dialogue transforms institutional awareness and trauma support',
        content: `When conversations around harassment and emotional trauma are pushed into shadows, isolation thrives. Over the past academic semester, peer advocacy circles across Delhi campuses demonstrated that structured, non-judgmental spaces fundamentally alter how survivors navigate their healing journeys.\n\nBy engaging with student leaders, establishing anonymous listening safe zones, and clarifying the legal protections guaranteed under the POSH Act and Internal Complaints Committees (ICC), university cohorts are fostering a climate where accountability replaces complicity.`,
        image_urls: JSON.stringify(['./assets/aistudio/image_93510b04.png']),
        caption: 'Student dialogue initiatives fostering campus safety and accountability',
        quote: '“True solidarity begins when we listen without interrogation and build bridges that never break under silence.”',
        category: 'Campus Advocacy',
        author_name: 'Aawaaz Setu Editorial Team',
        status: 'published',
        published_at: new Date().toISOString(),
      },
      {
        title: 'Male Survivors & The Stigma of Silence',
        subtitle: 'Deconstructing cultural barriers and affirming unconditional dignity for all genders',
        content: `Gender-based violence and boundary violations know no demographic boundaries. In academic institutions, male and gender-diverse survivors often encounter a secondary wall of toxic masculine stereotypes, ridicule, and disbelief.\n\nAawaaz Setu remains steadfast in its foundational principle: every human being, regardless of gender, deserves belief, emotional shelter, and competent legal and mental health navigation. Collaborating with organizations like the Vaastav Foundation and Tele-MANAS, we ensure no voice is left stranded in quiet distress.`,
        image_urls: JSON.stringify(['./assets/aistudio/WhatsApp_Image_2026-11-11_at_8.16.12_PM_2ff73539.jpeg']),
        caption: 'Operational leadership scaling survivor-support networks and due process',
        quote: '“Courage is the bridge between silence and solidarity. Our duty is to ensure that bridge never breaks.”',
        category: 'Awareness & Equality',
        author_name: 'Paritosh Rana, Managing Director',
        status: 'published',
        published_at: new Date().toISOString(),
      }
    ];

    const insertMention = db.prepare(`
      INSERT INTO honourable_mentions (title, subtitle, content, image_urls, caption, quote, category, author_name, status, created_at, updated_at, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    for (const m of seedMentions) {
      insertMention.run(m.title, m.subtitle, m.content, m.image_urls, m.caption, m.quote, m.category, m.author_name, m.status, now, now, m.published_at);
    }
  }

  console.log('Persistent SQLite database initialized successfully at', dbPath);
}
