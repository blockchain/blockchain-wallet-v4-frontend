import { includes, prop } from 'ramda'
import Borrow from './Borrow'
import moment from 'moment'
import React from 'react'
import USDDigital from './USDDigital'

const Announcements = [
  {
    content: <Borrow key={1} />,
    date: new Date('March 2020'),
    restrictByCountry: [],
    restrictByUserKyc: []
  },
  {
    content: <USDDigital key={2} />,
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
