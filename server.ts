import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';
import { DatabaseSync } from 'node:sqlite';

dotenv.config();

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
const db = new DatabaseSync(dbPath);

// Initialize database schema tables per specifications
function initDatabase() {
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

// Initialize persistent SQLite database
initDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

// High payload limit for image uploads (up to 25MB)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve uploaded media statically
app.use('/uploads', express.static(uploadsDir));

// =========================================================================
// SECURE ADMIN AUTHENTICATION
// Salted password hashing (password is never stored or transmitted in plaintext)
// =========================================================================
const ADMIN_SALT = process.env.ADMIN_SALT || 'aawaaz_setu_secure_admin_salt_2026';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_HASH = process.env.ADMIN_HASH || '15a6b16b46f6403c4a58e3b09b950d58ac238243a08e058398a4709b201ad752539e7e6256a3e741a15d47feacc48eac0721a09978ca9a5bf5a7201b5c945f41';

// Active admin session tokens with 24-hour expiration
const activeAdminSessions = new Map<string, { username: string; expiresAt: number }>();

function generateSessionToken(username: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeAdminSessions.set(token, { username, expiresAt });
  return token;
}

function isValidAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const session = activeAdminSessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    activeAdminSessions.delete(token);
    return false;
  }
  return true;
}

// Admin-only middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.body?.token || req.query?.token);

  if (typeof token === 'string' && isValidAdminToken(token)) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
  }
}

// Rate-limiting tracker for login attempts (IP -> { count, firstAttempt })
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

app.post('/api/admin/login', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || { count: 0, firstAttempt: now };

  if (now - attempts.firstAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
    attempts.firstAttempt = now;
  }

  if (attempts.count >= 8) {
    res.status(429).json({ error: 'Too many failed login attempts. Please try again in 15 minutes.' });
    return;
  }

  const { username, password } = req.body;
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Username and password are required.' });
    return;
  }

  const isUsernameMatch = username.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase() || username.trim().toLowerCase() === 'founder';

  let isPasswordMatch = false;
  try {
    const computedHash = crypto.scryptSync(password.trim(), ADMIN_SALT, 64).toString('hex');
    isPasswordMatch = crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(ADMIN_HASH, 'hex'));
  } catch (err) {
    isPasswordMatch = false;
  }

  if (isUsernameMatch && isPasswordMatch) {
    loginAttempts.delete(ip);
    const token = generateSessionToken(username.trim());

    // Update last_login in database
    try {
      db.prepare('UPDATE admin_users SET last_login = ? WHERE username = ?').run(new Date().toISOString(), 'admin');
    } catch (e) {
      console.error('Error updating last_login', e);
    }

    res.json({ success: true, token, username: ADMIN_USERNAME });
    return;
  }

  attempts.count += 1;
  loginAttempts.set(ip, attempts);
  res.status(401).json({ error: 'Invalid username or password.' });
});

app.post('/api/admin/verify', (req, res) => {
  const { token } = req.body;
  if (typeof token === 'string' && isValidAdminToken(token)) {
    res.json({ valid: true, username: ADMIN_USERNAME });
    return;
  }
  res.status(401).json({ valid: false });
});

app.post('/api/admin/logout', (req, res) => {
  const { token } = req.body;
  if (typeof token === 'string') {
    activeAdminSessions.delete(token);
  }
  res.json({ success: true });
});

// =========================================================================
// 1. ADMIN DASHBOARD STATS
// =========================================================================
app.get('/api/admin/stats', requireAdmin, (_req, res) => {
  try {
    const totalStories = (db.prepare('SELECT COUNT(*) as count FROM anonymous_stories').get() as { count: number })?.count || 0;
    const unreadStories = (db.prepare("SELECT COUNT(*) as count FROM anonymous_stories WHERE status = 'unread'").get() as { count: number })?.count || 0;
    const pendingStories = (db.prepare("SELECT COUNT(*) as count FROM anonymous_stories WHERE status = 'pending'").get() as { count: number })?.count || 0;
    const totalMentions = (db.prepare('SELECT COUNT(*) as count FROM honourable_mentions').get() as { count: number })?.count || 0;
    const publishedMentions = (db.prepare("SELECT COUNT(*) as count FROM honourable_mentions WHERE status = 'published'").get() as { count: number })?.count || 0;
    const draftMentions = (db.prepare("SELECT COUNT(*) as count FROM honourable_mentions WHERE status = 'draft'").get() as { count: number })?.count || 0;
    const totalMedia = (db.prepare('SELECT COUNT(*) as count FROM media_library').get() as { count: number })?.count || 0;

    res.json({
      totalStories,
      unreadStories,
      pendingStories,
      totalMentions,
      publishedMentions,
      draftMentions,
      totalMedia,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// =========================================================================
// 2. ANONYMOUS STORIES & PRIVATE TWO-WAY MESSAGING
// =========================================================================

// Public submission of story/confession with unique conversation token
app.post('/api/stories/submit', (req, res) => {
  try {
    const { title, content, authorName, creditPreference, category, consentGiven } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length < 15) {
      res.status(400).json({ error: 'Story content is required (min 15 characters).' });
      return;
    }

    // Generate unique user-friendly conversation ID: AS-XXXX-XXXX
    const convId = `AS-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const accessToken = crypto.randomBytes(24).toString('hex');
    const now = new Date().toISOString();

    const insertStory = db.prepare(`
      INSERT INTO anonymous_stories (conversation_id, access_token, title, story_content, author_name, credit_preference, category, status, consent_given, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'unread', ?, ?, ?)
    `);

    const result = insertStory.run(
      convId,
      accessToken,
      (title && typeof title === 'string') ? title.trim() : 'Anonymous Submission',
      content.trim(),
      (authorName && typeof authorName === 'string') ? authorName.trim() : 'Anonymous Survivor',
      (creditPreference && typeof creditPreference === 'string') ? creditPreference : 'Anonymous',
      (category && typeof category === 'string') ? category : 'Anonymous Stories',
      consentGiven ? 1 : 0,
      now,
      now
    );

    const storyId = Number(result.lastInsertRowid);

    // Insert first message from author
    db.prepare(`
      INSERT INTO story_messages (story_id, sender_type, message_content, created_at)
      VALUES (?, 'anonymous', ?, ?)
    `).run(storyId, content.trim(), now);

    res.status(201).json({
      success: true,
      conversationId: convId,
      accessToken,
      message: 'Your story has been submitted securely. Save your Conversation Code to check for private replies anytime.',
    });
  } catch (error) {
    console.error('Error submitting story:', error);
    res.status(500).json({ error: 'Failed to submit anonymous story.' });
  }
});

// Admin: Get all anonymous stories
app.get('/api/admin/stories', requireAdmin, (_req, res) => {
  try {
    const stories = db.prepare(`
      SELECT s.*, 
        (SELECT COUNT(*) FROM story_messages m WHERE m.story_id = s.id) as message_count,
        (SELECT COUNT(*) FROM story_messages m WHERE m.story_id = s.id AND m.sender_type = 'anonymous' AND m.read_at IS NULL) as unread_messages
      FROM anonymous_stories s
      ORDER BY s.updated_at DESC
    `).all();

    res.json(stories);
  } catch (error) {
    console.error('Error fetching admin stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories.' });
  }
});

// Admin: Get single story with all messages in the conversation
app.get('/api/admin/stories/:id', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    const story = db.prepare('SELECT * FROM anonymous_stories WHERE id = ?').get(id) as Record<string, unknown> | undefined;

    if (!story) {
      res.status(404).json({ error: 'Story not found.' });
      return;
    }

    // Mark as read if status was unread
    if (story.status === 'unread') {
      db.prepare("UPDATE anonymous_stories SET status = 'reviewed' WHERE id = ?").run(id);
      story.status = 'reviewed';
    }

    // Mark anonymous messages as read
    db.prepare("UPDATE story_messages SET read_at = ? WHERE story_id = ? AND sender_type = 'anonymous' AND read_at IS NULL").run(new Date().toISOString(), id);

    const messages = db.prepare('SELECT * FROM story_messages WHERE story_id = ? ORDER BY created_at ASC').all(id);

    res.json({ ...story, messages });
  } catch (error) {
    console.error('Error fetching story detail:', error);
    res.status(500).json({ error: 'Failed to fetch story detail.' });
  }
});

// Admin: Send private reply to story conversation
app.post('/api/admin/stories/:id/reply', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { messageContent, updateStatus } = req.body;

    if (!messageContent || typeof messageContent !== 'string' || !messageContent.trim()) {
      res.status(400).json({ error: 'Message content is required.' });
      return;
    }

    const story = db.prepare('SELECT id FROM anonymous_stories WHERE id = ?').get(id);
    if (!story) {
      res.status(404).json({ error: 'Story not found.' });
      return;
    }

    const now = new Date().toISOString();
    const result = db.prepare(`
      INSERT INTO story_messages (story_id, sender_type, message_content, created_at)
      VALUES (?, 'admin', ?, ?)
    `).run(id, messageContent.trim(), now);

    const newStatus = (updateStatus && typeof updateStatus === 'string') ? updateStatus : 'reviewed';
    db.prepare('UPDATE anonymous_stories SET status = ?, updated_at = ? WHERE id = ?').run(newStatus, now, id);

    res.status(201).json({
      success: true,
      messageId: Number(result.lastInsertRowid),
      sender_type: 'admin',
      message_content: messageContent.trim(),
      created_at: now,
    });
  } catch (error) {
    console.error('Error posting admin reply:', error);
    res.status(500).json({ error: 'Failed to send reply.' });
  }
});

// Admin: Update status of a story
app.patch('/api/admin/stories/:id/status', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const allowed = ['unread', 'reviewed', 'pending', 'resolved', 'archived'];

    if (!allowed.includes(status)) {
      res.status(400).json({ error: 'Invalid status.' });
      return;
    }

    db.prepare('UPDATE anonymous_stories SET status = ?, updated_at = ? WHERE id = ?').run(status, new Date().toISOString(), id);
    res.json({ success: true, status });
  } catch (error) {
    console.error('Error updating story status:', error);
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

// Admin: Delete story and conversation
app.delete('/api/admin/stories/:id', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    db.prepare('DELETE FROM story_messages WHERE story_id = ?').run(id);
    db.prepare('DELETE FROM anonymous_stories WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Failed to delete story.' });
  }
});

// Public / Anonymous: Retrieve conversation by conversation_id (e.g. AS-XXXX-XXXX) or access_token
app.get('/api/conversation/:code', (req, res) => {
  try {
    const rawCode = req.params.code.trim();
    const code = rawCode.toUpperCase();
    const story = db.prepare(`
      SELECT id, conversation_id, title, category, status, created_at, updated_at
      FROM anonymous_stories
      WHERE UPPER(conversation_id) = ? OR access_token = ?
    `).get(code, rawCode) as any;

    if (!story) {
      res.status(404).json({ error: 'Conversation not found. Please verify your Conversation Code.' });
      return;
    }

    const messages = db.prepare(`
      SELECT id, sender_type, message_content, created_at
      FROM story_messages
      WHERE story_id = ?
      ORDER BY created_at ASC
    `).all(Number(story.id));

    res.json({ ...story, messages });
  } catch (error) {
    console.error('Error retrieving conversation:', error);
    res.status(500).json({ error: 'Failed to retrieve conversation.' });
  }
});

// Public / Anonymous: Send follow-up reply in anonymous conversation
app.post('/api/conversation/:code/reply', (req, res) => {
  try {
    const rawCode = req.params.code.trim();
    const code = rawCode.toUpperCase();
    const { messageContent } = req.body;

    if (!messageContent || typeof messageContent !== 'string' || !messageContent.trim()) {
      res.status(400).json({ error: 'Message content is required.' });
      return;
    }

    const story = db.prepare(`
      SELECT id FROM anonymous_stories WHERE UPPER(conversation_id) = ? OR access_token = ?
    `).get(code, rawCode) as { id: number } | undefined;

    if (!story) {
      res.status(404).json({ error: 'Conversation not found.' });
      return;
    }

    const now = new Date().toISOString();
    const result = db.prepare(`
      INSERT INTO story_messages (story_id, sender_type, message_content, created_at)
      VALUES (?, 'anonymous', ?, ?)
    `).run(story.id, messageContent.trim(), now);

    db.prepare("UPDATE anonymous_stories SET status = 'pending', updated_at = ? WHERE id = ?").run(now, story.id);

    res.status(201).json({
      success: true,
      messageId: Number(result.lastInsertRowid),
      sender_type: 'anonymous',
      message_content: messageContent.trim(),
      created_at: now,
    });
  } catch (error) {
    console.error('Error posting anonymous reply:', error);
    res.status(500).json({ error: 'Failed to post reply.' });
  }
});

// =========================================================================
// 3. HONOURABLE MENTIONS — CONTENT MANAGEMENT
// =========================================================================

// Public: Get published honourable mentions
app.get('/api/honourable-mentions', (_req, res) => {
  try {
    const mentions = db.prepare(`
      SELECT * FROM honourable_mentions
      WHERE status = 'published'
      ORDER BY published_at DESC, created_at DESC
    `).all();

    // Parse image_urls JSON
    const parsed = mentions.map((m: any) => ({
      ...m,
      image_urls: m.image_urls ? JSON.parse(m.image_urls) : [],
    }));

    res.json(parsed);
  } catch (error) {
    console.error('Error fetching published mentions:', error);
    res.status(500).json({ error: 'Failed to fetch honourable mentions.' });
  }
});

// Admin: Get all honourable mentions (drafts & published)
app.get('/api/admin/honourable-mentions', requireAdmin, (_req, res) => {
  try {
    const mentions = db.prepare('SELECT * FROM honourable_mentions ORDER BY created_at DESC').all();
    const parsed = mentions.map((m: any) => ({
      ...m,
      image_urls: m.image_urls ? JSON.parse(m.image_urls) : [],
    }));
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching admin mentions:', error);
    res.status(500).json({ error: 'Failed to fetch mentions.' });
  }
});

// Admin: Create new honourable mention
app.post('/api/admin/honourable-mentions', requireAdmin, (req, res) => {
  try {
    const { title, subtitle, content, imageUrls, caption, quote, category, authorName, status } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required.' });
      return;
    }

    const now = new Date().toISOString();
    const finalStatus = status === 'draft' ? 'draft' : 'published';
    const publishedAt = finalStatus === 'published' ? now : null;

    const result = db.prepare(`
      INSERT INTO honourable_mentions (title, subtitle, content, image_urls, caption, quote, category, author_name, status, created_at, updated_at, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title.trim(),
      subtitle?.trim() || null,
      content.trim(),
      JSON.stringify(Array.isArray(imageUrls) ? imageUrls : []),
      caption?.trim() || null,
      quote?.trim() || null,
      category?.trim() || 'Student Voices',
      authorName?.trim() || 'Aawaaz Setu Team',
      finalStatus,
      now,
      now,
      publishedAt
    );

    res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Honourable mention post saved successfully.',
    });
  } catch (error) {
    console.error('Error creating honourable mention:', error);
    res.status(500).json({ error: 'Failed to create honourable mention.' });
  }
});

// Admin: Update honourable mention
app.put('/api/admin/honourable-mentions/:id', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, subtitle, content, imageUrls, caption, quote, category, authorName, status } = req.body;

    const existing = db.prepare('SELECT * FROM honourable_mentions WHERE id = ?').get(id) as any;
    if (!existing) {
      res.status(404).json({ error: 'Honourable mention not found.' });
      return;
    }

    const now = new Date().toISOString();
    const finalStatus = status === 'draft' ? 'draft' : 'published';
    const publishedAt = (finalStatus === 'published' && !existing.published_at) ? now : (existing.published_at || null);

    db.prepare(`
      UPDATE honourable_mentions
      SET title = ?, subtitle = ?, content = ?, image_urls = ?, caption = ?, quote = ?, category = ?, author_name = ?, status = ?, updated_at = ?, published_at = ?
      WHERE id = ?
    `).run(
      (title?.trim() || existing.title) as string,
      (subtitle !== undefined ? subtitle?.trim() : existing.subtitle) as string | null,
      (content?.trim() || existing.content) as string,
      (imageUrls !== undefined ? JSON.stringify(imageUrls) : existing.image_urls) as string,
      (caption !== undefined ? caption?.trim() : existing.caption) as string | null,
      (quote !== undefined ? quote?.trim() : existing.quote) as string | null,
      (category?.trim() || existing.category) as string,
      (authorName !== undefined ? authorName?.trim() : existing.author_name) as string | null,
      finalStatus,
      now,
      publishedAt,
      id
    );

    res.json({ success: true, message: 'Updated successfully.' });
  } catch (error) {
    console.error('Error updating honourable mention:', error);
    res.status(500).json({ error: 'Failed to update honourable mention.' });
  }
});

// Admin: Delete honourable mention
app.delete('/api/admin/honourable-mentions/:id', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    db.prepare('DELETE FROM honourable_mentions WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting honourable mention:', error);
    res.status(500).json({ error: 'Failed to delete honourable mention.' });
  }
});

// =========================================================================
// 4. IMAGE & MEDIA LIBRARY
// =========================================================================

// Admin: Upload image (JPG, JPEG, PNG, WEBP)
app.post('/api/admin/upload', requireAdmin, (req, res) => {
  try {
    const { fileName, fileType, dataBase64 } = req.body;

    if (!dataBase64 || !fileName) {
      res.status(400).json({ error: 'Missing file data or file name.' });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const detectedType = fileType?.toLowerCase() || '';

    if (detectedType && !allowedTypes.includes(detectedType)) {
      res.status(400).json({ error: 'Invalid file type. Supported types: JPG, JPEG, PNG, WEBP.' });
      return;
    }

    // Strip data URI scheme header if present
    const cleanBase64 = dataBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    // Generate safe unique filename
    const ext = path.extname(fileName) || (detectedType.includes('png') ? '.png' : detectedType.includes('webp') ? '.webp' : '.jpg');
    const safeBaseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const uniqueFileName = `${safeBaseName}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(filePath, buffer);
    const fileUrl = `/uploads/${uniqueFileName}`;
    const now = new Date().toISOString();

    const result = db.prepare(`
      INSERT INTO media_library (file_url, file_name, file_type, uploaded_at)
      VALUES (?, ?, ?, ?)
    `).run(fileUrl, fileName, detectedType || 'image/jpeg', now);

    res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      fileUrl,
      fileName,
      fileType: detectedType || 'image/jpeg',
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to process image upload.' });
  }
});

// Admin: Get all media in library
app.get('/api/admin/media', requireAdmin, (_req, res) => {
  try {
    const media = db.prepare('SELECT * FROM media_library ORDER BY uploaded_at DESC').all();
    res.json(media);
  } catch (error) {
    console.error('Error fetching media library:', error);
    res.status(500).json({ error: 'Failed to fetch media.' });
  }
});

// Admin: Delete media from library
app.delete('/api/admin/media/:id', requireAdmin, (req, res) => {
  try {
    const id = Number(req.params.id);
    const media = db.prepare('SELECT * FROM media_library WHERE id = ?').get(id) as { file_url: string } | undefined;

    if (media && media.file_url) {
      const fileName = path.basename(media.file_url);
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    db.prepare('DELETE FROM media_library WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media.' });
  }
});

// =========================================================================
// AI CHATBOT INTEGRATION
// =========================================================================
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const AAWAAZ_SYSTEM_INSTRUCTION = `
You are Aawaaz AI, the supportive awareness assistant of Aawaaz Setu.

Your purpose is to:
- Listen respectfully and respond without judgment.
- Support people of all genders.
- Provide emotional support, awareness education, and relevant resources.
- Encourage users to seek trusted human and professional support when appropriate.

Conversation Rules:
1. Never give the same generic response to every message.
2. Understand the user's emotion and respond specifically to it.
3. Keep responses warm, natural, compassionate, and concise.
4. Avoid repetitive phrases such as "You are not alone" in every reply.
5. Never blame survivors or question their experiences aggressively.
6. Never pressure users to share their stories.
7. Ask only one gentle follow-up question at a time.
8. Never claim to be a therapist, human, or emergency service.
9. Never promise absolute anonymity or confidentiality.
10. Do not request names, addresses, school names, phone numbers, or identifying information.
11. Never provide medical diagnoses or definitive legal advice.
12. If a user appears to be in immediate danger, prioritise safety and direct them to emergency assistance:
    - Pan-India National Emergency: 112
    - Women in Distress Helpline: 1091
    - Tele-MANAS (Govt. Mental Health 24/7 Toll-Free): 14416
    - Vandrevala Foundation (Free 24/7): +91 9999 666 555
    - iCall Psychosocial Helpline: +91 9152987821
    - Childline / POCSO: 1098
13. For users under 18, encourage seeking help from a trusted adult or appropriate child protection service (such as Childline 1098).
14. If the AI service is unavailable, clearly state that it cannot respond at the moment. Do not pretend to be providing live support.
15. Support both male and female survivors equally. Aawaaz Setu recognises that sexual abuse and harassment can affect people of all genders. Male survivors deserve the same dignity, respect, and access to support.

Response Style:
- Use natural conversational language.
- Avoid robotic introductions (e.g. do not say "As an AI..." or "Greetings, I am Aawaaz AI...").
- Do not use excessive emojis.
- Do not give long speeches when a short, caring response is more appropriate.
`.trim();

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    if (!ai || !apiKey) {
      console.warn('GEMINI_API_KEY is not set. Reporting service unavailability per Rule 14.');
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';

      if (lastUserMsg.includes('help right now') || lastUserMsg.includes('danger') || lastUserMsg.includes('emergency')) {
        res.json({
          text: "If you are in immediate danger, please reach out to emergency services right away:\n\n• **National Emergency:** 112\n• **Women Helpline:** 1091\n• **Tele-MANAS (24/7 Mental Health):** 14416\n\nPlease reach out to a trusted person near you. Your safety comes first.",
        });
        return;
      }

      res.json({
        text: "Aawaaz AI cannot respond at the moment because the live AI service is currently unavailable.\n\nIf you need support or someone to talk to right now, please reach out to these trusted human helplines:\n• **National Emergency (India):** 112\n• **Women in Distress:** 1091\n• **Tele-MANAS (Mental Health 24/7):** 14416 (Toll-free)\n• **Vandrevala Foundation:** +91 9999 666 555\n• **iCall (TISS):** +91 9152987821\n• **Childline:** 1098\n\nYou can also contact Aawaaz Setu directly at ProjectAawaazUni@gmail.com.",
      });
      return;
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const timeoutPromise = new Promise<{ text?: string }>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timed out')), 10000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: AAWAAZ_SYSTEM_INSTRUCTION,
      },
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const replyText = response.text || "I hear what you are saying. Take your time, and share only what you feel comfortable with.";
    res.json({ text: replyText });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error generating chat response:', error);
    res.json({
      text: "Aawaaz AI cannot respond at the moment due to a temporary service interruption.\n\nIf you need immediate support, please contact these verified resources:\n• **National Emergency:** 112\n• **Women Helpline:** 1091\n• **Tele-MANAS (Mental Health 24/7):** 14416\n• **Vandrevala Foundation:** +91 9999 666 555\n\nYou can also email the team at ProjectAawaazUni@gmail.com.",
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', initiative: 'Aawaaz Setu', service: 'Aawaaz AI' });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (isProduction=${isProduction})`);
  });
}

startServer();
