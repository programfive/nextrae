'use server';

import { createClient } from '@/lib/supabase/server';
import { inventoryMovementSchema } from '@/schemas/inventory';
import { InventoryMovement } from '@/types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

type InventoryMovementFormData = z.infer<typeof inventoryMovementSchema>;

export async function getInventoryMovements(): Promise<InventoryMovement[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inventory_movements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inventory movements:', error);
    throw new Error('Error al obtener los movimientos de inventario');
  }

  return data || [];
}

export async function getInventoryMovementById(id: number): Promise<InventoryMovement | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inventory_movements')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching inventory movement:', error);
    return null;
  }

  return data;
}

export async function createInventoryMovement(
  movementData: InventoryMovementFormData
): Promise<{ success: boolean; error?: string; }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('inventory_movements').insert([movementData]);
    
    if (error) {
      return {
        success: false,
        error: 'Error al crear el movimiento de inventario: ' + error.message,
      };
    }
    
    revalidatePath('/inventory');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error inesperado al crear el movimiento de inventario' };
  }
}

export async function updateInventoryMovement(
  id: number,
  movementData: InventoryMovementFormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('inventory_movements')
      .update({
        ...movementData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating inventory movement:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/inventory');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating inventory movement:', error);
    return {
      success: false,
      error: 'Error inesperado al actualizar el movimiento de inventario',
    };
  }
}

export async function deleteInventoryMovement(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('inventory_movements').delete().eq('id', id);

    if (error) {
      console.error('Error deleting inventory movement:', error);
      return { success: false, error: error.message };
    }
    revalidatePath('/inventory');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting inventory movement:', error);
    return {
      success: false,
      error: 'Error inesperado al eliminar el movimiento de inventario',
    };
  }
}

export async function deleteMultipleInventoryMovements(
  ids: number[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from('inventory_movements').delete().in('id', ids);

    if (error) {
      console.error('Error deleting multiple inventory movements:', error);
      return { success: false, error: error.message };
    }
    revalidatePath('/inventory');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting multiple inventory movements:', error);
    return {
      success: false,
      error: 'Error inesperado al eliminar los movimientos de inventario',
    };
  }
} 