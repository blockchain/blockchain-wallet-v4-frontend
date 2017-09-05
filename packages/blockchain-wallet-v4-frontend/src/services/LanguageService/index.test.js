import { getLanguageName, convertCultureCodeToLanguage, convertLanguageToCultureCode } from './index.js'
import Maybe from 'data.maybe'

describe('getLanguageName', () => {
  var testCases = [
    { cultureCode: 'en-GB', value: Maybe.Just('English') },
    { cultureCode: 'fr-FR', value: Maybe.Just('French') },
    { cultureCode: 'fr', value: Maybe.Nothing() },
    { cultureCode: '', value: Maybe.Nothing() },
    { cultureCode: null, value: Maybe.Nothing() }
  ]

  testCases.forEach(function (testCase) {
    test('Get the correct language name related to a specific culture code', () => {
      expect(getLanguageName(testCase.cultureCode)).toEqual(testCase.value)
    })
  })
})

describe('convertLanguageToCultureCode', () => {
  var testCases = [
    { language: 'en', value: Maybe.Just('en-GB') },
    { language: 'fr', value: Maybe.Just('fr-FR') },
    { language: 'fr-FR', value: Maybe.Nothing() },
    { language: '', value: Maybe.Nothing() },
    { language: null, value: Maybe.Nothing() }
  ]

  testCases.forEach(function (testCase) {
    test('Convert the culture code to the right language name', () => {
      expect(convertLanguageToCultureCode(testCase.language)).toEqual(testCase.value)
    })
  })
})

describe('convertCultureCodeToLanguage', () => {
  var testCases = [
    { cultureCode: 'en-GB', value: Maybe.Just('en') },
    { cultureCode: 'fr-FR', value: Maybe.Just('fr') },
    { cultureCode: 'fr', value: Maybe.Nothing() },
    { cultureCode: '', value: Maybe.Nothing() },
    { cultureCode: null, value: Maybe.Nothing() }
  ]

  testCases.forEach(function (testCase) {
    test('Convert the language to the right culture code', () => {
      expect(convertCultureCodeToLanguage(testCase.cultureCode)).toEqual(testCase.value)
    })
  })
})
