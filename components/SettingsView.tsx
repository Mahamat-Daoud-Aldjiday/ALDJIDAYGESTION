
import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Shield, Moon, Sun, Lock, User, CheckCircle2, AlertCircle, Store } from 'lucide-react';

interface Props {
  settings: AppSettings;
  onUpdate: (settings: Partial<AppSettings>) => void;
  onLogout: () => void;
}

const SettingsView: React.FC<Props> = ({ settings, onUpdate, onLogout }) => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdateAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newId = formData.get('adminId') as string;
    const newPass = formData.get('adminPass') as string;
    const confirmPass = formData.get('confirmPass') as string;
    const newShopName = formData.get('shopName') as string;

    if (newPass && newPass !== confirmPass) {
      setError('Les mots de passe ne correspondent pas');
      setSuccess('');
      return;
    }

    onUpdate({
      adminId: newId || settings.adminId,
      adminPass: newPass || settings.adminPass,
      shopName: newShopName || settings.shopName
    });

    setError('');
    setSuccess('Paramètres mis à jour avec succès');
    e.currentTarget.reset();
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Configuration Générale</h1>
        <p className="text-slate-500 dark:text-slate-400">Personnalisez votre expérience de gestion</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Apparence Toggle */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              {settings.theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
            </div>
            <div>
              <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Apparence</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Thème de l'interface</p>
            </div>
          </div>

          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button 
              onClick={() => onUpdate({ theme: 'light' })}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${settings.theme === 'light' ? 'bg-white text-slate-800 shadow-lg' : 'text-slate-400'}`}
            >
              <Sun size={18} />
              Clair
            </button>
            <button 
              onClick={() => onUpdate({ theme: 'dark' })}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${settings.theme === 'dark' ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400'}`}
            >
              <Moon size={18} />
              Sombre
            </button>
          </div>
        </div>

        {/* Sécurité et Nom Boutique */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Compte & Boutique</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Identité et sécurité</p>
            </div>
          </div>

          <form onSubmit={handleUpdateAuth} className="space-y-5">
            {success && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest rounded-2xl border border-emerald-100 dark:border-emerald-800 animate-in fade-in zoom-in-95">
                <CheckCircle2 size={18} />
                {success}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-widest rounded-2xl border border-rose-100 dark:border-rose-800 animate-in shake">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nom de la Boutique</label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  name="shopName" 
                  defaultValue={settings.shopName} 
                  placeholder="Nom de votre shop"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-bold" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Identifiant Administrateur</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  name="adminId" 
                  defaultValue={settings.adminId} 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-bold" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nouveau Mot de Passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password"
                    name="adminPass" 
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirmer</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password"
                    name="confirmPass" 
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white" 
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full mt-4 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              Enregistrer les Paramètres
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
