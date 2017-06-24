import { addLocaleData } from 'react-intl'
import { map, assoc, flatten, forEach } from 'ramda'
import * as languageService from 'services/languageService'

const importLocaleData = (language) => require(`react-intl/locale-data/${language}`)

const importTranslation = (language) => require(`locales/${language}`)

// const appendToMessages = (key, value, messages) => { return assoc(key, value, messages) }

function configureLocales (store) {
  // We add the locale data for each language
  console.log(flatten(map(x => importLocaleData(x.language), languageService.languages)))
  addLocaleData(flatten(map(x => importLocaleData(x.language), languageService.languages)))

  // We get all the messages
  let messages = {}
  forEach(function (x) {
    messages = assoc(x.language, importTranslation(x.language), messages)
  }, languageService.languages)

  return { messages }
}

export default configureLocales
