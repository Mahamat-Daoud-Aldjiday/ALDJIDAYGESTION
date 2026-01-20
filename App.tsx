
import React, { useEffect, useState } from 'react';
import { AppData, View, Product, Sale, Expense, AppSettings } from './types';

import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import SalesView from './components/SalesView';
import ExpensesView from './components/ExpensesView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';
import { LayoutDashboard, Package, ShoppingCart, Receipt, BarChart3, Settings, LogOut } from 'lucide-react';

/* Fix for error on line 13: Added missing properties adminId, adminPass, and theme to default settings */
const defaultData: AppData = {
  sales: [],
  expenses: [],
  products: [],
  settings: {
    shopName: 'ALDJIDAY GESTION',
    adminId: 'admin',
    adminPass: '12345678',
    theme: 'light'
  }
};

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('appData');
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* Apply theme and save data to localStorage */
  useEffect(() => {
    localStorage.setItem('appData', JSON.stringify(data));
    if (data.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data]);

  /* Product management handlers */
  const updateProducts = (products: Product[]) => {
    setData(prev => ({ ...prev, products }));
  };

  const deleteProduct = (id: string) => {
    setData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
  };

  /* Sale management handlers - handles both sale addition and stock reduction */
  const addSale = (sale: Sale) => {
    setData(prev => ({
      ...prev,
      sales: [sale, ...prev.sales],
      products: prev.products.map(p =>
        p.id === sale.productId
          ? { ...p, stock: p.stock - sale.quantity }
          : p
      )
    }));
  };

  const deleteSale = (id: string) => {
    setData(prev => ({ ...prev, sales: prev.sales.filter(s => s.id !== id) }));
  };

  /* Expense management handlers */
  const addExpense = (expense: Expense) => {
    setData(prev => ({ ...prev, expenses: [expense, ...prev.expenses] }));
  };

  const deleteExpense = (id: string) => {
    setData(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));
  };

  /* Settings and data history handlers */
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...newSettings } }));
  };

  const clearHistory = () => {
    setData(prev => ({ ...prev, sales: [], expenses: [] }));
  };

  /* Authentication check using LoginView */
  if (!isAuthenticated) {
    return <LoginView settings={data.settings} onLogin={() => setIsAuthenticated(true)} />;
  }

  /* Main view rendering logic with proper prop mapping */
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        /* Fix for error on line 69: Corrected DashboardView props to include setCurrentView instead of onAddSale */
        return <DashboardView data={data} setCurrentView={setCurrentView} />;
      case 'inventory':
        return (
          <InventoryView 
            products={data.products} 
            onUpdate={updateProducts} 
            onDelete={deleteProduct} 
            onSale={addSale} 
          />
        );
      case 'sales':
        return <SalesView sales={data.sales} onDelete={deleteSale} />;
      case 'expenses':
        /* Fix for error on line 71: Corrected ExpensesView props to use onAdd and onDelete as defined in its interface */
        return (
          <ExpensesView 
            expenses={data.expenses} 
            onAdd={addExpense} 
            onDelete={deleteExpense} 
          />
        );
      case 'analytics':
        return <AnalyticsView data={data} onClearHistory={clearHistory} />;
      case 'settings':
        return (
          <SettingsView 
            settings={data.settings} 
            onUpdate={updateSettings} 
            onLogout={() => setIsAuthenticated(false)} 
          />
        );
      default:
        return <DashboardView data={data} setCurrentView={setCurrentView} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventaire', icon: Package },
    { id: 'sales', label: 'Ventes', icon: ShoppingCart },
    { id: 'expenses', label: 'Dépenses', icon: Receipt },
    { id: 'analytics', label: 'Rapports', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className={`min-h-screen ${data.settings.theme === 'dark' ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Navigation Sidebar */}
        <aside className="lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col no-print">
          <div className="flex items-center gap-4 mb-10 px-2">
            <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h2 className="font-black text-xl text-slate-800 dark:text-white tracking-tighter uppercase leading-none">ALDJIDAY</h2>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Gestion v1.0</p>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`
                    w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold uppercase tracking-widest text-[10px]
                    ${isActive 
                      ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}
                  `}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button 
            onClick={() => setIsAuthenticated(false)}
            className="mt-auto flex items-center gap-4 px-5 py-4 rounded-2xl text-rose-600 dark:text-rose-400 font-bold uppercase tracking-widest text-[10px] hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </aside>

        {/* Dynamic Content Main Area */}
        <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
