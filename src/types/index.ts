export type LaneStatus = 'available' | 'occupied' | 'maintenance';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type OrderStatus = 'unpaid' | 'paid' | 'refunded';

export type EquipmentCategory = 'armguard' | 'bow' | 'arrow' | 'glove' | 'other';

export type PackageType = 'group' | 'duration' | 'combo';

export type PackageTarget = 'lane' | 'equipment';

export type DiscountType = 'percentage' | 'fixed';

export interface Lane {
  id: string;
  name: string;
  distance: number;
  pricePerHour: number;
  status: LaneStatus;
  zone: string;
}

export interface Booking {
  id: string;
  laneId: string;
  laneName?: string;
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerPhone: string;
  peopleCount: number;
  status: BookingStatus;
  createdAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  pricePerDay: number;
  stock: number;
  description: string;
  icon: string;
}

export interface EquipmentRental {
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  pricePerDay: number;
  subtotal: number;
}

export interface Package {
  id: string;
  name: string;
  type: PackageType;
  target: PackageTarget;
  minPeople?: number;
  minDuration?: number;
  discountType: DiscountType;
  discountValue: number;
  description: string;
  active: boolean;
}

export type ActivityTarget = 'lane' | 'equipment' | 'total';

export type ActivityStatus = 'active' | 'expired' | 'upcoming';

export interface Activity {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  applicableDays: number[];
  applicableDistances: number[];
  discountType: DiscountType;
  discountValue: number;
  target: ActivityTarget;
  stackableWithPackage: boolean;
  sortOrder: number;
  active: boolean;
}

export interface AppliedActivity {
  activity: Activity;
  discount: number;
}

export interface AppliedPackage {
  pkg: Package;
  discount: number;
}

export interface Order {
  id: string;
  bookingId: string;
  laneFee: number;
  equipmentFee: number;
  packageDiscount: number;
  activityDiscount: number;
  totalAmount: number;
  packagesApplied: AppliedPackage[];
  activitiesApplied: AppliedActivity[];
  equipmentRentals: EquipmentRental[];
  status: OrderStatus;
  createdAt: string;
}

export interface BookingFormData {
  laneId: string;
  date: string;
  startTime: string;
  duration: number;
  customerName: string;
  customerPhone: string;
  peopleCount: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
