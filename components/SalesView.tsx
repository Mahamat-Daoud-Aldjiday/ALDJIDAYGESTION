import React, { useState } from 'react';
import { Sale } from '../types';
import { ShoppingCart, Search, Calendar, FileDown } from 'lucide-react';

interface Props {
  sales: Sale[];
  onDelete: (id: string) => void;
}

const SalesView: React.FC<Props> = ({ sales }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales.filter(s => 
    s.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSalesAmount = filteredSales.reduce((sum, s) => sum + s.totalPrice, 0);

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Historique des Ventes</h1>
          <p className="text-slate-500 dark:text-slate-400">Suivi détaillé de vos revenus</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 px-4 py-2 rounded-xl">
            <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Total aujourd'hui</span>
            <span className="text-lg font-bold text-emerald-800 dark:text-emerald-100">{totalSalesAmount.toLocaleString()} Fcfa</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par produit..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
            <Calendar size={18} />
            <span>Date</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
            <FileDown size={18} />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Heure</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Produit</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Quantité</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Prix Unit.</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(sale.timestamp).toLocaleDateString('fr-FR')} à {new Date(sale.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{sale.productName}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-semibold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg dark:text-slate-200">x{sale.quantity}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {sale.unitPrice.toLocaleString()} Fcfa
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{sale.totalPrice.toLocaleString()} Fcfa</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                  <ShoppingCart className="mx-auto mb-4 opacity-20" size={48} />
                  <p>Aucune vente enregistrée.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesView;