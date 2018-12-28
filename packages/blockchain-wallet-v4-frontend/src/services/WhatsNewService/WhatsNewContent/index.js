import React from 'react'
import { prop } from 'ramda'
import moment from 'moment'
import BitcoinCashSVSupport from './BitcoinCashSVSupport'
import ExchangeByBlockchain from './ExchangeByBlockchain'

const Announcements = [
  {
    content: <BitcoinCashSVSupport />,
    date: new Date('Jan 31 2019'),
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
  const isOnRestrictedCountryList = restrictedCountryList => restrictedCountryList.indexOf(userCountry) > -1
  const isOnRestrictedKycList = restrictedKycList => restrictedKycList.indexOf(userKycState) > -1

  const isRestricted = announcement => (
    isOnRestrictedCountryList(prop('restrictByCountry', announcement)) ||
    isOnRestrictedKycList(prop('restrictByUserKyc', announcement))
  )

  const filteredAnnouncements = Announcements.filter(announcement => {
    if (!isRestricted(announcement)) {
      return moment(announcement.date).isBetween(moment(lastViewed), moment())
    }
  })
  return filteredAnnouncements
}
