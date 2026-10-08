import { NextRequest, NextResponse } from 'next/server';
import { defaultChargingProvider } from '@/lib/providers/ChargingDataProvider';

export async function GET() {
  const networks = await defaultChargingProvider.getNetworks();
  return NextResponse.json({
    success: true,
    count: networks.length,
    data: networks,
  });
}
