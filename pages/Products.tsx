import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../services/storage';
import { Product } from '../types';
import { RevealOnScroll } from '../components/RevealOnScroll';

export const Products: React.FC = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const all = (await getProducts()).filter(p => p.isVisible);
        setProducts(all);
        const uniqueCats = Array.from(new Set(all.map(p => p.category)));
        setCategories(['All', ...uniqueCats]);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="pt-40 pb-32 bg-sand min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <RevealOnScroll>
          <header className="mb-24 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-primary/10 pb-12">
            <div>
               <h1 className="text-5xl md:text-7xl font-serif text-primary mb-2">{t('nav.collection')}</h1>
               <p className="text-primary/50 text-sm uppercase tracking-widest">
                 {filteredProducts.length} {language === 'sq' ? 'Artikuj' : 'Items'}
               </p>
            </div>
            
            <div className="flex flex-wrap gap-6 md:gap-12">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-xs uppercase tracking-ultra transition-all duration-300 ${
                    filter === cat 
                      ? 'text-primary font-bold' 
                      : 'text-primary/40 hover:text-primary'
                  }`}
                >
                  {cat === 'All' ? t('products.filter.all') : t(`category.${cat}`)}
                </button>
              ))}
            </div>
          </header>
        </RevealOnScroll>

        {loading ? (
          <div className="text-center py-32 text-primary/30 text-xl font-serif italic">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            {filteredProducts.map((product, idx) => (
            <RevealOnScroll key={product.id} delay={idx % 2 * 100}>
              <Link to={`/product/${product.id}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden mb-8 bg-white">
                   {product.images && product.images.length > 0 && product.images[0] ? (
                     <>
                       <img 
                          src={product.images[0]} 
                          alt={product.title[language]} 
                          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        />
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                     </>
                   ) : (
                     <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400">No image</div>
                   )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-serif text-primary group-hover:text-gold transition-colors duration-300">
                      {product.title[language]}
                    </h3>
                    <p className="text-primary/40 text-xs uppercase tracking-widest mt-2">{t(`category.${product.category}`)}</p>
                  </div>
                  <span className="opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 text-gold text-lg">→</span>
                </div>
              </Link>
            </RevealOnScroll>
            ))}
          </div>
        )}
        
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-32 text-primary/30 text-xl font-serif italic">
            Empty collection.
          </div>
        )}
      </div>
    </div>
  );
};