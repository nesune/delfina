import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../services/storage';
import { Product } from '../types';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { ArrowRight, MoveRight } from 'lucide-react';
import heroImage from '../assets/images/Hero.jpg';
import philosophyImage from '../assets/images/Kuzhina.jpg';

export const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const all = await getProducts();
        setFeaturedProducts(all.filter(p => p.isFeatured && p.isVisible).slice(0, 3));
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="bg-sand">
      {/* Hero Section - Cinematic */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={import.meta.env.VITE_HERO_IMAGE || heroImage} 
            alt="Hero Interior" 
            className="w-full h-full object-cover animate-slow-zoom opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <RevealOnScroll variant="scale">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-6 tracking-tight drop-shadow-lg">
              {t('home.tagline')}
            </h1>
          </RevealOnScroll>
          
          <RevealOnScroll delay={300}>
            <p className="text-white/90 text-sm md:text-lg uppercase tracking-ultra font-light max-w-xl mx-auto mb-12">
              {t('home.subtagline')}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={500}>
             <Link 
              to="/collection"
              className="group flex items-center gap-4 text-white uppercase text-xs tracking-widest hover:text-gold transition-colors"
             >
               <span className="border-b border-white/30 pb-2 group-hover:border-gold transition-colors">{t('home.explore')}</span>
               <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
             </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* Editorial Split Section */}
      <section className="py-32 container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <RevealOnScroll variant="slide-right">
              <span className="text-gold text-xs font-bold uppercase tracking-ultra mb-6 block">{t('home.philosophy')}</span>
              <h2 className="text-4xl md:text-5xl font-serif text-primary leading-[1.15] mb-8">
                {t('home.philosophy_title')}
              </h2>
              <p className="text-lg text-primary/60 leading-relaxed font-light mb-12 max-w-md">
                {t('home.philosophy_text')}
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:text-gold transition-colors">
                 {t('home.read_story')} <MoveRight size={16} />
              </Link>
            </RevealOnScroll>
          </div>
          
          <div className="order-1 md:order-2 relative">
             <RevealOnScroll variant="reveal">
               <div className="aspect-[3/4] overflow-hidden bg-stone-200">
                 <img 
                   src={import.meta.env.VITE_ABOUT_MAIN_IMAGE || philosophyImage} 
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1.5s]" 
                   alt="Interior Detail"
                 />
               </div>
             </RevealOnScroll>
             {/* Overlapping small image */}
             {import.meta.env.VITE_ABOUT_DETAIL_IMAGE && (
               <div className="absolute -bottom-12 -left-12 w-1/2 shadow-2xl hidden md:block">
                 <RevealOnScroll delay={300} variant="reveal">
                   <img 
                      src={import.meta.env.VITE_ABOUT_DETAIL_IMAGE} 
                      className="w-full h-full object-cover" 
                      alt="Detail"
                   />
                 </RevealOnScroll>
               </div>
             )}
          </div>
        </div>
      </section>

      {/* Featured Gallery - Large format */}
      <section className="py-32 bg-secondary text-sand">
        <div className="container mx-auto px-6 md:px-12">
          <RevealOnScroll>
            <div className="flex justify-between items-end mb-20">
              <h2 className="text-4xl md:text-6xl font-serif">{t('home.featured')}</h2>
              <Link to="/collection" className="hidden md:block text-xs uppercase tracking-ultra hover:text-gold transition-colors">
                {t('home.view_all')}
              </Link>
            </div>
          </RevealOnScroll>

          <div className="flex flex-col gap-24">
            {loading ? (
              <div className="text-center py-16 text-white/40 text-lg font-serif italic">{t('home.loading')}</div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, idx) => (
              <RevealOnScroll key={product.id} className="group">
                <Link to={`/product/${product.id}`} className="grid md:grid-cols-12 gap-8 items-center">
                  <div className={`md:col-span-8 ${idx % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="overflow-hidden aspect-[16/9]">
                      {product.images && product.images.length > 0 && product.images[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.title[language]} 
                          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full bg-stone-300 flex items-center justify-center text-white/40">{t('home.no_image')}</div>
                      )}
                    </div>
                  </div>
                  <div className={`md:col-span-4 ${idx % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                    <span className="text-gold text-xs font-bold uppercase tracking-widest mb-2 block">0{idx + 1}</span>
                    <h3 className="text-3xl md:text-4xl font-serif mb-4 group-hover:text-gold transition-colors">{product.title[language]}</h3>
                    <p className="text-white/40 text-sm mb-6 line-clamp-2">{product.description[language]}</p>
                    <span className="text-xs uppercase tracking-widest border-b border-white/20 pb-1 group-hover:border-gold transition-colors">
                      {t('products.view_details')}
                    </span>
                  </div>
                </Link>
              </RevealOnScroll>
              ))
            ) : (
              <div className="text-center py-16 text-white/40 text-lg font-serif italic">{t('home.no_featured')}</div>
            )}
          </div>
          
          <div className="mt-20 text-center md:hidden">
             <Link to="/collection" className="text-xs uppercase tracking-ultra hover:text-gold transition-colors border-b border-white/20 pb-2">
                {t('home.view_all_collection')}
              </Link>
          </div>
        </div>
      </section>
    </div>
  );
};