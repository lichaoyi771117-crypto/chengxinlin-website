import { NextResponse } from 'next/server'
import { currentPrice, AUTH_CODE_CONFIG } from '@/lib/config'

export async function GET() {
  return NextResponse.json({
    price: currentPrice(),
    promoActive: AUTH_CODE_CONFIG.PROMO_ACTIVE,
    priceNormal: AUTH_CODE_CONFIG.PRICE_NORMAL,
    pricePromo: AUTH_CODE_CONFIG.PRICE_PROMO,
    method: AUTH_CODE_CONFIG.PAYMENT_PROVIDER,
  })
}
