import Maybe from 'data.maybe'
import { isNil, find, propEq, sortBy, prop } from 'ramda'

const languages = [
  { cultureCode: 'bg-BG', language: 'bg', name: 'Bulgarian' },
  { cultureCode: 'da-DK', language: 'da', name: 'Danish' },
  { cultureCode: 'de-DE', language: 'de', name: 'German' },
  { cultureCode: 'el-GR', language: 'el', name: 'Greek' },
  { cultureCode: 'en-GB', language: 'en', name: 'English' },
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

function convertLanguageToLanguageName (language) {
  let selectedLanguage = find(propEq('language', language))(languages)
  if (isNil(selectedLanguage)) return Maybe.Nothing()

  return Maybe.Just(selectedLanguage.name)
}

export {
  languages,
  languagesSortedByName,
  getLanguageName,
  convertCultureCodeToLanguage,
  convertLanguageToCultureCode,
  convertLanguageToLanguageName
}
