import { NavLink, Outlet } from 'react-router-dom';
import { Target, ShoppingCart, Receipt, Settings } from 'lucide-react';

const Layout = () => {
  const navItems = [
    { path: '/', label: '场馆预约', icon: Target },
    { path: '/equipment', label: '器材租赁', icon: ShoppingCart },
    { path: '/checkout', label: '订单结算', icon: Receipt },
    { path: '/admin', label: '后台管理', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-forest-800/95 backdrop-blur-sm border-b border-bronze-600/30 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-bronze-400 to-bronze-600 rounded-full flex items-center justify-center shadow-glow-bronze">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-bronze-300 leading-tight">
                  翎羽箭道
                </h1>
                <p className="text-xs text-forest-300">室内射箭馆预约系统</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-bronze-500/20 text-bronze-300'
                        : 'text-forest-200 hover:text-bronze-300 hover:bg-forest-700/50'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-forest-800/95 backdrop-blur-sm border-t border-bronze-600/30 z-50">
              <div className="flex items-center justify-around py-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'text-bronze-300'
                          : 'text-forest-300'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      <footer className="hidden md:block bg-forest-900/50 border-t border-forest-700/50 py-6">
        <div className="container mx-auto px-4 text-center text-forest-400 text-sm">
          <p>© 2024 翎羽箭道室内射箭馆 版权所有</p>
          <p className="mt-1 text-xs">专业射箭运动体验 · 安全 · 专业 · 愉悦</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
