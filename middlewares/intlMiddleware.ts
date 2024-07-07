import createMiddleware from 'next-intl/middleware';
import { locales } from '../i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
});

export default intlMiddleware;
