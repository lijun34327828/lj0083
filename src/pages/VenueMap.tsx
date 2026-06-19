import { useMemo } from 'react';
import { MapPin, Calendar, Filter, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import LaneCard from '@/components/LaneCard';
import TimeSelector from '@/components/TimeSelector';
import BookingForm from '@/components/BookingForm';
import OrderSummary from '@/components/OrderSummary';
import { distanceOptions } from '@/data/lanes';
import { formatDateDisplay, getDateString, getTodayString } from '@/utils/timeUtils';
import { getLaneOccupiedSlots } from '@/utils/validation';

const VenueMap = () => {
  const {
    lanes,
    bookings,
    selectedDate,
    selectedDistance,
    selectedLaneId,
    setSelectedDate,
    setSelectedDistance,
    setSelectedLane,
    getSelectedLane,
  } = useAppStore();

  const filteredLanes = useMemo(() => {
    if (selectedDistance === 0) return lanes;
    return lanes.filter((lane) => lane.distance === selectedDistance);
  }, [lanes, selectedDistance]);

  const selectedLane = getSelectedLane();

  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (current >= today) {
      setSelectedDate(current.toISOString().split('T')[0]);
      setSelectedLane(null);
    }
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 14);
    if (current <= maxDate) {
      setSelectedDate(current.toISOString().split('T')[0]);
      setSelectedLane(null);
    }
  };

  const dateOptions = Array.from({ length: 7 }, (_, i) => ({
    date: getDateString(i),
    label: formatDateDisplay(getDateString(i)),
    isToday: i === 0,
  }));

  const groupedLanes = useMemo(() => {
    const groups: Record<string, typeof lanes> = {};
    filteredLanes.forEach((lane) => {
      if (!groups[lane.zone]) {
        groups[lane.zone] = [];
      }
      groups[lane.zone].push(lane);
    });
    return groups;
  }, [filteredLanes]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-bold text-forest-800 mb-2">
          箭道预约
        </h2>
        <p className="text-bark-600 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          选择您心仪的箭道，开启精准射击之旅
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-bronze-500" />
              <h3 className="font-serif text-lg font-bold text-forest-800">选择日期</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevDay}
                className="w-10 h-10 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center hover:bg-forest-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedDate === getTodayString()}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 overflow-x-auto">
                <div className="flex gap-2 pb-1">
                  {dateOptions.map((opt) => (
                    <button
                      key={opt.date}
                      onClick={() => {
                        setSelectedDate(opt.date);
                        setSelectedLane(null);
                      }}
                      className={`
                        min-w-[80px] px-3 py-2 rounded-lg text-center transition-all duration-200
                        ${selectedDate === opt.date
                          ? 'bg-bronze-500 text-white shadow-glow-bronze'
                          : 'bg-forest-50 text-forest-700 hover:bg-forest-100'}
                      `}
                    >
                      <p className="text-xs">
                        {opt.isToday ? '今天' : opt.label.split(' ')[1]}
                      </p>
                      <p className="font-medium">{opt.label.split(' ')[0]}</p>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleNextDay}
                className="w-10 h-10 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center hover:bg-forest-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-bronze-500" />
                <h3 className="font-serif text-lg font-bold text-forest-800">箭道筛选</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                {distanceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSelectedDistance(opt.value);
                      setSelectedLane(null);
                    }}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${selectedDistance === opt.value
                        ? 'bg-bronze-500 text-white'
                        : 'bg-forest-100 text-forest-700 hover:bg-forest-200'}
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedLanes).map(([zone, zoneLanes]) => (
              <div key={zone}>
                <h3 className="font-serif text-lg font-bold text-forest-700 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-bronze-500 rounded-full"></span>
                  {zone}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {zoneLanes.map((lane) => (
                    <LaneCard
                      key={lane.id}
                      lane={lane}
                      selected={selectedLaneId === lane.id}
                      onClick={() => setSelectedLane(lane.id)}
                      occupiedSlots={getLaneOccupiedSlots(lane.id, selectedDate, bookings)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredLanes.length === 0 && (
            <div className="card text-center py-12">
              <Info className="w-12 h-12 text-bark-300 mx-auto mb-3" />
              <p className="text-bark-500">暂无符合条件的箭道</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {selectedLane ? (
            <>
              <TimeSelector laneId={selectedLane.id} date={selectedDate} />
              <BookingForm />
            </>
          ) : (
            <div className="card text-center py-12">
              <MapPin className="w-12 h-12 text-bark-300 mx-auto mb-3" />
              <p className="text-bark-500 mb-2">请选择一支箭道</p>
              <p className="text-sm text-bark-400">
                点击左侧箭道卡片开始预约
              </p>
            </div>
          )}

          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default VenueMap;
