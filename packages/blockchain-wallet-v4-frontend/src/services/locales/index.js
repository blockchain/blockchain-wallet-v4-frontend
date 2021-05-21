import Maybe from 'data.maybe'
import moment from 'moment'
import { find, findIndex, isNil, prop, propEq, sortBy, toUpper } from 'ramda'

import '@formatjs/intl-relativetimeformat/polyfill'

export const languages = [
  { cultureCode: 'de-DE', language: 'de', name: 'German' },
  { cultureCode: 'en-GB', language: 'en', name: 'English' },
  { cultureCode: 'es-ES', language: 'es', name: 'Spanish' },
  { cultureCode: 'fr-FR', language: 'fr', name: 'French' },
  { cultureCode: 'it-IT', language: 'it', name: 'Italian' },
  { cultureCode: 'pt-PT', language: 'pt', name: 'Portuguese' },
  { cultureCode: 'ru-RU', language: 'ru', name: 'Russian' },
  { cultureCode: 'tr-TR', language: 'tr', name: 'Turkish' }
]

export const languagesSortedByName = sortBy(prop('name'))(languages)

export function getLanguageName(cultureCode) {
  const selectedLanguage = find(propEq('cultureCode', cultureCode))(languages)
  if (isNil(selectedLanguage)) return Maybe.Nothing()

  return Maybe.Just(selectedLanguage.name)
}

export function convertLanguageToCultureCode(language) {
  const selectedLanguage = find(propEq('language', language))(languages)
  if (isNil(selectedLanguage)) return Maybe.Nothing()

  return Maybe.Just(selectedLanguage.cultureCode)
}

export function convertCultureCodeToLanguage(cultureCode) {
  const selectedLanguage = find(propEq('cultureCode', cultureCode))(languages)
  if (isNil(selectedLanguage)) return Maybe.Nothing()

  return Maybe.Just(selectedLanguage.language)
}

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
    moment.locale(locale)
    callback(messages)
  }

  switch (locale) {
    case 'de':
      require.ensure(
        [
          'moment/locale/de.js',
          '@formatjs/intl-relativetimeformat/locale-data/de.js',
          '../../assets/locales/de.json'
        ],
        (require) => {
          require('moment/locale/de.js')
          setLocaleData(
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('../../assets/locales/de.json')
          )
        },
        'i18n-de'
      )
      break
    case 'en':
      require.ensure(
        [
          'moment/locale/en-gb.js',
          '@formatjs/intl-relativetimeformat/locale-data/en.js',
          '../../assets/locales/en.json'
        ],
        (require) => {
          require('moment/locale/en-gb.js')
          setLocaleData(
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('../../assets/locales/en.json')
          )
        },
        'i18n-en'
      )
      break
    case 'es':
      require.ensure(
        [
          'moment/locale/es.js',
          '@formatjs/intl-relativetimeformat/locale-data/es.js',
          '../../assets/locales/es.json'
        ],
        (require) => {
          require('moment/locale/es.js')
          setLocaleData(
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('../../assets/locales/es.json')
          )
        },
        'i18n-es'
      )
      break
    case 'fr':
      require.ensure(
        [
          'moment/locale/fr.js',
          '@formatjs/intl-relativetimeformat/locale-data/fr.js',
          '../../assets/locales/fr.json'
        ],
        (require) => {
          require('moment/locale/fr.js')
          setLocaleData(
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('../../assets/locales/fr.json')
          )
        },
        'i18n-fr'
      )
      break
    case 'it':
      require.ensure(
        [
          'moment/locale/it.js',
          '@formatjs/intl-relativetimeformat/locale-data/it.js',
          '../../assets/locales/it.json'
        ],
        (require) => {
          require('moment/locale/it.js')
          setLocaleData(
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('../../assets/locales/it.json')
          )
        },
        'i18n-it'
      )
      break
    case 'pt':
      require.ensure(
        [
          'moment/locale/pt.js',
          '@formatjs/intl-relativetimeformat/locale-data/pt.js',
          '../../assets/locales/pt.json'
        ],
        (require) => {
          require('moment/locale/pt.js')
          setLocaleData(
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('../../assets/locales/pt.json')
          )
        },
        'i18n-pt'
      )
      break
    case 'ru':
      require.ensure(
        [
          'moment/locale/ru.js',
          '@formatjs/intl-relativetimeformat/locale-data/ru.js',
          '../../assets/locales/ru.json'
        ],
        (require) => {
          require('moment/locale/ru.js')
          setLocaleData(
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('../../assets/locales/ru.json')
          )
        },
        'i18n-ru'
      )
      break
    case 'tr':
      require.ensure(
        [
          'moment/locale/tr.js',
          '@formatjs/intl-relativetimeformat/locale-data/tr.js',
          '../../assets/locales/tr.json'
        ],
        (require) => {
          require('moment/locale/tr.js')
          setLocaleData(
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('../../assets/locales/tr.json')
          )
        },
        'i18n-tr'
      )
      break
    default:
      require.ensure(
        [
          'moment/locale/en-gb.js',
          '@formatjs/intl-relativetimeformat/locale-data/en.js',
          '../../assets/locales/en.json'
        ],
        (require) => {
          require('moment/locale/en-gb.js')
          setLocaleData(
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('../../assets/locales/en.json')
          )
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
