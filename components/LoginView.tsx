
import React, { useState } from 'react';
import { Store, Lock, User, AlertCircle } from 'lucide-react';
import { AppSettings } from '../types';

interface Props {
  settings: AppSettings;
  onLogin: () => void;
}

const LoginView: React.FC<Props> = ({ settings, onLogin }) => {
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId === settings.adminId && adminPass === settings.adminPass) {
      onLogin();
    } else {
      setError('Identifiant ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-6 bg-emerald-600 text-white rounded-[2rem] shadow-2xl shadow-emerald-500/30 mb-8 rotate-3">
            <Store size={48} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">{settings.shopName} GESTION</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-bold uppercase tracking-widest text-[10px]">Solution de gestion professionnelle</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-800 animate-in fade-in zoom-in-95">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Identifiant Admin</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 focus:border-emerald-500 transition-all dark:text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mot de passe (8 chiffres)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••••••"
                  maxLength={8}
                  pattern="\d{8}"
                  inputMode="numeric"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/5 focus:border-emerald-500 transition-all dark:text-white tracking-widest font-black"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition-all active:scale-95"
            >
              Se Connecter
            </button>
          </form>
        </div>
        
        <p className="text-center mt-10 text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
          Accès restreint aux gestionnaires {settings.shopName}
        </p>
      </div>
    </div>
  );
};

export default LoginView;
