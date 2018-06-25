import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = (state, ownProps) => createDeepEqualSelector(
  [
    selectors.core.walletOptions.getAnnouncements,
    selectors.cache.getLastAnnouncementState,
    selectors.preferences.getLanguage
  ],
  (announcementsR, announcementCachedState, language) => {
    const announcements = announcementsR.getOrElse({})
    const announcement = announcements[ownProps.alertArea]
    const cachedState = announcementCachedState && announcementCachedState[announcement.id]

    return {
      announcements: announcements,
      collapsed: cachedState && cachedState.collapsed ? cachedState.collapsed : false,
      language: language,
      visible: cachedState && cachedState.dismissed ? !cachedState.dismissed : true
    }
  }
)(state, ownProps)
