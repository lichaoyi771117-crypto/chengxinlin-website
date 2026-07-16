import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

let _db: Database.Database | null = null

// 硬编码管理员账号（初始密码，可修改）
const HARDCODED_ADMINS = [
  { account: 'lichaoyi', nickname: '李超逸', password: '123456' },
  { account: 'yulei', nickname: '余磊', password: '123456' },
]

// 管理员专属授权码（硬编码，永久绑定本人，子程序各 99999 次，陈曦不限）
export const ADMIN_AUTH_CODES: Record<string, string> = {
  lichaoyi: 'LICHAOYI-ADMIN-UNLIMITED',
  yulei: 'YULEI-ADMIN-UNLIMITED',
}
const ADMIN_CODE_CAP = 99999

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
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS authorization_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      qiaoxi_cap INTEGER NOT NULL DEFAULT 15,
      qiaoyuan_cap INTEGER NOT NULL DEFAULT 15,
      cxr_cap INTEGER NOT NULL DEFAULT 15,
      qiaoxi_used INTEGER NOT NULL DEFAULT 0,
      qiaoyuan_used INTEGER NOT NULL DEFAULT 0,
      cxr_used INTEGER NOT NULL DEFAULT 0,
      chenxi_used INTEGER NOT NULL DEFAULT 0,
      chenxi_unlimited INTEGER NOT NULL DEFAULT 1,
      is_active INTEGER NOT NULL DEFAULT 1,
      source TEXT NOT NULL DEFAULT 'admin_free',
      order_id INTEGER,
      note TEXT DEFAULT '',
      created_by TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS authorization_bindings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      bound_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (code_id) REFERENCES authorization_codes(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id)
    );

    CREATE TABLE IF NOT EXISTS authorization_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code_id INTEGER NOT NULL,
      product TEXT NOT NULL,
      user_id INTEGER,
      ip_address TEXT DEFAULT '',
      used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (code_id) REFERENCES authorization_codes(id)
    );

    CREATE TABLE IF NOT EXISTS authorization_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'CNY',
      status TEXT DEFAULT 'pending',
      payment_method TEXT,
      provider_order_id TEXT,
      paid_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS authorization_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      reason TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      reviewed_by INTEGER,
      reviewed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `)

  migrate(_db)

  // 初始化硬编码管理员账号
  initializeHardcodedAdmins()
  // 为管理员生成并绑定专属永久授权码
  initializeHardcodedAdminCodes()

  return _db
}

// 兼容旧库：将 trial_* 表重命名为 authorization_* 并补齐新字段
function migrate(db: Database.Database) {
  const tableExists = (name: string) =>
    !!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(name)

  // 旧库已部分迁移：trial_* 与新 authorization_* 表共存时，直接 RENAME 会
  // 因 "table already exists" 冲突而崩溃，导致 getDb 抛错、授权码无法初始化。
  // 此时 trial_* 是孤儿空表，直接删除以消除冲突。
  if (tableExists('trial_codes') && tableExists('authorization_codes')) {
    db.exec('PRAGMA foreign_keys = OFF')
    db.exec(`
      DROP TABLE IF EXISTS trial_codes;
      DROP TABLE IF EXISTS trial_bindings;
      DROP TABLE IF EXISTS trial_logs;
      DROP TABLE IF EXISTS trial_requests;
    `)
    db.exec('PRAGMA foreign_keys = ON')
  }

  if (tableExists('trial_codes')) {
    db.exec('ALTER TABLE trial_codes RENAME TO authorization_codes')
  }
  if (tableExists('trial_bindings')) {
    db.exec('ALTER TABLE trial_bindings RENAME TO authorization_bindings')
  }
  if (tableExists('trial_logs')) {
    db.exec('ALTER TABLE trial_logs RENAME TO authorization_logs')
  }

  const cols = () =>
    db.prepare('PRAGMA table_info(authorization_codes)').all().map((c: any) => c.name)

  const addColumn = (name: string, def: string) => {
    if (!cols().includes(name)) {
      db.exec(`ALTER TABLE authorization_codes ADD COLUMN ${name} ${def}`)
    }
  }

  addColumn('chenxi_unlimited', 'INTEGER NOT NULL DEFAULT 1')
  addColumn('source', "TEXT NOT NULL DEFAULT 'admin_free'")
  addColumn('order_id', 'INTEGER')
  addColumn('qiaoxi_cap', 'INTEGER NOT NULL DEFAULT 15')
  addColumn('qiaoyuan_cap', 'INTEGER NOT NULL DEFAULT 15')
  addColumn('cxr_cap', 'INTEGER NOT NULL DEFAULT 15')

  // 用户表：trial_decline（拒绝试用码次数，连续3次后不再提示）
  const userCols = () =>
    db.prepare('PRAGMA table_info(users)').all().map((c: any) => c.name)
  if (!userCols().includes('trial_decline')) {
    db.exec('ALTER TABLE users ADD COLUMN trial_decline INTEGER NOT NULL DEFAULT 0')
  }
  if (!userCols().includes('deleted_at')) {
    db.exec('ALTER TABLE users ADD COLUMN deleted_at DATETIME')
  }

  // 旧数据：用原 max_uses 回填各产品上限
  if (cols().includes('max_uses')) {
    db.exec(`
      UPDATE authorization_codes
      SET qiaoxi_cap = COALESCE(max_uses, 15),
          qiaoyuan_cap = COALESCE(max_uses, 15),
          cxr_cap = COALESCE(max_uses, 15)
      WHERE max_uses IS NOT NULL
    `)
    try { db.exec('ALTER TABLE authorization_codes DROP COLUMN max_uses') } catch { /* sqlite < 3.35 */ }
  }

  // 旧授权申请表重命名
  if (tableExists('trial_requests')) {
    db.exec('ALTER TABLE trial_requests RENAME TO authorization_requests')
  }
}

function initializeHardcodedAdmins(): void {
  const db = _db
  if (!db) return

  for (const admin of HARDCODED_ADMINS) {
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(account) = LOWER(?)').get(admin.account)
    if (!existing) {
      const hashedPassword = bcrypt.hashSync(admin.password, 10)
      db.prepare(`
        INSERT INTO users (account, password, nickname, role)
        VALUES (?, ?, ?, 'admin')
      `).run(admin.account, hashedPassword, admin.nickname)
      console.log(`Created hardcoded admin: ${admin.account}`)
    }
  }
}

// 为每位硬编码管理员生成并绑定专属永久授权码（子程序各 99999 次，陈曦不限）
function initializeHardcodedAdminCodes(): void {
  const db = _db
  if (!db) return

  for (const admin of HARDCODED_ADMINS) {
    const code = ADMIN_AUTH_CODES[admin.account]
    if (!code) continue

    const user = db.prepare('SELECT id FROM users WHERE LOWER(account) = LOWER(?)').get(admin.account) as { id: number } | undefined
    if (!user) continue

    let authCode = findAuthorizationCode(code)
    if (!authCode) {
      authCode = createAuthorizationCode(
        code,
        { qiaoxi: ADMIN_CODE_CAP, qiaoyuan: ADMIN_CODE_CAP, cxr: ADMIN_CODE_CAP },
        '管理员专属·无限次授权',
        undefined,
        admin.account,
        'admin'
      )
      console.log(`Created admin authorization code for ${admin.account}`)
    }

    bindAuthorizationCodeToUser(authCode.id, user.id)
  }
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
  return getDb().prepare('SELECT id, account, nickname, phone, email, role, created_at FROM users WHERE LOWER(account) = LOWER(?)').get(account) as User | undefined
}

export function findUserById(id: number): User | undefined {
  return getDb().prepare('SELECT id, account, nickname, phone, email, role, created_at FROM users WHERE id = ?').get(id) as User | undefined
}

export function findUserByPhone(phone: string): User | undefined {
  return getDb().prepare('SELECT id, account, nickname, phone, email, role, created_at FROM users WHERE phone = ?').get(phone) as User | undefined
}

export function findUserByEmail(email: string): User | undefined {
  return getDb().prepare('SELECT id, account, nickname, phone, email, role, created_at FROM users WHERE email = ?').get(email) as User | undefined
}

export function getPasswordHash(account: string): string | undefined {
  const row = getDb().prepare('SELECT password FROM users WHERE LOWER(account) = LOWER(?)').get(account) as { password: string } | undefined
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

// ===== 试用码相关 =====

// 试用码配额
export const TRIAL_CAPS = { qiaoxi: 3, qiaoyuan: 3, cxr: 3, chenxi: 10 }
const TRIAL_VALIDITY_MS = 30 * 24 * 60 * 60 * 1000 // 30 天

function generateTrialCodeStr(userId: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.randomBytes(6)
  let suffix = ''
  for (let i = 0; i < 6; i++) suffix += chars.charAt(bytes[i] % chars.length)
  return `TRY-${userId}-${suffix}`
}

/** 为用户生成并自动绑定试用码，返回授权码与当前 remaining */
export function createAndBindTrialCode(userId: number): { code: string; remaining: Record<string, number> } | null {
  const db = getDb()

  // 该用户是否已有授权码（试用或付费都算）
  const existing = db.prepare(
    'SELECT ab.id FROM authorization_bindings ab WHERE ab.user_id = ?'
  ).get(userId)
  if (existing) return null // 已有绑定 → 不重复生成试用码

  const code = generateTrialCodeStr(userId)
  const expiresAt = new Date(Date.now() + TRIAL_VALIDITY_MS).toISOString()

  const caps = TRIAL_CAPS

  db.prepare(`
    INSERT INTO authorization_codes
      (code, qiaoxi_cap, qiaoyuan_cap, cxr_cap, note, expires_at, created_by, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'trial')
  `).run(code, caps.qiaoxi, caps.qiaoyuan, caps.cxr, '新用户30天试用', expiresAt, 'SYSTEM')

  const created = db.prepare('SELECT id FROM authorization_codes WHERE code = ?').get(code) as { id: number }
  if (!created) return null

  // 绑定并激活
  db.prepare('INSERT OR REPLACE INTO authorization_bindings (code_id, user_id) VALUES (?, ?)').run(created.id, userId)

  return {
    code,
    remaining: { qiaoxi: caps.qiaoxi, qiaoyuan: caps.qiaoyuan, cxr: caps.cxr, chenxi: caps.chenxi },
  }
}

/** 用户拒绝试用码：递增 trial_decline 并返回最新次数 */
export function incrementTrialDecline(userId: number): number {
  const db = getDb()
  const row = db.prepare('SELECT trial_decline FROM users WHERE id = ?').get(userId) as { trial_decline: number } | undefined
  if (!row) return 0
  const n = row.trial_decline + 1
  db.prepare('UPDATE users SET trial_decline = ? WHERE id = ?').run(n, userId)
  return n
}

/** 查询用户当前 trial_decline */
export function getTrialDecline(userId: number): number {
  const row = getDb().prepare('SELECT trial_decline FROM users WHERE id = ?').get(userId) as { trial_decline: number } | undefined
  return row?.trial_decline ?? 0
}

// ===== 授权码相关函数 =====

export interface AuthorizationCode {
  id: number
  code: string
  qiaoxi_cap: number
  qiaoyuan_cap: number
  cxr_cap: number
  qiaoxi_used: number
  qiaoyuan_used: number
  cxr_used: number
  chenxi_used: number
  chenxi_unlimited: number
  is_active: number
  source: string
  order_id: number | null
  note: string
  created_by: string
  created_at: string
  expires_at: string | null
}

export interface AuthorizationBinding {
  id: number
  code_id: number
  user_id: number
  bound_at: string
}

export interface AuthorizationLog {
  id: number
  code_id: number
  product: string
  user_id: number | null
  ip_address: string
  used_at: string
}

export function findAuthorizationCode(code: string): AuthorizationCode | undefined {
  return getDb().prepare('SELECT * FROM authorization_codes WHERE code = ?').get(code) as AuthorizationCode | undefined
}

export function findAuthorizationCodeById(id: number): AuthorizationCode | undefined {
  return getDb().prepare('SELECT * FROM authorization_codes WHERE id = ?').get(id) as AuthorizationCode | undefined
}

export function createAuthorizationCode(
  code: string,
  caps: { qiaoxi: number; qiaoyuan: number; cxr: number },
  note: string = '',
  expiresAt?: string,
  createdBy: string = '',
  source: 'admin_free' | 'paid' | 'admin' = 'admin_free',
  orderId: number | null = null
): AuthorizationCode {
  const stmt = getDb().prepare(`
    INSERT INTO authorization_codes
      (code, qiaoxi_cap, qiaoyuan_cap, cxr_cap, note, expires_at, created_by, source, order_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  stmt.run(code, caps.qiaoxi, caps.qiaoyuan, caps.cxr, note, expiresAt || null, createdBy, source, orderId)
  const created = findAuthorizationCode(code)
  if (!created) throw new Error('授权码创建失败')
  return created
}

export function getAllAuthorizationCodes(): AuthorizationCode[] {
  return getDb().prepare('SELECT * FROM authorization_codes ORDER BY created_at DESC').all() as AuthorizationCode[]
}

// 仅统计「管理员免费生成」的码（付费码不占额度）
export function countAdminFreeCodes(createdBy: string): number {
  return (getDb().prepare(
    "SELECT COUNT(*) as c FROM authorization_codes WHERE source = 'admin_free' AND LOWER(created_by) = LOWER(?)"
  ).get(createdBy) as any).c
}

export function deactivateAuthorizationCode(id: number): void {
  getDb().prepare('UPDATE authorization_codes SET is_active = 0 WHERE id = ?').run(id)
}

export function activateAuthorizationCode(id: number): void {
  getDb().prepare('UPDATE authorization_codes SET is_active = 1 WHERE id = ?').run(id)
}

// 管理员授权码有效期（3 年 = 1095 天），可通过环境变量 AUTH_CODE_ADMIN_VALIDITY_DAYS 调整
const ADMIN_CODE_VALIDITY_MS = Number(process.env.AUTH_CODE_ADMIN_VALIDITY_DAYS ?? 1095) * 24 * 60 * 60 * 1000

export function bindAuthorizationCodeToUser(codeId: number, userId: number): void {
  const db = getDb()
  // 读取要绑定的授权码，判断其来源以决定有效期
  const code = db.prepare('SELECT expires_at, source FROM authorization_codes WHERE id = ?').get(codeId) as { expires_at: string | null; source: string } | undefined
  if (!code) return

  // 绑定即激活：仅当 expires_at 为 NULL（未激活）时计算并写入
  if (code.expires_at === null) {
    const expiresAt = code.source === 'admin'
      ? new Date(Date.now() + ADMIN_CODE_VALIDITY_MS).toISOString()
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    db.prepare('UPDATE authorization_codes SET expires_at = ? WHERE id = ?').run(expiresAt, codeId)
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO authorization_bindings (code_id, user_id)
    VALUES (?, ?)
  `)
  stmt.run(codeId, userId)
}

export function findAuthorizationBindingByUserId(userId: number): (AuthorizationBinding & {
  code: string
  qiaoxi_cap: number
  qiaoyuan_cap: number
  cxr_cap: number
  qiaoxi_used: number
  qiaoyuan_used: number
  cxr_used: number
  chenxi_used: number
  chenxi_unlimited: number
  is_active: number
  expires_at: string | null
}) | undefined {
  return getDb().prepare(`
    SELECT ab.*, ac.code, ac.qiaoxi_cap, ac.qiaoyuan_cap, ac.cxr_cap,
           ac.qiaoxi_used, ac.qiaoyuan_used, ac.cxr_used, ac.chenxi_used,
           ac.chenxi_unlimited, ac.is_active, ac.expires_at
    FROM authorization_bindings ab
    JOIN authorization_codes ac ON ab.code_id = ac.id
    WHERE ab.user_id = ?
  `).get(userId) as any
}

export function findBindingByCodeId(codeId: number): AuthorizationBinding | undefined {
  return getDb().prepare('SELECT * FROM authorization_bindings WHERE code_id = ?').get(codeId) as AuthorizationBinding | undefined
}

export function incrementAuthorizationUsage(codeId: number, product: 'qiaoxi' | 'qiaoyuan' | 'cxr' | 'chenxi'): void {
  const col = `${product}_used`
  getDb().prepare(`UPDATE authorization_codes SET ${col} = ${col} + 1 WHERE id = ?`).run(codeId)
}

// 次数划转：从源产品上限减去 n，加到目标产品上限（仅限 3 个限次产品，不含陈曦）
export function transferCap(
  codeId: number,
  from: 'qiaoxi' | 'qiaoyuan' | 'cxr',
  to: 'qiaoxi' | 'qiaoyuan' | 'cxr',
  amount: number
): boolean {
  const db = getDb()
  const code = findAuthorizationCodeById(codeId)
  if (!code) return false
  const fromCap = code[`${from}_cap` as keyof AuthorizationCode] as number
  const fromUsed = code[`${from}_used` as keyof AuthorizationCode] as number
  const fromRemaining = fromCap - fromUsed
  if (fromRemaining < amount || amount <= 0) return false

  const tx = db.transaction(() => {
    db.prepare(`UPDATE authorization_codes SET ${from}_cap = ${from}_cap - ? WHERE id = ?`).run(amount, codeId)
    db.prepare(`UPDATE authorization_codes SET ${to}_cap = ${to}_cap + ? WHERE id = ?`).run(amount, codeId)
  })
  tx()
  return true
}

export function addAuthorizationLog(codeId: number, product: string, userId: number | null, ipAddress: string): void {
  getDb().prepare(`
    INSERT INTO authorization_logs (code_id, product, user_id, ip_address)
    VALUES (?, ?, ?, ?)
  `).run(codeId, product, userId, ipAddress)
}

export function getAuthorizationLogsByCodeId(codeId: number): AuthorizationLog[] {
  return getDb().prepare('SELECT * FROM authorization_logs WHERE code_id = ? ORDER BY used_at DESC').all(codeId) as AuthorizationLog[]
}

export function getAllAuthorizationLogs(): (AuthorizationLog & { code: string })[] {
  return getDb().prepare(`
    SELECT al.*, ac.code
    FROM authorization_logs al
    JOIN authorization_codes ac ON al.code_id = ac.id
    ORDER BY al.used_at DESC
  `).all() as any
}

// ===== 支付订单相关函数 =====

export interface AuthorizationOrder {
  id: number
  user_id: number
  amount: number
  currency: string
  status: string
  payment_method: string | null
  provider_order_id: string | null
  paid_at: string | null
  created_at: string
}

export function createAuthorizationOrder(userId: number, amount: number, method: string): AuthorizationOrder {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO authorization_orders (user_id, amount, payment_method)
    VALUES (?, ?, ?)
  `)
  stmt.run(userId, amount, method)
  const id = (db.prepare('SELECT last_insert_rowid() as id').get() as any).id
  return getDb().prepare('SELECT * FROM authorization_orders WHERE id = ?').get(id) as AuthorizationOrder
}

export function getAuthorizationOrderById(id: number): AuthorizationOrder | undefined {
  return getDb().prepare('SELECT * FROM authorization_orders WHERE id = ?').get(id) as AuthorizationOrder | undefined
}

export function markOrderPaid(id: number, providerOrderId: string): void {
  getDb().prepare(`
    UPDATE authorization_orders
    SET status = 'paid', provider_order_id = ?, paid_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(providerOrderId, id)
}

// 累计收入（所有已支付订单）
export function getPaidOrdersTotal(): { total: number; count: number } {
  return getDb().prepare(`
    SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count
    FROM authorization_orders WHERE status = 'paid'
  `).get() as any
}

// ===== 会员与绑定相关函数 =====

export interface UserWithBinding {
  id: number
  account: string
  nickname: string
  phone: string
  email: string
  role: string
  created_at: string
  bound_at: string | null
  code_id: number | null
  code: string | null
  qiaoxi_cap: number | null
  qiaoyuan_cap: number | null
  cxr_cap: number | null
  qiaoxi_used: number | null
  qiaoyuan_used: number | null
  cxr_used: number | null
  chenxi_used: number | null
  chenxi_unlimited: number | null
  is_active: number | null
  expires_at: string | null
  source: string | null
}

export function getAllUsersWithBindings(): UserWithBinding[] {
  return getDb().prepare(`
    SELECT
      u.id, u.account, u.nickname, u.phone, u.email, u.role, u.created_at,
      ab.bound_at,
      ac.id AS code_id, ac.code, ac.qiaoxi_cap, ac.qiaoyuan_cap, ac.cxr_cap,
      ac.qiaoxi_used, ac.qiaoyuan_used, ac.cxr_used, ac.chenxi_used,
      ac.chenxi_unlimited, ac.is_active, ac.expires_at, ac.source
    FROM users u
    LEFT JOIN authorization_bindings ab ON u.id = ab.user_id
    LEFT JOIN authorization_codes ac ON ab.code_id = ac.id
    WHERE u.deleted_at IS NULL
    ORDER BY u.created_at DESC
  `).all() as UserWithBinding[]
}

export function getUnboundAuthorizationCodes(): AuthorizationCode[] {
  return getDb().prepare(`
    SELECT ac.*
    FROM authorization_codes ac
    WHERE ac.id NOT IN (SELECT code_id FROM authorization_bindings)
    ORDER BY ac.created_at DESC
  `).all() as AuthorizationCode[]
}

export function batchBindAuthorizationCodes(codeId: number, userIds: number[]): void {
  if (userIds.length === 0) return
  const db = getDb()

  const code = db.prepare('SELECT expires_at, source FROM authorization_codes WHERE id = ?').get(codeId) as { expires_at: string | null; source: string } | undefined
  if (code && code.expires_at === null) {
    const expiresAt = code.source === 'admin'
      ? new Date(Date.now() + ADMIN_CODE_VALIDITY_MS).toISOString()
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    db.prepare('UPDATE authorization_codes SET expires_at = ? WHERE id = ?').run(expiresAt, codeId)
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO authorization_bindings (code_id, user_id)
    VALUES (?, ?)
  `)
  const transaction = db.transaction((ids: number[]) => {
    for (const userId of ids) {
      stmt.run(codeId, userId)
    }
  })
  transaction(userIds)
}

export function batchUnbindAuthorizationCodes(userIds: number[]): void {
  if (userIds.length === 0) return
  const db = getDb()
  const stmt = db.prepare(`
    DELETE FROM authorization_bindings WHERE user_id = ?
  `)
  const transaction = db.transaction((ids: number[]) => {
    for (const userId of ids) {
      stmt.run(userId)
    }
  })
  transaction(userIds)
}

// ===== 会员管理函数 =====

export function updateUser(data: {
  id: number
  nickname?: string
  phone?: string
  email?: string
  role?: string
}): void {
  const updates: string[] = []
  const values: any[] = []

  if (data.nickname !== undefined) { updates.push('nickname = ?'); values.push(data.nickname) }
  if (data.phone !== undefined) { updates.push('phone = ?'); values.push(data.phone) }
  if (data.email !== undefined) { updates.push('email = ?'); values.push(data.email) }
  if (data.role !== undefined) { updates.push('role = ?'); values.push(data.role) }

  if (updates.length === 0) return

  updates.push('updated_at = CURRENT_TIMESTAMP')
  values.push(data.id)

  getDb().prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values)
}

export function updateUserPassword(account: string, hashedPassword: string): void {
  getDb().prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE LOWER(account) = LOWER(?)').run(hashedPassword, account)
}

export function softDeleteUser(id: number): void {
  getDb().prepare('UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?').run(id)
}

// ===== 授权申请（免费申请 + 管理员审批）=====

export function createAuthorizationRequest(userId: number, reason: string = ''): void {
  getDb().prepare(`
    INSERT INTO authorization_requests (user_id, reason)
    VALUES (?, ?)
  `).run(userId, reason)
}

export function getPendingAuthorizationRequests(): (AuthorizationRequest & { account: string; nickname: string })[] {
  return getDb().prepare(`
    SELECT ar.*, u.account, u.nickname
    FROM authorization_requests ar
    JOIN users u ON ar.user_id = u.id
    WHERE ar.status = 'pending' AND u.deleted_at IS NULL
    ORDER BY ar.created_at DESC
  `).all() as any
}

export function approveAuthorizationRequest(requestId: number, reviewedBy: number): AuthorizationCode | undefined {
  const db = getDb()
  const request = db.prepare('SELECT * FROM authorization_requests WHERE id = ?').get(requestId) as AuthorizationRequest | undefined
  if (!request || request.status !== 'pending') return undefined

  const unboundCodes = getUnboundAuthorizationCodes()
  if (unboundCodes.length === 0) return undefined

  const code = unboundCodes[0]
  const transaction = db.transaction(() => {
    bindAuthorizationCodeToUser(code.id, request.user_id)
    activateAuthorizationCode(code.id)
    db.prepare(`
      UPDATE authorization_requests
      SET status = 'approved', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(reviewedBy, requestId)
  })
  transaction()

  return code
}

export function rejectAuthorizationRequest(requestId: number, reviewedBy: number): void {
  getDb().prepare(`
    UPDATE authorization_requests
    SET status = 'rejected', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
    WHERE id = ? AND status = 'pending'
  `).run(reviewedBy, requestId)
}

export interface AuthorizationRequest {
  id: number
  user_id: number
  reason: string
  status: string
  reviewed_by: number | null
  reviewed_at: string | null
  created_at: string
}

export default getDb
