import { find, propEq } from 'ramda'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { languages, loadLocaleData } from 'services/LocalesService'

export const getData = createDeepEqualSelector(
  [selectors.preferences.getLanguage],
  language => {
    const hasLang = propEq('language', language)
    const locale = find(hasLang, languages) ? language : 'en'
    loadLocaleData(locale)
    return {
      locale,
      key: locale,
      messages: window.i18nMessages
    }
  }
)
