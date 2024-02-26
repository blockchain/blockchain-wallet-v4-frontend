import { createDeepEqualSelector } from '@core/utils'
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
    const announcement = announcements[alertArea] ?? {}
    if (Object.keys(announcement).length) {
      const cachedState = announcementCached?.[announcement.id]
      const showAnnouncement = announcement.coin
        ? announcement?.coin?.includes(currentCoin)
        : !cachedState?.dismissed
      return {
        announcements,
        collapsed: !!cachedState?.collapsed,
        language,
        showAnnouncement
      }
    }
    return { announcements: {} }
  }
)
