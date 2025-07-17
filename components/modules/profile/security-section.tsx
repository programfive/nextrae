'use client';

import { useState } from 'react';
import { IconLock, IconEye, IconEyeOff, IconShield } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export function SecuritySection() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <IconShield className='w-5 h-5 mr-2' />
            Seguridad de la Cuenta
          </CardTitle>
          <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='current-password'>Contraseña actual</Label>
              <div className='relative'>
                <Input
                  id='current-password'
                  type='password'
                  placeholder='Ingresa tu contraseña actual'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='new-password'>Nueva contraseña</Label>
              <Input
                id='new-password'
                type='password'
                placeholder='Ingresa tu nueva contraseña'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirm-password'>
                Confirmar nueva contraseña
              </Label>
              <Input
                id='confirm-password'
                type='password'
                placeholder='Confirma tu nueva contraseña'
              />
            </div>

            <Button>Actualizar contraseña</Button>
          </div>

          <Separator />

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>
              Autenticación de dos factores
            </h3>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Habilitar 2FA</p>
                <p className='text-sm text-muted-foreground'>
                  Agrega una capa extra de seguridad a tu cuenta
                </p>
              </div>
              <Switch />
            </div>
          </div>

          <Separator />

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Sesiones activas</h3>
            <div className='space-y-2'>
              <div className='flex items-center justify-between p-3 border rounded'>
                <div>
                  <p className='text-sm font-medium'>Navegador actual</p>
                  <p className='text-xs text-muted-foreground'>
                    Chrome en Windows • Última actividad: Ahora
                  </p>
                </div>
                <Badge variant='outline'>Actual</Badge>
              </div>
              <div className='flex items-center justify-between p-3 border rounded'>
                <div>
                  <p className='text-sm font-medium'>Móvil</p>
                  <p className='text-xs text-muted-foreground'>
                    Safari en iPhone • Última actividad: Hace 2 horas
                  </p>
                </div>
                <Button variant='outline' size='sm'>
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
