import React, { useState } from 'react';
import { Expense } from '../types';
import { Receipt, Plus, Trash2 } from 'lucide-react';

interface Props {
  expenses: Expense[];
  onAdd: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpensesView: React.FC<Props> = ({ expenses, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const expense: Expense = {
      id: Date.now().toString(),
      description: formData.get('description') as string,
      category: 'Général',
      amount: Number(formData.get('amount')),
      timestamp: Date.now()
    };
    onAdd(expense);
    setIsAdding(false);
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Suivi des Dépenses</h1>
          <p className="text-slate-500 dark:text-slate-400">Gérez vos coûts opérationnels</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 dark:shadow-none"
        >
          <Plus size={20} />
          <span>Nouvelle Dépense</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2 flex flex-col justify-center">
          <h3 className="font-bold text-slate-800 dark:text-white text-xl mb-2">Gestion Simplifiée</h3>
          <p className="text-slate-500 dark:text-slate-400">
            Enregistrez vos frais fixes et variables pour suivre votre bénéfice réel. La date et l'heure sont enregistrées automatiquement.
          </p>
        </div>
        <div className="bg-rose-600 p-8 rounded-3xl shadow-lg shadow-rose-200 dark:shadow-none text-white flex flex-col justify-center text-center">
          <p className="text-rose-100 text-xs font-bold uppercase tracking-wider mb-1">Total Dépenses</p>
          <h2 className="text-4xl font-black">{totalExpenses.toLocaleString()}</h2>
          <p className="text-rose-100 text-sm font-medium mt-1">Fcfa</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white">Historique des Dépenses</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <div key={expense.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 p-3 rounded-2xl">
                    <Receipt size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{expense.description}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(expense.timestamp).toLocaleDateString('fr-FR')} à {new Date(expense.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100">-{expense.amount.toLocaleString()} Fcfa</span>
                  <button 
                    onClick={() => onDelete(expense.id)}
                    className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-400">
              <Receipt className="mx-auto mb-4 opacity-20" size={48} />
              <p>Aucune dépense enregistrée.</p>
            </div>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nouvelle Dépense</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nom de la dépense</label>
                <input required name="description" placeholder="Ex: Achat matériel, Loyer..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-rose-500 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Montant (Fcfa)</label>
                <input required type="number" name="amount" placeholder="0" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-rose-500 dark:text-white" />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full py-4 text-white font-bold bg-rose-600 rounded-2xl hover:bg-rose-700 shadow-lg dark:shadow-none transition-all active:scale-95">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesView;