export type Language = 'sq' | 'en';

export interface LocalizedString {
  sq: string;
  en: string;
}

export interface ProductSpecifications {
  dimensions: LocalizedString;
  materials: LocalizedString;
}

export interface Product {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  specifications: ProductSpecifications;
  price: string; // "On Request" or value
  category: string;
  images: string[];
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  date: number;
  read: boolean;
}

export type Category = 'Dhoma e Ditës' | 'Kuzhinat' | 'Dhomat e Gjumit';
