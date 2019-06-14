import { addLocaleData } from 'react-intl'
import {
  find,
  findIndex,
  flatten,
  isNil,
  map,
  prop,
  propEq,
  sortBy
} from 'ramda'
import Maybe from 'data.maybe'

import localesCS from 'assets/locales/cs.json'
import localesDE from 'assets/locales/de.json'
import localesEN from 'assets/locales/en.json'
import localesES from 'assets/locales/es.json'
import localesFR from 'assets/locales/fr.json'
import localesID from 'assets/locales/id.json'
import localesIT from 'assets/locales/it.json'
import localesJA from 'assets/locales/ja.json'
import localesKO from 'assets/locales/ko.json'
import localesMS from 'assets/locales/ms.json'
import localesNL from 'assets/locales/nl.json'
import localesPL from 'assets/locales/pl.json'
import localesPT from 'assets/locales/pt.json'
import localesRO from 'assets/locales/ro.json'
import localesRU from 'assets/locales/ru.json'
import localesSV from 'assets/locales/sv.json'
import localesTH from 'assets/locales/th.json'
import localesTR from 'assets/locales/tr.json'
import localesVI from 'assets/locales/vi.json'
import localesUK from 'assets/locales/uk.json'
import localesZH from 'assets/locales/zh.json'

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

const importLocaleData = language =>
  require(`react-intl/locale-data/${language}`)

export function configureLocales () {
  // We add the locale data for each language
  addLocaleData(flatten(map(x => importLocaleData(x.language), languages)))

  // We get all the messages
  const messages = {
    cs: localesCS,
    de: localesDE,
    en: localesEN,
    es: localesES,
    fr: localesFR,
    id: localesID,
    it: localesIT,
    ja: localesJA,
    ko: localesKO,
    ms: localesMS,
    nl: localesNL,
    pl: localesPL,
    pt: localesPT,
    ro: localesRO,
    ru: localesRU,
    sv: localesSV,
    th: localesTH,
    tr: localesTR,
    vi: localesVI,
    uk: localesUK,
    zh: localesZH
  }

  return { messages }
}

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

// update url with new language without forcing browser reload
export function addLanguageToUrl (language) {
  window.history.pushState({}, '', `/${language}/${window.location.hash}`)
}

export function tryParseLanguageFromUrl () {
  const path = window.location.pathname.replace(/\//g, '')

  if (path && path.length) {
    return languages[findIndex(propEq('language', path))(languages)]
  }
}
