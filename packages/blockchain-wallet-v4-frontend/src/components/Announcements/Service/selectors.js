import { includes, keys, prop } from 'ramda'

import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.walletOptions.getAnnouncements,
    selectors.cache.getLastAnnouncementState,
    selectors.preferences.getLanguage,
    (state, { alertArea, currentCoin }) => ({ alertArea, currentCoin })
  ],
  (announcementsR, announcementCached, language, ownProps) => {
    const { alertArea, currentCoin } = ownProps
    const announcements = announcementsR.getOrElse({})
    const announcement = prop(alertArea, announcements)
    if (keys(announcement).length) {
      const announcement = announcements[alertArea]
      const cachedState = announcementCached && announcementCached[announcement.id]
      const showAnnouncement = prop('coins', announcement)
        ? includes(currentCoin, prop('coins', announcement))
        : !(cachedState && cachedState.dismissed)
      return {
        announcements,
        collapsed: cachedState && cachedState.collapsed,
        language,
        showAnnouncement
      }
    }
    return { announcements: {} }
  }
)
