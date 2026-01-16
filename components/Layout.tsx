import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Logic: Home page starts transparent. Other pages always white background nav (or consistent).
  const isHome = location.pathname === '/';
  // We want the nav to be transparent on home until scrolled
  const isTransparent = isHome && !isScrolled && !mobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/collection', label: t('nav.collection') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      {/* Navigation - Minimal & Floating */}
      <nav
        className={`fixed w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled || mobileMenuOpen 
            ? 'bg-sand/90 backdrop-blur-md py-4 border-b border-primary/5' 
            : 'py-8'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link to="/" className={`relative z-50 text-2xl font-serif font-medium tracking-tight transition-colors ${isTransparent ? 'text-white' : 'text-primary'}`}>
            Delfina.
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:tracking-[0.3em] ${
                  isTransparent ? 'text-white/90 hover:text-white' : 'text-primary/70 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="flex gap-4 ml-8">
              {['sq', 'en'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as any)}
                  className={`text-[10px] uppercase font-bold tracking-widest transition-colors ${
                    language === lang 
                      ? (isTransparent ? 'text-white border-b border-white' : 'text-primary border-b border-primary')
                      : (isTransparent ? 'text-white/40' : 'text-primary/30')
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`md:hidden relative z-50 transition-colors ${isTransparent ? 'text-white' : 'text-primary'}`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 w-screen h-screen bg-sand z-40 flex flex-col justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${
            mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="flex flex-col items-center justify-center gap-8 w-full px-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-4xl md:text-5xl font-serif text-primary hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {/* Language Selector in Mobile Menu */}
            <div className="flex gap-6 mt-8">
              {['sq', 'en'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as any)}
                  className={`text-lg uppercase font-bold tracking-widest transition-colors ${
                    language === lang 
                      ? 'text-primary border-b-2 border-primary pb-2' 
                      : 'text-primary/30 hover:text-primary/60'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Massive Editorial Footer */}
      <footer className="bg-secondary text-sand pt-32 pb-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">


            <div className="flex gap-16 md:gap-32">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-ultra text-white/40 mb-6">Socials</h3>
                <ul className="space-y-4 text-sm tracking-wide text-white/80">
                  {import.meta.env.VITE_INSTAGRAM_URL && (
                    <li><a href={import.meta.env.VITE_INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">Instagram</a></li>
                  )}
                  {import.meta.env.VITE_FACEBOOK_URL && (
                    <li><a href={import.meta.env.VITE_FACEBOOK_URL} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">Facebook</a></li>
                  )}
                  {!import.meta.env.VITE_INSTAGRAM_URL && !import.meta.env.VITE_FACEBOOK_URL && (
                    <li className="text-white/40 italic">Social links coming soon</li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-ultra text-white/40 mb-6">INFO</h3>
                <ul className="space-y-4 text-sm tracking-wide text-white/80">
                  <li>{import.meta.env.VITE_CONTACT_ADDRESS || 'Address'}</li>
                  <li>{import.meta.env.VITE_CONTACT_PHONE || 'Phone'}</li>
                  <li>{import.meta.env.VITE_CONTACT_EMAIL || 'Email'}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-end">
            <h1 className="text-[12vw] leading-[0.8] font-serif text-white/5 select-none pointer-events-none">
              Delfina.
            </h1>
            <div className="flex gap-8 text-xs uppercase tracking-widest text-white/30 pb-4">
              <span>© {new Date().getFullYear()}</span>
              <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};