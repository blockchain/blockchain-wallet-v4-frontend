/* eslint-disable @typescript-eslint/no-var-requires */
import { findIndex, prop, propEq, sortBy, toUpper } from 'ramda'

import '@formatjs/intl-relativetimeformat/polyfill'

type Language = { language: string; name: string }

export const languages: Array<Language> = [
  { language: 'en', name: 'English' },
  { language: 'es', name: 'Español' },
  { language: 'fr', name: 'Français' },
  { language: 'pt', name: 'Português' },
  { language: 'ru', name: 'Русский' }
]

export const languagesSortedByName = sortBy(prop('name'))(languages)

// update url with new language without forcing browser reload
export function addLanguageToUrl(language) {
  window.history.pushState({}, '', `/${language}/${window.location.hash}`)
}

export function tryParseLanguageFromUrl() {
  const path = window.location.pathname.replace(/\//g, '')

  if (path && path.length) {
    return languages[findIndex(propEq('language', path))(languages)]
  }
}

export const loadLocaleData = (locale, callback) => {
  const setLocaleData = (messages) => {
    // TODO: set date-fns locale globally
    // https://github.com/date-fns/date-fns/blob/master/docs/i18n.md
    // https://github.com/date-fns/date-fns/issues/816
    callback(messages)
  }

  switch (locale) {
    case 'es':
      require.ensure(
        [
          'date-fns/locale/es',
          '@formatjs/intl-relativetimeformat/locale-data/es.js',
          '../../assets/locales/es.json'
        ],
        (require) => {
          require('date-fns/locale/es')
          setLocaleData(require('../../assets/locales/es.json'))
        },
        'i18n-es'
      )
      break
    case 'fr':
      require.ensure(
        [
          'date-fns/locale/fr',
          '@formatjs/intl-relativetimeformat/locale-data/fr.js',
          '../../assets/locales/fr.json'
        ],
        (require) => {
          require('date-fns/locale/fr')
          setLocaleData(require('../../assets/locales/fr.json'))
        },
        'i18n-fr'
      )
      break
    case 'pt':
      require.ensure(
        [
          'date-fns/locale/pt',
          '@formatjs/intl-relativetimeformat/locale-data/pt.js',
          '../../assets/locales/pt.json'
        ],
        (require) => {
          require('date-fns/locale/pt')
          setLocaleData(require('../../assets/locales/pt.json'))
        },
        'i18n-pt'
      )
      break
    case 'ru':
      require.ensure(
        [
          'date-fns/locale/ru',
          '@formatjs/intl-relativetimeformat/locale-data/ru.js',
          '../../assets/locales/ru.json'
        ],
        (require) => {
          require('date-fns/locale/ru')
          setLocaleData(require('../../assets/locales/ru.json'))
        },
        'i18n-ru'
      )
      break
    case 'en':
    default:
      require.ensure(
        [
          'date-fns/locale/en-GB',
          '@formatjs/intl-relativetimeformat/locale-data/en.js',
          '../../assets/locales/en.json'
        ],
        (require) => {
          require('date-fns/locale/en-GB')
          setLocaleData(require('../../assets/locales/en.json'))
        },
        'i18n-en'
      )
      break
  }
}

const stateList = {
  AK: 'Alaska',
  AL: 'Alabama',
  AR: 'Arkansas',
  AS: 'American Samoa',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District Of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  FM: 'Federated States Of Micronesia',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MH: 'Marshall Islands',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MP: 'Northern Mariana Islands',
  MS: 'Mississippi',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  PW: 'Palau',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VI: 'Virgin Islands',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming'
}

export const getStateNameFromAbbreviation = (abbreviation) => {
  return abbreviation && stateList[toUpper(abbreviation)]
    ? stateList[toUpper(abbreviation)]
    : abbreviation
}

const countryToCurrencyMap = {
  AD: 'EUR',
  AT: 'EUR',
  BE: 'EUR',
  CA: 'CAD',
  CS: 'EUR',
  DE: 'EUR',
  DK: 'DKK',
  EE: 'EUR',
  ES: 'EUR',
  FI: 'EUR',
  FO: 'DKK',
  FR: 'EUR',
  GB: 'GBP',
  GF: 'EUR',
  GL: 'DKK',
  GP: 'EUR',
  GR: 'EUR',
  GY: 'EUR',
  IE: 'EUR',
  IT: 'EUR',
  LT: 'EUR',
  LU: 'EUR',
  LV: 'EUR',
  MC: 'EUR',
  MQ: 'EUR',
  MT: 'EUR',
  NL: 'EUR',
  PL: 'PLN',
  PM: 'EUR',
  PT: 'EUR',
  RE: 'EUR',
  SE: 'SEK',
  SI: 'EUR',
  SK: 'EUR',
  SM: 'EUR',
  TF: 'EUR',
  VA: 'EUR',
  YT: 'EUR'
}

export const getFiatCurrencyFromCountry = (countryCode: string) =>
  countryToCurrencyMap[countryCode] || 'USD'
