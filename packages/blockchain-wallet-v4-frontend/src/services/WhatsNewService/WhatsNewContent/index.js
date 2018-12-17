import React from 'react'

import BitcoinCashSVSupport from './BitcoinCashSVSupport'
import ExchangeByBlockchain from './ExchangeByBlockchain'

const Announcements = [
  {
    content: <BitcoinCashSVSupport />,
    date: null
  },
  {
    content: <ExchangeByBlockchain />,
    date: new Date('Nov 1 2018')
  }
]

export default Announcements
