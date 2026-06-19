import type { Booking } from '@/types';
import { checkTimeOverlap } from './timeUtils';

export const checkLaneAvailability = (
  laneId: string,
  date: string,
  startTime: string,
  endTime: string,
  bookings: Booking[]
): { available: boolean; conflictBooking?: Booking } => {
  const laneBookings = bookings.filter(
    (b) => b.laneId === laneId && b.date === date && b.status !== 'cancelled'
  );

  for (const booking of laneBookings) {
    if (checkTimeOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
      return { available: false, conflictBooking: booking };
    }
  }

  return { available: true };
};

export const getLaneOccupiedSlots = (
  laneId: string,
  date: string,
  bookings: Booking[]
): { startTime: string; endTime: string }[] => {
  return bookings
    .filter((b) => b.laneId === laneId && b.date === date && b.status !== 'cancelled')
    .map((b) => ({ startTime: b.startTime, endTime: b.endTime }));
};

export const isSlotOccupied = (
  time: string,
  occupiedSlots: { startTime: string; endTime: string }[]
): boolean => {
  return occupiedSlots.some((slot) => {
    return time >= slot.startTime && time < slot.endTime;
  });
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 20;
};

export const validatePeopleCount = (count: number): boolean => {
  return Number.isInteger(count) && count >= 1 && count <= 20;
};

export const validateBookingForm = (data: {
  laneId: string;
  date: string;
  startTime: string;
  duration: number;
  customerName: string;
  customerPhone: string;
  peopleCount: number;
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.laneId) {
    errors.laneId = '请选择箭道';
  }

  if (!data.date) {
    errors.date = '请选择日期';
  }

  if (!data.startTime) {
    errors.startTime = '请选择开始时间';
  }

  if (!data.duration || data.duration <= 0) {
    errors.duration = '请选择使用时长';
  }

  if (!validateName(data.customerName)) {
    errors.customerName = '请输入有效的姓名（2-20字）';
  }

  if (!validatePhone(data.customerPhone)) {
    errors.customerPhone = '请输入有效的手机号码';
  }

  if (!validatePeopleCount(data.peopleCount)) {
    errors.peopleCount = '请输入有效的人数（1-20人）';
  }

  return { valid: Object.keys(errors).length === 0, errors };
};
