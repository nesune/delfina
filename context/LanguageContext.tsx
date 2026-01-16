import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, { sq: string; en: string }> = {
  // Navigation
  'nav.home': { sq: 'Ballina', en: 'Home' },
  'nav.collection': { sq: 'Koleksioni', en: 'Collection' },
  'nav.about': { sq: 'Rreth Nesh', en: 'About' },
  'nav.contact': { sq: 'Kontakt', en: 'Contact' },
  
  // Home
  'home.tagline': { sq: 'Dizajn. Stil. Elegancë.', en: 'Design. Style. Elegance.' },
  'home.subtagline': { sq: 'Krijuar për jetesë luksoze.', en: 'Crafted for luxury living.' },
  'home.explore': { sq: 'Zbuloni Koleksionin', en: 'Explore Collection' },
  'home.featured': { sq: 'Koleksioni i Zgjedhur', en: 'Curated Collection' },
  'home.philosophy': { sq: 'Filozofia', en: 'Philosophy' },
  'home.philosophy_title': { sq: 'Dizajn që flet.', en: 'Design that speaks.' },
  'home.philosophy_text': { 
    sq: 'Ne krijojmë hapësira që nuk janë thjesht për të jetuar, por për të ndjerë. Çdo detaj është një dialog mes formës dhe funksionit.',
    en: 'We curate spaces not just for living, but for feeling. Every detail is a dialogue between form and function.'
  },
  'home.read_story': { sq: 'Lexo Historinë', en: 'Read Story' },
  'home.view_all': { sq: 'Shiko Të Gjitha', en: 'View All' },
  'home.view_all_collection': { sq: 'Shiko Të Gjithë Koleksionin', en: 'View All Collection' },
  'home.loading': { sq: 'Duke ngarkuar...', en: 'Loading...' },
  'home.no_featured': { sq: 'Nuk ka produkte të zgjedhura ende.', en: 'No featured products yet.' },
  'home.no_image': { sq: 'Nuk ka imazh', en: 'No image' },
  
  // Products
  'products.filter.all': { sq: 'Të Gjitha', en: 'All' },
  'products.view_details': { sq: 'Shiko Detajet', en: 'View Details' },
  'products.on_request': { sq: 'Me Kërkesë', en: 'On Request' },
  'product.description': { sq: 'Përshkrimi', en: 'Description' },
  'product.category': { sq: 'Kategoria', en: 'Category' },
  'product.inquire': { sq: 'Kërko Çmimin', en: 'Inquire Price' },
  'product.specifications': { sq: 'Specifikat', en: 'Specifications' },
  'product.dimensions': { sq: 'Përmasat', en: 'Dimensions' },
  'product.materials': { sq: 'Materialet', en: 'Materials' },

  // Categories
  'category.Dhoma e Ditës': { sq: 'Dhoma e Ditës', en: 'Living Room' },
  'category.Kuzhinat': { sq: 'Kuzhinat', en: 'Kitchens' },
  'category.Dhomat e Gjumit': { sq: 'Dhomat e Gjumit', en: 'Bedrooms' },
  
  // About
  'about.title': { sq: 'Trashëgimia e Delfina Home', en: 'The Legacy of Delfina Home' },
  'about.p1': { 
    sq: 'Në Delfina Home, ne besojmë se mobiljet nuk janë thjesht objekte, por shpirti i shtëpisë. Çdo pjesë është zgjedhur me kujdes për të sjellë harmoni dhe luks në hapësirën tuaj.', 
    en: 'At Delfina Home, we believe furniture is not merely functionality, but the soul of a home. Each piece is meticulously curated to bring harmony and luxury into your space.' 
  },
  
  // Contact
  'contact.title': { sq: 'Na Kontaktoni', en: 'Get in Touch' },
  'contact.name': { sq: 'Emri Juaj', en: 'Your Name' },
  'contact.email': { sq: 'Email Adresa', en: 'Email Address' },
  'contact.message': { sq: 'Mesazhi', en: 'Message' },
  'contact.send': { sq: 'Dërgo Mesazhin', en: 'Send Message' },
  'contact.success': { sq: 'Mesazhi u dërgua me sukses!', en: 'Message sent successfully!' },
  
  // Admin
  'admin.login': { sq: 'Hyrja Admin', en: 'Admin Login' },
  'admin.email': { sq: 'Email', en: 'Email' },
  'admin.password': { sq: 'Fjalëkalimi', en: 'Password' },
  'admin.products': { sq: 'Produktet', en: 'Products' },
  'admin.messages': { sq: 'Mesazhet', en: 'Messages' },
  'admin.add_new': { sq: 'Shto Produkt', en: 'Add Product' },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('sq');

  useEffect(() => {
    const saved = localStorage.getItem('delfina_lang') as Language;
    if (saved) setLanguageState(saved);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('delfina_lang', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
