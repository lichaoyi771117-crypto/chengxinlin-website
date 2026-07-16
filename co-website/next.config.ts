import type { NextConfig } from "next";

const frameSources = [
  "'self'",
  process.env.NEXT_PUBLIC_QIAOXI_URL || 'http://localhost:8511',
  process.env.NEXT_PUBLIC_QIAOYUAN_URL || 'http://localhost:8512',
  process.env.NEXT_PUBLIC_CHENXI_URL || 'http://localhost:8513',
  process.env.NEXT_PUBLIC_CXR_URL || 'http://localhost:8090',
].join(' ')

const nextConfig: NextConfig = {
  // 安全响应头
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 防止点击劫持 (Clickjacking)
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // 防止 MIME 类型嗅探
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // XSS 保护（旧浏览器）
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // 强制 HTTPS（1年，包含子域名）
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Content-Security-Policy：限制资源加载来源
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "media-src 'self' blob:",
              "connect-src 'self'",
              `frame-src ${frameSources}`,
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          // Referrer 策略：仅发送 origin 给跨域请求
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // 权限策略：禁用不需要的浏览器功能
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
