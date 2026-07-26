// 授权码 / 付费相关配置
// 价格单位：元（CNY）。收款模式后定，先用桩占位。

export const AUTH_CODE_CONFIG = {
  // 价格
  PRICE_NORMAL: Number(process.env.AUTH_CODE_PRICE_NORMAL ?? 399),
  PRICE_PROMO: Number(process.env.AUTH_CODE_PRICE_PROMO ?? 199),
  PROMO_ACTIVE: (process.env.AUTH_CODE_PROMO_ACTIVE ?? 'true') !== 'false',

  // 每个限次产品默认可用次数（契审通/峤远/程晓融）
  DEFAULT_CAP: Number(process.env.AUTH_CODE_DEFAULT_CAP ?? 15),

  // 管理员免费额度（每个管理员）
  ADMIN_FREE_QUOTA: Number(process.env.AUTH_CODE_ADMIN_QUOTA ?? 200),

  // 收款管道（后续二选一切换）
  PAYMENT_PROVIDER: (process.env.PAYMENT_PROVIDER ?? 'aggregator') as 'aggregator' | 'bank_qr',

  // 开发期模拟支付成功（接真收款后改为 false）
  PAYMENT_SIMULATE: (process.env.PAYMENT_SIMULATE ?? 'true') !== 'false',

  // 授权码有效期（天）：年卡模式，默认 365 天
  VALIDITY_DAYS: Number(process.env.AUTH_CODE_VALIDITY_DAYS ?? 365),
}

// 授权码默认有效期（年卡：从当前时间起 +VALIDITY_DAYS 天），ISO 字符串供 expires_at 存储与校验
export function oneYearFromNow(): string {
  return new Date(Date.now() + AUTH_CODE_CONFIG.VALIDITY_DAYS * 24 * 60 * 60 * 1000).toISOString()
}

// 管理员授权码有效期（3 年），与普通年卡区分
export function threeYearsFromNow(): string {
  return new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString()
}

// 当前售价（促销期取促销价）
export function currentPrice(): number {
  return AUTH_CODE_CONFIG.PROMO_ACTIVE
    ? AUTH_CODE_CONFIG.PRICE_PROMO
    : AUTH_CODE_CONFIG.PRICE_NORMAL
}
