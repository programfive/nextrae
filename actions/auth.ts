"use server";

import { createClient } from "@/lib/supabase/server";

export const updateUserProfile = async (userUpdate: {
  name: string;
  email: string;
  avatarUrl: string;
}) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: userUpdate.name,
      email: userUpdate.email,
      avatar_url: userUpdate.avatarUrl,
    },
  });
  if (error) {
    console.error(error);
  }
  return { data, error };
};

export const currentUser = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error(error);
  }
  return { data, error };
};

export const getUserProvider = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const provider = data?.user?.app_metadata.provider;
  if (error) {
    console.error(error);
  }
  return { provider, error };
};

export const isVerifyPassword = async (email: string, password: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const getUserByEmail = async (email: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_user_id_by_email", {
    email: email,
  });
  return { data, error };
};
export const getUserFullName = async (fullName: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_user_id_by_fullname", {
    fullname: fullName,
  });
  return { data, error };
};
export const updateUserEmail = async (email: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    email,
  });
  return { data, error };
};
export const updateUserPassword = async (password: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  return { data, error };
};
export const isEmailAvailable = async (email: string) => {
  const { data } = await getUserByEmail(email);
  return data.length === 0;
};
export const isFullNameAvailable = async (fullName: string) => {
  const { data } = await getUserFullName(fullName);
  console.log('data', data);
  return (data?.length ?? 0) === 0;
};



