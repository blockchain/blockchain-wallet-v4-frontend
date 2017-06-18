import { translate } from './translationService.js'
import Maybe from 'data.maybe'

var testCases = [
  { translationKey: 'CUSTOMIZE', language: 'en', data: null, value: Maybe.Just("Customize") },
  { translationKey: 'CUSTOMIZE', language: 'fr', data: null, value: Maybe.Just("Personnaliser") },
  { translationKey: 'FAQ_QUESTIONS.WALLET_SAFETY.Q', language: 'fr', data: null, value: Maybe.Just("De quoi ai-je besoin pour garder mon portefeuille en sécurité ?") },
  { translationKey: 'THANK_YOU_FOR_JOINING', language: 'en', data: { '{{count}}' : '10' } , value: Maybe.Just("Welcome! Thank you for joining over 10 million Blockchain wallet users.") },
  { translationKey: 'SOME_FAKE_VALUE', language: 'en', value: Maybe.Nothing() }
]

testCases.forEach(function (testCase) {
  test('Translate a value', () => {
    expect(translate(testCase.translationKey, testCase.language, testCase.data)).toEqual(testCase.value)
  })
})
