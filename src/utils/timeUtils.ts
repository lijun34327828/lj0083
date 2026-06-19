export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseTime = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const addDurationToTime = (startTime: string, durationHours: number): string => {
  const totalMinutes = parseTime(startTime) + durationHours * 60;
  return formatTime(totalMinutes);
};

export const generateTimeSlots = (startHour = 9, endHour = 21, stepMinutes = 60): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += stepMinutes) {
      slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
    }
  }
  return slots;
};

export const getTodayString = (): string => {
  return formatDate(new Date());
};

export const getDateString = (daysFromToday: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return formatDate(date);
};

export const formatDateDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = weekDays[date.getDay()];
  return `${month}月${day}日 ${weekDay}`;
};

export const isTimeInRange = (time: string, startTime: string, endTime: string): boolean => {
  const t = parseTime(time);
  const s = parseTime(startTime);
  const e = parseTime(endTime);
  return t >= s && t < e;
};

export const checkTimeOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const s1 = parseTime(start1);
  const e1 = parseTime(end1);
  const s2 = parseTime(start2);
  const e2 = parseTime(end2);
  return s1 < e2 && e1 > s2;
};

export const durationOptions = [
  { value: 0.5, label: '30分钟' },
  { value: 1, label: '1小时' },
  { value: 1.5, label: '1.5小时' },
  { value: 2, label: '2小时' },
  { value: 2.5, label: '2.5小时' },
  { value: 3, label: '3小时' },
];
