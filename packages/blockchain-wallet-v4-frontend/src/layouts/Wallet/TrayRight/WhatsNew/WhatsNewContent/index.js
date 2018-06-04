import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Link } from 'blockchain-info-components'
import FaqLink from '../FaqLink'

const LearnMore = () => <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.learnmore' defaultMessage='Learn More' />

const Announcements = [
  {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title12' defaultMessage='Import Funds from MyEtherWallet' />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc12' defaultMessage='You can now import your ether from your MyEtherWallet backup directly into your Blockchain wallet.' />,
    date: 'February 10, 2018',
    link: <LinkContainer to='/settings/info'><Link size='13px' weight={300}><LearnMore /></Link></LinkContainer>

  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title11' defaultMessage='New Bitcoin Cash Address Format' />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc11' defaultMessage='Bitcoin Cash addresses now follow the CashAddr format.' />,
    date: 'January 18, 2018',
    link: <FaqLink />
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title10' defaultMessage='Bitcoin Cash' />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc10' defaultMessage='If you had bitcoin in your wallet before August 1, 2017, you can now access Bitcoin Cash via Settings > General.' />,
    date: 'October 3, 2017',
    link: <LinkContainer to='/bch/transactions'><Link size='13px' weight={300}><LearnMore /></Link></LinkContainer>
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title9' defaultMessage='Exchange Assets' />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc9' defaultMessage='You can exchange between bitcoin, ether, and bitcoin cash directly from your Blockchain wallet' />,
    date: 'August 11, 2017',
    link: <LinkContainer to='/exchange'><Link size='13px' weight={300}><LearnMore /></Link></LinkContainer>
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title8' defaultMessage='Send & Receive Ether' />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc8' defaultMessage='You can now send and receive ether from your Blockchain wallet!' />,
    date: 'July 24, 2017',
    link: <LinkContainer to='/eth/transactions'><Link size='13px' weight={300}><LearnMore /></Link></LinkContainer>
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title7' defaultMessage='Sell Bitcoin' />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc7' defaultMessage='You can now sell bitcoin directly from your Blockchain wallet!' />,
    date: 'May 12, 2017',
    link: <LinkContainer to='/buy-sell'><Link size='13px' weight={300}><LearnMore /></Link></LinkContainer>
  }
]

export default Announcements
