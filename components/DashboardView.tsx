
import React, { useMemo } from 'react';
import { AppData, View } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle,
  LayoutDashboard,
  Calendar,
  History
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: AppData;
  setCurrentView: (view: View) => void;
}

const DashboardView: React.FC<Props> = ({ data, setCurrentView }) => {
  const stats = useMemo(() => {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const oneDay = 24 * 60 * 60 * 1000;
    const yesterdayStart = todayStart - oneDay;

    const totalSales = data.sales.reduce((sum, s) => sum + s.totalPrice, 0);
    const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
    const profit = totalSales - totalExpenses;
    const lowStockItems = data.products.filter(p => p.stock <= p.minStockAlert).length;

    const todaySales = data.sales
      .filter(s => s.timestamp >= todayStart)
      .reduce((sum, s) => sum + s.totalPrice, 0);
    const yesterdaySales = data.sales
      .filter(s => s.timestamp >= yesterdayStart && s.timestamp < todayStart)
      .reduce((sum, s) => sum + s.totalPrice, 0);

    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    return { 
      totalSales, 
      totalExpenses, 
      profit, 
      lowStockItems,
      todaySales,
      salesTrend: calculateTrend(todaySales, yesterdaySales),
      lowStockCount: lowStockItems
    };
  }, [data]);

  const recentSales = data.sales.slice(0, 6);

  const chartData = useMemo(() => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const dayStart = d.setHours(0, 0, 0, 0);
      const dayEnd = d.setHours(23, 59, 59, 999);
      
      const dayTotal = data.sales
        .filter(s => s.timestamp >= dayStart && s.timestamp <= dayEnd)
        .reduce((sum, s) => sum + s.totalPrice, 0);
        
      result.push({ name: dayName, ventes: dayTotal });
    }
    return result;
  }, [data.sales]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Welcome Header - Centered Layout */}
      <div className="flex flex-col items-center justify-center text-center gap-6 mb-10">
        <div className="bg-emerald-600/10 dark:bg-emerald-500/10 p-4 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
           <LayoutDashboard className="text-emerald-600 dark:text-emerald-400" size={40} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase mb-2">
            TABLEAU DE BORD
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight text-sm sm:text-base">
            Voici l'état actuel de votre boutique <span className="text-emerald-600 dark:text-emerald-400 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">{data.settings.shopName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-xs sm:text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em]">
          <Calendar size={18} className="text-emerald-600" />
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Main Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ventes Totales" 
          value={stats.totalSales} 
          icon={TrendingUp} 
          trend={stats.salesTrend} 
          color="emerald" 
          description="Chiffre d'affaire global"
        />
        <StatCard 
          title="Dépenses" 
          value={stats.totalExpenses} 
          icon={TrendingDown} 
          color="rose" 
          description="Coûts opérationnels"
        />
        <StatCard 
          title="Bénéfice Net" 
          value={stats.profit} 
          icon={CreditCard} 
          color="indigo" 
          description="Gain réel calculé"
        />
        <StatCard 
          title="Stock Alerte" 
          value={stats.lowStockCount} 
          icon={Package} 
          color="amber" 
          description="Articles à racheter"
          isCount
          onClick={() => setCurrentView('inventory')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Performance Hebdomadaire</h3>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Graphique des ventes (7 jours)</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest">
              Activité Temps Réel
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5'}}
                  contentStyle={{
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    padding: '12px 16px'
                  }}
                  itemStyle={{color: '#10b981', fontWeight: 900}}
                  labelStyle={{color: '#94a3b8', marginBottom: '4px', fontWeight: 700}}
                  formatter={(value: number) => [`${value.toLocaleString()} Fcfa`, 'Ventes']}
                />
                <Area 
                  type="monotone" 
                  dataKey="ventes" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#chartGradient)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Dernières Ventes</h3>
            <History size={20} className="text-slate-400" />
          </div>
          <div className="space-y-4">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      <ArrowUpRight size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{sale.productName}</p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{new Date(sale.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">{sale.totalPrice.toLocaleString()} Fcfa</p>
                    <p className="text-[10px] font-bold text-slate-400">Qté: {sale.quantity}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-4">
                  <TrendingUp className="text-slate-300" size={40} />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Aucune vente</p>
              </div>
            )}
          </div>
          {recentSales.length > 0 && (
            <button 
              onClick={() => setCurrentView('sales')}
              className="w-full mt-6 py-3 text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors border-t border-slate-100 dark:border-slate-800"
            >
              Voir tout l'historique
            </button>
          )}
        </div>
      </div>
      
      {/* Stock Alert Banner */}
      {stats.lowStockCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center gap-6 text-white shadow-xl shadow-amber-500/20 animate-pulse-slow">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            <AlertCircle className="text-white" size={32} />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h4 className="text-xl font-black uppercase tracking-tight leading-none mb-1">Attention : Stock Critique</h4>
            <p className="text-sm font-medium opacity-90 italic">Vous avez {stats.lowStockCount} article(s) en dessous du seuil de sécurité.</p>
          </div>
          <button 
            onClick={() => setCurrentView('inventory')}
            className="bg-white text-amber-600 px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-amber-50 transition-all active:scale-95 shadow-lg"
          >
            Réapprovisionner
          </button>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: any;
  trend?: string;
  color: 'emerald' | 'rose' | 'indigo' | 'amber';
  description: string;
  isCount?: boolean;
  onClick?: () => void;
}> = ({ title, value, icon: Icon, trend, color, description, isCount, onClick }) => {
  const themes = {
    emerald: 'bg-emerald-600 shadow-emerald-500/30 text-emerald-600',
    rose: 'bg-rose-600 shadow-rose-500/30 text-rose-600',
    indigo: 'bg-indigo-600 shadow-indigo-500/30 text-indigo-600',
    amber: 'bg-amber-600 shadow-amber-500/30 text-amber-600',
  };

  const softThemes = {
    emerald: 'bg-emerald-50 dark:bg-emerald-900/10',
    rose: 'bg-rose-50 dark:bg-rose-900/10',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/10',
    amber: 'bg-amber-50 dark:bg-amber-900/10',
  };

  return (
    <div 
      onClick={onClick}
      className={`relative group bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:-translate-y-1 transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl shadow-lg ${themes[color].split(' ')[0]} text-white`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${softThemes[color]} ${themes[color].split(' ')[2]}`}>
            <ArrowUpRight size={12} />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">
          {isCount ? value : `${value.toLocaleString()} Fcfa`}
        </h3>
        <p className="text-[10px] text-slate-400 font-medium mt-1 italic">{description}</p>
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -bottom-2 -right-2 w-20 h-20 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${themes[color].split(' ')[0]}`}></div>
    </div>
  );
};

export default DashboardView;
