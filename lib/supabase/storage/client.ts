import { createClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';

function getStorage() {
  const { storage } = createClient();
  return storage;
}

type UploadProps = {
  file: File;
  bucket: string;
  folder?: string;
};

export const uploadImage = async ({ file, bucket, folder }: UploadProps) => {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1);
  const path = `${folder ? folder + '/' : ''}${uuidv4()}.${fileExtension}`;

  try {
    file = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
    });
  } catch (error) {
    console.error('Error comprimiendo imagen:', error);
    return { imageUrl: '', error: 'Image compression failed' };
  }

  const storage = getStorage();

  try {
    const { data, error } = await storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('Error subiendo imagen:', error);
      return { imageUrl: '', error: error.message || 'Image upload failed' };
    }

    if (!data?.path) {
      console.error('No se recibió path de la imagen subida');
      return { imageUrl: '', error: 'No path received from upload' };
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data.path}`;
    console.log('Imagen subida exitosamente:', imageUrl);

    return { imageUrl, error: '' };
  } catch (error) {
    console.error('Error inesperado subiendo imagen:', error);
    return { imageUrl: '', error: 'Unexpected upload error' };
  }
};

export const deleteImage = async (imageUrl: string) => {
  if (!imageUrl) {
    console.warn('URL de imagen vacía para eliminar');
    return { data: null, error: null };
  }

  try {
    const bucketAndPathString = imageUrl.split('/storage/v1/object/public/')[1];
    if (!bucketAndPathString) {
      console.warn('URL de imagen inválida:', imageUrl);
      return { data: null, error: 'Invalid image URL' };
    }

    const firstSlashIndex = bucketAndPathString.indexOf('/');
    if (firstSlashIndex === -1) {
      console.warn('URL de imagen malformada:', imageUrl);
      return { data: null, error: 'Malformed image URL' };
    }

    const bucket = bucketAndPathString.slice(0, firstSlashIndex);
    const path = bucketAndPathString.slice(firstSlashIndex + 1);

    const storage = getStorage();
    const { data, error } = await storage.from(bucket).remove([path]);

    if (error) {
      console.error('Error eliminando imagen:', error);
    } else {
      console.log('Imagen eliminada exitosamente:', path);
    }

    return { data, error };
  } catch (error) {
    console.error('Error inesperado eliminando imagen:', error);
    return { data: null, error: 'Unexpected delete error' };
  }
};
