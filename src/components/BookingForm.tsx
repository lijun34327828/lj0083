import { useState } from 'react';
import { User, Phone, Users, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { validateBookingForm, validatePhone, validateName, validatePeopleCount } from '@/utils/validation';

interface BookingFormProps {
  onSuccess?: () => void;
}

const BookingForm = ({ onSuccess }: BookingFormProps) => {
  const navigate = useNavigate();
  const {
    selectedLaneId,
    selectedDate,
    selectedStartTime,
    selectedDuration,
    customerName,
    customerPhone,
    peopleCount,
    setCustomerName,
    setCustomerPhone,
    setPeopleCount,
    createBooking,
    getSelectedLane,
    getEndTime,
  } = useAppStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const lane = getSelectedLane();
  const endTime = getEndTime();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const formErrors: Record<string, string> = {};

    if (!selectedLaneId) {
      formErrors.lane = '请选择箭道';
    }
    if (!selectedStartTime) {
      formErrors.time = '请选择开始时间';
    }
    if (!validateName(customerName)) {
      formErrors.name = '请输入有效的姓名（2-20字）';
    }
    if (!validatePhone(customerPhone)) {
      formErrors.phone = '请输入有效的手机号码';
    }
    if (!validatePeopleCount(peopleCount)) {
      formErrors.people = '请输入有效的人数（1-20人）';
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    setSubmitting(true);

    const result = createBooking({
      laneId: selectedLaneId!,
      date: selectedDate,
      startTime: selectedStartTime,
      duration: selectedDuration,
      customerName,
      customerPhone,
      peopleCount,
    });

    setSubmitting(false);

    if (result.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/equipment');
      }
    } else {
      setSubmitError(result.error || '预约失败，请重试');
    }
  };

  const canSubmit = selectedLaneId && selectedStartTime && customerName && customerPhone && peopleCount > 0;

  return (
    <div className="card">
      <h3 className="font-serif text-lg font-bold text-forest-800 mb-4">
        预约信息
      </h3>

      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              预约日期
            </label>
            <div className="input-field flex items-center text-bark-600">
              {selectedDate}
            </div>
          </div>
          <div>
            <label className="label-field">箭道</label>
            <div className="input-field flex items-center text-bark-600">
              {lane ? lane.name : '请选择箭道'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">开始时间</label>
            <div className="input-field flex items-center text-bark-600">
              {selectedStartTime || '请选择时段'}
            </div>
            {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
          </div>
          <div>
            <label className="label-field">结束时间</label>
            <div className="input-field flex items-center text-bark-600">
              {endTime || '--:--'}
            </div>
          </div>
        </div>

        <div>
          <label className="label-field flex items-center gap-1">
            <User className="w-4 h-4" />
            姓名
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="请输入您的姓名"
            className={`input-field ${errors.name ? 'border-red-400' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="label-field flex items-center gap-1">
            <Phone className="w-4 h-4" />
            手机号
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="请输入手机号码"
            className={`input-field ${errors.phone ? 'border-red-400' : ''}`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="label-field flex items-center gap-1">
            <Users className="w-4 h-4" />
            同行人数
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
              className="w-10 h-10 rounded-lg bg-forest-100 text-forest-700 font-bold hover:bg-forest-200 transition-colors"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max="20"
              value={peopleCount}
              onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
              className={`input-field w-20 text-center ${errors.people ? 'border-red-400' : ''}`}
            />
            <button
              type="button"
              onClick={() => setPeopleCount(Math.min(20, peopleCount + 1))}
              className="w-10 h-10 rounded-lg bg-forest-100 text-forest-700 font-bold hover:bg-forest-200 transition-colors"
            >
              +
            </button>
            <span className="text-sm text-bark-500">人</span>
          </div>
          {errors.people && <p className="text-red-500 text-xs mt-1">{errors.people}</p>}
          <p className="text-xs text-bark-400 mt-1">
            多人同行可享受套餐优惠
          </p>
        </div>

        {errors.lane && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.lane}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className={`
            w-full btn-primary flex items-center justify-center gap-2
            ${!canSubmit || submitting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {submitting ? (
            <>
              <span className="animate-spin">⏳</span>
              提交中...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              确认预约
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
