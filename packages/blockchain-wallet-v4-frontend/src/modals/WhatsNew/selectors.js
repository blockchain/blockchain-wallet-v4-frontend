import { includes, prop } from 'ramda'
import { selectors } from 'data'
import moment from 'moment'
import React from 'react'

import Borrow from './Content/Borrow'
import TxHistoryDownload from './Content/TxHistoryDownload'
import USDDigital from './Content/USDDigital'

const Announcements = [
  {
    content: <TxHistoryDownload key={1} />,
    date: new Date('April 2020'),
    restrictByCountry: [],
    restrictByUserKyc: []
  },
  {
    content: <Borrow key={2} />,
    date: new Date('March 2020'),
    restrictByCountry: [],
    restrictByUserKyc: []
  },
  {
    content: <USDDigital key={3} />,
    date: new Date('March 2020'),
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

  const isAvailableToView = (announcement, expires) => {
    return (
      moment(prop('date', announcement)).isBetween(
        moment(lastViewed).subtract(expires, 'days'),
        moment()
      ) && !isRestrictedByKvStore(prop('restrictByKvStoreCheck', announcement))
    )
  }

  return Announcements.map(announcement => ({
    content: prop('content', announcement),
    restricted: isRestricted(announcement),
    display: true,
    alert: isAvailableToView(announcement, 0)
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
