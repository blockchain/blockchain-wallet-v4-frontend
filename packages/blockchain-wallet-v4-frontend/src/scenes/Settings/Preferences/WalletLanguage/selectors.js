import { createDeepEqualSelector } from 'services/misc'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.preferences.getLanguage],
  language => {
    const locale = language || 'en'
    return { locale }
  }
)
