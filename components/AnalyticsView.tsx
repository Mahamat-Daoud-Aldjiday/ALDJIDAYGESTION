
import React from 'react';
import { AppData } from '../types';
import { FileSpreadsheet, ClipboardList, Printer, RotateCcw } from 'lucide-react';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

interface Props {
  data: AppData;
  onClearHistory: () => void;
}

const AnalyticsView: React.FC<Props> = ({ data, onClearHistory }) => {
  const totals = {
    sales: data.sales.reduce((sum, s) => sum + s.totalPrice, 0),
    expenses: data.expenses.reduce((sum, e) => sum + e.amount, 0),
    products: data.products.length,
    stockValue: data.products.reduce((sum, p) => sum + (p.stock * (p.purchasePrice || 0)), 0)
  };

  /* ===================== EXPORT EXCEL REEL (.xlsx) ===================== */
  const handleDownloadExcel = () => {
    try {
      // Préparation des données pour la feuille de résumé et ventes
      const salesData = data.sales.map(s => ({
        "Date": new Date(s.timestamp).toLocaleDateString('fr-FR'),
        "Heure": new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        "Produit": s.productName,
        "Catégorie": s.productCategory || "Général",
        "Quantité": s.quantity,
        "Prix Unitaire": s.unitPrice,
        "Total (Fcfa)": s.totalPrice
      }));

      const expensesData = data.expenses.map(e => ({
        "Date": new Date(e.timestamp).toLocaleDateString('fr-FR'),
        "Heure": new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        "Description": e.description,
        "Montant (Fcfa)": e.amount
      }));

      const summaryData = [
        { "Métrique": "Boutique", "Valeur": data.settings.shopName },
        { "Métrique": "Date du rapport", "Valeur": new Date().toLocaleDateString('fr-FR') },
        { "Métrique": "Ventes Totales", "Valeur": totals.sales },
        { "Métrique": "Dépenses Totales", "Valeur": totals.expenses },
        { "Métrique": "Bénéfice Net", "Valeur": totals.sales - totals.expenses }
      ];

      // Création du classeur
      const wb = XLSX.utils.book_new();
      
      // Ajout de la feuille Résumé
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Résumé");

      // Ajout de la feuille Ventes
      const wsSales = XLSX.utils.json_to_sheet(salesData);
      XLSX.utils.book_append_sheet(wb, wsSales, "Ventes");

      // Ajout de la feuille Dépenses
      const wsExpenses = XLSX.utils.json_to_sheet(expensesData);
      XLSX.utils.book_append_sheet(wb, wsExpenses, "Dépenses");

      // Téléchargement
      XLSX.writeFile(wb, `Rapport_${data.settings.shopName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error("Erreur lors de l'export Excel:", error);
      alert("Une erreur est survenue lors de la génération du fichier Excel.");
    }
  };

  /* ===================== IMPRIMER / PDF ===================== */
  const handlePrintPDF = () => {
    // Petit délai pour s'assurer que le rendu est stable avant l'impression
    setTimeout(() => {
      window.print();
    }, 100);
  };

  /* ===================== REINITIALISER ===================== */
  const handleReset = () => {
    const confirmation = window.confirm(
      "⚠️ ATTENTION : RÉINITIALISATION COMPLÈTE ⚠️\n\n" +
      "Cette action va EFFACER DEFINITIVEMENT :\n" +
      "• Tout l'historique de vos VENTES\n" +
      "• Tout l'historique de vos DÉPENSES\n\n" +
      "Le tableau de bord retombera à zéro.\n" +
      "Votre inventaire (produits) ne sera PAS touché.\n\n" +
      "Voulez-vous vraiment continuer ?"
    );

    if (confirmation) {
      const doubleCheck = window.confirm("Confirmez-vous la suppression de toutes les données financières ?");
      if (doubleCheck) {
        onClearHistory();
        alert("Les données de vente et de dépenses ont été réinitialisées.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ===== ACTIONS BAR (Hidden on Print) ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            Rapports & PDF
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
            Gérez vos archives et votre cycle de vente
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-95 shadow-sm"
          >
            <FileSpreadsheet size={16} />
            Exporter Excel (.xlsx)
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 dark:bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-700 dark:hover:bg-emerald-500 transition-all active:scale-95"
          >
            <Printer size={16} />
            Imprimer / PDF
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-rose-700 transition-all active:scale-95"
          >
            <RotateCcw size={16} />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* ===== RAPPORT CONTAINER (Optimized for Print) ===== */}
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none print:shadow-none print:border-none print:p-0">

        <div className="flex items-center justify-between mb-12 border-b-2 border-slate-100 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-4">
             <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-lg print:bg-emerald-600 print:text-white">
              <ClipboardList size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">Rapport d'Activité</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Généré le {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Établissement</p>
            <p className="text-xl font-black text-emerald-600">{data.settings.shopName.toUpperCase()}</p>
          </div>
        </div>

        {/* ===== STATS SUMMARY ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 text-center">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Ventes Totales</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white">{totals.sales.toLocaleString()} <span className="text-xs">Fcfa</span></p>
          </div>

          <div className="p-8 bg-rose-50 dark:bg-rose-900/10 rounded-3xl border border-rose-100 dark:border-rose-800/50 text-center">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Dépenses Totales</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white">{totals.expenses.toLocaleString()} <span className="text-xs">Fcfa</span></p>
          </div>

          <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/50 text-center">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Bénéfice Net</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white">
              {(totals.sales - totals.expenses).toLocaleString()} <span className="text-xs">Fcfa</span>
            </p>
          </div>
        </div>

        <div className="space-y-12">
          {/* ===== TABLE VENTES ===== */}
          <section>
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
              Détail des Ventes
            </h3>
            <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-3xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                    <th className="px-6 py-4 text-left">Produit</th>
                    <th className="px-6 py-4 text-center">Quantité</th>
                    <th className="px-6 py-4 text-right">Prix Unitaire</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.sales.length > 0 ? data.sales.map(s => (
                    <tr key={s.id} className="text-slate-700 dark:text-slate-300">
                      <td className="px-6 py-4 font-bold">{s.productName}</td>
                      <td className="px-6 py-4 text-center font-black">x{s.quantity}</td>
                      <td className="px-6 py-4 text-right">{s.unitPrice.toLocaleString()} F</td>
                      <td className="px-6 py-4 text-right font-black text-emerald-600">{s.totalPrice.toLocaleString()} F</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center italic text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                        Aucune vente enregistrée pour cette période
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ===== TABLE DEPENSES ===== */}
          <section>
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-rose-600 rounded-full"></span>
              Détail des Dépenses
            </h3>
            <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-3xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                    <th className="px-6 py-4 text-left">Description</th>
                    <th className="px-6 py-4 text-right">Montant</th>
                    <th className="px-6 py-4 text-right">Heure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.expenses.length > 0 ? data.expenses.map(e => (
                    <tr key={e.id} className="text-slate-700 dark:text-slate-300">
                      <td className="px-6 py-4 font-bold">{e.description}</td>
                      <td className="px-6 py-4 text-right font-black text-rose-600">{e.amount.toLocaleString()} Fcfa</td>
                      <td className="px-6 py-4 text-right text-[10px] font-black uppercase text-slate-400">
                        {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center italic text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                        Aucune dépense enregistrée pour cette période
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ===== FOOTER (Visible on Print) ===== */}
        <div className="mt-24 pt-8 border-t-2 border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.6em]">
            Document de gestion généré par ALDJIDAY v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
