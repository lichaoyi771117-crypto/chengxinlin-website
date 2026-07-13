import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  return NextResponse.json({ method: process.env.PAYMENT_PROVIDER || 'aggregator' })
}
