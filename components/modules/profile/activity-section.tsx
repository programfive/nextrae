'use client';

import { IconActivity, IconPackage } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const recentActivity = [
  {
    id: 1,
    action: 'Venta creada',
    details: 'Venta #VT-2024-001',
    time: 'Hace 2 horas',
  },
  {
    id: 2,
    action: 'Producto actualizado',
    details: 'Laptop Dell XPS 13',
    time: 'Hace 4 horas',
  },
  {
    id: 3,
    action: 'Cliente registrado',
    details: 'Juan Pérez',
    time: 'Hace 1 día',
  },
  {
    id: 4,
    action: 'Inventario ajustado',
    details: 'Mouse inalámbrico',
    time: 'Hace 2 días',
  },
];

export function ActivitySection() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <IconActivity className='w-5 h-5 mr-2' />
            Actividad Reciente
          </CardTitle>
          <CardDescription>
            Tu actividad más reciente en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {recentActivity.map(activity => (
              <div
                key={activity.id}
                className='flex items-center space-x-4 p-3 border rounded'
              >
                <div className='w-2 h-2 bg-blue-500 rounded-full' />
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{activity.action}</p>
                  <p className='text-xs text-muted-foreground'>
                    {activity.details}
                  </p>
                </div>
                <p className='text-xs text-muted-foreground'>{activity.time}</p>
              </div>
            ))}
          </div>
          <div className='mt-4'>
            <Button variant='outline' className='w-full'>
              Ver toda la actividad
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Productos Más Vendidos</CardTitle>
          <CardDescription>
            Tus productos con mejor rendimiento este mes
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between p-3 border rounded-lg'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <IconPackage className='w-5 h-5 text-blue-600' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Laptop Dell XPS 13</p>
                  <p className='text-xs text-muted-foreground'>SKU: LAP-001</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium'>24 vendidas</p>
                <p className='text-xs text-muted-foreground'>$18,500</p>
              </div>
            </div>

            <div className='flex items-center justify-between p-3 border rounded-lg'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                  <IconPackage className='w-5 h-5 text-green-600' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Mouse Inalámbrico</p>
                  <p className='text-xs text-muted-foreground'>SKU: MOU-002</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium'>18 vendidos</p>
                <p className='text-xs text-muted-foreground'>$1,080</p>
              </div>
            </div>

            <div className='flex items-center justify-between p-3 border rounded-lg'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                  <IconPackage className='w-5 h-5 text-purple-600' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Teclado Mecánico</p>
                  <p className='text-xs text-muted-foreground'>SKU: KEY-003</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium'>12 vendidos</p>
                <p className='text-xs text-muted-foreground'>$1,800</p>
              </div>
            </div>
          </div>

          <Button variant='outline' className='w-full'>
            Ver reporte completo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
