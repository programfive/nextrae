'use server';

import { createClient } from '@/lib/supabase/server';
import { purchaseSchema } from '@/schemas';
import { Purchase } from '@/types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

type PurchaseFormData = z.infer<typeof purchaseSchema>;

export async function getPurchases(): Promise<Purchase[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching purchases:', error);
    throw new Error('Error al obtener las compras');
  }

  return data || [];
}

export async function getPurchaseById(id: number): Promise<Purchase | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching purchase:', error);
    return null;
  }

  return data;
}

export async function createPurchase(
  purchaseData: PurchaseFormData
): Promise<{ success: boolean; error?: string; }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('purchases').insert([purchaseData]);
    
    if (error) {
      return {
        success: false,
        error: 'Error al crear la compra: ' + error.message,
      };
    }
    
    revalidatePath('/purchases');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error inesperado al crear la compra' };
  }
}

export async function updatePurchase(
  id: number,
  purchaseData: PurchaseFormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('purchases')
      .update({
        ...purchaseData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating purchase:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/purchases');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating purchase:', error);
    return {
      success: false,
      error: 'Error inesperado al actualizar la compra',
    };
  }
}

export async function deletePurchase(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('purchases').delete().eq('id', id);

    if (error) {
      console.error('Error deleting purchase:', error);
      return { success: false, error: error.message };
    }
    revalidatePath('/purchases');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting purchase:', error);
    return {
      success: false,
      error: 'Error inesperado al eliminar la compra',
    };
  }
}

export async function deleteMultiplePurchases(
  ids: number[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('purchases').delete().in('id', ids);

    if (error) {
      console.error('Error deleting multiple purchases:', error);
      return { success: false, error: error.message };
    }
    revalidatePath('/purchases');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting multiple purchases:', error);
    return {
      success: false,
      error: 'Error inesperado al eliminar las compras',
    };
  }
} 