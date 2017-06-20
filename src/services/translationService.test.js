import { translate, getLanguageName, convertCultureCodeToLanguage, convertLanguageToCultureCode } from './translationService.js'
import Maybe from 'data.maybe'

describe('translate', () => {
  var testCases = [
    { translationKey: 'CUSTOMIZE', language: 'en-GB', data: null, value: Maybe.Just('Customize') },
    { translationKey: 'CUSTOMIZE', language: 'fr-FR', data: null, value: Maybe.Just('Personnaliser') },
    { translationKey: 'FAQ_QUESTIONS.WALLET_SAFETY.Q', language: 'fr-FR', data: null, value: Maybe.Just('De quoi ai-je besoin pour garder mon portefeuille en sécurité ?') },
    { translationKey: 'THANK_YOU_FOR_JOINING', language: 'en-GB', data: { '{{count}}': '10' }, value: Maybe.Just('Welcome! Thank you for joining over 10 million Blockchain wallet users.') },
    { translationKey: 'SOME_FAKE_VALUE', language: 'en-GB', value: Maybe.Nothing() }
  ]

  testCases.forEach(function (testCase) {
    test('Translate a value', () => {
      expect(translate(testCase.translationKey, testCase.language, testCase.data)).toEqual(testCase.value)
    })
  })
})

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
