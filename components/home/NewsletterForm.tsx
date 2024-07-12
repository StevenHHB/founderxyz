/* eslint-disable react/jsx-props-no-spreading */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import cn from 'classnames';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const FormSchema = z.object({
  email: z.string().email(),
});

export default function NewsletterForm({ className }: { className?: string }) {
  const t = useTranslations('Home');
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    // Handle form submission
    // You can replace this with a more appropriate logging method if necessary
    console.log(data);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col items-center lg:flex-row lg:space-x-3', className)}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='w-full lg:w-auto'>
              <FormControl>
                <Input
                  placeholder={t('subscribePrompt')}
                  {...field}
                  className='h-10 w-full rounded-l-md border border-white/40 bg-transparent px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-0 lg:h-12 lg:w-80'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          type='submit'
          className='mt-3 h-10 w-full rounded-r-md bg-white px-5 py-2 text-sm font-bold text-black hover:opacity-80 lg:mt-0 lg:h-12 lg:w-auto'
        >
          {t('subscribe')}
        </button>
      </form>
    </FormProvider>
  );
}
