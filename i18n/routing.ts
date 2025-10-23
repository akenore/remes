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
    '/nursing-home/living-at-remes/entertainment-and-activities' : {
      fr: '/ehpad/vivre-a-remes/animations-et-activites',
    },
    '/nursing-home/living-at-remes/meals-and-daily-services' : {
      fr: '/ehpad/vivre-a-remes/repas-et-services-quotidiens',
    },
    '/nursing-home/living-at-remes/well-being-and-comfort' : {
      fr: '/ehpad/vivre-a-remes/bien-etre-et-confort',
    },
    '/nursing-home/the-residence' : {
      fr: '/ehpad/la-residence',
    },
    '/nursing-home/hosting-solutions' : {
      fr: '/ehpad/solutions-dhebergement',
    },
    '/nursing-home/care-expertise' : {
      fr: '/ehpad/expertise-soins',
    },
    '/nursing-home/our-offers' : {
      fr: '/ehpad/nos-offres',
    },


    '/adapted-stay' : {
      fr: '/sejour-adapte',
    },
    '/adapted-stay/professional-services' : {
      fr: '/sejour-adapte/services-aux-professionnels',
    },
    '/adapted-stay/adapted-accommodation' : {
      fr: '/sejour-adapte/hebergement-adapte',
    },
    '/adapted-stay/adapted-transport' : {
      fr: '/sejour-adapte/transport-adapte',
    },
    '/adapted-stay/adapted-care' : {
      fr: '/sejour-adapte/soins-adaptes',
    },
    '/adapted-stay/medical-equipment' : {
      fr: '/sejour-adapte/equipements-medicaux',
    },
    '/about' : {
      fr: '/a-propos',
    },
    '/magazine' : {
      fr: '/magazine',
    },
    '/magazine/[slug]' : {
      fr: '/magazine/[slug]',
    },
    '/search' : {
      fr: '/recherche',
    },
    
    '/terms-of-use' : {
      fr: '/conditions-dutilisation',
    },
    '/privacy-policy' : {
      fr: '/politique-de-confidentialite',
    },
  }
});