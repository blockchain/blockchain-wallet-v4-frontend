import { includes, prop } from 'ramda'
import { selectors } from 'data'
import moment from 'moment'
import React from 'react'

import Borrow from './Content/Borrow'
import TxHistoryDownload from './Content/TxHistoryDownload'
import USDDigital from './Content/USDDigital'

const Announcements = [
  {
    content: <TxHistoryDownload key={0} />,
    date: new Date('March 27, 2020'),
    restrictByCountry: [],
    restrictByUserKyc: []
  },
  {
    content: <Borrow key={1} />,
    date: new Date('March 9, 2020'),
    restrictByCountry: [],
    restrictByUserKyc: []
  },
  {
    content: <USDDigital key={2} />,
    date: new Date('March 9, 2020'),
    restrictByCountry: [],
    restrictByUserKyc: []
  }
]

export const filterAnnouncements = (
  lastViewed,
  userCountry,
  userKycState,
  whatsNewKvStore
) => {
  const isOnRestrictedCountryList = includes(userCountry)
  const isOnRestrictedKycList = includes(userKycState)
  const isRestrictedByKvStore = kvCheckFunc => {
    return kvCheckFunc && kvCheckFunc(whatsNewKvStore)
  }
  const isRestricted = announcement =>
    isOnRestrictedCountryList(prop('restrictByCountry', announcement)) ||
    isOnRestrictedKycList(prop('restrictByUserKyc', announcement))

  const isAvailableToView = announcement => {
    const announcementDate = prop('date', announcement)
    const restrictByKv = prop('restrictByKvStoreCheck', announcement)
    // show new announcement alert if
    // the announcement is less than 30 days old &&
    // last time whats new was viewed is before the announcement date &&
    // it is not restricted by kvStore
    return (
      moment()
        .subtract(30, 'days')
        .isBefore(announcementDate) &&
      moment(lastViewed).isBefore(announcementDate) &&
      !isRestrictedByKvStore(restrictByKv)
    )
  }

  return Announcements.map(announcement => ({
    content: prop('content', announcement),
    restricted: isRestricted(announcement),
    display: true,
    alert: isAvailableToView(announcement)
  }))
}

export const getData = state => {
  const whatsNewKvStore = selectors.core.kvStore.whatsNew
    .getState(state)
    .getOrElse({})
  const lastViewed = selectors.core.kvStore.whatsNew
    .getLastViewed(state)
    .getOrElse(
      moment()
        .subtract(2, 'months')
        .unix()
    )
  const userCountry = selectors.core.settings
    .getCountryCode(state)
    .getOrElse(null)
  const userKycState = selectors.modules.profile
    .getUserKYCState(state)
    .getOrElse(null)

  return {
    announcements: filterAnnouncements(
      lastViewed,
      userCountry,
      userKycState,
      whatsNewKvStore
    ).filter(prop('display'))
  }
}
