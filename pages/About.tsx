import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { RevealOnScroll } from '../components/RevealOnScroll';
import aboutHeroImage from '../assets/images/aboutImage.jpg';
import aboutCraftsmanshipImage from '../assets/images/aboutSquareImg.jpg';

export const About: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-stone-50">
       {/* Header Image */}
       <div className="h-[60vh] relative overflow-hidden">
         <img 
            src={import.meta.env.VITE_ABOUT_HEADER_IMAGE || aboutHeroImage} 
            alt="Delfina About Us Hero Image"
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-stone-900/30 flex items-center justify-center">
            <h1 className="text-5xl md:text-7xl font-serif text-white tracking-wide">{t('nav.about')}</h1>
         </div>
       </div>

       <div className="container mx-auto px-6 py-24">
         <div className="max-w-4xl mx-auto">
            <RevealOnScroll>
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-8 text-center">
                {t('about.title')}
              </h2>
              <p className="text-lg md:text-xl text-stone-600 leading-relaxed text-center mb-16 font-light">
                {t('about.p1')}
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {import.meta.env.VITE_ABOUT_CRAFT_IMAGE || aboutCraftsmanshipImage ? (
                  <img 
                    src={import.meta.env.VITE_ABOUT_CRAFT_IMAGE || aboutCraftsmanshipImage} 
                    alt="Craftsmanship" 
                    className="w-full h-auto shadow-xl"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] bg-stone-200 shadow-xl"></div>
                )}
                <div>
                   <h3 className="text-2xl font-serif text-primary mb-4">
                     {language === 'sq' ? 'Cilësi e Pakrahasueshme' : 'Unmatched Quality'}
                   </h3>
                   <p className="text-stone-500 mb-6 leading-relaxed">
                     {language === 'sq' 
                      ? 'Çdo copë në koleksionin tonë zgjidhet me dorë, duke siguruar që standardet më të larta të qëndrueshmërisë dhe estetikës të plotësohen. Ne bashkëpunojmë me artizanë që kanë dekada përvojë.'
                      : 'Every piece in our collection is hand-selected, ensuring the highest standards of durability and aesthetics are met. We partner with artisans who have decades of experience.'}
                   </p>
                   <div className="h-px w-20 bg-gold"></div>
                </div>
              </div>
            </RevealOnScroll>
         </div>
       </div>
    </div>
  );
};
