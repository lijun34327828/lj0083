import { useState, useMemo } from 'react';
import { ShoppingBag, Filter, ArrowRight, CheckCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import EquipmentCard from '@/components/EquipmentCard';
import OrderSummary from '@/components/OrderSummary';
import { equipmentCategories } from '@/data/equipment';

const EquipmentPage = () => {
  const navigate = useNavigate();
  const {
    equipment,
    equipmentRentals,
    addEquipmentRental,
    removeEquipmentRental,
    updateEquipmentQuantity,
    getCurrentBooking,
    packages,
  } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState('all');

  const currentBooking = getCurrentBooking();

  const filteredEquipment = useMemo(() => {
    if (selectedCategory === 'all') return equipment;
    return equipment.filter((e) => e.category === selectedCategory);
  }, [equipment, selectedCategory]);

  const getQuantity = (equipmentId: string): number => {
    const rental = equipmentRentals.find((r) => r.equipmentId === equipmentId);
    return rental ? rental.quantity : 0;
  };

  const handleAdd = (equipmentId: string) => {
    const currentQty = getQuantity(equipmentId);
    if (currentQty === 0) {
      addEquipmentRental(equipmentId, 1);
    } else {
      addEquipmentRental(equipmentId, currentQty + 1);
    }
  };

  const handleRemove = (equipmentId: string) => {
    const currentQty = getQuantity(equipmentId);
    if (currentQty <= 1) {
      removeEquipmentRental(equipmentId);
    } else {
      updateEquipmentQuantity(equipmentId, currentQty - 1);
    }
  };

  const handleUpdateQuantity = (equipmentId: string, qty: number) => {
    if (qty <= 0) {
      removeEquipmentRental(equipmentId);
    } else {
      updateEquipmentQuantity(equipmentId, qty);
    }
  };

  const activePackages = packages.filter((p) => p.active && p.type === 'combo');

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-bold text-forest-800 mb-2">
          器材租赁
        </h2>
        <p className="text-bark-600 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          精选专业射箭器材，为您的体验保驾护航
        </p>
      </div>

      {currentBooking && (
        <div className="card mb-6 bg-gradient-to-r from-bronze-50 to-ivory-200 border-bronze-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-bronze-500" />
              <div>
                <p className="font-medium text-forest-800">预约已确认</p>
                <p className="text-sm text-bark-600">
                  {currentBooking.laneName} · {currentBooking.date} · {currentBooking.startTime}-{currentBooking.endTime}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-bronze-600 hover:text-bronze-700 font-medium"
            >
              修改预约 →
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-bronze-500" />
                <h3 className="font-serif text-lg font-bold text-forest-800">器材分类</h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {equipmentCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${selectedCategory === cat.value
                      ? 'bg-bronze-500 text-white'
                      : 'bg-forest-100 text-forest-700 hover:bg-forest-200'}
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredEquipment.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                selectedQuantity={getQuantity(item.id)}
                onAdd={() => handleAdd(item.id)}
                onRemove={() => handleRemove(item.id)}
                onUpdateQuantity={(qty) => handleUpdateQuantity(item.id, qty)}
              />
            ))}
          </div>

          {activePackages.length > 0 && (
            <div className="card bg-gradient-to-br from-bronze-50 to-ivory-200 border-bronze-200">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-bronze-500" />
                <h3 className="font-serif text-lg font-bold text-forest-800">租赁套餐优惠</h3>
              </div>
              <div className="space-y-3">
                {activePackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between p-3 bg-white/60 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-forest-800">{pkg.name}</p>
                      <p className="text-sm text-bark-600">{pkg.description}</p>
                    </div>
                    <span className="text-bronze-600 font-bold">
                      {pkg.discountType === 'percentage'
                        ? `${pkg.discountValue}% OFF`
                        : `立减${pkg.discountValue}元`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <OrderSummary />

          <button
            onClick={() => navigate('/checkout')}
            disabled={!currentBooking}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            去结算
            <ArrowRight className="w-5 h-5" />
          </button>

          {!currentBooking && (
            <p className="text-center text-sm text-bark-500">
              请先完成箭道预约
            </p>
          )}

          {equipmentRentals.length > 0 && (
            <div className="card">
              <h4 className="font-medium text-forest-800 mb-3">已选器材</h4>
              <div className="space-y-2">
                {equipmentRentals.map((rental) => (
                  <div
                    key={rental.equipmentId}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-bark-600">
                      {rental.equipmentName} × {rental.quantity}
                    </span>
                    <span className="text-bark-700 font-medium">
                      ¥{rental.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentPage;
