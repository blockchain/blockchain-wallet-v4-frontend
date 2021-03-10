import { addLocaleData } from 'react-intl'
import Maybe from 'data.maybe'
import moment from 'moment'
import { find, findIndex, isNil, prop, propEq, sortBy, toUpper } from 'ramda'

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
  let selectedLanguage = find(propEq('cultureCode', cultureCode))(languages)
  if (isNil(selectedLanguage)) return Maybe.Nothing()

  return Maybe.Just(selectedLanguage.name)
}

export function convertLanguageToCultureCode(language) {
  let selectedLanguage = find(propEq('language', language))(languages)
  if (isNil(selectedLanguage)) return Maybe.Nothing()

  return Maybe.Just(selectedLanguage.cultureCode)
}

export function convertCultureCodeToLanguage(cultureCode) {
  let selectedLanguage = find(propEq('cultureCode', cultureCode))(languages)
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
  const setLocaleData = (localeData, messages) => {
    addLocaleData(localeData)
    moment.locale(locale)
    callback(messages)
  }

  switch (locale) {
    case 'de':
      require.ensure(
        [
          'moment/locale/de.js',
          'react-intl/locale-data/de.js',
          '../../assets/locales/de.json'
        ],
        require => {
          require('moment/locale/de.js')
          setLocaleData(
            require('react-intl/locale-data/de.js'),
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
          'react-intl/locale-data/en.js',
          '../../assets/locales/en.json'
        ],
        require => {
          require('moment/locale/en-gb.js')
          setLocaleData(
            require('react-intl/locale-data/en.js'),
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
          'react-intl/locale-data/es.js',
          '../../assets/locales/es.json'
        ],
        require => {
          require('moment/locale/es.js')
          setLocaleData(
            require('react-intl/locale-data/es.js'),
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
          'react-intl/locale-data/fr.js',
          '../../assets/locales/fr.json'
        ],
        require => {
          require('moment/locale/fr.js')
          setLocaleData(
            require('react-intl/locale-data/fr.js'),
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
          'react-intl/locale-data/it.js',
          '../../assets/locales/it.json'
        ],
        require => {
          require('moment/locale/it.js')
          setLocaleData(
            require('react-intl/locale-data/it.js'),
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
          'react-intl/locale-data/pt.js',
          '../../assets/locales/pt.json'
        ],
        require => {
          require('moment/locale/pt.js')
          setLocaleData(
            require('react-intl/locale-data/pt.js'),
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
          'react-intl/locale-data/ru.js',
          '../../assets/locales/ru.json'
        ],
        require => {
          require('moment/locale/ru.js')
          setLocaleData(
            require('react-intl/locale-data/ru.js'),
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
          'react-intl/locale-data/tr.js',
          '../../assets/locales/tr.json'
        ],
        require => {
          require('moment/locale/tr.js')
          setLocaleData(
            require('react-intl/locale-data/tr.js'),
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
          'react-intl/locale-data/en.js',
          '../../assets/locales/en.json'
        ],
        require => {
          require('moment/locale/en-gb.js')
          setLocaleData(
            require('react-intl/locale-data/en.js'),
            require('../../assets/locales/en.json')
          )
        },
        'i18n-en'
      )
      break
  }
}

const stateList = {
  AL: 'Alabama',
  AK: 'Alaska',
  AS: 'American Samoa',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District Of Columbia',
  FM: 'Federated States Of Micronesia',
  FL: 'Florida',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MH: 'Marshall Islands',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  MP: 'Northern Mariana Islands',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PW: 'Palau',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VI: 'Virgin Islands',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming'
}

export const getStateNameFromAbbreviation = abbreviation => {
  return abbreviation && stateList[toUpper(abbreviation)]
    ? stateList[toUpper(abbreviation)]
    : abbreviation
}
