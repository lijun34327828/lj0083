import { Receipt, Target, ShoppingBag, Tag, Calculator } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatPrice, calculateTotalDiscount } from '@/utils/priceUtils';

interface OrderSummaryProps {
  showTitle?: boolean;
  compact?: boolean;
}

const OrderSummary = ({ showTitle = true, compact = false }: OrderSummaryProps) => {
  const { getSelectedLane, getLaneFee, getEquipmentFee, getBestPackages, getTotalAmount, getEndTime, selectedStartTime, selectedDuration, equipmentRentals } =
    useAppStore();

  const lane = getSelectedLane();
  const laneFee = getLaneFee();
  const equipmentFee = getEquipmentFee();
  const appliedPackages = getBestPackages();
  const totalDiscount = calculateTotalDiscount(appliedPackages);
  const totalAmount = getTotalAmount();
  const endTime = getEndTime();

  return (
    <div className={`card ${compact ? 'p-4' : ''}`}>
      {showTitle && (
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-5 h-5 text-bronze-500" />
          <h3 className="font-serif text-lg font-bold text-forest-800">费用明细</h3>
        </div>
      )}

      <div className="space-y-3">
        {lane && (
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-bronze-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-bark-700">{lane.name}</p>
                <p className="text-xs text-bark-500">
                  {selectedStartTime
                    ? `${selectedStartTime} - ${endTime} · ${selectedDuration}小时`
                    : '请选择时段'}
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-bark-700">
              {laneFee > 0 ? formatPrice(laneFee) : '--'}
            </span>
          </div>
        )}

        {equipmentRentals.length > 0 && (
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-bronze-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-bark-700">器材租赁</p>
                <p className="text-xs text-bark-500">
                  {equipmentRentals.length}种器材
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-bark-700">
              {formatPrice(equipmentFee)}
            </span>
          </div>
        )}

        {appliedPackages.map(({ pkg, discount }) => (
          <div key={pkg.id} className="flex items-start justify-between text-red-500">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{pkg.name}</p>
                <p className="text-xs">{pkg.description}</p>
              </div>
            </div>
            <span className="text-sm font-medium">-{formatPrice(discount)}</span>
          </div>
        ))}

        <div className="border-t border-forest-200 pt-3 mt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-bronze-500" />
              <span className="font-medium text-bark-700">应付总额</span>
            </div>
            <span className="font-serif text-2xl font-bold text-bronze-600">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {!compact && equipmentRentals.length > 0 && (
        <div className="mt-4 pt-4 border-t border-forest-100">
          <p className="text-xs text-bark-500 mb-2">租赁器材清单：</p>
          <div className="space-y-1.5">
            {equipmentRentals.map((rental) => (
              <div key={rental.equipmentId} className="flex justify-between text-xs">
                <span className="text-bark-600">
                  {rental.equipmentName} × {rental.quantity}
                </span>
                <span className="text-bark-700">{formatPrice(rental.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
