import type { Package, EquipmentRental, Lane, AppliedPackage, Activity, AppliedActivity } from '@/types';

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
  packageDiscount: number,
  activityDiscount: number = 0
): number => {
  const total = laneFee + equipmentFee - packageDiscount - activityDiscount;
  return Math.ceil(Math.max(0, total) * 100) / 100;
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

export const getActivityStatus = (activity: Activity): 'active' | 'expired' | 'upcoming' => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(activity.startDate + 'T00:00:00');
  const end = new Date(activity.endDate + 'T23:59:59');

  if (today < start) return 'upcoming';
  if (today > end) return 'expired';
  return 'active';
};

export const isActivityApplicable = (
  activity: Activity,
  bookingDate: string,
  laneDistance: number
): boolean => {
  if (!activity.active) return false;

  const status = getActivityStatus(activity);
  if (status !== 'active') return false;

  const booking = new Date(bookingDate + 'T00:00:00');
  const start = new Date(activity.startDate + 'T00:00:00');
  const end = new Date(activity.endDate + 'T23:59:59');
  if (booking < start || booking > end) return false;

  const dayOfWeek = booking.getDay();
  if (activity.applicableDays.length > 0 && !activity.applicableDays.includes(dayOfWeek)) return false;

  if (activity.applicableDistances.length > 0 && !activity.applicableDistances.includes(laneDistance)) return false;

  return true;
};

const calculateActivityDiscount = (
  activity: Activity,
  baseAmount: number
): number => {
  if (baseAmount <= 0) return 0;

  let discount = 0;
  if (activity.discountType === 'percentage') {
    discount = (baseAmount * activity.discountValue) / 100;
  } else {
    discount = activity.discountValue;
  }

  discount = Math.ceil(discount * 100) / 100;
  return Math.min(discount, baseAmount);
};

export const findApplicableActivities = (
  activities: Activity[],
  bookingDate: string,
  laneDistance: number,
  laneFee: number,
  equipmentFee: number,
  appliedPackages: AppliedPackage[]
): AppliedActivity[] => {
  const applicable = activities.filter((a) =>
    isActivityApplicable(a, bookingDate, laneDistance)
  );

  const lanePackageDiscount = appliedPackages
    .filter((ap) => ap.pkg.target === 'lane')
    .reduce((sum, ap) => sum + ap.discount, 0);
  const equipmentPackageDiscount = appliedPackages
    .filter((ap) => ap.pkg.target === 'equipment')
    .reduce((sum, ap) => sum + ap.discount, 0);
  const totalPackageDiscount = lanePackageDiscount + equipmentPackageDiscount;

  const result: AppliedActivity[] = [];

  const laneActivities = applicable.filter((a) => a.target === 'lane');
  const equipmentActivities = applicable.filter((a) => a.target === 'equipment');
  const totalActivities = applicable.filter((a) => a.target === 'total');

  for (const activity of laneActivities) {
    const remainingLaneFee = Math.max(0, laneFee - lanePackageDiscount);

    if (activity.stackableWithPackage) {
      const discount = calculateActivityDiscount(activity, remainingLaneFee);
      if (discount > 0) result.push({ activity, discount });
    } else {
      const activityDiscount = calculateActivityDiscount(activity, laneFee);
      if (activityDiscount > lanePackageDiscount) {
        result.push({ activity, discount: activityDiscount - lanePackageDiscount });
      }
    }
  }

  for (const activity of equipmentActivities) {
    const remainingEquipmentFee = Math.max(0, equipmentFee - equipmentPackageDiscount);

    if (activity.stackableWithPackage) {
      const discount = calculateActivityDiscount(activity, remainingEquipmentFee);
      if (discount > 0) result.push({ activity, discount });
    } else {
      const activityDiscount = calculateActivityDiscount(activity, equipmentFee);
      if (activityDiscount > equipmentPackageDiscount) {
        result.push({ activity, discount: activityDiscount - equipmentPackageDiscount });
      }
    }
  }

  for (const activity of totalActivities) {
    const remainingTotal = Math.max(0, laneFee + equipmentFee - totalPackageDiscount);

    if (activity.stackableWithPackage) {
      const discount = calculateActivityDiscount(activity, remainingTotal);
      if (discount > 0) result.push({ activity, discount });
    } else {
      const activityDiscount = calculateActivityDiscount(activity, laneFee + equipmentFee);
      if (activityDiscount > totalPackageDiscount) {
        result.push({ activity, discount: activityDiscount - totalPackageDiscount });
      }
    }
  }

  result.sort((a, b) => b.activity.sortOrder - a.activity.sortOrder);
  return result;
};

export const calculateTotalActivityDiscount = (appliedActivities: AppliedActivity[]): number => {
  return Math.ceil(appliedActivities.reduce((sum, aa) => sum + aa.discount, 0) * 100) / 100;
};
