/* eslint-disable react/jsx-props-no-spreading */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/db/supabase/client';

import Content from './Content';

export async function generateMetadata({ params }: { params: { code: string; pageNum?: string } }) {
  const supabase = createClient();
  const { data: categoryList } = await supabase.from('navigation_category').select().eq('name', params.code);

  if (!categoryList || !categoryList[0]) {
    notFound();
  }

  return {
    title: categoryList[0].title,
  };
}

export default async function Page({ params }: { params: { code: string; pageNum?: string } }) {
  const supabase = createClient();
  const currentPage = Number(params?.pageNum || 1);
  const startRange = (currentPage - 1) * InfoPageSize;
  const endRange = currentPage * InfoPageSize - 1;

  const [{ data: categoryList }, { data: navigationList, count }] = await Promise.all([
    supabase.from('navigation_category').select().eq('name', params.code),
    supabase
      .from('web_navigation')
      .select('*', { count: 'exact' })
      .eq('category_name', params.code)
      .range(startRange, endRange),
  ]);

  if (!categoryList || !categoryList[0]) {
    notFound();
  }

  return (
    <Content
      headerTitle={categoryList[0]!.title || params.code}
      initialNavigationList={navigationList!}
      initialCurrentPage={currentPage}
      initialTotal={count!}
      pageSize={InfoPageSize}
      route={`/category/${params.code}`}
    />
  );
}
