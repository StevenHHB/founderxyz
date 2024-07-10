'use client';

import { useEffect, useState } from 'react';
import { WebNavigation } from '@/db/supabase/types';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/db/supabase/client';

import Empty from '@/components/Empty';
import ExploreBreadcrumb from '@/components/explore/ExploreBreadcrumb';
import BasePagination from '@/components/page/BasePagination';
import WebNavCard from '@/components/webNav/WebNavCard';

export default function Content({
  headerTitle,
  initialNavigationList,
  initialCurrentPage,
  initialTotal,
  pageSize,
  route,
}: {
  headerTitle: string;
  initialNavigationList: WebNavigation[];
  initialCurrentPage: number;
  initialTotal: number;
  pageSize: number;
  route: string;
}) {
  const t = useTranslations('Category');
  const searchParams = useSearchParams();

  const [navigationList, setNavigationList] = useState<WebNavigation[]>(initialNavigationList);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage);
  const [total, setTotal] = useState<number>(initialTotal);

  useEffect(() => {
    const fetchNavigationData = async () => {
      const supabase = createClient();
      const code = searchParams.get('code');
      const pageNum = searchParams.get('pageNum') || '1';
      const currentPageLocal = Number(pageNum);

      if (!code) {
        return;
      }

      const startRange = (currentPageLocal - 1) * pageSize;
      const endRange = currentPageLocal * pageSize - 1;

      const { data: fetchedNavigationList, count } = await supabase
        .from('web_navigation')
        .select('*', { count: 'exact' })
        .eq('category_name', code)
        .range(startRange, endRange);

      setNavigationList(fetchedNavigationList || []);
      setCurrentPage(currentPageLocal);
      setTotal(count || 0);
    };

    fetchNavigationData();
  }, [searchParams, pageSize]);

  return (
    <>
      <div className='mx-auto flex flex-col gap-3 py-5 lg:pt-10'>
        <h1 className='text-center text-[28px] font-bold lg:text-5xl'>{headerTitle}</h1>
        <div className='mx-auto'>
          <ExploreBreadcrumb
            linkList={[
              {
                href: '/',
                title: t('home'),
              },
              {
                title: headerTitle,
                isLast: true,
              },
            ]}
          />
        </div>
      </div>
      <div className='mt-3'>
        {navigationList && !!navigationList.length ? (
          <>
            <div className='grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4'>
              {navigationList.map((item) => (
                <WebNavCard key={item.id} {...item} />
              ))}
            </div>
            <div className='my-5 flex items-center justify-center lg:my-10'>
              <BasePagination
                currentPage={currentPage}
                total={total}
                pageSize={pageSize}
                route={route}
                subRoute='/page'
              />
            </div>
          </>
        ) : (
          <div className='mb-3 lg:mb-5'>
            <Empty title={t('empty')} />
          </div>
        )}
      </div>
    </>
  );
}
