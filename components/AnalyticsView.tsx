
import React from 'react';
import { AppData } from '../types';
import { Download, FileSpreadsheet, FileText, ClipboardList } from 'lucide-react';

interface Props {
  data: AppData;
}

const AnalyticsView: React.FC<Props> = ({ data }) => {
  const totals = {
    sales: data.sales.reduce((sum, s) => sum + s.totalPrice, 0),
    expenses: data.expenses.reduce((sum, e) => sum + e.amount, 0),
    products: data.products.length,
    stockValue: data.products.reduce((sum, p) => sum + (p.stock * p.purchasePrice), 0)
  };

  const handleDownloadExcel = () => {
    const rows = [
      [`${data.settings.shopName.toUpperCase()} GESTION - RAPPORT GLOBAL`],
      [`Date: ${new Date().toLocaleDateString()}`],
      [''],
      ['--- RESUME ---'],
      ['Ventes Totales', `${totals.sales} Fcfa`],
      ['Depenses Totales', `${totals.expenses} Fcfa`],
      ['Benefice Net', `${totals.sales - totals.expenses} Fcfa`],
      [''],
      ['--- VENTES ---'],
      ['Categorie', 'Nom', 'Quantite', 'P.U', 'Total', 'Heure'],
      ...data.sales.map(s => [
        s.productCategory || '-', 
        s.productName, 
        s.quantity, 
        s.unitPrice, 
        s.totalPrice, 
        new Date(s.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      ]),
      [''],
      ['--- PRODUITS RESTANTS ---'],
      ['Nom', 'Categorie', 'Quantite'],
      ...data.products.map(p => [p.name, p.category, p.stock]),
      [''],
      ['--- DEPENSES ---'],
      ['Description', 'Montant', 'Heure'],
      ...data.expenses.map(e => [
        e.description, 
        e.amount, 
        new Date(e.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      ]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${data.settings.shopName.toLowerCase()}_rapport_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Rapports & Documents</h1>
          <p className="text-slate-500 dark:text-slate-400">Générer le rapport complet de l'activité</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 px-4 py-2 border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-sm"
          >
            <FileSpreadsheet size={18} />
            <span>Télécharger Excel</span>
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-900 dark:hover:bg-slate-600 transition-all shadow-lg active:scale-95"
          >
            <FileText size={18} />
            <span>Télécharger PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Preview Area */}
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm print:shadow-none print:border-none print:p-0">
        <div className="flex items-center justify-between mb-12 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
              <ClipboardList size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Rapport d'Activité</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Date: {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Logiciel</p>
            <p className="text-lg font-black text-emerald-600">{data.settings.shopName.toUpperCase()} GESTION</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chiffre d'Affaire</p>
            <p className="text-3xl font-black text-emerald-600">{totals.sales.toLocaleString()} Fcfa</p>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dépenses Totales</p>
            <p className="text-3xl font-black text-rose-600">{totals.expenses.toLocaleString()} Fcfa</p>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bénéfice Net</p>
            <p className="text-3xl font-black text-blue-600">{(totals.sales - totals.expenses).toLocaleString()} Fcfa</p>
          </div>
        </div>

        <div className="space-y-12">
          {/* Sales Table */}
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-tight border-l-4 border-emerald-600 pl-4">Tableau des Ventes</h3>
            <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">
                    <th className="px-6 py-4">Catégorie</th>
                    <th className="px-6 py-4">Nom</th>
                    <th className="px-6 py-4 text-center">Quantité</th>
                    <th className="px-6 py-4 text-right">P.U</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4 text-right">Heure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.sales.map(s => (
                    <tr key={s.id} className="text-slate-700 dark:text-slate-300 group hover:bg-slate-50 dark:hover:bg-slate-800/20">
                      <td className="px-6 py-4 font-medium text-slate-400 uppercase text-xs">{s.productCategory || '-'}</td>
                      <td className="px-6 py-4 font-bold">{s.productName}</td>
                      <td className="px-6 py-4 text-center font-black">x{s.quantity}</td>
                      <td className="px-6 py-4 text-right">{s.unitPrice.toLocaleString()} F</td>
                      <td className="px-6 py-4 text-right font-black text-emerald-600">{s.totalPrice.toLocaleString()} F</td>
                      <td className="px-6 py-4 text-right text-xs text-slate-400">
                        {new Date(s.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                    </tr>
                  ))}
                  {data.sales.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400 italic">Aucune vente enregistrée</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remaining Products Table */}
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-tight border-l-4 border-blue-600 pl-4">Produits Restants (Inventaire)</h3>
            <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">
                    <th className="px-6 py-4">Désignation</th>
                    <th className="px-6 py-4">Catégorie</th>
                    <th className="px-6 py-4 text-right">Quantité Restante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.products.map(p => (
                    <tr key={p.id} className="text-slate-700 dark:text-slate-300">
                      <td className="px-6 py-4 font-bold">{p.name}</td>
                      <td className="px-6 py-4 text-slate-500 uppercase text-xs">{p.category}</td>
                      <td className="px-6 py-4 text-right font-black text-blue-600">{p.stock}</td>
                    </tr>
                  ))}
                  {data.products.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400 italic">Inventaire vide</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expenses Table */}
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-tight border-l-4 border-rose-600 pl-4">Tableau des Dépenses</h3>
            <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Montant</th>
                    <th className="px-6 py-4 text-right">Heure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.expenses.map(e => (
                    <tr key={e.id} className="text-slate-700 dark:text-slate-300">
                      <td className="px-6 py-4 font-bold">{e.description}</td>
                      <td className="px-6 py-4 text-right font-black text-rose-600">{e.amount.toLocaleString()} Fcfa</td>
                      <td className="px-6 py-4 text-right text-xs text-slate-400">
                        {new Date(e.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                    </tr>
                  ))}
                  {data.expenses.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400 italic">Aucune dépense enregistrée</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Document officiel généré par {data.settings.shopName.toUpperCase()} GESTION - Solution Hors-Ligne</p>
        </div>
      </div>
      
      {/* GUIDE SECTION */}
      <div className="no-print bg-emerald-600 dark:bg-emerald-900 p-8 rounded-[2.5rem] flex items-center justify-center gap-6 text-white shadow-xl shadow-emerald-500/20">
        <span className="text-2xl font-black tracking-tighter uppercase text-center sm:text-left">
          VOTRE GUIDE POUR GESTION SIMPLIFIEE
        </span>
      </div>
    </div>
  );
};

export default AnalyticsView;
