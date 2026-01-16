import { supabase, dbProductToProduct, productToDbProduct, dbContactToContact } from '../lib/supabase';
import { Product, ContactSubmission } from '../types';

// Products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return (data || []).map(dbProductToProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data ? dbProductToProduct(data) : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const saveProduct = async (product: Product): Promise<boolean> => {
  try {
    const dbProduct = productToDbProduct(product);
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(product.id)) {
      console.error('Invalid UUID format:', product.id);
      return false;
    }
    
    // Check if product exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('id', product.id)
      .single();

    if (existing) {
      // Update existing product
      const { error } = await supabase
        .from('products')
        .update(dbProduct)
        .eq('id', product.id);

      if (error) {
        console.error('Error updating product:', error);
        return false;
      }
    } else {
      // Insert new product
      const { error } = await supabase
        .from('products')
        .insert({
          id: product.id,
          ...dbProduct,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error creating product:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error saving product:', error);
    return false;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Contact Submissions
export const getMessages = async (): Promise<ContactSubmission[]> => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return (data || []).map(dbContactToContact);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const saveMessage = async (msg: Omit<ContactSubmission, 'id' | 'date' | 'read'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name: msg.name,
        email: msg.email,
        message: msg.message,
        date: new Date().toISOString(),
        read: false,
      });

    if (error) {
      console.error('Error saving message:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving message:', error);
    return false;
  }
};

export const markMessageRead = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking message as read:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error marking message as read:', error);
    return false;
  }
};
