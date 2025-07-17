import { SettingsSection } from '@/components/modules/profile/settings-section';
import { ActivitySection } from '@/components/modules/profile/activity-section';
import { SecuritySection } from '@/components/modules/profile/security-section';
import { ProfileSection } from '@/components/modules/profile/profile-section';
import { Badge } from '@/components/ui/badge';
import { MobileTabs, MobileTabsContent } from '@/components/ui/mobile-tabs';
import { tabItems, userData } from '@/constants/account';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    redirect('/login');
  }
  console.log(authData.user.user_metadata.full_name);
  return (
    <div className='container mx-auto p-6 max-w-6xl'>
      <div className='flex flex-col space-y-2 mb-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold tracking-tight'>Mi Cuenta</h1>
          <Badge variant={userData?.is_active ? 'default' : 'secondary'}>
            {userData?.is_active ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
        <p className='text-muted-foreground'>
          Gestiona tu perfil y configuraciones del sistema
        </p>
      </div>

      <MobileTabs defaultValue='profile' className='space-y-6' items={tabItems}>
        <MobileTabsContent value='profile' className='space-y-6'>
          <ProfileSection currentUser={authData.user} />
        </MobileTabsContent>

        <MobileTabsContent value='security' className='space-y-6'>
          <SecuritySection />
        </MobileTabsContent>

        <MobileTabsContent value='activity' className='space-y-6'>
          <ActivitySection />
        </MobileTabsContent>

        <MobileTabsContent value='settings' className='space-y-6'>
          <SettingsSection />
        </MobileTabsContent>
      </MobileTabs>
    </div>
  );
}
