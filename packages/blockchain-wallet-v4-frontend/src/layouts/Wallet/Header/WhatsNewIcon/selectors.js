import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { lift, prop } from 'ramda'
import { filterAnnouncements } from 'services/WhatsNewService/WhatsNewContent'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getTrayOpened,
    selectors.components.layoutWallet.getTrayContent,
    selectors.core.kvStore.whatsNew.getLastViewed,
    selectors.core.settings.getCountryCode,
    selectors.modules.profile.getUserKYCState
  ],
  (opened, content, lastViewedR, countryR, kycStateR) => {
    const transform = (lastViewed, country, kycState) => {
      const highlighted = opened && content === 'whatsnew'
      const latestAnnouncements = filterAnnouncements(lastViewed, country, kycState)
      return {
        highlighted,
        numOfNewAnnouncements: prop('length', latestAnnouncements)
      }
    }
    return lift(transform)(lastViewedR, countryR, kycStateR)
  }
)
