import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog as DialogComponent,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ExportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: ReactNode;
  triggerButton?: ReactNode;
  footerContent?: ReactNode;
}

export function Dialog({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  children,
  triggerButton,
  footerContent,
}: ExportDialogProps) {
  return (
    <DialogComponent open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}

        <DialogFooter className='flex flex-col sm:flex-row sm:justify-between gap-2'>
          {footerContent || (
            <>
              <Button
                variant='outline'
                onClick={() => {
                  onCancel?.();
                  onOpenChange?.(false);
                }}
              >
                {cancelLabel || 'Cancelar'}
              </Button>
              <Button
                onClick={() => {
                  onConfirm?.();
                  onOpenChange?.(false);
                }}
              >
                {confirmLabel}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </DialogComponent>
  );
}
