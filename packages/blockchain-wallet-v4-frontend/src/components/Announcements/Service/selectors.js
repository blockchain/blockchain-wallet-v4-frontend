import { keys, prop } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.core.walletOptions.getAnnouncements,
    selectors.cache.getLastAnnouncementState,
    selectors.preferences.getLanguage,
    (state, { alertArea }) => alertArea
  ],
  (announcementsR, announcementCached, language, alertArea) => {
    const announcements = announcementsR.getOrElse({})
    const announcement = prop(alertArea, announcements)
    if (keys(announcement).length) {
      const announcement = announcements[alertArea]
      const cachedState =
        announcementCached && announcementCached[announcement.id]

      return {
        announcements: announcements,
        collapsed: cachedState && cachedState.collapsed,
        language: language,
        showAnnounce: !(cachedState && cachedState.dismissed)
      }
    } else {
      return { announcements: {} }
    }
  }
)
