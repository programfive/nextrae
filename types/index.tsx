import { ReactNode } from "react";

export type IconProps = React.HTMLAttributes<SVGElement>;

export interface TabItem {
    value: string;
    label: string;
    icon: ReactNode;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    category_id: number;
    price: number;
    created_at: string;
    updated_at?: string;
    deleted_at?: string;
    category?: Category;
}

export interface Purchase {
    id: number;
    supplier_name: string;
    total_amount: number;
    purchase_date: string;
    user_id?: number;
    created_at: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface PurchaseDetail {
    id: number;
    purchase_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    created_at: string;
    updated_at?: string;
    deleted_at?: string;
    product?: Product;
    purchase?: Purchase;
}

export interface Sale {
    id: number;
    customer_name: string;
    total_amount: number;
    sale_date: string;
    user_id?: number;
    created_at: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface SaleDetail {
    id: number;
    sale_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    created_at: string;
    updated_at?: string;
    deleted_at?: string;
    product?: Product;
    sale?: Sale;
}

export interface InventoryBatch {
    id: number;
    product_id: number;
    batch_number: string;
    expiration_date?: string;
    quantity: number;
    created_at: string;
    updated_at?: string;
    deleted_at?: string;
    product?: Product;
}

export interface InventoryMovement {
    id: number;
    product_id: number;
    movement_type: 'purchase' | 'sale' | 'adjustment' | 'waste';
    quantity: number;
    movement_date: string;
    user_id?: number;
    created_at: string;
    updated_at?: string;
    deleted_at?: string;
    product?: Product;
}

export interface ProductWaste {
    id: number;
    product_id: number;
    reason: string;
    quantity: number;
    waste_date: string;
    user_id?: number;
    created_at: string;
    updated_at?: string;
    deleted_at?: string;
    product?: Product;
}

export interface UserData {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    roles: Array<{ id: number; name: string; description: string }>;
    permissions: string[];
    stats: {
      totalSales: number;
      totalRevenue: number;
      activeProducts: number;
      totalCustomers: number;
    };
}