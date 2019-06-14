// import configureLocales from './index.js'
//
// describe('LocalesService', () => {
//   it('should configure all locales in the store', () => {
//     let mockStore = configureLocales({})
//     expect(mockStore.messages.cs).toBeDefined()
//     expect(mockStore.messages.de).toBeDefined()
//     expect(mockStore.messages.en).toBeDefined()
//     expect(mockStore.messages.fr).toBeDefined()
//     expect(mockStore.messages.id).toBeDefined()
//     expect(mockStore.messages.it).toBeDefined()
//     expect(mockStore.messages.ja).toBeDefined()
//     expect(mockStore.messages.ko).toBeDefined()
//     expect(mockStore.messages.ms).toBeDefined()
//     expect(mockStore.messages.nl).toBeDefined()
//     expect(mockStore.messages.pl).toBeDefined()
//     expect(mockStore.messages.pt).toBeDefined()
//     expect(mockStore.messages.ro).toBeDefined()
//     expect(mockStore.messages.ru).toBeDefined()
//     expect(mockStore.messages.th).toBeDefined()
//     expect(mockStore.messages.tr).toBeDefined()
//     expect(mockStore.messages.vi).toBeDefined()
//     expect(mockStore.messages.uk).toBeDefined()
//     expect(mockStore.messages.zh).toBeDefined()
//   })
// })
//
// import {
//   getLanguageName,
//   convertCultureCodeToLanguage,
//   convertLanguageToCultureCode
// } from './index.js'
// import Maybe from 'data.maybe'
//
// describe('getLanguageName', () => {
//   let testCases = [
//     { cultureCode: 'en-GB', value: Maybe.Just('English') },
//     { cultureCode: 'fr-FR', value: Maybe.Just('French') },
//     { cultureCode: 'fr', value: Maybe.Nothing() },
//     { cultureCode: '', value: Maybe.Nothing() },
//     { cultureCode: null, value: Maybe.Nothing() }
//   ]
//
//   testCases.forEach(function (testCase) {
//     it(
//       'Get correct language name from culture code: ' + testCase.cultureCode,
//       () => {
//         expect(getLanguageName(testCase.cultureCode)).toEqual(testCase.value)
//       }
//     )
//   })
// })
//
// describe('convertLanguageToCultureCode', () => {
//   let testCases = [
//     { language: 'en', value: Maybe.Just('en-GB') },
//     { language: 'fr', value: Maybe.Just('fr-FR') },
//     { language: 'fr-FR', value: Maybe.Nothing() },
//     { language: '', value: Maybe.Nothing() },
//     { language: null, value: Maybe.Nothing() }
//   ]
//
//   testCases.forEach(function (testCase) {
//     it('Convert culture code to language name: ' + testCase.language, () => {
//       expect(convertLanguageToCultureCode(testCase.language)).toEqual(
//         testCase.value
//       )
//     })
//   })
// })
//
// describe('convertCultureCodeToLanguage', () => {
//   let testCases = [
//     { cultureCode: 'en-GB', value: Maybe.Just('en') },
//     { cultureCode: 'fr-FR', value: Maybe.Just('fr') },
//     { cultureCode: 'fr', value: Maybe.Nothing() },
//     { cultureCode: '', value: Maybe.Nothing() },
//     { cultureCode: null, value: Maybe.Nothing() }
//   ]
//
//   testCases.forEach(function (testCase) {
//     test('Convert language to culture code: ' + testCase.cultureCode, () => {
//       expect(convertCultureCodeToLanguage(testCase.cultureCode)).toEqual(
//         testCase.value
//       )
//     })
//   })
// })
