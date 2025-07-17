import { Button } from '@/components/ui/button';
import { IconLoader } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function DeleteDialog({
  isOpen,
  description,
  onClose,
  onConfirm,
  isPending = false,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro?</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <IconLoader className='w-4 h-4 animate-spin' />}
            {isPending ? 'Eliminando' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
