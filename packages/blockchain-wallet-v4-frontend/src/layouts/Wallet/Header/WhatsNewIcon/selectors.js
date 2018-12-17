import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { lift, prop } from 'ramda'
import Announcements from 'services/WhatsNewService/WhatsNewContent'
import moment from 'moment'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getTrayOpened,
    selectors.components.layoutWallet.getTrayContent,
    selectors.core.kvStore.whatsNew.getLastViewed
  ],
  (opened, content, lastViewedR) => {
    const transform = (lastViewed) => {
      const highlighted = opened && content === 'whatsnew'
      const latestAnnouncements = Announcements.filter(announcement => {
        return moment(prop('date', announcement)).isBetween(moment(lastViewed), moment())
      })
      return {
        highlighted,
        opened,
        content,
        lastViewed,
        numOfNewAnnouncements: prop('length', latestAnnouncements)
      }
    }
    return lift(transform)(lastViewedR)
  }
)
