'use client';

import { useState } from 'react';
import { IconEdit, IconDeviceFloppy, IconX, IconCalendar, IconShield, IconUser, IconMail } from '@tabler/icons-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema } from '@/schemas';
import type { z } from 'zod';
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
import { IconShoppingCart, IconTrendingUp, IconPackage, IconUsers } from '@tabler/icons-react';
import { User as UserType } from '@supabase/supabase-js';
import { updateUserProfile } from '@/actions/auth';
import { AvatarUpload } from '@/components/modules/profile/avatar-upload';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileSectionProps {
  currentUser: UserType;
}

export function ProfileSection({ currentUser }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);
  const {
    user_metadata: { full_name, avatar_url },
    email,
    created_at,
  } = currentUser;
  const name = full_name || email?.split('@')[0] || 'Usuario';
  const userCreatedAt = new Date(created_at).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: name,
      email: email,
      avatarUrl: avatar_url,
    },
  });

  const handleAvatarChange = (imageUrl: string) => {
    setNewAvatarUrl(imageUrl);
  };

  const onSubmit = async (data: ProfileFormData) => {
    console.log('Datos validados del formulario:', data);

    try {
      let avatarUrl = avatar_url;

      if (newAvatarUrl !== null) {
        avatarUrl = newAvatarUrl;
      }

      const profileData = {
        name: data.name,
        email: data.email,
        avatarUrl: avatarUrl,
      };

      const { data: updateResult, error } = await updateUserProfile(
        profileData,
        currentUser
      );

      if (error) {
        console.error('Error al actualizar perfil:', error);
        toast.error('Error al actualizar el perfil');
        return;
      }

      console.log('Resultado de la actualización:', updateResult);

      // Refrescar la sesión del usuario para actualizar inmediatamente el nav_user
      const supabase = createClient();
      await supabase.auth.refreshSession();

      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);

      // Forzar un refresh de la página para asegurar que todos los componentes se actualicen
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar los cambios');
    }
  };

  const handleCancel = () => {
    form.reset();
    setNewAvatarUrl(null);
    setIsEditing(false);
  };

  return (
    <div className='space-y-6'>
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Profile Information */}
        <Card className='md:col-span-2'>
          <CardHeader className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
            <div>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información de perfil
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsEditing(true)}
              >
                <IconEdit className='w-4 h-4 mr-2' />
                Editar
              </Button>
            ) : (
              <div className='flex flex-col gap-2 sm:flex-row'>
                <Button size='sm' onClick={form.handleSubmit(onSubmit)}>
                  <IconDeviceFloppy className='w-4 h-4 mr-2' />
                  Guardar
                </Button>
                <Button variant='outline' size='sm' onClick={handleCancel}>
                  <IconX className='w-4 h-4 mr-2' />
                  Cancelar
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className='space-y-6'>
            <FormProvider {...form}>
              <AvatarUpload
                currentAvatarUrl={avatar_url}
                userName={name}
                isEditing={isEditing}
                onAvatarChange={handleAvatarChange}
              />
            </FormProvider>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Nombre completo</Label>
                <Input
                  id='name'
                  value={form.watch('name')}
                  onChange={e => form.setValue('name', e.target.value)}
                  disabled={!isEditing}
                />
                {form.formState.errors.name && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Correo electrónico</Label>
                <Input
                  id='email'
                  type='email'
                  value={form.watch('email')}
                  onChange={e => form.setValue('email', e.target.value)}
                  disabled
                />
                {form.formState.errors.email && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label>Miembro desde</Label>
              <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
                <IconCalendar className='h-4 w-4' />
                <span>{userCreatedAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roles */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <IconShield className='w-5 h-5 mr-2' />
              Roles
            </CardTitle>
            <CardDescription>Roles asignados a tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm font-medium leading-none'>Vendedor</p>
                <p className='text-sm text-muted-foreground'>
                  Gestión de ventas y clientes
                </p>
              </div>
              <Badge variant='secondary'>Activo</Badge>
            </div>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm font-medium leading-none'>Supervisor</p>
                <p className='text-sm text-muted-foreground'>
                  Supervisión de equipo de ventas
                </p>
              </div>
              <Badge variant='secondary'>Activo</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Ventas Totales
            </CardTitle>
            <IconShoppingCart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>156</div>
            <p className='text-xs text-muted-foreground'>
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Ingresos</CardTitle>
            <IconTrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$45,780</div>
            <p className='text-xs text-muted-foreground'>
              +8% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Productos Activos
            </CardTitle>
            <IconPackage className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>234</div>
            <p className='text-xs text-muted-foreground'>
              +3 nuevos esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Clientes</CardTitle>
            <IconUsers className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>89</div>
            <p className='text-xs text-muted-foreground'>+5 nuevos este mes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
