import { z } from "zod";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/constants/file";

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    .max(50, { message: 'El nombre no puede tener más de 50 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  avatar: z
    .custom<File>()
    .refine(file => file, 'La imagen es requerida.')
    .refine(file => file.size <= MAX_FILE_SIZE, `El tamaño máximo es de 800KB.`)
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Solo se aceptan formatos .jpg, .jpeg, .png y .gif.'
    )
    .optional(),
  avatarUrl: z.string().optional(),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    .max(100, { message: 'El nombre no puede tener más de 100 caracteres.' }),
  description: z
    .string()
    .max(500, { message: 'La descripción no puede tener más de 500 caracteres.' })
    .optional(),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    .max(100, { message: 'El nombre no puede tener más de 100 caracteres.' }),
  description: z
    .string()
    .max(500, { message: 'La descripción no puede tener más de 500 caracteres.' })
    .optional(),
  category_id: z
    .number()
    .min(1, { message: 'Debe seleccionar una categoría.' }),
  price: z
    .number()
    .min(0, { message: 'El precio debe ser mayor a 0.' })
    .max(99999999, { message: 'El precio no puede ser mayor a 999999.99.' }),
});

export const purchaseSchema = z.object({
  supplier_name: z
    .string()
    .min(2, { message: 'El nombre del proveedor debe tener al menos 2 caracteres.' })
    .max(100, { message: 'El nombre del proveedor no puede tener más de 100 caracteres.' }),
  total_amount: z
    .number()
    .min(0, { message: 'El monto total debe ser mayor a 0.' })
    .max(99999999, { message: 'El monto total no puede ser mayor a 99999999.' }),
  purchase_date: z.date({ message: 'La fecha de compra es requerida.' }),
});

export const purchaseDetailSchema = z.object({
  purchase_id: z.number().min(1, { message: 'ID de compra requerido.' }),
  product_id: z.number().min(1, { message: 'Debe seleccionar un producto.' }),
  quantity: z.number().min(1, { message: 'La cantidad debe ser mayor a 0.' }),
  unit_price: z
    .number()
    .min(0, { message: 'El precio unitario debe ser mayor a 0.' })
    .max(99999999, { message: 'El precio unitario no puede ser mayor a 999999.99.' }),
});

export const saleSchema = z.object({
  customer_name: z
    .string()
    .min(2, { message: 'El nombre del cliente debe tener al menos 2 caracteres.' })
    .max(100, { message: 'El nombre del cliente no puede tener más de 100 caracteres.' }),
  total_amount: z
    .number()
    .min(0, { message: 'El monto total debe ser mayor a 0.' })
    .max(99999999.99, { message: 'El monto total no puede ser mayor a 99999.99.' }),
  sale_date: z.date({ message: 'La fecha de venta es requerida.' }),
});

export const saleDetailSchema = z.object({
  sale_id: z.number().min(1, { message: 'ID de venta requerido.' }),
  product_id: z.number().min(1, { message: 'Debe seleccionar un producto.' }),
  quantity: z.number().min(1, { message: 'La cantidad debe ser mayor a 0.' }),
  unit_price: z
    .number()
    .min(0, { message: 'El precio unitario debe ser mayor a 0.' })
    .max(99999999, { message: 'El precio unitario no puede ser mayor a 999999.99.' }),
});

export const inventoryBatchSchema = z.object({
  product_id: z.number().min(1, { message: 'Debe seleccionar un producto.' }),
  batch_number: z
    .string()
    .min(1, { message: 'El número de lote es requerido.' })
    .max(50, { message: 'El número de lote no puede tener más de 50 caracteres.' }),
  expiration_date: z.date().optional(),
  quantity: z.number().min(1, { message: 'La cantidad debe ser mayor a 0.' }),
});

export const inventoryMovementSchema = z.object({
  product_id: z.number().min(1, { message: 'Debe seleccionar un producto.' }),
  movement_type: z.enum(['purchase', 'sale', 'adjustment', 'transfer'], {
    message: 'Debe seleccionar un tipo de movimiento válido.',
  }),
  quantity: z.number().min(1, { message: 'La cantidad debe ser mayor a 0.' }),
  movement_date: z.date({ message: 'La fecha de movimiento es requerida.' }),
});

export const productWasteSchema = z.object({
  product_id: z.number().min(1, { message: 'Debe seleccionar un producto.' }),
  reason: z
    .string()
    .min(2, { message: 'La razón debe tener al menos 2 caracteres.' })
    .max(200, { message: 'La razón no puede tener más de 200 caracteres.' }),
  quantity: z.number().min(1, { message: 'La cantidad debe ser mayor a 0.' }),
  waste_date: z.date({ message: 'La fecha de desperdicio es requerida.' }),
});

export const exportSchema = z
  .object({
    format: z.enum(['pdf', 'excel', 'json'], {
      message: 'Selecciona un formato',
    }),
    startDate: z.date({
      message: 'La fecha inicial es requerida',
    }),
    endDate: z.date({
      message: 'La fecha final es requerida',
    }),
    status: z.boolean().optional(),
  })
  .refine(
    data => {
      return data.endDate >= data.startDate;
    },
    {
      message: 'La fecha final debe ser posterior a la fecha inicial',
      path: ['endDate'],
    }
  );
