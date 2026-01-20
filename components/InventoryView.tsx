import React, { useState } from 'react';
import { Product, Sale } from '../types';
import { Plus, Search, Edit2, Trash2, ShoppingCart, AlertTriangle, AlertCircle } from 'lucide-react';

interface Props {
  products: Product[];
  onUpdate: (products: Product[]) => void;
  onDelete: (id: string) => void;
  onSale: (sale: Sale) => void;
}

const InventoryView: React.FC<Props> = ({ products, onUpdate, onDelete, onSale }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sellingProduct, setSellingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert);
  const lowStockCount = lowStockProducts.length;

  const handleSubmitProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      purchasePrice: Number(formData.get('purchasePrice') || 0), 
      sellingPrice: Number(formData.get('sellingPrice') || 0), 
      stock: Number(formData.get('stock')),
      minStockAlert: Number(formData.get('minStockAlert')),
      updatedAt: Date.now()
    };

    if (editingProduct) {
      onUpdate(products.map(p => p.id === editingProduct.id ? productData : p));
      setEditingProduct(null);
    } else {
      onUpdate([productData, ...products]);
      setIsAddingProduct(false);
    }
  };

  const handleProcessSale = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sellingProduct) return;
    const formData = new FormData(e.currentTarget);
    const quantity = Number(formData.get('quantity'));
    const unitPrice = Number(formData.get('unitPrice'));
    
    if (quantity > sellingProduct.stock) {
      alert("Stock insuffisant !");
      return;
    }
    const sale: Sale = {
      id: Date.now().toString(),
      productId: sellingProduct.id,
      productName: sellingProduct.name,
      productCategory: sellingProduct.category,
      quantity,
      unitPrice: unitPrice,
      totalPrice: quantity * unitPrice,
      timestamp: Date.now()
    };
    onSale(sale);
    setSellingProduct(null);
  };

  const handleDeleteProduct = (product: Product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?\nCette action est irréversible.`)) {
      onDelete(product.id);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Gestion d'Inventaire</h1>
          <p className="text-slate-500 dark:text-slate-400">Suivez vos articles et niveaux de stocks</p>
        </div>
        <button 
          onClick={() => setIsAddingProduct(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none active:scale-95"
        >
          <Plus size={20} />
          <span>Nouveau Produit</span>
        </button>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
          <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-xl text-amber-600 dark:text-amber-400">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-black text-amber-800 dark:text-amber-300 uppercase tracking-tight">Alerte Stock Bas</p>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Il y a {lowStockCount} produit(s) nécessitant un réapprovisionnement.</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un produit ou une catégorie..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm dark:text-white font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Produit</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Quantité</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const isLowStock = product.stock <= product.minStockAlert;
                return (
                  <tr 
                    key={product.id} 
                    className={`
                      transition-colors group
                      ${isLowStock ? 'bg-rose-50/30 dark:bg-rose-900/10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/50'}
                    `}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isLowStock ? 'text-rose-700 dark:text-rose-400' : 'text-slate-800 dark:text-slate-100'}`}>
                          {product.name}
                        </span>
                        {isLowStock && (
                          <AlertCircle size={14} className="text-rose-500 animate-bounce" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`
                        inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-black
                        ${isLowStock 
                          ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800' 
                          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}
                      `}>
                        {product.stock}
                        {isLowStock && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSellingProduct(product)} 
                          title="Vendre" 
                          className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                        >
                          <ShoppingCart size={18} />
                        </button>
                        <button 
                          onClick={() => setEditingProduct(product)} 
                          title="Modifier" 
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product)} 
                          title="Supprimer" 
                          className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Search size={48} className="opacity-10" />
                    <p className="font-bold uppercase tracking-widest text-xs">Aucun produit trouvé</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Product Modal (Add/Edit) */}
      {(isAddingProduct || editingProduct) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                {editingProduct ? 'Modifier' : 'Ajouter'} un Produit
              </h2>
              <button 
                onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }} 
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmitProduct} className="p-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Nom du Produit</label>
                  <input required name="name" defaultValue={editingProduct?.name} placeholder="Ex: Coca-Cola 33cl" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 dark:text-white font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Catégorie</label>
                  <input required name="category" defaultValue={editingProduct?.category} placeholder="Ex: Boissons" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 dark:text-white font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Stock Actuel</label>
                    <input required type="number" name="stock" defaultValue={editingProduct?.stock ?? 0} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 dark:text-white font-black" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Alerte Stock Bas</label>
                    <input required type="number" name="minStockAlert" defaultValue={editingProduct?.minStockAlert ?? 5} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 dark:text-white font-black" />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg dark:shadow-none font-black uppercase tracking-widest text-sm transition-all active:scale-95">
                Enregistrer le Produit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sale Modal */}
      {sellingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border dark:border-slate-800">
            <div className="p-8 bg-emerald-600 text-white flex flex-col items-center text-center gap-4">
              <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                <ShoppingCart size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Vendre un Article</h2>
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">{sellingProduct.name}</p>
              </div>
            </div>
            <div className="p-8">
              <form onSubmit={handleProcessSale} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Quantité à vendre (Max: {sellingProduct.stock})</label>
                  <input required type="number" name="quantity" min="1" max={sellingProduct.stock} defaultValue="1" className="w-full text-center text-4xl font-black py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-emerald-500 dark:text-white transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Prix de Vente Unitaire (Fcfa)</label>
                  <input required type="number" name="unitPrice" placeholder="0" className="w-full text-center text-3xl font-black py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-emerald-500 dark:text-white transition-all" />
                </div>
                <div className="flex gap-3">
                   <button 
                    type="button" 
                    onClick={() => setSellingProduct(null)} 
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="flex-[2] py-4 bg-emerald-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                    Confirmer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;