'use server';

import { createClient } from '@/lib/supabase/server';
import { saleSchema } from '@/schemas/sales';
import { Sale } from '@/types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

type SaleFormData = z.infer<typeof saleSchema>;

export async function getSales(): Promise<Sale[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sales:', error);
    throw new Error('Error al obtener las ventas');
  }

  return data || [];
}

export async function getSaleById(id: number): Promise<Sale | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching sale:', error);
    return null;
  }

  return data;
}

export async function createSale(
  saleData: SaleFormData
): Promise<{ success: boolean; error?: string; }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('sales').insert([saleData]);
    
    if (error) {
      return {
        success: false,
        error: 'Error al crear la venta: ' + error.message,
      };
    }
    
    revalidatePath('/sales');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error inesperado al crear la venta' };
  }
}

export async function updateSale(
  id: number,
  saleData: SaleFormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('sales')
      .update({
        ...saleData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating sale:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/sales');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating sale:', error);
    return {
      success: false,
      error: 'Error inesperado al actualizar la venta',
    };
  }
}

export async function deleteSale(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('sales').delete().eq('id', id);

    if (error) {
      console.error('Error deleting sale:', error);
      return { success: false, error: error.message };
    }
    revalidatePath('/sales');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting sale:', error);
    return {
      success: false,
      error: 'Error inesperado al eliminar la venta',
    };
  }
}

export async function deleteMultipleSales(
  ids: number[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('sales').delete().in('id', ids);

    if (error) {
      console.error('Error deleting multiple sales:', error);
      return { success: false, error: error.message };
    }
    revalidatePath('/sales');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting multiple sales:', error);
    return {
      success: false,
      error: 'Error inesperado al eliminar las ventas',
    };
  }
} 