import { addLocaleData } from 'react-intl'
import moment from 'moment'
import { find, findIndex, isNil, prop, propEq, sortBy, toUpper } from 'ramda'
import Maybe from 'data.maybe'

export const languages = [
  { cultureCode: 'cs-CZ', language: 'cs', name: 'Czech' },
  { cultureCode: 'de-DE', language: 'de', name: 'German' },
  { cultureCode: 'en-GB', language: 'en', name: 'English' },
  { cultureCode: 'es-ES', language: 'es', name: 'Spanish' },
  { cultureCode: 'fr-FR', language: 'fr', name: 'French' },
  { cultureCode: 'id-ID', language: 'id', name: 'Indonesian' },
  { cultureCode: 'it-IT', language: 'it', name: 'Italian' },
  { cultureCode: 'ja-JP', language: 'ja', name: 'Japanese' },
  { cultureCode: 'ko-KR', language: 'ko', name: 'Korean' },
  { cultureCode: 'ms-MY', language: 'ms', name: 'Malay' },
  { cultureCode: 'nl-NL', language: 'nl', name: 'Dutch' },
  { cultureCode: 'pl-PL', language: 'pl', name: 'Polish' },
  { cultureCode: 'pt-PT', language: 'pt', name: 'Portuguese' },
  { cultureCode: 'ro-RO', language: 'ro', name: 'Romanian' },
  { cultureCode: 'ru-RU', language: 'ru', name: 'Russian' },
  { cultureCode: 'sv-SE', language: 'sv', name: 'Swedish' },
  { cultureCode: 'th-TH', language: 'th', name: 'Thai' },
  { cultureCode: 'tr-TR', language: 'tr', name: 'Turkish' },
  { cultureCode: 'vi-VN', language: 'vi', name: 'Vietnamese' },
  { cultureCode: 'uk-UA', language: 'uk', name: 'Ukraine' },
  { cultureCode: 'zh-CN', language: 'zh', name: 'Chinese (simplified)' }
]

export const languagesSortedByName = sortBy(prop('name'))(languages)

export function getLanguageName (cultureCode) {
  let selectedLanguage = find(propEq('cultureCode', cultureCode))(languages)
  if (isNil(selectedLanguage)) return Maybe.Nothing()

  return Maybe.Just(selectedLanguage.name)
}

export function convertLanguageToCultureCode (language) {
  let selectedLanguage = find(propEq('language', language))(languages)
  if (isNil(selectedLanguage)) return Maybe.Nothing()

  return Maybe.Just(selectedLanguage.cultureCode)
}

export function convertCultureCodeToLanguage (cultureCode) {
  let selectedLanguage = find(propEq('cultureCode', cultureCode))(languages)
  if (isNil(selectedLanguage)) return Maybe.Nothing()

  return Maybe.Just(selectedLanguage.language)
}

export function tryParseLanguageFromUrl ({ pathname }) {
  const path = pathname.replace(/\//g, '')

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
    case 'cs':
      require.ensure(
        [
          'moment/locale/cs.js',
          'react-intl/locale-data/cs.js',
          '../../assets/locales/cs.json'
        ],
        require => {
          require('moment/locale/cs.js')
          setLocaleData(
            require('react-intl/locale-data/cs.js'),
            require('../../assets/locales/cs.json')
          )
        },
        'i18n-cs'
      )
      break
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
    case 'id':
      require.ensure(
        [
          'moment/locale/id.js',
          'react-intl/locale-data/id.js',
          '../../assets/locales/id.json'
        ],
        require => {
          require('moment/locale/id.js')
          setLocaleData(
            require('react-intl/locale-data/id.js'),
            require('../../assets/locales/id.json')
          )
        },
        'i18n-id'
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
    case 'ja':
      require.ensure(
        [
          'moment/locale/ja.js',
          'react-intl/locale-data/ja.js',
          '../../assets/locales/ja.json'
        ],
        require => {
          require('moment/locale/ja.js')
          setLocaleData(
            require('react-intl/locale-data/ja.js'),
            require('../../assets/locales/ja.json')
          )
        },
        'i18n-ja'
      )
      break
    case 'ko':
      require.ensure(
        [
          'moment/locale/ko.js',
          'react-intl/locale-data/ko.js',
          '../../assets/locales/ko.json'
        ],
        require => {
          require('moment/locale/ko.js')
          setLocaleData(
            require('react-intl/locale-data/ko.js'),
            require('../../assets/locales/ko.json')
          )
        },
        'i18n-ko'
      )
      break
    case 'ms':
      require.ensure(
        [
          'moment/locale/ms.js',
          'react-intl/locale-data/ms.js',
          '../../assets/locales/ms.json'
        ],
        require => {
          require('moment/locale/ms.js')
          setLocaleData(
            require('react-intl/locale-data/ms.js'),
            require('../../assets/locales/ms.json')
          )
        },
        'i18n-ms'
      )
      break
    case 'nl':
      require.ensure(
        [
          'moment/locale/nl.js',
          'react-intl/locale-data/nl.js',
          '../../assets/locales/nl.json'
        ],
        require => {
          require('moment/locale/nl.js')
          setLocaleData(
            require('react-intl/locale-data/nl.js'),
            require('../../assets/locales/nl.json')
          )
        },
        'i18n-nl'
      )
      break
    case 'pl':
      require.ensure(
        [
          'moment/locale/pl.js',
          'react-intl/locale-data/pl.js',
          '../../assets/locales/pl.json'
        ],
        require => {
          require('moment/locale/pl.js')
          setLocaleData(
            require('react-intl/locale-data/pl.js'),
            require('../../assets/locales/pl.json')
          )
        },
        'i18n-pl'
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
    case 'ro':
      require.ensure(
        [
          'moment/locale/ro.js',
          'react-intl/locale-data/ro.js',
          '../../assets/locales/ro.json'
        ],
        require => {
          require('moment/locale/ro.js')
          setLocaleData(
            require('react-intl/locale-data/ro.js'),
            require('../../assets/locales/ro.json')
          )
        },
        'i18n-ro'
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
    case 'sv':
      require.ensure(
        [
          'moment/locale/sv.js',
          'react-intl/locale-data/sv.js',
          '../../assets/locales/sv.json'
        ],
        require => {
          require('moment/locale/sv.js')
          setLocaleData(
            require('react-intl/locale-data/sv.js'),
            require('../../assets/locales/sv.json')
          )
        },
        'i18n-sv'
      )
      break
    case 'th':
      require.ensure(
        [
          'moment/locale/th.js',
          'react-intl/locale-data/th.js',
          '../../assets/locales/th.json'
        ],
        require => {
          require('moment/locale/th.js')
          setLocaleData(
            require('react-intl/locale-data/th.js'),
            require('../../assets/locales/th.json')
          )
        },
        'i18n-th'
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
    case 'uk':
      require.ensure(
        [
          'moment/locale/uk.js',
          'react-intl/locale-data/uk.js',
          '../../assets/locales/uk.json'
        ],
        require => {
          require('moment/locale/uk.js')
          setLocaleData(
            require('react-intl/locale-data/uk.js'),
            require('../../assets/locales/uk.json')
          )
        },
        'i18n-uk'
      )
      break
    case 'vi':
      require.ensure(
        [
          'moment/locale/vi.js',
          'react-intl/locale-data/vi.js',
          '../../assets/locales/vi.json'
        ],
        require => {
          require('moment/locale/vi.js')
          setLocaleData(
            require('react-intl/locale-data/vi.js'),
            require('../../assets/locales/vi.json')
          )
        },
        'i18n-vi'
      )
      break
    case 'zh':
      require.ensure(
        [
          'moment/locale/zh-cn.js',
          'react-intl/locale-data/zh.js',
          '../../assets/locales/zh.json'
        ],
        require => {
          require('moment/locale/zh-cn.js')
          setLocaleData(
            require('react-intl/locale-data/zh.js'),
            require('../../assets/locales/zh.json')
          )
        },
        'i18n-zh'
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

export const getStateNameFromAbbreviation = a =>
  stateList[toUpper(a)] ? stateList[toUpper(a)] : '????'
