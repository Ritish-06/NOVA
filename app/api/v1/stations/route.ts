import { NextRequest, NextResponse } from 'next/server';
import { defaultChargingProvider } from '@/lib/providers/ChargingDataProvider';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city') || undefined;
  const country = searchParams.get('country') || undefined;
  const status = searchParams.get('status') || undefined;
  const minPowerKw = searchParams.get('minPowerKw') ? Number(searchParams.get('minPowerKw')) : undefined;

  const stations = await defaultChargingProvider.getStations({
    city,
    country,
    status,
    minPowerKw,
  });

  return NextResponse.json({
    success: true,
    count: stations.length,
    data: stations,
    meta: {
      provider: 'NOVA Provider Abstraction Layer',
      timestamp: new Date().toISOString(),
    },
  });
}
