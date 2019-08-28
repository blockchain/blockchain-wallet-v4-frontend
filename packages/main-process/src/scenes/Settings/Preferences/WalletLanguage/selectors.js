import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.preferences.getLanguage],
  language => {
    const locale = language || 'en'
    return { locale }
  }
)
