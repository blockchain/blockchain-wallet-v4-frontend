import { keys, prop } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = (state, ownProps) =>
  createDeepEqualSelector(
    [
      selectors.core.walletOptions.getAnnouncements,
      selectors.cache.getLastAnnouncementState,
      selectors.preferences.getLanguage
    ],
    (announcementsR, announcementCachedState, language) => {
      const announcements = announcementsR.getOrElse({})
      const announcement = prop(ownProps.alertArea, announcements)
      if (keys(announcement).length) {
        const announcement = announcements[ownProps.alertArea]
        const cachedState =
          announcementCachedState && announcementCachedState[announcement.id]

        return {
          announcements: announcements,
          collapsed:
            cachedState && cachedState.collapsed
              ? cachedState.collapsed
              : false,
          language: language,
          visible:
            cachedState && cachedState.dismissed ? !cachedState.dismissed : true
        }
      } else {
        return null
      }
    }
  )(state, ownProps)
