import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const calcSchema = z.object({
  currentPct: z.number().min(0).max(99),
  targetPct: z.number().min(1).max(100),
  batteryCapacityKwh: z.number().positive(),
  chargingSpeedKw: z.number().positive(),
  electricityCostPerKwh: z.number().nonnegative(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = calcSchema.parse(body);

    const pctDelta = Math.max(0, parsed.targetPct - parsed.currentPct);
    const energyRequiredKwh = (pctDelta / 100) * parsed.batteryCapacityKwh;
    const estMins = Math.round((energyRequiredKwh / parsed.chargingSpeedKw) * 60 * 1.15);
    const estCost = energyRequiredKwh * parsed.electricityCostPerKwh;

    return NextResponse.json({
      success: true,
      calculation: {
        energyRequiredKwh,
        estimatedChargingTimeMins: estMins,
        estimatedCost: estCost,
      },
      disclaimer:
        'Charging time is an estimate. Actual charging speed varies with vehicle, charger, temperature, battery state, and charging curve.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid input' },
      { status: 400 }
    );
  }
}
