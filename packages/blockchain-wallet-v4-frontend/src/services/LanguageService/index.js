import Maybe from 'data.maybe'
import { isNil, find, propEq, sortBy, prop } from 'ramda'

const languages = [
  { cultureCode: 'de-DE', language: 'de', name: 'German' },
  { cultureCode: 'hi-IN', language: 'hi', name: 'Hindi' },
  { cultureCode: 'nn-NO', language: 'nn', name: 'Norwegian' },
  { language: 'ru', name: 'Russian' },
  { cultureCode: 'pt-PT', language: 'pt', name: 'Portuguese' },
  { cultureCode: 'bg-BG', language: 'bg', name: 'Bulgarian' },
  { cultureCode: 'fr-FR', language: 'fr', name: 'French' },
  { cultureCode: 'zh-CN', language: 'zh', name: 'Chinese (simplified)' },
  { cultureCode: 'hu-HU', language: 'hu', name: 'Hungarian' },
  { language: 'sl', name: 'Slovenian' },
  { cultureCode: 'id-ID', language: 'id', name: 'Indonesian' },
  { language: 'sv', name: 'Swedish' },
  { cultureCode: 'ko-KR', language: 'ko', name: 'Korean' },
  { cultureCode: 'el-GR', language: 'el', name: 'Greek' },
  { cultureCode: 'en-GB', language: 'en', name: 'English' },
  { cultureCode: 'it-IT', language: 'it', name: 'Italian' },
  { cultureCode: 'es-ES', language: 'es', name: 'Spanish' },
  { language: 'vi', name: 'Vietnamese' },
  { language: 'th', name: 'Thai' },
  { cultureCode: 'ja-JP', language: 'ja', name: 'Japanese' },
  { cultureCode: 'pl-PL', language: 'pl', name: 'Polish' },
  { cultureCode: 'da-DK', language: 'da', name: 'Danish' },
  { language: 'ro', name: 'Romanian' },
  { cultureCode: 'nl-NL', language: 'nl', name: 'Dutch' },
  { language: 'tr', name: 'Turkish' }
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

export {
  languages,
  languagesSortedByName,
  getLanguageName,
  convertCultureCodeToLanguage,
  convertLanguageToCultureCode
}
