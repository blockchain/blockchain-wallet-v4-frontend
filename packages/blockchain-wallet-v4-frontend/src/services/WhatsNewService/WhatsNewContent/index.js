// Wipe announcements for launch, keeping code around to remember format

import React from 'react'

// import { FormattedMessage } from 'react-intl'
// import { LinkContainer } from 'react-router-bootstrap'

// import { Link } from 'blockchain-info-components'
// import FaqLink from '../FaqLink'
import ExchangeByBlockchain from './ExchangeByBlockchain'

// const LearnMore = () => <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.learnmore' defaultMessage='Learn More' />

const Announcements = [
  // {
  //   content: <div style={{ height: '250px', marginBottom: '50px', border: '1px solid red', width: '100px' }}>Jan content</div>,
  //   date: new Date('Jan 1 2019')
  // },
  {
    content: <ExchangeByBlockchain />,
    date: new Date('Nov 1 2018')
  },
  {
    content: <div style={{ height: '250px', marginBottom: '50px', border: '1px solid red', width: '100px' }}>Oct content</div>,
    date: new Date('Oct 1 2018')
  },
  {
    content: <div style={{ height: '250px', marginBottom: '50px', border: '1px solid red', width: '100px' }}>Sept content</div>,
    date: new Date('Sep 1 2018')
  },
  {
    content: <div style={{ height: '250px', marginBottom: '50px', border: '1px solid red', width: '100px' }}>Aug content</div>,
    date: new Date('Aug 1 2018')
  },
  {
    content: <div style={{ height: '250px', marginBottom: '50px', border: '1px solid red', width: '100px' }}>May content</div>,
    date: new Date('May 1 2018')
  }
]

export default Announcements
