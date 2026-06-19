import type { Lane } from '@/types';

export const lanes: Lane[] = [
  { id: 'lane-01', name: 'A1 箭道', distance: 10, pricePerHour: 60, status: 'available', zone: 'A区 10米' },
  { id: 'lane-02', name: 'A2 箭道', distance: 10, pricePerHour: 60, status: 'available', zone: 'A区 10米' },
  { id: 'lane-03', name: 'A3 箭道', distance: 10, pricePerHour: 60, status: 'available', zone: 'A区 10米' },
  { id: 'lane-04', name: 'A4 箭道', distance: 10, pricePerHour: 60, status: 'maintenance', zone: 'A区 10米' },
  { id: 'lane-05', name: 'B1 箭道', distance: 18, pricePerHour: 80, status: 'available', zone: 'B区 18米' },
  { id: 'lane-06', name: 'B2 箭道', distance: 18, pricePerHour: 80, status: 'available', zone: 'B区 18米' },
  { id: 'lane-07', name: 'B3 箭道', distance: 18, pricePerHour: 80, status: 'available', zone: 'B区 18米' },
  { id: 'lane-08', name: 'B4 箭道', distance: 18, pricePerHour: 80, status: 'available', zone: 'B区 18米' },
  { id: 'lane-09', name: 'C1 箭道', distance: 30, pricePerHour: 120, status: 'available', zone: 'C区 30米' },
  { id: 'lane-10', name: 'C2 箭道', distance: 30, pricePerHour: 120, status: 'available', zone: 'C区 30米' },
  { id: 'lane-11', name: 'C3 箭道', distance: 30, pricePerHour: 120, status: 'available', zone: 'C区 30米' },
  { id: 'lane-12', name: 'D1 箭道', distance: 50, pricePerHour: 180, status: 'available', zone: 'D区 50米' },
  { id: 'lane-13', name: 'D2 箭道', distance: 50, pricePerHour: 180, status: 'available', zone: 'D区 50米' },
];

export const distanceOptions = [
  { value: 0, label: '全部距离' },
  { value: 10, label: '10米' },
  { value: 18, label: '18米' },
  { value: 30, label: '30米' },
  { value: 50, label: '50米' },
];
