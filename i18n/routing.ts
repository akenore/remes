import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',

  pathnames: {
    '/': '/',
    '/nursing-home' : {
      fr: '/ehpad',
    },
    '/adapted-stay' : {
      fr: '/sejour-adapte',
    },
    '/about' : {
      fr: '/a-propos',
    },
    '/magazine' : {
      fr: '/magazine',
    },
    '/search' : {
      fr: '/recherche',
    },
  }
});