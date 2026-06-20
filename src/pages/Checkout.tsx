import { useState } from 'react';
import { Receipt, Target, ShoppingBag, Tag, Calendar, Clock, User, Phone, Users, CheckCircle, CreditCard, ArrowLeft, AlertTriangle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { formatPrice, calculateTotalDiscount, calculateTotalActivityDiscount } from '@/utils/priceUtils';
import type { AppliedPackage, AppliedActivity } from '@/types';

const Checkout = () => {
  const navigate = useNavigate();
  const {
    getCurrentBooking,
    getCurrentOrder,
    getLaneFee,
    getEquipmentFee,
    getBestPackages,
    getApplicableActivities,
    getTotalAmount,
    equipmentRentals,
    createOrder,
    currentBookingId,
    currentOrderId,
    orders,
    resetBookingForm,
  } = useAppStore();

  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const booking = getCurrentBooking();
  const existingOrder = getCurrentOrder();

  const laneFee = getLaneFee();
  const equipmentFee = getEquipmentFee();
  const appliedPackages = getBestPackages();
  const appliedActivities = getApplicableActivities();
  const totalPackageDiscount = calculateTotalDiscount(appliedPackages);
  const totalActivityDiscount = calculateTotalActivityDiscount(appliedActivities);
  const totalAmount = getTotalAmount();

  const handleCreateOrder = () => {
    if (!currentBookingId) return;
    const result = createOrder(currentBookingId);
    if (result.success) {
      setPaid(true);
    }
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
    }, 1500);
  };

  const handleNewBooking = () => {
    resetBookingForm();
    navigate('/');
  };

  if (!booking && !existingOrder) {
    return (
      <div className="animate-fade-in max-w-xl mx-auto">
        <div className="card text-center py-12">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-forest-800 mb-2">
            暂无订单信息
          </h2>
          <p className="text-bark-600 mb-6">
            请先完成箭道预约，再进行结算
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            去预约
          </button>
        </div>
      </div>
    );
  }

  const displayOrder = existingOrder || {
    laneFee,
    equipmentFee,
    packageDiscount: totalPackageDiscount,
    activityDiscount: totalActivityDiscount,
    totalAmount,
    packagesApplied: appliedPackages,
    activitiesApplied: appliedActivities,
    equipmentRentals,
    status: 'unpaid' as const,
  };

  if (paid || existingOrder?.status === 'paid') {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto">
        <div className="card text-center py-12">
          <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-forest-500" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-forest-800 mb-2">
            支付成功
          </h2>
          <p className="text-bark-600 mb-8">
            感谢您的预订，祝您射箭愉快！
          </p>

          <div className="bg-forest-50 rounded-xl p-6 mb-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5 text-bronze-500" />
              <h3 className="font-serif text-lg font-bold text-forest-800">
                订单详情
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-bark-500">订单编号</span>
                <span className="font-medium text-bark-700">
                  {existingOrder?.id || 'ORD-DEMO-001'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-bark-500">预约箭道</span>
                <span className="font-medium text-bark-700">
                  {booking?.laneName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-bark-500">预约日期</span>
                <span className="font-medium text-bark-700">
                  {booking?.date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-bark-500">使用时段</span>
                <span className="font-medium text-bark-700">
                  {booking?.startTime} - {booking?.endTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-bark-500">同行人数</span>
                <span className="font-medium text-bark-700">
                  {booking?.peopleCount}人
                </span>
              </div>
              <div className="border-t border-forest-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-forest-700 font-medium">实付金额</span>
                  <span className="font-serif text-2xl font-bold text-bronze-600">
                    {formatPrice(displayOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleNewBooking}
            className="btn-primary inline-flex items-center gap-2"
          >
            开始新的预约
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button
          onClick={() => navigate('/equipment')}
          className="text-bark-500 hover:text-bronze-600 flex items-center gap-1 text-sm mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回器材选择
        </button>
        <h2 className="font-serif text-3xl font-bold text-forest-800 mb-2">
          订单结算
        </h2>
        <p className="text-bark-600 flex items-center gap-2">
          <Receipt className="w-4 h-4" />
          确认订单信息，完成支付
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-bronze-500" />
              <h3 className="font-serif text-lg font-bold text-forest-800">
                箭道预约信息
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-bark-400" />
                <span className="text-bark-500">日期：</span>
                <span className="font-medium text-bark-700">{booking?.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-bark-400" />
                <span className="text-bark-500">时段：</span>
                <span className="font-medium text-bark-700">
                  {booking?.startTime} - {booking?.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-bark-400" />
                <span className="text-bark-500">箭道：</span>
                <span className="font-medium text-bark-700">{booking?.laneName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-bark-400" />
                <span className="text-bark-500">人数：</span>
                <span className="font-medium text-bark-700">{booking?.peopleCount}人</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-bark-400" />
                <span className="text-bark-500">姓名：</span>
                <span className="font-medium text-bark-700">{booking?.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-bark-400" />
                <span className="text-bark-500">电话：</span>
                <span className="font-medium text-bark-700">{booking?.customerPhone}</span>
              </div>
            </div>
          </div>

          {displayOrder.equipmentRentals.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-bronze-500" />
                <h3 className="font-serif text-lg font-bold text-forest-800">
                  租赁器材
                </h3>
              </div>

              <div className="space-y-3">
                {displayOrder.equipmentRentals.map((rental) => (
                  <div
                    key={rental.equipmentId}
                    className="flex items-center justify-between p-3 bg-forest-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-forest-800">
                        {rental.equipmentName}
                      </p>
                      <p className="text-sm text-bark-500">
                        数量：{rental.quantity} · {formatPrice(rental.pricePerDay)}/天
                      </p>
                    </div>
                    <span className="font-medium text-bark-700">
                      {formatPrice(rental.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(displayOrder.packagesApplied && displayOrder.packagesApplied.length > 0) || (displayOrder.activitiesApplied && displayOrder.activitiesApplied.length > 0) ? (
            <div className="card bg-gradient-to-r from-bronze-50 to-ivory-200 border-bronze-200">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-bronze-500" />
                <h3 className="font-serif text-lg font-bold text-forest-800">
                  已享优惠
                </h3>
              </div>
              <div className="space-y-4">
                {displayOrder.packagesApplied && displayOrder.packagesApplied.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-bark-500 uppercase tracking-wider">套餐优惠</p>
                    {displayOrder.packagesApplied.map(({ pkg, discount }: AppliedPackage) => (
                      <div key={pkg.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-forest-800">
                            {pkg.name}
                          </p>
                          <p className="text-sm text-bark-600">
                            {pkg.description}
                          </p>
                        </div>
                        <span className="font-serif text-xl font-bold text-red-500">
                          -{formatPrice(discount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {displayOrder.activitiesApplied && displayOrder.activitiesApplied.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">限时活动</p>
                    {displayOrder.activitiesApplied.map(({ activity, discount }: AppliedActivity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <p className="font-medium text-forest-800">
                              {activity.name}
                            </p>
                          </div>
                          <p className="text-sm text-bark-600 ml-6">
                            {activity.discountType === 'percentage'
                              ? `${activity.discountValue}%折扣`
                              : `立减${activity.discountValue}元`}
                            · 作用于{activity.target === 'lane' ? '箭道费' : activity.target === 'equipment' ? '器材费' : '总价'}
                          </p>
                          <p className="text-xs text-amber-600 ml-6 mt-0.5">
                            有效期至{activity.endDate}
                          </p>
                        </div>
                        <span className="font-serif text-xl font-bold text-red-500">
                          -{formatPrice(discount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5 text-bronze-500" />
              <h3 className="font-serif text-lg font-bold text-forest-800">
                费用明细
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-bark-600">箭道使用费</span>
                <span className="font-medium text-bark-700">
                  {formatPrice(displayOrder.laneFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-bark-600">器材租赁费</span>
                <span className="font-medium text-bark-700">
                  {formatPrice(displayOrder.equipmentFee)}
                </span>
              </div>
              {displayOrder.packageDiscount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>套餐优惠</span>
                  <span className="font-medium">
                    -{formatPrice(displayOrder.packageDiscount)}
                  </span>
                </div>
              )}
              {displayOrder.activityDiscount > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    活动优惠
                  </span>
                  <span className="font-medium">
                    -{formatPrice(displayOrder.activityDiscount)}
                  </span>
                </div>
              )}
              <div className="border-t border-forest-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-forest-800 font-medium">应付总额</span>
                  <span className="font-serif text-3xl font-bold text-bronze-600">
                    {formatPrice(displayOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 className="font-medium text-forest-800 mb-3">支付方式</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border-2 border-bronze-400 bg-bronze-50 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="wechat"
                  checked
                  readOnly
                  className="w-4 h-4 text-bronze-500"
                />
                <span className="text-lg">💳</span>
                <span className="font-medium text-forest-800">微信支付</span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-forest-200 rounded-lg cursor-pointer hover:border-forest-300 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="alipay"
                  className="w-4 h-4 text-bronze-500"
                />
                <span className="text-lg">💰</span>
                <span className="font-medium text-forest-800">支付宝</span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-forest-200 rounded-lg cursor-pointer hover:border-forest-300 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  className="w-4 h-4 text-bronze-500"
                />
                <CreditCard className="w-5 h-5 text-forest-600" />
                <span className="font-medium text-forest-800">到店支付</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleCreateOrder}
            disabled={processing}
            className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <span className="animate-spin">⏳</span>
                支付中...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                确认支付 {formatPrice(displayOrder.totalAmount)}
              </>
            )}
          </button>

          <p className="text-center text-xs text-bark-400">
            点击支付即表示同意《射箭馆服务协议》
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
