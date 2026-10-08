import { NextRequest, NextResponse } from 'next/server';
import { defaultChargingProvider } from '@/lib/providers/ChargingDataProvider';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const station = await defaultChargingProvider.getStation(params.id);

  if (!station) {
    return NextResponse.json(
      { success: false, error: 'Station not found' },
      { status: 404 }
    );
  }

  const availability = await defaultChargingProvider.getAvailability(params.id);

  return NextResponse.json({
    success: true,
    data: station,
    availability: availability.metadata,
  });
}
