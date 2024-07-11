'use client';

import { useState } from 'react';
import { createClient } from '@/db/supabase/client';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Spinning from '@/components/Spinning';

const FormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export default function NewsletterForm({ className }: { className?: string }) {
    const supabase = createClient();
    const t = useTranslations('Newsletter');

    const [loading, setLoading] = useState(false);

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            email: '',
        },
    });

    const onSubmit = async (formData: FormSchemaType) => {
        let errMsg: any = t('networkError');
        try {
            setLoading(true);
            const { error } = await supabase.from('newsletter_subscriptions').insert({
                name: formData.name,
                email: formData.email,
            });
            if (error) {
                errMsg = error.message;
                throw new Error();
            }
            toast.success(t('success'));
            form.reset();
        } catch (error) {
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            control={form.control}
            handleSubmit={form.handleSubmit}
            reset={form.reset}
            formState={form.formState}
            getValues={form.getValues}
            setValue={form.setValue}
            trigger={form.trigger}
            watch={form.watch}
        >
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={`mx-3 mb-5 flex flex-col justify-between rounded-[12px] bg-[#2C2D36] px-3 py-5 lg:w-[444px] lg:p-8 ${className}`}
            >
                <div className='space-y-3 lg:space-y-5'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormLabel>{t('name')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Your Name'
                                        className='input-border-pink h-[42px] w-full rounded-[8px] border-[0.5px] bg-dark-bg p-5'
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem className='space-y-1'>
                                <FormLabel>{t('email')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Your Email'
                                        className='input-border-pink h-[42px] w-full rounded-[8px] border-[0.5px] bg-dark-bg p-5'
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-[10px] lg:gap-8'>
                    <button
                        type='submit'
                        disabled={loading}
                        className={`flex-center mt-auto h-[48px] w-full gap-4 rounded-[8px] bg-white text-center font-bold text-black hover:cursor-pointer hover:opacity-80 ${loading && 'hover:cursor-not-allowed'
                            }`}
                    >
                        {loading ? <Spinning className='size-[22px]' /> : t('subscribe')}
                    </button>
                </div>
            </form>
        </Form>
    );
}
