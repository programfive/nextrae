'use server';
import { createClient } from '@/lib/supabase/server';
import { User as UserType } from '@supabase/supabase-js';
import { profileFormSchema } from '@/schemas';
import { z } from 'zod';
type ProfileFormData = z.infer<typeof profileFormSchema>;

export const updateUserProfile = async (
  userUpdate: ProfileFormData,
  currentUser: UserType
) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: userUpdate.name,
      email: userUpdate.email,
      avatar_url: userUpdate.avatarUrl,
    },
  });
  if (error) {
    console.log(error);
  }
  return { data, error };
};
