import { getLanguageName, convertCultureCodeToLanguage, convertLanguageToCultureCode } from './index.js'
import Maybe from 'data.maybe'

describe('getLanguageName', () => {
  let testCases = [
    { cultureCode: 'en-GB', value: Maybe.Just('English') },
    { cultureCode: 'fr-FR', value: Maybe.Just('French') },
    { cultureCode: 'fr', value: Maybe.Nothing() },
    { cultureCode: '', value: Maybe.Nothing() },
    { cultureCode: null, value: Maybe.Nothing() }
  ]

  testCases.forEach(function (testCase) {
    test('Get correct language name from culture code: ' + testCase.cultureCode, () => {
      expect(getLanguageName(testCase.cultureCode)).toEqual(testCase.value)
    })
  })
})

describe('convertLanguageToCultureCode', () => {
  let testCases = [
    { language: 'en', value: Maybe.Just('en-GB') },
    { language: 'fr', value: Maybe.Just('fr-FR') },
    { language: 'fr-FR', value: Maybe.Nothing() },
    { language: '', value: Maybe.Nothing() },
    { language: null, value: Maybe.Nothing() }
  ]

  testCases.forEach(function (testCase) {
    test('Convert culture code to language name: ' + testCase.language, () => {
      expect(convertLanguageToCultureCode(testCase.language)).toEqual(testCase.value)
    })
  })
})

describe('convertCultureCodeToLanguage', () => {
  let testCases = [
    { cultureCode: 'en-GB', value: Maybe.Just('en') },
    { cultureCode: 'fr-FR', value: Maybe.Just('fr') },
    { cultureCode: 'fr', value: Maybe.Nothing() },
    { cultureCode: '', value: Maybe.Nothing() },
    { cultureCode: null, value: Maybe.Nothing() }
  ]

  testCases.forEach(function (testCase) {
    test('Convert language to culture code: ' + testCase.cultureCode, () => {
      expect(convertCultureCodeToLanguage(testCase.cultureCode)).toEqual(testCase.value)
    })
  })
})
