import { IconUser, IconShield, IconActivity, IconSettings } from '@tabler/icons-react';
import { TabItem, UserData } from '@/types';
import React from 'react';

export const tabItems: TabItem[] = [
  { value: 'profile', label: 'Perfil', icon: React.createElement(IconUser) },
  {
    value: 'security',
    label: 'Seguridad',
    icon: React.createElement(IconShield),
  },
  {
    value: 'activity',
    label: 'Actividad',
    icon: React.createElement(IconActivity),
  },
  {
    value: 'settings',
    label: 'Configuración',
    icon: React.createElement(IconSettings),
  },
];
export const userData: UserData = {
  id: 1,
  name: 'María González',
  email: 'maria.gonzalez@empresa.com',
  avatarUrl: '/placeholder.svg?height=100&width=100',
  is_active: true,
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-06-20T14:45:00Z',
  roles: [
    { id: 1, name: 'Administrador', description: 'Acceso completo al sistema' },
    { id: 2, name: 'Vendedor', description: 'Gestión de ventas y clientes' },
  ],
  permissions: [
    'sales.create',
    'sales.read',
    'sales.update',
    'sales.delete',
    'products.read',
    'inventory.read',
    'customers.manage',
  ],
  stats: {
    totalSales: 156,
    totalRevenue: 45780.5,
    activeProducts: 234,
    totalCustomers: 89,
  },
};
