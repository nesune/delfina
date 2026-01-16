import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getProduct } from '../services/storage';
import { Product } from '../types';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { ArrowLeft, MessageCircle } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        navigate('/collection');
        return;
      }
      setLoading(true);
      try {
        const found = await getProduct(id);
        if (found) {
          setProduct(found);
        } else {
          navigate('/collection');
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        navigate('/collection');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, navigate]);

  if (loading || !product) {
    return (
      <div className="pt-40 text-center text-primary/40 min-h-screen flex items-center justify-center">
        <div className="text-xl font-serif">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-sand min-h-screen">
      <div className="container mx-auto px-6 md:px-12 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          
          {/* Left: Images (Scrollable) */}
          <div className="w-full lg:w-3/5 space-y-4 md:space-y-8">
            <Link to="/collection" className="inline-flex lg:hidden items-center gap-2 text-primary/40 hover:text-primary mb-8 transition-colors text-xs uppercase tracking-widest">
               <ArrowLeft size={16} /> Back
            </Link>
            {product.images && product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <RevealOnScroll key={idx} delay={idx * 100}>
                  <div className="aspect-[3/4] md:aspect-[4/5] w-full bg-stone-100 overflow-hidden">
                    <img src={img} alt={`${product.title[language]} view ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" />
                  </div>
                </RevealOnScroll>
              ))
            ) : (
              <div className="aspect-[3/4] md:aspect-[4/5] w-full bg-stone-200 flex items-center justify-center text-primary/30">
                No images available
              </div>
            )}
          </div>

          {/* Right: Info (Sticky) */}
          <div className="w-full lg:w-2/5">
            <div className="lg:sticky lg:top-40">
              <Link to="/collection" className="hidden lg:inline-flex items-center gap-2 text-primary/40 hover:text-primary mb-12 transition-colors text-xs uppercase tracking-widest">
                 <ArrowLeft size={14} /> Back to Collection
              </Link>
              
              <RevealOnScroll delay={200}>
                <span className="text-gold uppercase tracking-ultra text-xs font-bold mb-4 block">
                  {t(`category.${product.category}`)}
                </span>
                <h1 className="text-5xl lg:text-6xl font-serif text-primary mb-8 leading-[1.1]">
                  {product.title[language]}
                </h1>
                
                {/* Minimal Separator */}
                <div className="w-12 h-px bg-primary/20 mb-8"></div>
                
                <div className="prose prose-stone mb-12 text-primary/70 font-light leading-relaxed">
                  <p className="text-lg mb-8">{product.description[language]}</p>

                  {/* Specifications - Minimal Design */}
                  <div className="border-t border-primary/10 pt-8 mt-8">
                    <h3 className="text-primary uppercase text-xs tracking-ultra font-bold mb-6">{t('product.specifications')}</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex justify-between items-baseline border-b border-primary/5 pb-2">
                        <span className="text-xs uppercase text-primary/40 font-bold">{t('product.dimensions')}</span>
                        <span className="text-sm text-primary font-medium text-right">{product.specifications.dimensions[language]}</span>
                      </div>
                      <div className="flex justify-between items-baseline border-b border-primary/5 pb-2">
                        <span className="text-xs uppercase text-primary/40 font-bold">{t('product.materials')}</span>
                        <span className="text-sm text-primary font-medium text-right">{product.specifications.materials[language]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Link 
                    to="/contact" 
                    className="w-full bg-primary text-white text-center py-5 px-8 uppercase tracking-widest text-xs font-bold hover:bg-gold transition-colors duration-500"
                  >
                    {t('product.inquire')}
                  </Link>
                  {import.meta.env.VITE_WHATSAPP_NUMBER && (
                    <a 
                      href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full border border-primary/20 text-primary text-center py-5 px-8 uppercase tracking-widest text-xs font-bold hover:border-primary transition-colors flex items-center justify-center gap-2"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </RevealOnScroll>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};