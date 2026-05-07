import * as React from 'react'
import { ScrollArea, ScrollBar } from './scroll-area'
import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'

function Table({
  className,
  classNames,
  ...props
}: React.ComponentProps<'table'> & {
  classNames?: {
    wrapper?: string
  }
}) {
  const locale = useLocale();
  return (
    <ScrollArea
      className={cn(
        'bg-card p-3 sm:p-6 rounded-2xl border border-border overflow-hidden w-full max-md:max-w-[90svw] max-md:mx-auto whitespace-nowrap',
        classNames?.wrapper,
      )}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="relative overflow-auto rounded-t-2xl">
        <table
          data-slot="table"
          className={cn('w-full caption-bottom text-sm', className)}
          {...props}
        />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('bg-muted', className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-zinc-800 dark:text-zinc-200 h-12 px-3 text-start align-middle font-medium has-[role=checkbox]:w-px [&:has([role=checkbox])]:pe-0',
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'px-3 py-5 align-middle [&:has([role=checkbox])]:pe-0',
        className,
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...props}
    />
  )
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
