import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { length, lift, prop } from 'ramda'
import { filterAnnouncements } from 'services/WhatsNewService/WhatsNewContent'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getTrayOpened,
    selectors.components.layoutWallet.getTrayContent,
    selectors.core.kvStore.whatsNew.getLastViewed,
    selectors.core.settings.getCountryCode,
    selectors.modules.profile.getUserKYCState,
    selectors.core.kvStore.whatsNew.getState
  ],
  (opened, content, lastViewedR, countryR, kycStateR, whatsNewKvStoreR) => {
    const transform = (lastViewed, country, kycState, whatsNewKvStore) => {
      const highlighted = opened && content === 'whatsnew'
      const announcements = filterAnnouncements(
        lastViewed,
        country,
        kycState,
        whatsNewKvStore
      )
      return {
        highlighted,
        numOfNewAnnouncements: length(announcements.filter(prop('alert')))
      }
    }
    return lift(transform)(lastViewedR, countryR, kycStateR, whatsNewKvStoreR)
  }
)
