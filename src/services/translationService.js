import Maybe from 'data.maybe'
import { path, isNil, replace, forEachObjIndexed } from 'ramda'
import translationEn from 'locales/en-human.json'
import translationFr from 'locales/fr-human.json'

function translate (translationKey, language, data) {
  let translationFile
  switch (language) {
      case 'en': { translationFile = translationEn } break
      case 'fr': { translationFile = translationFr } break
      default: return Maybe.Nothing()
  }

  let translation = path(translationKey.split('.'), translationFile)
  if(isNil(translation)) return Maybe.Nothing()

  forEachObjIndexed((value, key) => { translation = translation.replace(key, value) }, data)

  return Maybe.Just(translation)
}

export {
  translate
}
