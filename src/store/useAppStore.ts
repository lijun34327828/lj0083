import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lane, Booking, Equipment, Package, Order, EquipmentRental, BookingFormData, AppliedPackage, Activity, AppliedActivity } from '@/types';
import { lanes as initialLanes } from '@/data/lanes';
import { equipment as initialEquipment } from '@/data/equipment';
import { packages as initialPackages } from '@/data/packages';
import { activities as initialActivities } from '@/data/activities';
import { initialBookings, initialOrders } from '@/data/bookings';
import { addDurationToTime, getTodayString } from '@/utils/timeUtils';
import {
  calculateLaneFee,
  calculateEquipmentFee,
  calculateEquipmentRentalSubtotal,
  findBestPackages,
  calculateTotalDiscount,
  calculateTotalAmount,
  generateBookingId,
  generateOrderId,
  findApplicableActivities,
  calculateTotalActivityDiscount,
} from '@/utils/priceUtils';
import { checkLaneAvailability } from '@/utils/validation';

interface AppState {
  lanes: Lane[];
  bookings: Booking[];
  equipment: Equipment[];
  packages: Package[];
  activities: Activity[];
  orders: Order[];
  selectedDate: string;
  selectedDistance: number;
  selectedLaneId: string | null;
  selectedStartTime: string;
  selectedDuration: number;
  customerName: string;
  customerPhone: string;
  peopleCount: number;
  equipmentRentals: EquipmentRental[];
  currentBookingId: string | null;
  currentOrderId: string | null;

  setSelectedDate: (date: string) => void;
  setSelectedDistance: (distance: number) => void;
  setSelectedLane: (laneId: string | null) => void;
  setSelectedStartTime: (time: string) => void;
  setSelectedDuration: (duration: number) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setPeopleCount: (count: number) => void;

  addEquipmentRental: (equipmentId: string, quantity: number) => void;
  removeEquipmentRental: (equipmentId: string) => void;
  updateEquipmentQuantity: (equipmentId: string, quantity: number) => void;
  clearEquipmentRentals: () => void;

  createBooking: (formData: BookingFormData) => { success: boolean; bookingId?: string; error?: string };
  createOrder: (bookingId: string) => { success: boolean; orderId?: string; error?: string };
  cancelBooking: (bookingId: string) => boolean;

  getSelectedLane: () => Lane | undefined;
  getEndTime: () => string;
  getLaneFee: () => number;
  getEquipmentFee: () => number;
  getBestPackages: () => AppliedPackage[];
  getApplicableActivities: () => AppliedActivity[];
  getTotalAmount: () => number;
  getCurrentBooking: () => Booking | undefined;
  getCurrentOrder: () => Order | undefined;
  getEquipmentCategories: () => string[];
  getEquipmentByCategory: (category: string) => Equipment[];
  resetBookingForm: () => void;
  toggleActivity: (activityId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      lanes: initialLanes,
      bookings: initialBookings,
      equipment: initialEquipment,
      packages: initialPackages,
      activities: initialActivities,
      orders: initialOrders,
      selectedDate: getTodayString(),
      selectedDistance: 0,
      selectedLaneId: null,
      selectedStartTime: '',
      selectedDuration: 1,
      customerName: '',
      customerPhone: '',
      peopleCount: 1,
      equipmentRentals: [],
      currentBookingId: null,
      currentOrderId: null,

      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedDistance: (distance) => set({ selectedDistance: distance, selectedLaneId: null }),
      setSelectedLane: (laneId) => set({ selectedLaneId: laneId }),
      setSelectedStartTime: (time) => set({ selectedStartTime: time }),
      setSelectedDuration: (duration) => set({ selectedDuration: duration }),
      setCustomerName: (name) => set({ customerName: name }),
      setCustomerPhone: (phone) => set({ customerPhone: phone }),
      setPeopleCount: (count) => set({ peopleCount: count }),

      addEquipmentRental: (equipmentId, quantity) => {
        const { equipment } = get();
        const item = equipment.find((e) => e.id === equipmentId);
        if (!item) return;

        const existing = get().equipmentRentals.find((r) => r.equipmentId === equipmentId);
        if (existing) {
          get().updateEquipmentQuantity(equipmentId, existing.quantity + quantity);
          return;
        }

        const newRental: EquipmentRental = {
          equipmentId,
          equipmentName: item.name,
          quantity,
          pricePerDay: item.pricePerDay,
          subtotal: calculateEquipmentRentalSubtotal(item.pricePerDay, quantity),
        };

        set({ equipmentRentals: [...get().equipmentRentals, newRental] });
      },

      removeEquipmentRental: (equipmentId) => {
        set({
          equipmentRentals: get().equipmentRentals.filter((r) => r.equipmentId !== equipmentId),
        });
      },

      updateEquipmentQuantity: (equipmentId, quantity) => {
        const { equipment } = get();
        const item = equipment.find((e) => e.id === equipmentId);
        if (!item) return;

        set({
          equipmentRentals: get().equipmentRentals.map((r) =>
            r.equipmentId === equipmentId
              ? {
                  ...r,
                  quantity,
                  subtotal: calculateEquipmentRentalSubtotal(item.pricePerDay, quantity),
                }
              : r
          ),
        });
      },

      clearEquipmentRentals: () => set({ equipmentRentals: [] }),

      createBooking: (formData) => {
        const { bookings, lanes } = get();
        const lane = lanes.find((l) => l.id === formData.laneId);
        if (!lane) return { success: false, error: '箭道不存在' };

        const endTime = addDurationToTime(formData.startTime, formData.duration);
        const { available } = checkLaneAvailability(
          formData.laneId,
          formData.date,
          formData.startTime,
          endTime,
          bookings
        );

        if (!available) {
          return { success: false, error: '该时段已被预约，请选择其他时段' };
        }

        const bookingId = generateBookingId();
        const newBooking: Booking = {
          id: bookingId,
          laneId: formData.laneId,
          laneName: lane.name,
          date: formData.date,
          startTime: formData.startTime,
          endTime,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          peopleCount: formData.peopleCount,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };

        set({
          bookings: [...bookings, newBooking],
          currentBookingId: bookingId,
        });

        return { success: true, bookingId };
      },

      createOrder: (bookingId) => {
        const { bookings, equipmentRentals, activities } = get();
        const booking = bookings.find((b) => b.id === bookingId);
        if (!booking) return { success: false, error: '预约不存在' };

        const lane = get().lanes.find((l) => l.id === booking.laneId);
        if (!lane) return { success: false, error: '箭道不存在' };

        const duration =
          (parseInt(booking.endTime.split(':')[0]) * 60 +
            parseInt(booking.endTime.split(':')[1]) -
            (parseInt(booking.startTime.split(':')[0]) * 60 +
              parseInt(booking.startTime.split(':')[1]))) /
          60;

        const laneFee = calculateLaneFee(lane.pricePerHour, duration);
        const equipmentFee = calculateEquipmentFee(equipmentRentals);

        const appliedPackages = findBestPackages(
          get().packages,
          booking.peopleCount,
          duration,
          laneFee,
          equipmentRentals.length,
          equipmentFee
        );

        const totalPackageDiscount = calculateTotalDiscount(appliedPackages);

        const appliedActivities = findApplicableActivities(
          activities,
          booking.date,
          lane.distance,
          laneFee,
          equipmentFee,
          appliedPackages
        );

        const totalActivityDiscount = calculateTotalActivityDiscount(appliedActivities);

        const totalAmount = calculateTotalAmount(laneFee, equipmentFee, totalPackageDiscount, totalActivityDiscount);

        const orderId = generateOrderId();
        const newOrder: Order = {
          id: orderId,
          bookingId,
          laneFee,
          equipmentFee,
          packageDiscount: totalPackageDiscount,
          activityDiscount: totalActivityDiscount,
          totalAmount,
          packagesApplied: appliedPackages,
          activitiesApplied: appliedActivities,
          equipmentRentals: [...equipmentRentals],
          status: 'unpaid',
          createdAt: new Date().toISOString(),
        };

        set({
          orders: [...get().orders, newOrder],
          currentOrderId: orderId,
        });

        return { success: true, orderId };
      },

      cancelBooking: (bookingId) => {
        set({
          bookings: get().bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
          ),
        });
        return true;
      },

      getSelectedLane: () => {
        const { lanes, selectedLaneId } = get();
        return lanes.find((l) => l.id === selectedLaneId);
      },

      getEndTime: () => {
        const { selectedStartTime, selectedDuration } = get();
        if (!selectedStartTime) return '';
        return addDurationToTime(selectedStartTime, selectedDuration);
      },

      getLaneFee: () => {
        const lane = get().getSelectedLane();
        if (!lane) return 0;
        return calculateLaneFee(lane.pricePerHour, get().selectedDuration);
      },

      getEquipmentFee: () => {
        return calculateEquipmentFee(get().equipmentRentals);
      },

      getBestPackages: () => {
        const { packages, selectedDuration, peopleCount, equipmentRentals } = get();
        const laneFee = get().getLaneFee();
        const equipmentFee = get().getEquipmentFee();

        return findBestPackages(
          packages,
          peopleCount,
          selectedDuration,
          laneFee,
          equipmentRentals.length,
          equipmentFee
        );
      },

      getApplicableActivities: () => {
        const { activities, selectedDate, selectedLaneId } = get();
        const lane = get().getSelectedLane();
        if (!lane || !selectedDate) return [];

        const laneFee = get().getLaneFee();
        const equipmentFee = get().getEquipmentFee();
        const appliedPackages = get().getBestPackages();

        return findApplicableActivities(
          activities,
          selectedDate,
          lane.distance,
          laneFee,
          equipmentFee,
          appliedPackages
        );
      },

      getTotalAmount: () => {
        const laneFee = get().getLaneFee();
        const equipmentFee = get().getEquipmentFee();
        const appliedPackages = get().getBestPackages();
        const appliedActivities = get().getApplicableActivities();
        const totalPackageDiscount = calculateTotalDiscount(appliedPackages);
        const totalActivityDiscount = calculateTotalActivityDiscount(appliedActivities);
        return calculateTotalAmount(laneFee, equipmentFee, totalPackageDiscount, totalActivityDiscount);
      },

      getCurrentBooking: () => {
        const { bookings, currentBookingId } = get();
        return bookings.find((b) => b.id === currentBookingId);
      },

      getCurrentOrder: () => {
        const { orders, currentOrderId } = get();
        return orders.find((o) => o.id === currentOrderId);
      },

      getEquipmentCategories: () => {
        const categories = new Set(get().equipment.map((e) => e.category));
        return ['all', ...Array.from(categories)];
      },

      getEquipmentByCategory: (category) => {
        if (category === 'all') return get().equipment;
        return get().equipment.filter((e) => e.category === category);
      },

      resetBookingForm: () => {
        set({
          selectedLaneId: null,
          selectedStartTime: '',
          selectedDuration: 1,
          customerName: '',
          customerPhone: '',
          peopleCount: 1,
          equipmentRentals: [],
          currentBookingId: null,
          currentOrderId: null,
        });
      },

      toggleActivity: (activityId) => {
        set({
          activities: get().activities.map((a) =>
            a.id === activityId ? { ...a, active: !a.active } : a
          ),
        });
      },
    }),
    {
      name: 'archery-booking-storage',
      partialize: (state) => ({
        bookings: state.bookings,
        orders: state.orders,
      }),
    }
  )
);
