import { Clock } from 'lucide-react';
import { generateTimeSlots, isTimeInRange } from '@/utils/timeUtils';
import { durationOptions } from '@/utils/timeUtils';
import { useAppStore } from '@/store/useAppStore';

interface TimeSelectorProps {
  laneId: string;
  date: string;
}

const TimeSelector = ({ laneId, date }: TimeSelectorProps) => {
  const { bookings, selectedStartTime, selectedDuration, setSelectedStartTime, setSelectedDuration } =
    useAppStore();

  const timeSlots = generateTimeSlots(9, 21, 30);

  const laneBookings = bookings.filter(
    (b) => b.laneId === laneId && b.date === date && b.status !== 'cancelled'
  );

  const isSlotOccupied = (time: string): boolean => {
    return laneBookings.some((booking) => isTimeInRange(time, booking.startTime, booking.endTime));
  };

  const canSelectSlot = (time: string): boolean => {
    if (isSlotOccupied(time)) return false;

    const endMinutes =
      parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]) + selectedDuration * 60;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

    for (const booking of laneBookings) {
      if (isTimeInRange(booking.startTime, time, endTime)) return false;
      if (isTimeInRange(booking.endTime, time, endTime)) return false;
      if (time < booking.startTime && endTime > booking.endTime) return false;
    }

    return endMinutes <= 21 * 60;
  };

  const handleTimeClick = (time: string) => {
    if (!canSelectSlot(time)) return;
    setSelectedStartTime(time === selectedStartTime ? '' : time);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-bronze-500" />
        <h3 className="font-serif text-lg font-bold text-forest-800">选择时段</h3>
      </div>

      <div className="mb-4">
        <label className="label-field">使用时长</label>
        <div className="flex flex-wrap gap-2">
          {durationOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedDuration(opt.value)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${selectedDuration === opt.value
                  ? 'bg-bronze-500 text-white shadow-glow-bronze'
                  : 'bg-forest-100 text-forest-700 hover:bg-forest-200'}
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label-field">开始时间</label>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {timeSlots.map((time) => {
            const occupied = isSlotOccupied(time);
            const selectable = canSelectSlot(time);
            const isSelected = selectedStartTime === time;

            return (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                disabled={!selectable}
                className={`
                  time-slot text-center
                  ${occupied ? 'time-slot-occupied' : ''}
                  ${!occupied && selectable ? 'time-slot-available' : ''}
                  ${isSelected ? 'time-slot-selected' : ''}
                  ${!selectable && !occupied ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                `}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-bark-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-forest-200"></span>
          <span>可预约</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-200"></span>
          <span>已占用</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-gray-200"></span>
          <span>不可选</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-bronze-500"></span>
          <span>已选择</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;
