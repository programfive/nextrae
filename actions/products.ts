'use server';

import { createClient } from '@/lib/supabase/server';
import { productSchema } from '@/schemas';
import { Product } from '@/types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

type ProductFormData = z.infer<typeof productSchema>;

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, description)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Error al obtener los productos');
  }

  return data || [];
}

export async function getProductById(id: number): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, description)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function createProduct(
  productData: ProductFormData
): Promise<{ success: boolean; error?: string; field?: string }> {
  const supabase = await createClient();

  try {
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id, name')
      .eq('name', productData.name)
      .single();

    if (existingProduct) {
      return {
        success: false,
        error: 'Ya existe un producto con ese nombre',
        field: 'name',
      };
    }

    const { error } = await supabase.from('products').insert([productData]);
    
    if (error) {
      return {
        success: false,
        error: 'Error al crear el producto: ' + error.message,
        field: 'name',
      };
    }
    
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error inesperado al crear el producto' };
  }
}

export async function updateProduct(
  id: number,
  productData: ProductFormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id, name')
      .eq('name', productData.name)
      .neq('id', id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {     console.error('Error checking for duplicate product:', checkError);
      return { success: false, error: 'Error al verificar duplicados' };
    }

    if (existingProduct) {
      return {
        success: false,
        error: 'Ya existe un producto con ese nombre',
      };
    }

    const { error } = await supabase
      .from('products')
      .update({
        ...productData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating product:', error);
    return {
      success: false,
      error: 'Error inesperado al actualizar el producto',
    };
  }
}

export async function deleteProduct(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    }
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting product:', error);
    return {
      success: false,
      error: 'Error inesperado al eliminar el producto',
    };
  }
}

export async function deleteMultipleProducts(
  ids: number[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('products').delete().in('id', ids);

    if (error) {
      console.error('Error deleting multiple products:', error);
      return { success: false, error: error.message };
    }
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting multiple products:', error);
    return {
      success: false,
      error: 'Error inesperado al eliminar los productos',
    };
  }
} 