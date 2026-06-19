import { Clock, Users, Zap } from 'lucide-react';
import type { Lane } from '@/types';
import { formatPrice } from '@/utils/priceUtils';

interface LaneCardProps {
  lane: Lane;
  selected: boolean;
  onClick: () => void;
  occupiedSlots?: { startTime: string; endTime: string }[];
}

const LaneCard = ({ lane, selected, onClick, occupiedSlots = [] }: LaneCardProps) => {
  const isMaintenance = lane.status === 'maintenance';
  const isOccupied = occupiedSlots.length > 0;

  const getStatusColor = () => {
    if (isMaintenance) return 'bg-gray-400';
    if (isOccupied) return 'bg-amber-500';
    return 'bg-forest-500';
  };

  const getStatusText = () => {
    if (isMaintenance) return '维护中';
    if (isOccupied) return '部分占用';
    return '空闲';
  };

  return (
    <div
      onClick={() => !isMaintenance && onClick()}
      className={`
        card-lane relative overflow-hidden
        ${isMaintenance ? 'card-lane-occupied' : ''}
        ${selected ? 'card-lane-selected' : ''}
        ${isMaintenance ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="absolute top-3 right-3">
        <span className={`badge ${isMaintenance ? 'bg-gray-200 text-gray-600' : isOccupied ? 'badge-warning' : 'badge-success'}`}>
          <span className={`w-2 h-2 rounded-full ${getStatusColor()} mr-1.5`}></span>
          {getStatusText()}
        </span>
      </div>

      <div className="mb-3">
        <h3 className="font-serif text-lg font-bold text-forest-800">{lane.name}</h3>
        <p className="text-sm text-bark-500">{lane.zone}</p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-bark-600">
          <Zap className="w-4 h-4 text-bronze-500" />
          <span>{lane.distance}米箭道</span>
        </div>
        <div className="flex items-center gap-2 text-bark-600">
          <Clock className="w-4 h-4 text-bronze-500" />
          <span>{formatPrice(lane.pricePerHour)}/小时</span>
        </div>
        <div className="flex items-center gap-2 text-bark-600">
          <Users className="w-4 h-4 text-bronze-500" />
          <span>最多4人</span>
        </div>
      </div>

      {occupiedSlots.length > 0 && !isMaintenance && (
        <div className="mt-3 pt-3 border-t border-forest-200">
          <p className="text-xs text-bark-500 mb-1">今日已预约时段：</p>
          <div className="flex flex-wrap gap-1">
            {occupiedSlots.slice(0, 3).map((slot, index) => (
              <span
                key={index}
                className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded"
              >
                {slot.startTime}-{slot.endTime}
              </span>
            ))}
            {occupiedSlots.length > 3 && (
              <span className="text-xs text-bark-500">+{occupiedSlots.length - 3}个</span>
            )}
          </div>
        </div>
      )}

      {isMaintenance && (
        <div className="absolute inset-0 bg-gray-200/60 backdrop-blur-sm flex items-center justify-center">
          <span className="font-bold text-gray-500 text-lg">设备维护</span>
        </div>
      )}

      {selected && (
        <div className="absolute top-3 left-3 w-6 h-6 bg-bronze-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default LaneCard;
