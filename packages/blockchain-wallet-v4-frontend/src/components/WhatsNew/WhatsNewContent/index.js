import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import { Text } from 'blockchain-info-components'
import PropTypes from 'prop-types'

const Announcements = [
  {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title12' defaultMessage={'Import Funds from MyEtherWallet'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc12' defaultMessage={'You can now import your ether from your MyEtherWallet backup directky into your Blockchain wallet.'}/>,
    date: 'February 10, 2018',
    link: <NavLink to='/settings/info'>
          <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.link.12' defaultMessage={'Learn More'}/>
          </NavLink>
    //if i have a link, follow link. Otherwise, set an onClick
  }, {
      title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title11' defaultMessage={'New Bitcoin Cash Address Format'} />,
      desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc11' defaultMessage={'Bitcoin Cash addresses now follow the CashAddr format.'} />,
      date: 'January 18, 2018',
      link: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.link.11' defaultMessage={'Learn More'}/>

    }, {
      title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title10' defaultMessage={'Bitcoin Cash'} />,
      desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc10' defaultMessage={'If you had bitcoin in your wallet before August 1, 2017, you can now access Bitcoin Cash via Settings > General.'} />,
      date: 'October 3, 2017',
      link: <NavLink to='/bch/transactions'>
            <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.link.12' defaultMessage={'Learn More'}/>
            </NavLink>
    }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title9' defaultMessage={'Exchange Assets'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc9' defaultMessage={'You can exchange between bitcoin, ether, and bitcoin cash directly from your Blockchain wallet'} />,
    date: 'August 11, 2017',
    link: <NavLink to='/exchange'>
          <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.link.9' defaultMessage={'Learn More'}/>
          </NavLink>
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title8' defaultMessage={'Send & Receive Ether'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc8' defaultMessage={'You can now send and receive ether from your Blockchain wallet!'} />,
    date: 'July 24, 2017',
    link: <NavLink to='/eth/transactions'>
          <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.link.8' defaultMessage={'Learn More'}/>
          </NavLink>
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title7' defaultMessage={'Sell Bitcoin'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc7' defaultMessage={'You can now sell bitcoin directly from your Blockchain wallet!'} />,
    date: 'May 12, 2017',
    link: <NavLink to='/buy-sell'>
          <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.link.7' defaultMessage={'Learn More'}/>
          </NavLink>
  }
]

export default Announcements
