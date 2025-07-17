'use client';

import { useState } from 'react';
import { IconSettings, IconBell } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SettingsSection() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sales: true,
    inventory: true,
  });

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <IconSettings className='w-5 h-5 mr-2' />
            Configuración General
          </CardTitle>
          <CardDescription>
            Personaliza tu experiencia en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <h3 className='text-lg font-medium flex items-center'>
              <IconBell className='w-5 h-5 mr-2' />
              Notificaciones
            </h3>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>
                    Notificaciones por email
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    Recibe actualizaciones importantes por correo
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={checked =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>Notificaciones push</p>
                  <p className='text-sm text-muted-foreground'>
                    Recibe notificaciones en tiempo real
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={checked =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>Alertas de ventas</p>
                  <p className='text-sm text-muted-foreground'>
                    Notificaciones sobre nuevas ventas
                  </p>
                </div>
                <Switch
                  checked={notifications.sales}
                  onCheckedChange={checked =>
                    setNotifications({ ...notifications, sales: checked })
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>Alertas de inventario</p>
                  <p className='text-sm text-muted-foreground'>
                    Notificaciones sobre stock bajo
                  </p>
                </div>
                <Switch
                  checked={notifications.inventory}
                  onCheckedChange={checked =>
                    setNotifications({ ...notifications, inventory: checked })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>
              Preferencias de la aplicación
            </h3>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label>Idioma</Label>
                <Select defaultValue='es'>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecciona un idioma' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='es'>Español</SelectItem>
                    <SelectItem value='en'>English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Tema</Label>
                <Select defaultValue='gmt-5'>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecciona un tema' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='gmt-5'>Oscuro</SelectItem>
                    <SelectItem value='gmt-3'>Claro </SelectItem>
                    <SelectItem value='gmt-6'>Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className='pt-4'>
            <Button>Guardar configuración</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
