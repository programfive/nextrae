'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

interface MobileTabsProps
  extends React.ComponentProps<typeof TabsPrimitive.Root> {
  items: Array<{ value: string; label: string; icon?: React.ReactNode }>;
  children: React.ReactNode;
}

function MobileTabs({ items, className, children, ...props }: MobileTabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot='tabs'
      className={cn('flex flex-col gap-4', className)}
      {...props}
    >
      {/* Mobile: Card-like tabs */}
      <div className='sm:hidden'>
        <TabsPrimitive.List className='grid grid-cols-2 gap-2'>
          {items.map(item => (
            <TabsPrimitive.Trigger
              key={item.value}
              value={item.value}
              className={cn(
                'flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200',
                'data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary',
                'data-[state=inactive]:border-muted data-[state=inactive]:bg-background data-[state=inactive]:text-muted-foreground',
                'hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                'min-h-[80px]'
              )}
            >
              {item.icon && <span className='text-lg'>{item.icon}</span>}
              <span className='text-xs font-medium text-center'>
                {item.label}
              </span>
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
      </div>

      <div className='hidden sm:flex sm:justify-start'>
        <TabsPrimitive.List className='inline-flex h-auto bg-muted text-muted-foreground rounded-lg p-1 flex-nowrap overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory gap-1'>
          {items.map(item => (
            <TabsPrimitive.Trigger
              key={item.value}
              value={item.value}
              className={cn(
                'flex-none snap-start flex-shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
                'hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50'
              )}
            >
              <div className='flex items-center gap-2'>
                {item.icon && (
                  <span className='flex-shrink-0'>{item.icon}</span>
                )}
                <span>{item.label}</span>
              </div>
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
      </div>

      {/* Render tab content */}
      {children}
    </TabsPrimitive.Root>
  );
}

function MobileTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot='tabs-content'
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export { MobileTabs, MobileTabsContent };
