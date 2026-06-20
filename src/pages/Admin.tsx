import { useState } from 'react';
import { Settings, BarChart3, ListTodo, Package, Target, Users, DollarSign, Calendar, Plus, Trash2, Edit2, ToggleLeft, ToggleRight, Eye, Search, Filter, Zap, Clock, MapPin } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatPrice, getActivityStatus } from '@/utils/priceUtils';

type AdminTab = 'dashboard' | 'orders' | 'packages' | 'activities' | 'lanes';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const { bookings, orders, packages, activities, lanes, toggleActivity } = useAppStore();

  const todayBookings = bookings.filter(
    (b) => b.date === new Date().toISOString().split('T')[0] && b.status !== 'cancelled'
  );

  const totalRevenue = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const paidOrders = orders.filter((o) => o.status === 'paid');

  const tabs = [
    { id: 'dashboard' as AdminTab, label: '数据概览', icon: BarChart3 },
    { id: 'orders' as AdminTab, label: '订单管理', icon: ListTodo },
    { id: 'packages' as AdminTab, label: '套餐管理', icon: Package },
    { id: 'activities' as AdminTab, label: '活动管理', icon: Zap },
    { id: 'lanes' as AdminTab, label: '箭道管理', icon: Target },
  ];

  const statusLabels: Record<string, { text: string; className: string }> = {
    confirmed: { text: '已确认', className: 'bg-forest-100 text-forest-700' },
    pending: { text: '待确认', className: 'bg-amber-100 text-amber-700' },
    completed: { text: '已完成', className: 'bg-blue-100 text-blue-700' },
    cancelled: { text: '已取消', className: 'bg-red-100 text-red-700' },
    paid: { text: '已支付', className: 'bg-forest-100 text-forest-700' },
    unpaid: { text: '未支付', className: 'bg-amber-100 text-amber-700' },
    refunded: { text: '已退款', className: 'bg-gray-100 text-gray-700' },
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-bold text-forest-800 mb-2">
          后台管理
        </h2>
        <p className="text-bark-600 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          门店运营管理中心
        </p>
      </div>

      <div className="flex gap-1 mb-6 bg-forest-100/50 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-white text-bronze-600 shadow-md'
                : 'text-forest-600 hover:text-forest-800'}
            `}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-bark-500 text-sm">今日预约</p>
                  <p className="font-serif text-3xl font-bold text-forest-800 mt-1">
                    {todayBookings.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-bronze-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-bronze-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-bark-500 text-sm">总订单数</p>
                  <p className="font-serif text-3xl font-bold text-forest-800 mt-1">
                    {paidOrders.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center">
                  <ListTodo className="w-6 h-6 text-forest-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-bark-500 text-sm">累计营收</p>
                  <p className="font-serif text-3xl font-bold text-bronze-600 mt-1">
                    ¥{totalRevenue.toFixed(0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-bark-500 text-sm">在用箭道</p>
                  <p className="font-serif text-3xl font-bold text-forest-800 mt-1">
                    {lanes.filter((l) => l.status === 'available').length}/{lanes.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-forest-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-serif text-lg font-bold text-forest-800 mb-4">
                今日预约列表
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {todayBookings.length === 0 ? (
                  <p className="text-center text-bark-400 py-8">暂无今日预约</p>
                ) : (
                  todayBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 bg-forest-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-forest-800">
                          {booking.customerName}
                        </p>
                        <p className="text-sm text-bark-500">
                          {booking.laneName} · {booking.startTime}-{booking.endTime}
                        </p>
                      </div>
                      <span
                        className={`badge ${statusLabels[booking.status]?.className || ''}`}
                      >
                        {statusLabels[booking.status]?.text || booking.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="font-serif text-lg font-bold text-forest-800 mb-4">
                热门套餐
              </h3>
              <div className="space-y-3">
                {packages.filter((p) => p.active).slice(0, 4).map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between p-3 bg-ivory-100 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-bronze-500" />
                      <div>
                        <p className="font-medium text-forest-800">{pkg.name}</p>
                        <p className="text-xs text-bark-500">{pkg.description}</p>
                      </div>
                    </div>
                    <span className="text-bronze-600 font-bold text-sm">
                      {pkg.discountType === 'percentage'
                        ? `${pkg.discountValue}% OFF`
                        : `立减${pkg.discountValue}元`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-lg font-bold text-forest-800">
              全部订单
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-bark-400" />
                <input
                  type="text"
                  placeholder="搜索订单..."
                  className="input-field pl-9 py-2 text-sm w-48"
                />
              </div>
              <button className="btn-ghost flex items-center gap-1">
                <Filter className="w-4 h-4" />
                筛选
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-forest-200">
                  <th className="text-left py-3 px-4 font-medium text-bark-600">订单号</th>
                  <th className="text-left py-3 px-4 font-medium text-bark-600">顾客</th>
                  <th className="text-left py-3 px-4 font-medium text-bark-600">箭道</th>
                  <th className="text-left py-3 px-4 font-medium text-bark-600">金额</th>
                  <th className="text-left py-3 px-4 font-medium text-bark-600">状态</th>
                  <th className="text-left py-3 px-4 font-medium text-bark-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const booking = bookings.find((b) => b.id === order.bookingId);
                  return (
                    <tr key={order.id} className="border-b border-forest-100 hover:bg-forest-50/50">
                      <td className="py-3 px-4 font-mono text-xs text-bark-600">{order.id}</td>
                      <td className="py-3 px-4 text-forest-800">
                        {booking?.customerName || '-'}
                      </td>
                      <td className="py-3 px-4 text-bark-600">{booking?.laneName || '-'}</td>
                      <td className="py-3 px-4 font-medium text-bronze-600">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${statusLabels[order.status]?.className || ''}`}>
                          {statusLabels[order.status]?.text || order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-forest-600 hover:text-bronze-600 p-1">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-lg font-bold text-forest-800">
              套餐管理
            </h3>
            <button className="btn-primary flex items-center gap-2 text-sm py-2">
              <Plus className="w-4 h-4" />
              新增套餐
            </button>
          </div>

          <div className="space-y-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200
                  ${pkg.active ? 'border-bronze-300 bg-ivory-50' : 'border-gray-200 bg-gray-50 opacity-60'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-bronze-100 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-bronze-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-forest-800">{pkg.name}</h4>
                      <p className="text-sm text-bark-500">{pkg.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-bark-400">
                        <span>类型：{
                          pkg.type === 'group' ? '多人套餐' :
                          pkg.type === 'duration' ? '时长套餐' : '组合套餐'
                        }</span>
                        <span>优惠：{
                          pkg.discountType === 'percentage'
                            ? `${pkg.discountValue}%折扣`
                            : `立减${pkg.discountValue}元`
                        }</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-bark-500 hover:text-bronze-600 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-bark-500 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      className={`p-2 transition-colors ${pkg.active ? 'text-forest-500' : 'text-gray-400'}`}
                    >
                      {pkg.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-lg font-bold text-forest-800">
              活动管理
            </h3>
            <button className="btn-primary flex items-center gap-2 text-sm py-2">
              <Plus className="w-4 h-4" />
              新增活动
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((activity) => {
              const status = getActivityStatus(activity);
              const statusConfig: Record<string, { text: string; className: string }> = {
                active: { text: '进行中', className: 'bg-forest-100 text-forest-700' },
                expired: { text: '已过期', className: 'bg-gray-100 text-gray-500' },
                upcoming: { text: '未开始', className: 'bg-blue-100 text-blue-700' },
              };
              const dayLabels = ['日', '一', '二', '三', '四', '五', '六'];
              const applicableDaysText = activity.applicableDays.length === 7
                ? '每天'
                : activity.applicableDays.length === 0
                ? '不限'
                : `周${activity.applicableDays.map((d) => dayLabels[d]).join('、')}`;
              const applicableDistancesText = activity.applicableDistances.length === 0
                ? '不限距离'
                : activity.applicableDistances.map((d) => `${d}米`).join('、');

              return (
                <div
                  key={activity.id}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200
                    ${activity.active && status === 'active' ? 'border-amber-300 bg-amber-50/50' : 'border-gray-200 bg-gray-50 opacity-60'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-forest-800">{activity.name}</h4>
                          <span className={`badge ${statusConfig[status]?.className || ''}`}>
                            {statusConfig[status]?.text || status}
                          </span>
                          {!activity.active && (
                            <span className="badge bg-red-100 text-red-600">已停用</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-bark-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {activity.startDate} ~ {activity.endDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {applicableDaysText}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {applicableDistancesText}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-bark-400">
                          <span>优惠：{
                            activity.discountType === 'percentage'
                              ? `${activity.discountValue}%折扣`
                              : `立减${activity.discountValue}元`
                          }</span>
                          <span>作用于：{
                            activity.target === 'lane' ? '箭道费' :
                            activity.target === 'equipment' ? '器材费' : '总价'
                          }</span>
                          <span>{activity.stackableWithPackage ? '可叠加套餐' : '不可叠加套餐'}</span>
                          <span>权重：{activity.sortOrder}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-bark-500 hover:text-bronze-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-bark-500 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleActivity(activity.id)}
                        className={`p-2 transition-colors ${activity.active ? 'text-forest-500' : 'text-gray-400'}`}
                      >
                        {activity.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'lanes' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-lg font-bold text-forest-800">
              箭道管理
            </h3>
            <button className="btn-primary flex items-center gap-2 text-sm py-2">
              <Plus className="w-4 h-4" />
              新增箭道
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {lanes.map((lane) => (
              <div
                key={lane.id}
                className="p-4 rounded-xl border border-forest-200 bg-gradient-to-br from-forest-50 to-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-serif font-bold text-forest-800">{lane.name}</h4>
                    <p className="text-xs text-bark-500">{lane.zone}</p>
                  </div>
                  <span className={`badge ${
                    lane.status === 'available' ? 'badge-success' :
                    lane.status === 'maintenance' ? 'badge-warning' : 'badge-error'
                  }`}>
                    {
                      lane.status === 'available' ? '空闲' :
                      lane.status === 'maintenance' ? '维护中' : '占用'
                    }
                  </span>
                </div>
                <div className="space-y-1 text-sm text-bark-600">
                  <p>距离：{lane.distance}米</p>
                  <p>价格：{formatPrice(lane.pricePerHour)}/小时</p>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-forest-100">
                  <button className="flex-1 text-xs py-1.5 rounded-lg bg-forest-100 text-forest-700 hover:bg-forest-200 transition-colors">
                    编辑
                  </button>
                  <button className="flex-1 text-xs py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors">
                    {lane.status === 'maintenance' ? '恢复' : '维护'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
