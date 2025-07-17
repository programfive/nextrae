'use client';

import { useState, useRef, useTransition } from 'react';
import { IconUpload, IconPhoto, IconLoader } from '@tabler/icons-react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { deleteImage, uploadImage } from '@/lib/supabase/storage/client';
import { toast } from 'sonner';
import { getInitials } from '@/tools/methods';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userName: string;
  isEditing: boolean;
  onAvatarChange: (imageUrl: string) => void;
}

export function AvatarUpload({
  currentAvatarUrl,
  userName,
  isEditing,
  onAvatarChange,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const { setValue } = useFormContext();
  const [lastCurrentAvatarUrl, setLastCurrentAvatarUrl] = useState<
    string | null
  >(currentAvatarUrl!);

  const currentAvatarUrlDisplay = uploadedImage || lastCurrentAvatarUrl;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    startTransition(async () => {
      setIsUploading(true);

      try {
        const { imageUrl, error } = await uploadImage({
          file,
          bucket: 'images',
          folder: 'avatars',
        });
        if (imageUrl) {
          await deleteImage(lastCurrentAvatarUrl!);
          setLastCurrentAvatarUrl(imageUrl);
        }

        if (error) {
          toast.error('No se pudo subir la imagen');
          return;
        }

        setUploadedImage(imageUrl);
        setValue('avatar', file);
        setValue('avatarUrl', imageUrl);
        onAvatarChange(imageUrl);
      } catch (error) {
        toast.error('Error al procesar la imagen');
      } finally {
        setIsUploading(false);
      }
    });
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='flex items-center space-x-4'>
      <div className='relative'>
        <Avatar className='h-20 w-20 object-cover'>
          <AvatarImage
            src={currentAvatarUrlDisplay || ''}
            alt={userName}
            className='object-cover'
          />
          <AvatarFallback className='text-lg'>
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>
        {isUploading && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full'>
            <IconLoader className='w-6 h-6 animate-spin' />
          </div>
        )}
      </div>
      <div className='space-y-2'>
        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileSelect}
          className='hidden'
        />

        {isEditing ? (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleChangePhotoClick}
            disabled={isUploading}
          >
            <IconUpload className='w-4 h-4 mr-2' />
            Cambiar foto
          </Button>
        ) : (
          <Button variant='outline' size='sm' disabled>
            <IconPhoto className='w-4 h-4 mr-2' />
            Cambiar foto
          </Button>
        )}
        <p className='text-sm text-muted-foreground'>
          JPG, PNG o GIF. Máximo 2MB.
        </p>
      </div>
    </div>
  );
}
