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
    (announcementsR, announcementCached, language) => {
      const announcements = announcementsR.getOrElse({})
      const announcement = prop(ownProps.alertArea, announcements)
      if (keys(announcement).length) {
        const announcement = announcements[ownProps.alertArea]
        const cachedState =
          announcementCached && announcementCached[announcement.id]
        const isCacheLoaded = announcementCached !== undefined

        return {
          announcements: announcements,
          collapsed:
            cachedState && cachedState.collapsed
              ? cachedState.collapsed
              : false,
          language: language,
          showAnnounce: !isCacheLoaded
            ? false
            : announcementCached[announcement.id]
              ? !announcementCached[announcement.id].dismissed
              : true
        }
      } else {
        return {
          announcements: {}
        }
      }
    }
  )(state, ownProps)
