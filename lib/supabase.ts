import { createClient } from '@supabase/supabase-js';
import { Product, ContactSubmission } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types matching our schema
export interface DatabaseProduct {
  id: string;
  title_sq: string;
  title_en: string;
  description_sq: string;
  description_en: string;
  dimensions_sq: string;
  dimensions_en: string;
  materials_sq: string;
  materials_en: string;
  price: string;
  category: string;
  images: string[];
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
}

export interface DatabaseContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

// Helper functions to convert between database and app types
export const dbProductToProduct = (db: DatabaseProduct): Product => ({
  id: db.id,
  title: { sq: db.title_sq, en: db.title_en },
  description: { sq: db.description_sq, en: db.description_en },
  specifications: {
    dimensions: { sq: db.dimensions_sq, en: db.dimensions_en },
    materials: { sq: db.materials_sq, en: db.materials_en },
  },
  price: db.price,
  category: db.category,
  images: db.images || [],
  isFeatured: db.is_featured,
  isVisible: db.is_visible,
  createdAt: new Date(db.created_at).getTime(),
});

export const productToDbProduct = (p: Product): Omit<DatabaseProduct, 'id' | 'created_at'> => ({
  title_sq: p.title.sq,
  title_en: p.title.en,
  description_sq: p.description.sq,
  description_en: p.description.en,
  dimensions_sq: p.specifications.dimensions.sq,
  dimensions_en: p.specifications.dimensions.en,
  materials_sq: p.specifications.materials.sq,
  materials_en: p.specifications.materials.en,
  price: p.price,
  category: p.category,
  images: p.images,
  is_featured: p.isFeatured,
  is_visible: p.isVisible,
});

export const dbContactToContact = (db: DatabaseContactSubmission): ContactSubmission => ({
  id: db.id,
  name: db.name,
  email: db.email,
  message: db.message,
  date: new Date(db.date).getTime(),
  read: db.read,
});
