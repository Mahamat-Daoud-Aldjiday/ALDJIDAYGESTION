
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  Receipt, 
  BarChart3, 
  Plus, 
  Search,
  AlertTriangle,
  Menu,
  X,
  Store,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { Product, Sale, Expense, View, AppData, AppSettings } from './types';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import SalesView from './components/SalesView';
import ExpensesView from './components/ExpensesView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';

const STORAGE_KEY = 'aldjiday_gestion_data_v2';

const DEFAULT_SETTINGS: AppSettings = {
  adminId: 'admin',
  adminPass: '12345678',
  shopName: 'ALDJIDAY',
  theme: 'light'
};

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // App Data State
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.settings) parsed.settings = DEFAULT_SETTINGS;
        if (!parsed.settings.shopName) parsed.settings.shopName = DEFAULT_SETTINGS.shopName;
        return parsed;
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    return {
      products: [],
      sales: [],
      expenses: [],
      settings: DEFAULT_SETTINGS
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (data.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data]);

  const updateProducts = (newProducts: Product[]) => {
    setData(prev => ({ ...prev, products: newProducts }));
  };

  const addSale = (sale: Sale) => {
    setData(prev => {
      const updatedProducts = prev.products.map(p => {
        if (p.id === sale.productId) {
          return { ...p, stock: p.stock - sale.quantity, updatedAt: Date.now() };
        }
        return p;
      });

      return {
        ...prev,
        products: updatedProducts,
        sales: [sale, ...prev.sales]
      };
    });
  };

  const addExpense = (expense: Expense) => {
    setData(prev => ({
      ...prev,
      expenses: [expense, ...prev.expenses]
    }));
  };

  const deleteProduct = (id: string) => {
    setData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  const deleteSale = (id: string) => {
    setData(prev => {
      const sale = prev.sales.find(s => s.id === id);
      if (!sale) return prev;
      const updatedProducts = prev.products.map(p => {
        if (p.id === sale.productId) {
          return { ...p, stock: p.stock + sale.quantity, updatedAt: Date.now() };
        }
        return p;
      });
      return {
        ...prev,
        products: updatedProducts,
        sales: prev.sales.filter(s => s.id !== id)
      };
    });
  };

  const deleteExpense = (id: string) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id)
    }));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventaire', icon: Package },
    { id: 'sales', label: 'Historique Ventes', icon: TrendingUp },
    { id: 'expenses', label: 'Dépenses', icon: Receipt },
    { id: 'analytics', label: 'Rapports PDF', icon: BarChart3 },
    { id: 'settings', label: 'Configuration', icon: SettingsIcon },
  ];

  if (!isAuthenticated) {
    return <LoginView settings={data.settings} onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView data={data} setCurrentView={setCurrentView} />;
      case 'inventory':
        return <InventoryView products={data.products} onUpdate={updateProducts} onDelete={deleteProduct} onSale={addSale} />;
      case 'sales':
        return <SalesView sales={data.sales} onDelete={deleteSale} />;
      case 'expenses':
        return <ExpensesView expenses={data.expenses} onAdd={addExpense} onDelete={deleteExpense} />;
      case 'analytics':
        return <AnalyticsView data={data} />;
      case 'settings':
        return <SettingsView settings={data.settings} onUpdate={updateSettings} onLogout={handleLogout} />;
      default:
        return <DashboardView data={data} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-md transition-opacity duration-300" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Modern Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 w-80 bg-slate-900 text-white z-50 transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:relative lg:translate-x-0 border-r border-slate-800
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section - Centered */}
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="bg-emerald-500 p-4 rounded-2xl shadow-lg shadow-emerald-500/20 rotate-3 group-hover:rotate-0 transition-transform mb-4">
              <Store size={32} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter leading-none uppercase">{data.settings.shopName}</h1>
              <p className="text-[10px] text-emerald-400 uppercase tracking-[0.3em] font-black mt-2">GESTION PRO</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto hide-scrollbar">
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Menu Principal</p>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as View);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 group
                  ${currentView === item.id 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon size={22} className={`${currentView === item.id ? 'text-white' : 'text-emerald-500 group-hover:scale-110 transition-transform'}`} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                {currentView === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Card */}
          <div className="p-6">
            <div className="bg-slate-800/50 rounded-[2rem] p-6 border border-slate-700/50 mb-4">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connecté</span>
              </div>
              <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-tight text-center">Session Admin</p>
              <h3 className="text-xl font-black text-white tracking-tighter truncate text-center">{data.settings.adminId}</h3>
              
              <button 
                onClick={handleLogout}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
              >
                <LogOut size={16} />
                Quitter
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Modern Top Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 h-20 flex items-center justify-between px-8 sticky top-0 z-30 transition-all">
          <div className="flex items-center gap-6">
            <button 
              className="lg:hidden p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-400 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">Section Actuelle</span>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                {navItems.find(i => i.id === currentView)?.label}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Logiciel Actif</span>
               <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{data.settings.shopName} GESTION v2.0</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-500/20 border border-white/20">
              {data.settings.adminId.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto pb-20">
            {renderView()}
          </div>
        </div>

        {/* Subtle Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent pointer-events-none z-10"></div>
      </main>
    </div>
  );
};

export default App;
