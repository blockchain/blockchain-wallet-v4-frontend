import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.preferences.getLanguage],
  language => {
    const locale = language || 'en'
    return { locale }
  }
)
