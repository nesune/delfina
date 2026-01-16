import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getProducts, saveProduct, deleteProduct, getMessages, markMessageRead } from '../../services/storage';
import { Product, ContactSubmission, Category } from '../../types';
import { supabase } from '../../lib/supabase';
import { Trash2, Edit, CheckCircle, Eye, EyeOff, Plus, Upload, X } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'products' | 'messages'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, messagesData] = await Promise.all([
        getProducts(),
        getMessages()
      ]);
      setProducts(productsData);
      setMessages(messagesData);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      const success = await deleteProduct(id);
      if (success) {
        await refreshData();
      } else {
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleEdit = (p: Product) => {
    setEditProduct(p);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    // Generate a proper UUID v4
    const generateUUID = (): string => {
      // Use browser's crypto.randomUUID() if available (modern browsers)
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      // Fallback for older browsers
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    setEditProduct({
      id: generateUUID(),
      title: { sq: '', en: '' },
      description: { sq: '', en: '' },
      specifications: {
        dimensions: { sq: '', en: '' },
        materials: { sq: '', en: '' }
      },
      price: 'On Request',
      category: 'Dhoma e Ditës',
      images: [],
      isFeatured: false,
      isVisible: true,
      createdAt: Date.now()
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct.id || !editProduct.title) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!editProduct.images || editProduct.images.length === 0) {
      alert('Please add at least one product image.');
      return;
    }

    setSaving(true);
    try {
      const productToSave = {
          ...editProduct,
          images: editProduct.images || []
      } as Product;
      
      const success = await saveProduct(productToSave);
      if (success) {
        setIsEditing(false);
        await refreshData();
      } else {
        alert('Failed to save product. Please try again.');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('An error occurred while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRead = async (id: string) => {
    const success = await markMessageRead(id);
    if (success) {
      await refreshData();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditProduct(prev => ({
          ...prev,
          images: [base64String] // Currently handling single image for simplicity in UI, easy to extend
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isEditing) {
    return (
      <div className="fixed inset-0 z-[60] overflow-y-auto bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-4xl shadow-2xl rounded-none max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-stone-100 bg-white sticky top-0 z-10">
             <h2 className="text-2xl font-serif text-primary">
               {editProduct.id && products.find(p => p.id === editProduct.id) ? 'Edit Product' : 'Add New Product'}
             </h2>
             <button onClick={() => setIsEditing(false)} className="text-stone-400 hover:text-red-500 transition-colors">
               <X size={24} />
             </button>
          </div>
          
          <form onSubmit={handleSave} className="p-8 space-y-8 bg-white">
            {/* Title Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-bold text-stone-500">Emri i Produktit (SQ)</label>
                <input 
                  required 
                  className="w-full bg-stone-50 border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-gold focus:bg-white transition-colors" 
                  value={editProduct.title?.sq} 
                  onChange={e => setEditProduct({...editProduct, title: {...editProduct.title!, sq: e.target.value}})} 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-bold text-stone-500">Product Name (EN)</label>
                <input 
                  required 
                  className="w-full bg-stone-50 border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-gold focus:bg-white transition-colors" 
                  value={editProduct.title?.en} 
                  onChange={e => setEditProduct({...editProduct, title: {...editProduct.title!, en: e.target.value}})} 
                />
              </div>
            </div>
            
            {/* Description Section */}
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-bold text-stone-500">Përshkrimi (SQ)</label>
                <textarea 
                  className="w-full bg-stone-50 border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-gold focus:bg-white transition-colors" 
                  rows={4} 
                  value={editProduct.description?.sq} 
                  onChange={e => setEditProduct({...editProduct, description: {...editProduct.description!, sq: e.target.value}})} 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-bold text-stone-500">Description (EN)</label>
                <textarea 
                  className="w-full bg-stone-50 border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-gold focus:bg-white transition-colors" 
                  rows={4} 
                  value={editProduct.description?.en} 
                  onChange={e => setEditProduct({...editProduct, description: {...editProduct.description!, en: e.target.value}})} 
                />
              </div>
            </div>

            {/* Specifications Section */}
            <div className="bg-stone-50 p-6 border border-stone-100">
              <h3 className="text-sm font-serif font-bold text-primary mb-6">Technical Specifications</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-stone-500">Dimensionet (SQ)</label>
                  <input className="w-full bg-white border border-stone-200 p-3 text-stone-900 focus:border-gold outline-none" placeholder="psh. 200x100cm" value={editProduct.specifications?.dimensions?.sq || ''} onChange={e => setEditProduct({...editProduct, specifications: {...editProduct.specifications!, dimensions: {...editProduct.specifications!.dimensions, sq: e.target.value}}})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-stone-500">Dimensions (EN)</label>
                  <input className="w-full bg-white border border-stone-200 p-3 text-stone-900 focus:border-gold outline-none" placeholder="e.g. 200x100cm" value={editProduct.specifications?.dimensions?.en || ''} onChange={e => setEditProduct({...editProduct, specifications: {...editProduct.specifications!, dimensions: {...editProduct.specifications!.dimensions, en: e.target.value}}})} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-stone-500">Materialet (SQ)</label>
                  <input className="w-full bg-white border border-stone-200 p-3 text-stone-900 focus:border-gold outline-none" value={editProduct.specifications?.materials?.sq || ''} onChange={e => setEditProduct({...editProduct, specifications: {...editProduct.specifications!, materials: {...editProduct.specifications!.materials, sq: e.target.value}}})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-stone-500">Materials (EN)</label>
                  <input className="w-full bg-white border border-stone-200 p-3 text-stone-900 focus:border-gold outline-none" value={editProduct.specifications?.materials?.en || ''} onChange={e => setEditProduct({...editProduct, specifications: {...editProduct.specifications!, materials: {...editProduct.specifications!.materials, en: e.target.value}}})} />
                </div>
              </div>
            </div>

            {/* Price and Category */}
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-stone-500">Price (Internal Use)</label>
                  <input 
                    className="w-full bg-stone-50 border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-gold focus:bg-white transition-colors" 
                    value={editProduct.price} 
                    onChange={e => setEditProduct({...editProduct, price: e.target.value})} 
                  />
               </div>
               <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-stone-500">Kategoria / Category</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-stone-50 border border-stone-200 p-4 text-stone-900 focus:outline-none focus:border-gold focus:bg-white transition-colors" 
                      value={editProduct.category} 
                      onChange={e => setEditProduct({...editProduct, category: e.target.value})}
                    >
                      {['Dhoma e Ditës', 'Kuzhinat', 'Dhomat e Gjumit'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
               </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
               <label className="block text-xs uppercase tracking-widest font-bold text-stone-500">Product Image</label>
               <div className="flex items-center gap-6">
                 {editProduct.images && editProduct.images.length > 0 && editProduct.images[0] && (
                   <div className="w-32 h-32 bg-stone-100 border border-stone-200 flex-shrink-0">
                     <img src={editProduct.images[0]} alt="Preview" className="w-full h-full object-cover" />
                   </div>
                 )}
                 <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-stone-400" />
                        <p className="mb-2 text-sm text-stone-500"><span className="font-semibold">Click to upload</span></p>
                        <p className="text-xs text-stone-400">SVG, PNG, JPG or GIF</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
               </div>
            </div>

            <div className="flex flex-wrap gap-8 py-4 border-t border-stone-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${editProduct.isFeatured ? 'border-gold bg-gold' : 'border-stone-300 group-hover:border-gold'}`}>
                   {editProduct.isFeatured && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <input type="checkbox" className="hidden" checked={editProduct.isFeatured} onChange={e => setEditProduct({...editProduct, isFeatured: e.target.checked})} />
                <span className="text-sm font-bold uppercase tracking-wide text-stone-600 group-hover:text-primary transition-colors">Featured on Home</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${editProduct.isVisible ? 'border-green-500 bg-green-500' : 'border-stone-300 group-hover:border-green-500'}`}>
                   {editProduct.isVisible && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <input type="checkbox" className="hidden" checked={editProduct.isVisible} onChange={e => setEditProduct({...editProduct, isVisible: e.target.checked})} />
                <span className="text-sm font-bold uppercase tracking-wide text-stone-600 group-hover:text-primary transition-colors">Visible on Site</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="flex-1 bg-primary text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Product'}
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="px-8 border border-stone-200 text-stone-500 uppercase tracking-widest text-sm font-bold hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-sand/30">
      <div className="container mx-auto px-6 md:px-12 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <h1 className="text-4xl font-serif text-primary">Admin Dashboard</h1>
          <button 
             onClick={async () => {
               try {
                 await supabase.auth.signOut();
                 navigate('/');
                 window.location.reload();
               } catch (error) {
                 console.error('Error signing out:', error);
               }
             }}
             className="text-xs uppercase tracking-widest text-red-500 hover:text-red-700 border-b border-red-200 pb-1"
          >
            Logout
          </button>
        </div>

        <div className="bg-white shadow-xl border border-stone-100">
          <div className="flex border-b border-stone-100">
            <button 
              className={`flex-1 py-6 text-sm font-bold uppercase tracking-widest transition-colors ${tab === 'products' ? 'bg-white text-primary border-b-2 border-gold -mb-[2px]' : 'bg-stone-50 text-stone-400 hover:text-stone-600'}`}
              onClick={() => setTab('products')}
            >
              {t('admin.products')}
            </button>
            <button 
              className={`flex-1 py-6 text-sm font-bold uppercase tracking-widest transition-colors ${tab === 'messages' ? 'bg-white text-primary border-b-2 border-gold -mb-[2px]' : 'bg-stone-50 text-stone-400 hover:text-stone-600'}`}
              onClick={() => setTab('messages')}
            >
              {t('admin.messages')}
            </button>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 mb-6 text-sm">
                {error}
              </div>
            )}
            {tab === 'products' && (
              <div>
                <div className="flex justify-end mb-8">
                  <button onClick={handleAddNew} className="bg-primary text-white px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gold transition-colors shadow-lg">
                    <Plus size={16} /> {t('admin.add_new')}
                  </button>
                </div>
                
                {loading ? (
                  <div className="text-center py-12 text-stone-400 italic">Loading products...</div>
                ) : (
                  <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 text-xs uppercase tracking-widest">
                        <th className="py-4 pr-4 font-normal">Image</th>
                        <th className="py-4 px-4 font-normal">Details</th>
                        <th className="py-4 px-4 font-normal">Category</th>
                        <th className="py-4 px-4 font-normal">Status</th>
                        <th className="py-4 px-4 text-right font-normal">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors group">
                          <td className="py-4 pr-4 w-24">
                            <div className="w-16 h-16 bg-stone-100 overflow-hidden">
                              {p.images && p.images.length > 0 && p.images[0] ? (
                                <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400 text-xs">No image</div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-serif text-lg text-primary">{p.title.en}</div>
                            <div className="text-xs text-stone-400">{p.title.sq}</div>
                          </td>
                          <td className="py-4 px-4 text-xs font-bold uppercase tracking-wide text-stone-500">{p.category}</td>
                          <td className="py-4 px-4">
                             <div className="flex flex-col gap-2 items-start">
                               {p.isVisible ? (
                                 <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                   <Eye size={10} /> Live
                                 </span>
                               ) : (
                                 <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-stone-400 bg-stone-100 px-2 py-1 rounded-full border border-stone-200">
                                   <EyeOff size={10} /> Hidden
                                 </span>
                               )}
                               {p.isFeatured && (
                                 <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gold bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                                   ★ Featured
                                 </span>
                               )}
                             </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                             <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                               <button onClick={() => handleEdit(p)} className="text-stone-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"><Edit size={18}/></button>
                               <button onClick={() => handleDelete(p.id)} className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 size={18}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            )}

            {tab === 'messages' && (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12 text-stone-400 italic">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-stone-400 italic">No messages yet.</div>
                ) : (
                  <>
                {messages.map(m => (
                  <div key={m.id} className={`p-6 border transition-all duration-300 ${m.read ? 'bg-stone-50 border-stone-100 opacity-70 hover:opacity-100' : 'bg-white border-l-4 border-l-gold border-stone-200 shadow-md transform hover:-translate-y-1'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-serif text-xl text-primary mb-1">{m.name}</h4>
                        <p className="text-xs uppercase tracking-widest text-stone-400">{m.email}</p>
                      </div>
                      <span className="text-xs text-stone-400 font-mono">{new Date(m.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-stone-600 mb-6 leading-relaxed border-t border-stone-100 pt-4">{m.message}</p>
                    {!m.read && (
                      <button onClick={() => handleToggleRead(m.id)} className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-gold hover:text-primary transition-colors">
                        <CheckCircle size={14} /> Mark as Read
                      </button>
                    )}
                  </div>
                ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};