import { find, propEq } from 'ramda'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { configureLocales, languages } from 'services/LocalesService'

export const getData = createDeepEqualSelector(
  [selectors.preferences.getLanguage],
  language => {
    const { messages } = configureLocales()
    const hasLang = propEq('language', language)
    const locale = find(hasLang, languages) ? language : 'en'
    return {
      locale,
      key: locale,
      messages: messages[locale]
    }
  }
)
