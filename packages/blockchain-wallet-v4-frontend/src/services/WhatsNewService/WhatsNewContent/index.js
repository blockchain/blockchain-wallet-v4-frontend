import { equals, includes, prop, propOr } from 'ramda'
import ExchangeByBlockchain from './ExchangeByBlockchain'
import moment from 'moment'
import React from 'react'
import USDPax from './USDPax'
import WalletTour from './WalletTour'

const Announcements = [
  {
    content: <WalletTour />,
    date: new Date('September 9 2019'),
    restrictByCountry: [],
    restrictByUserKyc: [],
    restrictByKvStoreCheck: whatsNewKvStore =>
      equals(false, propOr(false, 'hasSkippedWalletTour', whatsNewKvStore))
  },
  {
    content: <USDPax />,
    date: new Date('April 30 2019'),
    restrictByCountry: [],
    restrictByUserKyc: []
  },
  {
    content: <ExchangeByBlockchain />,
    date: new Date('Nov 1 2018'),
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
