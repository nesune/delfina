import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { saveMessage } from '../services/storage';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { Mail, Phone, MapPin } from 'lucide-react';
import { siteConfig } from '../config/site';

export const Contact: React.FC = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    
    try {
      const success = await saveMessage(formData);
      if (success) {
        setSent(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <RevealOnScroll>
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-16 text-center">{t('contact.title')}</h1>
        </RevealOnScroll>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Info */}
          <RevealOnScroll delay={100} className="bg-stone-50 p-12 h-full flex flex-col justify-center">
             <h3 className="text-2xl font-serif text-primary mb-8">{siteConfig.name} Studio</h3>
             
             <div className="space-y-8">
               <div className="flex items-start gap-4">
                 <div className="p-3 bg-white text-gold shadow-sm rounded-full">
                   <MapPin size={24} />
                 </div>
                 <div>
                   <p className="font-bold text-stone-800 uppercase text-xs tracking-widest mb-1">{language === 'sq' ? 'Na Vizitoni' : 'Visit Us'}</p>
                   <p className="text-stone-600 whitespace-pre-line">{siteConfig.contact.address[language]}</p>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="p-3 bg-white text-gold shadow-sm rounded-full">
                   <Phone size={24} />
                 </div>
                 <div>
                   <p className="font-bold text-stone-800 uppercase text-xs tracking-widest mb-1">{language === 'sq' ? 'Na Telefononi' : 'Call Us'}</p>
                   <p className="text-stone-600">{siteConfig.contact.phone}</p>
                   <p className="text-stone-500 text-sm">{siteConfig.contact.hours[language]}</p>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="p-3 bg-white text-gold shadow-sm rounded-full">
                   <Mail size={24} />
                 </div>
                 <div>
                   <p className="font-bold text-stone-800 uppercase text-xs tracking-widest mb-1">{language === 'sq' ? 'Na Dërgoni Email' : 'Email Us'}</p>
                   <p className="text-stone-600">{siteConfig.contact.email}</p>
                 </div>
               </div>
             </div>
          </RevealOnScroll>

          {/* Form */}
          <RevealOnScroll delay={200}>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-stone-200">
                <div className="text-gold mb-4 text-5xl">✓</div>
                <h3 className="text-2xl font-serif text-primary mb-2">{t('contact.success')}</h3>
                <button onClick={() => { setSent(false); setError(null); }} className="text-stone-500 underline mt-4">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-stone-500 mb-2">{t('contact.name')}</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-stone-50 border-b border-stone-200 p-4 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-stone-500 mb-2">{t('contact.email')}</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-stone-50 border-b border-stone-200 p-4 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-stone-500 mb-2">{t('contact.message')}</label>
                  <textarea 
                    required 
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-stone-50 border-b border-stone-200 p-4 focus:outline-none focus:border-gold transition-colors resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={sending}
                  className="bg-stone-900 text-white px-10 py-4 uppercase tracking-widest text-sm hover:bg-gold transition-colors w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : t('contact.send')}
                </button>
              </form>
            )}
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
};
