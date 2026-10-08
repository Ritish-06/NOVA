export interface EVModelSpec {
  model: string;
  batteryCapacityKwh: number;
  rangeKm: number;
  connectorType: 'CCS2' | 'NACS' | 'Type 2' | 'CHAdeMO';
  maxChargeRateKw: number;
  category?: 'Sedan' | 'SUV' | 'Crossover' | 'Hatchback' | 'Truck' | 'Sports' | 'Luxury';
}

export interface EVBrandCategory {
  category: 'Popular' | 'Global & Western' | 'Chinese Leaders' | 'Indian Market';
  brands: string[];
}

export const POPULAR_BRANDS = [
  'Tesla',
  'BMW',
  'BYD',
  'Mercedes-Benz',
  'Hyundai',
  'Kia',
  'Tata',
  'Mahindra',
];

export const BRAND_CATEGORIES: EVBrandCategory[] = [
  {
    category: 'Popular',
    brands: POPULAR_BRANDS,
  },
  {
    category: 'Global & Western',
    brands: [
      'Tesla', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche', 'Volvo', 'Polestar',
      'Rivian', 'Lucid', 'Ford', 'Chevrolet', 'Nissan', 'Renault', 'Peugeot', 'Citroën',
      'Fiat', 'Jaguar', 'Land Rover', 'Toyota', 'Lexus', 'Honda', 'Mitsubishi', 'Subaru',
      'Mazda', 'MINI', 'Genesis', 'Škoda', 'CUPRA', 'smart', 'Dacia', 'Jeep'
    ],
  },
  {
    category: 'Chinese Leaders',
    brands: [
      'BYD', 'Geely', 'Zeekr', 'XPeng', 'NIO', 'Xiaomi', 'Li Auto', 'Leapmotor',
      'Wuling', 'GAC Aion', 'AITO', 'Hongqi', 'Chery', 'Changan', 'Dongfeng', 'Neta',
      'BAIC', 'Great Wall Motors', 'Haval', 'Ora', 'IM Motors', 'Denza', 'Fang Cheng Bao'
    ],
  },
  {
    category: 'Indian Market',
    brands: [
      'Tata', 'Mahindra', 'MG', 'Hyundai', 'Kia', 'BYD', 'Maruti Suzuki', 'VinFast', 'Citroën'
    ],
  },
];

export const GLOBAL_EV_CATALOG: Record<string, EVModelSpec[]> = {
  Tesla: [
    { model: 'Model Y Long Range', batteryCapacityKwh: 75, rangeKm: 533, connectorType: 'CCS2', maxChargeRateKw: 250, category: 'SUV' },
    { model: 'Model Y Performance', batteryCapacityKwh: 78.1, rangeKm: 514, connectorType: 'CCS2', maxChargeRateKw: 250, category: 'SUV' },
    { model: 'Model 3 Long Range', batteryCapacityKwh: 78.1, rangeKm: 629, connectorType: 'NACS', maxChargeRateKw: 250, category: 'Sedan' },
    { model: 'Model 3 Performance', batteryCapacityKwh: 82, rangeKm: 547, connectorType: 'NACS', maxChargeRateKw: 250, category: 'Sedan' },
    { model: 'Model S Plaid', batteryCapacityKwh: 100, rangeKm: 637, connectorType: 'NACS', maxChargeRateKw: 250, category: 'Sedan' },
    { model: 'Model X Dual Motor', batteryCapacityKwh: 100, rangeKm: 576, connectorType: 'NACS', maxChargeRateKw: 250, category: 'SUV' },
    { model: 'Cybertruck Tri-Motor', batteryCapacityKwh: 123, rangeKm: 515, connectorType: 'NACS', maxChargeRateKw: 250, category: 'Truck' },
  ],
  BYD: [
    { model: 'Seal Performance AWD', batteryCapacityKwh: 82.56, rangeKm: 570, connectorType: 'CCS2', maxChargeRateKw: 150, category: 'Sedan' },
    { model: 'Atto 3 Extended', batteryCapacityKwh: 60.48, rangeKm: 521, connectorType: 'CCS2', maxChargeRateKw: 80, category: 'SUV' },
    { model: 'Dolphin Extended', batteryCapacityKwh: 60.48, rangeKm: 427, connectorType: 'CCS2', maxChargeRateKw: 88, category: 'Hatchback' },
    { model: 'Tang EV AWD', batteryCapacityKwh: 108.8, rangeKm: 530, connectorType: 'CCS2', maxChargeRateKw: 170, category: 'SUV' },
    { model: 'Han EV', batteryCapacityKwh: 85.4, rangeKm: 521, connectorType: 'CCS2', maxChargeRateKw: 120, category: 'Sedan' },
    { model: 'Sealion 7', batteryCapacityKwh: 82.5, rangeKm: 550, connectorType: 'CCS2', maxChargeRateKw: 150, category: 'SUV' },
    { model: 'Yangwang U8', batteryCapacityKwh: 49.05, rangeKm: 180, connectorType: 'CCS2', maxChargeRateKw: 110, category: 'SUV' },
  ],
  BMW: [
    { model: 'i4 eDrive40', batteryCapacityKwh: 83.9, rangeKm: 590, connectorType: 'CCS2', maxChargeRateKw: 205, category: 'Sedan' },
    { model: 'i4 M50', batteryCapacityKwh: 83.9, rangeKm: 521, connectorType: 'CCS2', maxChargeRateKw: 205, category: 'Sports' },
    { model: 'iX xDrive50', batteryCapacityKwh: 111.5, rangeKm: 630, connectorType: 'CCS2', maxChargeRateKw: 195, category: 'SUV' },
    { model: 'i7 xDrive60', batteryCapacityKwh: 101.7, rangeKm: 625, connectorType: 'CCS2', maxChargeRateKw: 195, category: 'Luxury' },
    { model: 'i5 eDrive40', batteryCapacityKwh: 81.2, rangeKm: 582, connectorType: 'CCS2', maxChargeRateKw: 205, category: 'Sedan' },
    { model: 'iX1 xDrive30', batteryCapacityKwh: 64.7, rangeKm: 440, connectorType: 'CCS2', maxChargeRateKw: 130, category: 'Crossover' },
    { model: 'iX3 M Sport', batteryCapacityKwh: 80, rangeKm: 460, connectorType: 'CCS2', maxChargeRateKw: 150, category: 'SUV' },
  ],
  'Mercedes-Benz': [
    { model: 'EQS 580 4MATIC', batteryCapacityKwh: 107.8, rangeKm: 770, connectorType: 'CCS2', maxChargeRateKw: 200, category: 'Luxury' },
    { model: 'EQE 350+', batteryCapacityKwh: 90.6, rangeKm: 660, connectorType: 'CCS2', maxChargeRateKw: 170, category: 'Sedan' },
    { model: 'EQB 350 4MATIC', batteryCapacityKwh: 66.5, rangeKm: 419, connectorType: 'CCS2', maxChargeRateKw: 100, category: 'SUV' },
    { model: 'EQA 250+', batteryCapacityKwh: 70.5, rangeKm: 528, connectorType: 'CCS2', maxChargeRateKw: 100, category: 'Crossover' },
    { model: 'G 580 EQ', batteryCapacityKwh: 116, rangeKm: 473, connectorType: 'CCS2', maxChargeRateKw: 200, category: 'SUV' },
  ],
  Tata: [
    { model: 'Nexon EV Max Long Range', batteryCapacityKwh: 40.5, rangeKm: 453, connectorType: 'CCS2', maxChargeRateKw: 50, category: 'SUV' },
    { model: 'Curvv EV 55', batteryCapacityKwh: 55, rangeKm: 585, connectorType: 'CCS2', maxChargeRateKw: 70, category: 'Crossover' },
    { model: 'Punch EV Long Range', batteryCapacityKwh: 35, rangeKm: 421, connectorType: 'CCS2', maxChargeRateKw: 50, category: 'Crossover' },
    { model: 'Tiago EV Long Range', batteryCapacityKwh: 24, rangeKm: 315, connectorType: 'CCS2', maxChargeRateKw: 25, category: 'Hatchback' },
    { model: 'Harrier EV', batteryCapacityKwh: 60, rangeKm: 500, connectorType: 'CCS2', maxChargeRateKw: 100, category: 'SUV' },
  ],
  Mahindra: [
    { model: 'XUV400 EL Pro', batteryCapacityKwh: 39.4, rangeKm: 456, connectorType: 'CCS2', maxChargeRateKw: 50, category: 'SUV' },
    { model: 'BE.05 Electric', batteryCapacityKwh: 60, rangeKm: 480, connectorType: 'CCS2', maxChargeRateKw: 150, category: 'SUV' },
    { model: 'XUV.e8 AWD', batteryCapacityKwh: 80, rangeKm: 500, connectorType: 'CCS2', maxChargeRateKw: 175, category: 'SUV' },
  ],
  Hyundai: [
    { model: 'Ioniq 5 AWD', batteryCapacityKwh: 77.4, rangeKm: 481, connectorType: 'CCS2', maxChargeRateKw: 235, category: 'Crossover' },
    { model: 'Ioniq 6 Long Range', batteryCapacityKwh: 77.4, rangeKm: 614, connectorType: 'CCS2', maxChargeRateKw: 235, category: 'Sedan' },
    { model: 'Kona Electric Long Range', batteryCapacityKwh: 64.8, rangeKm: 490, connectorType: 'CCS2', maxChargeRateKw: 100, category: 'Crossover' },
    { model: 'Creta EV', batteryCapacityKwh: 45, rangeKm: 450, connectorType: 'CCS2', maxChargeRateKw: 80, category: 'SUV' },
  ],
  Kia: [
    { model: 'EV6 GT AWD', batteryCapacityKwh: 77.4, rangeKm: 424, connectorType: 'CCS2', maxChargeRateKw: 235, category: 'Crossover' },
    { model: 'EV9 Land AWD', batteryCapacityKwh: 99.8, rangeKm: 505, connectorType: 'CCS2', maxChargeRateKw: 210, category: 'SUV' },
    { model: 'EV3 Long Range', batteryCapacityKwh: 81.4, rangeKm: 600, connectorType: 'CCS2', maxChargeRateKw: 128, category: 'SUV' },
    { model: 'Niro EV', batteryCapacityKwh: 64.8, rangeKm: 460, connectorType: 'CCS2', maxChargeRateKw: 100, category: 'Crossover' },
  ],
  Porsche: [
    { model: 'Taycan Turbo S', batteryCapacityKwh: 93.4, rangeKm: 450, connectorType: 'CCS2', maxChargeRateKw: 270, category: 'Sports' },
    { model: 'Macan Electric Turbo', batteryCapacityKwh: 100, rangeKm: 591, connectorType: 'CCS2', maxChargeRateKw: 270, category: 'SUV' },
    { model: 'Taycan Cross Turismo 4S', batteryCapacityKwh: 93.4, rangeKm: 456, connectorType: 'CCS2', maxChargeRateKw: 270, category: 'Sports' },
  ],
  Audi: [
    { model: 'RS e-tron GT', batteryCapacityKwh: 93.4, rangeKm: 472, connectorType: 'CCS2', maxChargeRateKw: 270, category: 'Sports' },
    { model: 'Q8 e-tron 55', batteryCapacityKwh: 114, rangeKm: 600, connectorType: 'CCS2', maxChargeRateKw: 170, category: 'SUV' },
    { model: 'Q4 e-tron 45', batteryCapacityKwh: 77, rangeKm: 530, connectorType: 'CCS2', maxChargeRateKw: 135, category: 'SUV' },
    { model: 'Q6 e-tron quattro', batteryCapacityKwh: 100, rangeKm: 625, connectorType: 'CCS2', maxChargeRateKw: 270, category: 'SUV' },
  ],
  Xiaomi: [
    { model: 'SU7 Max AWD', batteryCapacityKwh: 101, rangeKm: 800, connectorType: 'CCS2', maxChargeRateKw: 310, category: 'Sedan' },
    { model: 'SU7 Pro', batteryCapacityKwh: 94.3, rangeKm: 830, connectorType: 'CCS2', maxChargeRateKw: 250, category: 'Sedan' },
    { model: 'SU7 Ultra Track Edition', batteryCapacityKwh: 93.7, rangeKm: 620, connectorType: 'CCS2', maxChargeRateKw: 400, category: 'Sports' },
  ],
  Zeekr: [
    { model: 'Zeekr 001 FR', batteryCapacityKwh: 100, rangeKm: 620, connectorType: 'CCS2', maxChargeRateKw: 360, category: 'Sports' },
    { model: 'Zeekr 007 Long Range', batteryCapacityKwh: 75.6, rangeKm: 688, connectorType: 'CCS2', maxChargeRateKw: 310, category: 'Sedan' },
    { model: 'Zeekr X AWD', batteryCapacityKwh: 66, rangeKm: 440, connectorType: 'CCS2', maxChargeRateKw: 150, category: 'Crossover' },
  ],
  NIO: [
    { model: 'ET7 Executive Edition', batteryCapacityKwh: 100, rangeKm: 580, connectorType: 'CCS2', maxChargeRateKw: 180, category: 'Sedan' },
    { model: 'ES8 Flagship SUV', batteryCapacityKwh: 100, rangeKm: 500, connectorType: 'CCS2', maxChargeRateKw: 180, category: 'SUV' },
    { model: 'EL6 Smart SUV', batteryCapacityKwh: 75, rangeKm: 483, connectorType: 'CCS2', maxChargeRateKw: 180, category: 'SUV' },
  ],
  XPeng: [
    { model: 'G9 AWD Performance', batteryCapacityKwh: 98, rangeKm: 570, connectorType: 'CCS2', maxChargeRateKw: 300, category: 'SUV' },
    { model: 'P7i Wing Edition', batteryCapacityKwh: 86.2, rangeKm: 702, connectorType: 'CCS2', maxChargeRateKw: 175, category: 'Sedan' },
    { model: 'G6 Ultra Smart Coupe', batteryCapacityKwh: 87.5, rangeKm: 570, connectorType: 'CCS2', maxChargeRateKw: 280, category: 'Crossover' },
  ],
  Rivian: [
    { model: 'R1T Dual-Motor', batteryCapacityKwh: 135, rangeKm: 560, connectorType: 'NACS', maxChargeRateKw: 220, category: 'Truck' },
    { model: 'R1S Quad-Motor', batteryCapacityKwh: 135, rangeKm: 516, connectorType: 'NACS', maxChargeRateKw: 220, category: 'SUV' },
    { model: 'R2 SUV', batteryCapacityKwh: 85, rangeKm: 480, connectorType: 'NACS', maxChargeRateKw: 220, category: 'SUV' },
  ],
  Lucid: [
    { model: 'Air Grand Touring', batteryCapacityKwh: 112, rangeKm: 830, connectorType: 'CCS2', maxChargeRateKw: 300, category: 'Luxury' },
    { model: 'Gravity SUV', batteryCapacityKwh: 118, rangeKm: 700, connectorType: 'CCS2', maxChargeRateKw: 300, category: 'SUV' },
  ],
  Volvo: [
    { model: 'EX90 Twin Motor', batteryCapacityKwh: 111, rangeKm: 600, connectorType: 'CCS2', maxChargeRateKw: 250, category: 'SUV' },
    { model: 'EX30 Twin Motor Performance', batteryCapacityKwh: 69, rangeKm: 460, connectorType: 'CCS2', maxChargeRateKw: 153, category: 'Crossover' },
    { model: 'XC40 Recharge Ultimate', batteryCapacityKwh: 82, rangeKm: 537, connectorType: 'CCS2', maxChargeRateKw: 200, category: 'SUV' },
  ],
  Polestar: [
    { model: 'Polestar 2 Long Range Single Motor', batteryCapacityKwh: 82, rangeKm: 654, connectorType: 'CCS2', maxChargeRateKw: 205, category: 'Sedan' },
    { model: 'Polestar 3 Long Range Dual Motor', batteryCapacityKwh: 111, rangeKm: 610, connectorType: 'CCS2', maxChargeRateKw: 250, category: 'SUV' },
    { model: 'Polestar 4 Long Range', batteryCapacityKwh: 100, rangeKm: 600, connectorType: 'CCS2', maxChargeRateKw: 200, category: 'Crossover' },
  ],
  Volkswagen: [
    { model: 'ID.4 Pro Performance', batteryCapacityKwh: 77, rangeKm: 525, connectorType: 'CCS2', maxChargeRateKw: 175, category: 'SUV' },
    { model: 'ID.7 Pro S', batteryCapacityKwh: 86, rangeKm: 700, connectorType: 'CCS2', maxChargeRateKw: 200, category: 'Sedan' },
    { model: 'ID. Buzz Pro', batteryCapacityKwh: 77, rangeKm: 423, connectorType: 'CCS2', maxChargeRateKw: 170, category: 'Crossover' },
  ],
  Ford: [
    { model: 'Mustang Mach-E GT', batteryCapacityKwh: 91, rangeKm: 490, connectorType: 'CCS2', maxChargeRateKw: 150, category: 'Crossover' },
    { model: 'F-150 Lightning Extended Range', batteryCapacityKwh: 131, rangeKm: 515, connectorType: 'NACS', maxChargeRateKw: 150, category: 'Truck' },
    { model: 'Explorer EV Extended Range', batteryCapacityKwh: 79, rangeKm: 602, connectorType: 'CCS2', maxChargeRateKw: 185, category: 'SUV' },
  ],
  Chevrolet: [
    { model: 'Blazer EV SS', batteryCapacityKwh: 102, rangeKm: 467, connectorType: 'NACS', maxChargeRateKw: 190, category: 'SUV' },
    { model: 'Equinox EV 2LT', batteryCapacityKwh: 85, rangeKm: 513, connectorType: 'NACS', maxChargeRateKw: 150, category: 'Crossover' },
    { model: 'Silverado EV RST', batteryCapacityKwh: 205, rangeKm: 724, connectorType: 'NACS', maxChargeRateKw: 350, category: 'Truck' },
  ],
  Nissan: [
    { model: 'Ariya Evolve+ e-4ORCE', batteryCapacityKwh: 87, rangeKm: 500, connectorType: 'CCS2', maxChargeRateKw: 130, category: 'SUV' },
    { model: 'Leaf e+ N-Connecta', batteryCapacityKwh: 62, rangeKm: 385, connectorType: 'CCS2', maxChargeRateKw: 100, category: 'Hatchback' },
  ],
  MG: [
    { model: 'ZS EV Exclusive', batteryCapacityKwh: 50.3, rangeKm: 461, connectorType: 'CCS2', maxChargeRateKw: 50, category: 'SUV' },
    { model: 'Windsor EV 38', batteryCapacityKwh: 38, rangeKm: 331, connectorType: 'CCS2', maxChargeRateKw: 45, category: 'Crossover' },
    { model: 'MG4 EV Extended Range', batteryCapacityKwh: 77, rangeKm: 520, connectorType: 'CCS2', maxChargeRateKw: 144, category: 'Hatchback' },
    { model: 'Cyberster GT AWD', batteryCapacityKwh: 77, rangeKm: 507, connectorType: 'CCS2', maxChargeRateKw: 144, category: 'Sports' },
  ],
  VinFast: [
    { model: 'VF 8 Plus AWD', batteryCapacityKwh: 87.7, rangeKm: 471, connectorType: 'CCS2', maxChargeRateKw: 160, category: 'SUV' },
    { model: 'VF 9 Plus AWD', batteryCapacityKwh: 123, rangeKm: 594, connectorType: 'CCS2', maxChargeRateKw: 160, category: 'SUV' },
  ],
  'Maruti Suzuki': [
    { model: 'eVX Concept Dual-Motor', batteryCapacityKwh: 60, rangeKm: 550, connectorType: 'CCS2', maxChargeRateKw: 120, category: 'SUV' },
  ],
};

export function getAllBrands(): string[] {
  const brandSet = new Set<string>();
  BRAND_CATEGORIES.forEach((cat) => cat.brands.forEach((b) => brandSet.add(b)));
  Object.keys(GLOBAL_EV_CATALOG).forEach((b) => brandSet.add(b));
  return Array.from(brandSet).sort();
}

export function getModelsForBrand(brand: string): EVModelSpec[] {
  if (GLOBAL_EV_CATALOG[brand]) {
    return GLOBAL_EV_CATALOG[brand];
  }
  // Generic models for any unlisted custom brand
  return [
    { model: `${brand} Standard EV`, batteryCapacityKwh: 60, rangeKm: 400, connectorType: 'CCS2', maxChargeRateKw: 100, category: 'Crossover' },
    { model: `${brand} Long Range EV`, batteryCapacityKwh: 85, rangeKm: 550, connectorType: 'CCS2', maxChargeRateKw: 180, category: 'Sedan' },
    { model: `${brand} Performance SUV`, batteryCapacityKwh: 100, rangeKm: 500, connectorType: 'CCS2', maxChargeRateKw: 250, category: 'SUV' },
  ];
}
