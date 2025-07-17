import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { IconCalendar } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { es } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { exportSchema } from '@/schemas';

export type ExportFormat = 'pdf' | 'excel' | 'json';

type ExportFormValues = z.infer<typeof exportSchema>;

interface ExportDialogProps {
  onExport: (
    format: ExportFormat,
    startDate: Date,
    endDate: Date,
    status?: boolean
  ) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  buttonText?: string;
  exportFormats?: Array<ExportFormat>;
  isLoading?: boolean;
  showStatusFilter?: boolean;
  statusLabel?: string;
}

export function ExportDialog({
  onExport,
  title = 'Exportar datos',
  description = 'Selecciona el formato y rango de fechas para exportar los datos.',
  buttonText = 'Exportar',
  exportFormats = ['pdf', 'excel', 'json'],
  isLoading = false,
  showStatusFilter = false,
  statusLabel = 'Estado',
  open,
  setOpen,
}: ExportDialogProps) {
  const form = useForm<ExportFormValues>({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      format: 'pdf',
      status: undefined,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        format: 'pdf',
        startDate: undefined,
        endDate: undefined,
        status: undefined,
      });
    }
  }, [open, form]);

  function onSubmit(data: ExportFormValues) {
    onExport(data.format, data.startDate, data.endDate, data.status);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-w-md '>
        <DialogHeader className='mb-4'>
          <DialogTitle className='text-xl'>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField
              control={form.control}
              name='format'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center gap-2'>
                    <FormLabel className='min-w-24'>Formato</FormLabel>
                    <div className='flex-1'>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full '>
                            <SelectValue placeholder='Selecciona un formato' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {exportFormats.includes('pdf') && (
                            <SelectItem value='pdf'>PDF</SelectItem>
                          )}
                          {exportFormats.includes('excel') && (
                            <SelectItem value='excel'>Excel</SelectItem>
                          )}
                          {exportFormats.includes('json') && (
                            <SelectItem value='json'>JSON</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className='pl-24'>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {showStatusFilter && (
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center gap-2'>
                      <FormLabel className='min-w-24'>{statusLabel}</FormLabel>
                      <div className='flex-1'>
                        <Select
                          onValueChange={value => {
                            if (value === 'all') {
                              field.onChange(undefined);
                            } else if (value === 'active') {
                              field.onChange(true);
                            } else if (value === 'inactive') {
                              field.onChange(false);
                            }
                          }}
                          defaultValue={
                            field.value === undefined
                              ? 'all'
                              : field.value
                                ? 'active'
                                : 'inactive'
                          }
                        >
                          <FormControl>
                            <SelectTrigger className='w-full '>
                              <SelectValue placeholder='Selecciona un estado' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='all'>Todos</SelectItem>
                            <SelectItem value='active'>Activos</SelectItem>
                            <SelectItem value='inactive'>Inactivos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className='pl-24'>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name='startDate'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center gap-2'>
                    <FormLabel className='min-w-24'>Desde</FormLabel>
                    <div className='flex-1'>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              className={cn(
                                'w-full justify-start text-left ',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <IconCalendar className='mr-2 h-4 w-4' />
                              {field.value
                                ? format(field.value, 'PPP', { locale: es })
                                : 'Seleccionar fecha'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0 '>
                          <Calendar
                            locale={es}
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className='pl-24'>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='endDate'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center gap-2'>
                    <FormLabel className='min-w-24'>Hasta</FormLabel>
                    <div className='flex-1'>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              className={cn(
                                'w-full justify-start text-left ',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <IconCalendar className='mr-2 h-4 w-4' />
                              {field.value
                                ? format(field.value, 'PPP', { locale: es })
                                : 'Seleccionar fecha'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0 '>
                          <Calendar
                            locale={es}
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={date => {
                              const startDate = form.getValues('startDate');
                              return startDate ? date < startDate : false;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className='pl-24'>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className='pt-2 gap-2'>
              <DialogClose asChild>
                <Button variant='outline'>Cancelar</Button>
              </DialogClose>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Exportando...' : buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
