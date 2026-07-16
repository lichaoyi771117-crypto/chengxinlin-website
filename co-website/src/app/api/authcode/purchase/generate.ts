import crypto from 'crypto'

export function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.randomBytes(8)
  let result = 'CXL-'
  for (let i = 0; i < 8; i++) {
    if (i === 4) result += '-'
    result += chars.charAt(bytes[i] % chars.length)
  }
  return result
}
