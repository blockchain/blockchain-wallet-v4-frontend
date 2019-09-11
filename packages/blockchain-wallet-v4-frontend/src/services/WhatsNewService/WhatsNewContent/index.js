import React from 'react'
import { prop, contains } from 'ramda'
import moment from 'moment'

import ExchangeByBlockchain from './ExchangeByBlockchain'
import USDPax from './USDPax'
import WalletTour from './WalletTour'

const Announcements = [
  {
    content: <WalletTour />,
    date: new Date('September 9 2019'),
    restrictByCountry: [],
    restrictByUserKyc: []
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

export const filterAnnouncements = (lastViewed, userCountry, userKycState) => {
  const isOnRestrictedCountryList = contains(userCountry)
  const isOnRestrictedKycList = contains(userKycState)

  const isRestricted = announcement =>
    isOnRestrictedCountryList(prop('restrictByCountry', announcement)) ||
    isOnRestrictedKycList(prop('restrictByUserKyc', announcement))

  const isAvailableToView = (start, expires) =>
    moment(start).isBetween(
      moment(lastViewed).subtract(expires, 'days'),
      moment()
    )

  return Announcements.map(announcement => ({
    content: prop('content', announcement),
    restricted: isRestricted(announcement),
    display: isAvailableToView(announcement.date, 30),
    alert: isAvailableToView(announcement.date, 0)
  }))
}
