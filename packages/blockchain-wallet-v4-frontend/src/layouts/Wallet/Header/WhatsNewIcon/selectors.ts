import { createDeepEqualSelector } from 'services/ReselectHelper'
import { filterAnnouncements } from '../../../../modals/WhatsNew/selectors'
import { length, lift, prop } from 'ramda'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.kvStore.whatsNew.getLastViewed,
    selectors.core.settings.getCountryCode,
    selectors.modules.profile.getUserKYCState,
    selectors.core.kvStore.whatsNew.getState
  ],
  (lastViewedR, countryR, kycStateR, whatsNewKvStoreR) => {
    const transform = (lastViewed, country, kycState, whatsNewKvStore) => {
      const announcements = filterAnnouncements(
        lastViewed,
        country,
        kycState,
        whatsNewKvStore
      )
      return {
        numOfNewAnnouncements: length(announcements.filter(prop('alert')))
      }
    }
    return lift(transform)(lastViewedR, countryR, kycStateR, whatsNewKvStoreR)
  }
)
