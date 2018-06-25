import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.core.walletOptions.getAnnouncements, selectors.preferences.getLanguage],
  (announcements, language) => {
    return {
      announcements: announcements.getOrElse([]),
      language: language
    }
  }
)
