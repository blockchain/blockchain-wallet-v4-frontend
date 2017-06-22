import Maybe from 'data.maybe'
import { path, isNil, forEachObjIndexed, find, propEq, sortBy, prop, map } from 'ramda'

const languages = [
  { cultureCode: 'bg-BG', language: 'bg', name: 'Bulgarian' },
  { cultureCode: 'cs-CZ', language: 'cs', name: 'Czech' },
  { cultureCode: 'da-DK', language: 'da', name: 'Danish' },
  { cultureCode: 'de-DE', language: 'de', name: 'German' },
  { cultureCode: 'el-GR', language: 'el', name: 'Greek' },
  { cultureCode: 'en-GB', language: 'en', name: 'English' },
  { cultureCode: 'es-ES', language: 'es', name: 'Spanish' },
  { cultureCode: 'fr-FR', language: 'fr', name: 'French' },
  { cultureCode: 'hi-IN', language: 'hi', name: 'Hindi' },
  { cultureCode: 'hu-HU', language: 'hu', name: 'Hungarian' },
  { cultureCode: 'id-ID', language: 'id', name: 'Indonesian' },
  { cultureCode: 'it-IT', language: 'it', name: 'Italian' },
  { cultureCode: 'ja-JP', language: 'ja', name: 'Japanese' },
  { cultureCode: 'ko-KR', language: 'ko', name: 'Korean' },
  { cultureCode: 'nl-NL', language: 'nl', name: 'Dutch' },
  { cultureCode: 'nn-NO', language: 'nn', name: 'Norwegian' },
  { cultureCode: 'pl-PL', language: 'pl', name: 'Polish' },
  { cultureCode: 'pt-PT', language: 'pt', name: 'Portuguese' },
  { cultureCode: 'ro-RO', language: 'ro', name: 'Romanian' },
  { cultureCode: 'ru-RU', language: 'ru', name: 'Russian' },
  { cultureCode: 'sl-SL', language: 'sl', name: 'Slovenian' },
  { cultureCode: 'sv-SE', language: 'sv', name: 'Swedish' },
  { cultureCode: 'th-TH', language: 'th', name: 'Thai' },
  { cultureCode: 'tr-TR', language: 'tr', name: 'Turkish' },
  { cultureCode: 'uk-UA', language: 'uk', name: 'Ukrainian' },
  { cultureCode: 'vi-VN', language: 'vi', name: 'Vietnamese' },
  { cultureCode: 'zh-CN', language: 'zh', name: 'Chinese (simplified)' }
]

const languagesSortedByName = sortBy(prop('name'))(languages)

function translate (translationKey, cultureCode, data) {
  let translation = path(translationKey.split('.'), require('locales/' + cultureCode + '.json'))

  // if (isNil(translation)) return Maybe.Nothing()
  // Fallback english if the translation does not exist
  if (isNil(translation)) translation = path(translationKey.split('.'), require('locales/en-GB.json'))

  forEachObjIndexed((value, key) => { translation = translation.replace(key, value) }, data)

  return Maybe.Just(translation)
}

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

export {
  languages,
  languagesSortedByName,
  translate,
  getLanguageName,
  convertCultureCodeToLanguage,
  convertLanguageToCultureCode
}
