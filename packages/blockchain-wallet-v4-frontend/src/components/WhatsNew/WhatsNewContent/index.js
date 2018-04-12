import React from 'react'
import { FormattedMessage } from 'react-intl'

const Announcements = [
  {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title12' defaultMessage={'Import Funds from MyEtherWallet'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc12' defaultMessage={'You can now import your ether from your MyEtherWallet backup directky into your Blockchain wallet.'}/>,
    date: 'February 10, 2018',
    // link: <a href="blockchain.info/settings/info">Learn More</a>
    //if i have a link, follow link. Otherwise, set an onClick
  }, {
      title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title11' defaultMessage={'New Bitcoin Cash Address Format'} />,
      desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc11' defaultMessage={'Bitcoin Cash addresses now follow the CashAddr format.'} />,
      date: 'January 18, 2018',
      link: '/settings/info'
    }, {
      title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title10' defaultMessage={'Bitcoin Cash'} />,
      desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc10' defaultMessage={'If you had bitcoin in your wallet before August 1, 2017, you can now access Bitcoin Cash via Settings > General.'} />,
      date: 'October 3, 2017',
      link: '/settings/info'
    }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title9' defaultMessage={'Exchange Assets'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc9' defaultMessage={'You can exchange between bitcoin, ether, and bitcoin cash directly from your Blockchain wallet'} />,
    date: 'August 11, 2017',
    link: '/exchange'
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title8' defaultMessage={'Send & Receive Ether'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc8' defaultMessage={'You can now send and receive ether from your Blockchain wallet!'} />,
    date: 'July 24, 2017',
    link: '/eth/transactions'
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title7' defaultMessage={'Sell Bitcoin'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc7' defaultMessage={'You can now sell bitcoin directly from your Blockchain wallet!'} />,
    date: 'May 12, 2017',
    link: '/buy-sell'
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title6' defaultMessage={'Buy Bitcoin'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc6' defaultMessage={'You can now buy bitcoin with your Blockchain wallet!'} />,
    date: 'December 15, 2016',
    link: '/buy-sell'
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title1' defaultMessage={'Dev Themes'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc1' defaultMessage={'You can now customize your Blockchain Wallet with different themes. Head over to Preferences to see your options.'} />,
    date: 'September 26, 2016'
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title5' defaultMessage={'Export History'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc5' defaultMessage={'Export the transaction history of your addresses in CSV format'} />,
    date: 'June 21, 2016'
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title4' defaultMessage={'What\'s New'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc4' defaultMessage={'We now have a "What\'s New" section where we\'ll let you know about all the changes we\'ve been making to the Blockchain Wallet.'} />,
    date: 'May 20, 2016'
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title3' defaultMessage={'Sign and Verify'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc3' defaultMessage={'Prove that you own a bitcoin address by signing a message. Verify to confirm someone else owns an address.'} />,
    date: 'May 2, 2016'
  }, {
    title: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title2' defaultMessage={'Transfer All'} />,
    desc: <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc2' defaultMessage={'Move all funds from your imported addresses to your HD addresses for added privacy and security.'} />,
    date: 'April 25, 2016'
  }
]

export default Announcements
