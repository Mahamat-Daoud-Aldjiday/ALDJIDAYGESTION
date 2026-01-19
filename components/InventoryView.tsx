
import React, { useState } from 'react';
import { Product, Sale } from '../types';
import { Plus, Search, Edit2, Trash2, ShoppingCart } from 'lucide-react';

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

  const handleSubmitProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      purchasePrice: 0, 
      sellingPrice: 0, 
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

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Gestion d'Inventaire</h1>
          <p className="text-slate-500 dark:text-slate-400">Suivez vos articles et niveaux de stocks</p>
        </div>
        <button 
          onClick={() => setIsAddingProduct(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none"
        >
          <Plus size={20} />
          <span>Nouveau Produit</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un produit..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

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
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-5">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{product.name}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg uppercase tracking-wider">{product.category}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`
                      inline-block px-4 py-1 rounded-full text-sm font-black
                      ${product.stock <= product.minStockAlert ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}
                    `}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSellingProduct(product)} title="Vendre" className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"><ShoppingCart size={18} /></button>
                      <button onClick={() => setEditingProduct(product)} title="Modifier" className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => onDelete(product.id)} title="Supprimer" className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-400">Aucun produit trouvé.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {(isAddingProduct || editingProduct) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{editingProduct ? 'Modifier' : 'Ajouter'} un Produit</h2>
              <button onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400"><Plus size={24} className="rotate-45" /></button>
            </div>
            <form onSubmit={handleSubmitProduct} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Nom du Produit</label>
                  <input required name="name" defaultValue={editingProduct?.name} placeholder="Ex: Coca-Cola" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 dark:text-white font-medium" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Catégorie</label>
                  <input required name="category" defaultValue={editingProduct?.category} placeholder="Ex: Boissons" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 dark:text-white font-medium" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Quantité Initiale</label>
                  <input required type="number" name="stock" defaultValue={editingProduct?.stock ?? 0} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 dark:text-white font-bold" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1">Alerte Stock Bas</label>
                  <input required type="number" name="minStockAlert" defaultValue={editingProduct?.minStockAlert ?? 5} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 dark:text-white" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg dark:shadow-none font-black uppercase tracking-widest text-sm transition-all active:scale-95">Enregistrer le Produit</button>
            </form>
          </div>
        </div>
      )}

      {sellingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border dark:border-slate-800">
            <div className="p-6 bg-emerald-600 text-white flex items-center justify-between">
              <h2 className="text-xl font-bold">Effectuer une Vente</h2>
              <button onClick={() => setSellingProduct(null)} className="p-2 hover:bg-emerald-500 rounded-full transition-colors"><Plus size={24} className="rotate-45" /></button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 text-center">{sellingProduct.name}</h3>
              <form onSubmit={handleProcessSale} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 text-center">Quantité à vendre (Max: {sellingProduct.stock})</label>
                  <input required type="number" name="quantity" min="1" max={sellingProduct.stock} defaultValue="1" className="w-full text-center text-2xl font-black py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 text-center">Prix de Vente Unitaire (Fcfa)</label>
                  <input required type="number" name="unitPrice" placeholder="0" className="w-full text-center text-2xl font-black py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 dark:text-white" />
                </div>
                <button type="submit" className="w-full py-5 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-lg active:scale-95">Valider la Vente</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
