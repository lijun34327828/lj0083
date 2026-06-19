import type { Package, EquipmentRental, Lane, AppliedPackage } from '@/types';

export const calculateLaneFee = (pricePerHour: number, durationHours: number): number => {
  return Math.ceil(pricePerHour * durationHours * 100) / 100;
};

export const calculateEquipmentFee = (rentals: EquipmentRental[]): number => {
  return Math.ceil(rentals.reduce((sum, r) => sum + r.subtotal, 0) * 100) / 100;
};

export const calculateEquipmentRentalSubtotal = (
  pricePerDay: number,
  quantity: number
): number => {
  return Math.ceil(pricePerDay * quantity * 100) / 100;
};

export const findBestPackages = (
  packages: Package[],
  peopleCount: number,
  durationHours: number,
  laneFee: number,
  equipmentCount: number,
  equipmentFee: number
): AppliedPackage[] => {
  const laneCandidates: AppliedPackage[] = [];
  const equipmentCandidates: AppliedPackage[] = [];

  for (const pkg of packages) {
    if (!pkg.active) continue;

    let applicable = false;
    let discount = 0;

    switch (pkg.type) {
      case 'group':
        if (pkg.minPeople && peopleCount >= pkg.minPeople) {
          applicable = true;
          if (pkg.discountType === 'percentage') {
            discount = (laneFee * pkg.discountValue) / 100;
          } else {
            discount = pkg.discountValue;
          }
        }
        break;

      case 'duration':
        if (pkg.minDuration && durationHours >= pkg.minDuration) {
          applicable = true;
          if (pkg.discountType === 'percentage') {
            discount = (laneFee * pkg.discountValue) / 100;
          } else {
            discount = pkg.discountValue;
          }
        }
        break;

      case 'combo':
        if (equipmentCount >= 3) {
          applicable = true;
          if (pkg.discountType === 'percentage') {
            discount = (equipmentFee * pkg.discountValue) / 100;
          } else {
            discount = pkg.discountValue;
          }
        }
        break;
    }

    if (applicable && discount > 0) {
      const roundedDiscount = Math.ceil(discount * 100) / 100;
      if (pkg.target === 'lane') {
        laneCandidates.push({ pkg, discount: roundedDiscount });
      } else if (pkg.target === 'equipment') {
        equipmentCandidates.push({ pkg, discount: roundedDiscount });
      }
    }
  }

  const result: AppliedPackage[] = [];

  if (laneCandidates.length > 0) {
    laneCandidates.sort((a, b) => b.discount - a.discount);
    result.push(laneCandidates[0]);
  }

  if (equipmentCandidates.length > 0) {
    equipmentCandidates.sort((a, b) => b.discount - a.discount);
    result.push(equipmentCandidates[0]);
  }

  return result;
};

export const calculateTotalDiscount = (appliedPackages: AppliedPackage[]): number => {
  return Math.ceil(appliedPackages.reduce((sum, ap) => sum + ap.discount, 0) * 100) / 100;
};

export const calculateTotalAmount = (
  laneFee: number,
  equipmentFee: number,
  packageDiscount: number
): number => {
  return Math.ceil((laneFee + equipmentFee - packageDiscount) * 100) / 100;
};

export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(2)}`;
};

export const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

export const generateBookingId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `BKG-${timestamp}-${random}`.toUpperCase();
};

export const getLaneByDistance = (lanes: Lane[], distance: number): Lane[] => {
  if (distance === 0) return lanes;
  return lanes.filter((lane) => lane.distance === distance);
};

export const getAvailableLanes = (lanes: Lane[]): Lane[] => {
  return lanes.filter((lane) => lane.status === 'available');
};
