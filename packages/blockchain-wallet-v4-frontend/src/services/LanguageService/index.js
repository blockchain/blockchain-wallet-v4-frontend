import Maybe from 'data.maybe'
import { isNil, find, findIndex, propEq, sortBy, prop } from 'ramda'

const languages = [
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

const languagesSortedByName = sortBy(prop('name'))(languages)

function getLanguageName (cultureCode) {
  let selectedLanguage = find(propEq('cultureCode', cultureCode))(languages)
  if (isNil(selectedLanguage)) return Maybe.Nothing()

  return Maybe.Just(selectedLanguage.name)
}

function convertLanguageToCultureCode (language) {
  let selectedLanguage = find(propEq('language', language))(languages)
  if (isNil(selectedLanguage)) return Maybe.Nothing()

  return Maybe.Just(selectedLanguage.cultureCode)
}

function convertCultureCodeToLanguage (cultureCode) {
  let selectedLanguage = find(propEq('cultureCode', cultureCode))(languages)
  if (isNil(selectedLanguage)) return Maybe.Nothing()

  return Maybe.Just(selectedLanguage.language)
}

// update url with new language without forcing browser reload
function addLanguageToUrl (language) {
  window.history.pushState({}, '', `/${language}/${window.location.hash}`)
}

function tryParseLanguageFromUrl () {
  const path = window.location.pathname.replace(/\//g, '')

  if (path && path.length) {
    return languages[findIndex(propEq('language', path))(languages)]
  }
}

export {
  addLanguageToUrl,
  convertCultureCodeToLanguage,
  convertLanguageToCultureCode,
  getLanguageName,
  languages,
  languagesSortedByName,
  tryParseLanguageFromUrl
}
