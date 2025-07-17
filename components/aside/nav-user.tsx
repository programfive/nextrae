'use client';

import { IconCreditCard, IconDotsVertical, IconBell, IconUser } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { User as SupabaseUser } from '@supabase/supabase-js';
  import { LogoutButton } from '@/components/modules/auth/logout-button';
import Link from 'next/link';
import { getInitials } from '@/tools/methods';
interface NavUserProps {
  isLoading: boolean;
  user: SupabaseUser | null;
}

export function NavUser({ user, isLoading }: NavUserProps) {
  const { isMobile } = useSidebar();

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg'>
            <Skeleton className='h-8 w-8 rounded-lg' />
            <div className='grid flex-1 text-left text-sm leading-tight gap-1'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-3 w-24' />
            </div>
            <Skeleton className='ml-auto size-4' />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg'>
            <Skeleton className='h-8 w-8 rounded-lg' />
            <div className='grid flex-1 text-left text-sm leading-tight gap-1'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-3 w-20' />
            </div>
            <Skeleton className='ml-auto size-4' />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const userName =
    user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';
  const userEmail = user.email || '';
  const userAvatar = user.user_metadata?.avatar_url;

  const userInitials = getInitials(userName);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg grayscale'>
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className='rounded-lg'>
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{userName}</span>
                <span className='text-muted-foreground truncate text-xs'>
                  {userEmail}
                </span>
              </div>
                             <IconDotsVertical className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className='rounded-lg'>
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{userName}</span>
                  <span className='text-muted-foreground truncate text-xs'>
                    {userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href='/account' className='flex items-center'>
                                     <IconUser className='mr-2 h-4 w-4' />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/billing' className='flex items-center'>
                                     <IconCreditCard className='mr-2 h-4 w-4' />
                  Facturación
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/notifications' className='flex items-center'>
                                     <IconBell className='mr-2 h-4 w-4' />
                  Notificaciones
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutButton
                variant='ghost'
                size='sm'
                className='w-full justify-start h-auto p-0'
              >
                Cerrar sesión
              </LogoutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
