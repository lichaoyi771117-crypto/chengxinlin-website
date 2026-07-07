import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

let _db: Database.Database | null = null

function getDb(): Database.Database {
  if (_db) return _db

  const DB_DIR = path.join(process.cwd(), 'data')
  const DB_PATH = path.join(DB_DIR, 'users.db')

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }

  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')

  _db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS trial_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      max_uses INTEGER NOT NULL DEFAULT 5,
      qiaoxi_used INTEGER NOT NULL DEFAULT 0,
      qiaoyuan_used INTEGER NOT NULL DEFAULT 0,
      cxr_used INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      note TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS trial_bindings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      bound_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (code_id) REFERENCES trial_codes(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id)
    );

    CREATE TABLE IF NOT EXISTS trial_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code_id INTEGER NOT NULL,
      product TEXT NOT NULL,
      user_id INTEGER,
      ip_address TEXT DEFAULT '',
      used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (code_id) REFERENCES trial_codes(id)
    );
  `)

  return _db
}

export interface User {
  id: number
  account: string
  nickname: string
  phone: string
  email: string
  role: string
  created_at: string
}

export function findUserByAccount(account: string): User | undefined {
  return getDb().prepare('SELECT id, account, nickname, phone, email, role, created_at FROM users WHERE account = ?').get(account) as User | undefined
}

export function findUserByPhone(phone: string): User | undefined {
  return getDb().prepare('SELECT id, account, nickname, phone, email, role, created_at FROM users WHERE phone = ?').get(phone) as User | undefined
}

export function findUserByEmail(email: string): User | undefined {
  return getDb().prepare('SELECT id, account, nickname, phone, email, role, created_at FROM users WHERE email = ?').get(email) as User | undefined
}

export function getPasswordHash(account: string): string | undefined {
  const row = getDb().prepare('SELECT password FROM users WHERE account = ?').get(account) as { password: string } | undefined
  return row?.password
}

export function createUser(data: {
  account: string
  password: string
  nickname?: string
  phone?: string
  email?: string
  role?: string
}): User {
  const stmt = getDb().prepare(`
    INSERT INTO users (account, password, nickname, phone, email, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  stmt.run(
    data.account,
    data.password,
    data.nickname || '',
    data.phone || '',
    data.email || '',
    data.role || 'user'
  )
  const user = findUserByAccount(data.account)
  if (!user) {
    throw new Error('用户创建失败：无法读取新创建的用户')
  }
  return user
}

// ===== 体验码相关函数 =====

export interface TrialCode {
  id: number
  code: string
  max_uses: number
  qiaoxi_used: number
  qiaoyuan_used: number
  cxr_used: number
  is_active: number
  note: string
  created_at: string
  expires_at: string | null
}

export interface TrialBinding {
  id: number
  code_id: number
  user_id: number
  bound_at: string
}

export interface TrialLog {
  id: number
  code_id: number
  product: string
  user_id: number | null
  ip_address: string
  used_at: string
}

export function findTrialCode(code: string): TrialCode | undefined {
  return getDb().prepare('SELECT * FROM trial_codes WHERE code = ?').get(code) as TrialCode | undefined
}

export function findTrialCodeById(id: number): TrialCode | undefined {
  return getDb().prepare('SELECT * FROM trial_codes WHERE id = ?').get(id) as TrialCode | undefined
}

export function createTrialCode(code: string, maxUses: number = 5, note: string = '', expiresAt?: string): TrialCode {
  const stmt = getDb().prepare(`
    INSERT INTO trial_codes (code, max_uses, note, expires_at)
    VALUES (?, ?, ?, ?)
  `)
  stmt.run(code, maxUses, note, expiresAt || null)
  const created = findTrialCode(code)
  if (!created) throw new Error('体验码创建失败')
  return created
}

export function getAllTrialCodes(): TrialCode[] {
  return getDb().prepare('SELECT * FROM trial_codes ORDER BY created_at DESC').all() as TrialCode[]
}

export function deactivateTrialCode(id: number): void {
  getDb().prepare('UPDATE trial_codes SET is_active = 0 WHERE id = ?').run(id)
}

export function activateTrialCode(id: number): void {
  getDb().prepare('UPDATE trial_codes SET is_active = 1 WHERE id = ?').run(id)
}

export function bindTrialCodeToUser(codeId: number, userId: number): void {
  const stmt = getDb().prepare(`
    INSERT OR REPLACE INTO trial_bindings (code_id, user_id)
    VALUES (?, ?)
  `)
  stmt.run(codeId, userId)
}

export function findTrialBindingByUserId(userId: number): (TrialBinding & { code: string; max_uses: number; qiaoxi_used: number; qiaoyuan_used: number; cxr_used: number; is_active: number; expires_at: string | null }) | undefined {
  return getDb().prepare(`
    SELECT tb.*, tc.code, tc.max_uses, tc.qiaoxi_used, tc.qiaoyuan_used, tc.cxr_used, tc.is_active, tc.expires_at
    FROM trial_bindings tb
    JOIN trial_codes tc ON tb.code_id = tc.id
    WHERE tb.user_id = ?
  `).get(userId) as any
}

export function getTrialBindingByCodeId(codeId: number): TrialBinding | undefined {
  return getDb().prepare('SELECT * FROM trial_bindings WHERE code_id = ?').get(codeId) as TrialBinding | undefined
}

export function incrementTrialUsage(codeId: number, product: 'qiaoxi' | 'qiaoyuan' | 'cxr'): void {
  const col = `${product}_used`
  getDb().prepare(`UPDATE trial_codes SET ${col} = ${col} + 1 WHERE id = ?`).run(codeId)
}

export function addTrialLog(codeId: number, product: string, userId: number | null, ipAddress: string): void {
  getDb().prepare(`
    INSERT INTO trial_logs (code_id, product, user_id, ip_address)
    VALUES (?, ?, ?, ?)
  `).run(codeId, product, userId, ipAddress)
}

export function getTrialLogsByCodeId(codeId: number): TrialLog[] {
  return getDb().prepare('SELECT * FROM trial_logs WHERE code_id = ? ORDER BY used_at DESC').all(codeId) as TrialLog[]
}

export function getAllTrialLogs(): (TrialLog & { code: string })[] {
  return getDb().prepare(`
    SELECT tl.*, tc.code
    FROM trial_logs tl
    JOIN trial_codes tc ON tl.code_id = tc.id
    ORDER BY tl.used_at DESC
  `).all() as any
}

export default getDb
