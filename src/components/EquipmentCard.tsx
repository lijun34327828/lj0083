import { Plus, Minus, ShoppingCart } from 'lucide-react';
import type { Equipment } from '@/types';
import { formatPrice } from '@/utils/priceUtils';

interface EquipmentCardProps {
  equipment: Equipment;
  selectedQuantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
}

const EquipmentCard = ({
  equipment,
  selectedQuantity,
  onAdd,
  onRemove,
  onUpdateQuantity,
}: EquipmentCardProps) => {
  const isSelected = selectedQuantity > 0;
  const isOutOfStock = equipment.stock === 0;

  const categoryLabels: Record<string, string> = {
    bow: '弓箭',
    armguard: '护臂',
    glove: '手套',
    arrow: '箭支',
    other: '其他',
  };

  return (
    <div
      className={`
        card relative overflow-hidden transition-all duration-300
        ${isSelected ? 'ring-2 ring-bronze-400 shadow-glow-bronze' : ''}
        ${isOutOfStock ? 'opacity-50' : ''}
      `}
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gradient-to-br from-forest-100 to-ivory-300 rounded-xl flex items-center justify-center text-4xl">
        {equipment.icon}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-serif font-bold text-forest-800">{equipment.name}</h4>
            <span className="text-xs text-bark-500 bg-bark-100 px-2 py-0.5 rounded">
              {categoryLabels[equipment.category] || equipment.category}
            </span>
          </div>
          <div className="text-right">
            <p className="font-bold text-bronze-600">{formatPrice(equipment.pricePerDay)}</p>
            <p className="text-xs text-bark-500">/天</p>
          </div>
        </div>

        <p className="text-sm text-bark-600 mt-2">{equipment.description}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-bark-500">
            库存：<span className={equipment.stock < 10 ? 'text-amber-600' : 'text-forest-600'}>
              {equipment.stock}件
            </span>
          </div>

          {isOutOfStock ? (
            <span className="text-sm text-gray-500">暂不可租</span>
          ) : isSelected ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onRemove}
                className="w-8 h-8 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center hover:bg-forest-200 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                max={equipment.stock}
                value={selectedQuantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  onUpdateQuantity(Math.max(1, Math.min(equipment.stock, val)));
                }}
                className="w-12 h-8 text-center rounded-lg border border-forest-200 text-sm"
              />
              <button
                onClick={onAdd}
                disabled={selectedQuantity >= equipment.stock}
                className="w-8 h-8 rounded-lg bg-bronze-500 text-white flex items-center justify-center hover:bg-bronze-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="btn-secondary py-1.5 px-4 text-sm flex items-center gap-1"
            >
              <ShoppingCart className="w-4 h-4" />
              添加
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default EquipmentCard;
