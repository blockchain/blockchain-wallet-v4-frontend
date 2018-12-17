import Announcements from 'services/WhatsNewService/WhatsNewContent'
import { selectors } from 'data'
import moment from 'moment'

export const getData = state => {
  const lastViewed = (selectors.core.kvStore.whatsNew.getLastViewed(state)).getOrElse(moment().subtract(2, 'months').unix())
  const latestAnnouncements = Announcements.filter(announcement => {
    return moment(announcement.date).isBetween(moment(lastViewed), moment())
  })
  return {
    lastViewed,
    latestAnnouncements
  }
}
