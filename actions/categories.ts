'use server';

import { createClient } from '@/lib/supabase/server';
import { categorySchema } from '@/schemas';
import { Category } from '@/types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

type CategoryFormData = z.infer<typeof categorySchema>;

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Error al obtener las categorías');
  }

  return data || [];
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching category:', error);
    return null;
  }

  return data;
}

export async function createCategory(
  categoryData: CategoryFormData
): Promise<{ success: boolean; error?: string; field?: string }> {
  const supabase = await createClient();

  try {
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id, name')
      .eq('name', categoryData.name)
      .single();

    const { error } = await supabase.from('categories').insert([categoryData]);
    if (existingCategory) {
      return {
        success: false,
        error: 'Ya existe una categoría con ese nombre',
        field: 'name',
      };
    }
    if (error) {
      return {
        success: false,
        error: 'Error al crear la categoría' + error.message,
        field: 'name',
      };
    }
    revalidatePath('/categories');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error inesperado al crear la categoría' };
  }
}

export async function updateCategory(
  id: number,
  categoryData: CategoryFormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id, name')
      .eq('name', categoryData.name)
      .neq('id', id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for duplicate category:', checkError);
      return { success: false, error: 'Error al verificar duplicados' };
    }

    if (existingCategory) {
      return {
        success: false,
        error: 'Ya existe una categoría con ese nombre',
      };
    }

    const { error } = await supabase
      .from('categories')
      .update({
        ...categoryData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating category:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/categories');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating category:', error);
    return {
      success: false,
      error: 'Error inesperado al actualizar la categoría',
    };
  }
}

export async function deleteCategory(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: error.message };
    }
    revalidatePath('/categories');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting category:', error);
    return {
      success: false,
      error: 'Error inesperado al eliminar la categoría',
    };
  }
}

export async function deleteMultipleCategories(
  ids: number[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('categories').delete().in('id', ids);

    if (error) {
      console.error('Error deleting multiple categories:', error);
      return { success: false, error: error.message };
    }
    revalidatePath('/categories');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting multiple categories:', error);
    return {
      success: false,
      error: 'Error inesperado al eliminar las categorías',
    };
  }
}
