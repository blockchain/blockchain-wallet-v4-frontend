import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { MenuTooltip } from 'blockchain-info-components'

const Container = styled.div`
 margin-top: 5px;
`
const NewsItemWrapper = styled.div``

const WhatsNew = () => {
  const news = [
    { titleId: 'BITCOIN_CASH.BCH_IN_WALLET', descId: 'BITCOIN_CASH.BCH_WHATS_NEW', title: 'Bitcoin Cash', desc: 'If you had bitcoin in your wallet before August 1, 2017, you can now access Bitcoin Cash via Settings > General.', date: new Date('October 3 2017') },
    { titleId: 'BTC_ETH_EXCHANGE', descId: 'BTC_ETH_EXCHANGE_WHATS_NEW', title: 'Exchange Assets', desc: 'BTC_ETH_EXCHANGE_WHATS_NEW', date: new Date('August 11 2017') },
    { titleId: 'ETHER_SEND_RECEIVE', descId: 'ETHER_SEND_RECEIVE_WHATS_NEW', title: 'Send & Receive Ether', desc: 'You can now send and receive ether from your Blockchain wallet!', date: new Date('July 24 2017') },
    { titleId: 'SELL_BITCOIN', descId: 'SELL_BITCOIN_EXPLAIN', title: 'Sell Bitcoin', desc: 'You can now sell bitcoin directly from your Blockchain wallet!', date: new Date('May 12 2017') },
    { titleId: 'BUY_BITCOIN', descId: 'BUY_BITCOIN_EXPLAIN', title: 'Buy Bitcoin', desc: 'You can now buy bitcoin with your Blockchain wallet!', date: new Date('12/15/2016') },
    { titleId: 'EXPORT_HISTORY', descId: 'EXPORT_HISTORY_EXPLAIN', title: 'Export history', desc: 'Export the transaction history of your addresses in CSV format', date: 1466521300000 },
    { titleId: 'WHATS_NEW', descId: 'WHATS_NEW_EXPLAIN', title: 'What&apos;s New', desc: 'We now have a &quot;What&apos;s New&quot; section where we&apos;ll let you know about all the changes we&apos;ve been making to the Blockchain Wallet.', date: 1463716800000 },
    { titleId: 'SIGN_VERIFY', descId: 'SIGN_VERIFY_EXPLAIN', title: 'Sign and Verify', desc: 'Prove that you own a bitcoin address by signing a message. Verify to confirm someone else owns an address.', date: 1462161600000 },
    { titleId: 'TRANSFER_ALL', descId: 'TRANSFER_ALL_EXPLAIN', title: 'Transfer All', desc: 'Move all funds from your imported addresses to your HD addresses for added privacy and security.', date: 1461556800000 },
    { titleId: 'DEV_THEMES', descId: 'DEV_THEMES_EXPLAIN', title: 'Dev Themes', desc: 'You can now customize your Blockchain Wallet with different themes. Head over to Preferences to see your options.', date: 1474862400000 }
  ]

  // TODO: Build title and desc FormattedMessages outside the map to have different ids

  return (
    <Container>
      <MenuTooltip title='What&apos;s new?'>
        {news.map((item, index) => {
          const { title, desc, date } = item
          return (
            <NewsItemWrapper key={index}>
              <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.title' defaultMessage={title} />
              <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.desc' defaultMessage={desc} />
              <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.date' defaultMessage={date.toString} />
              <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.learnmore' defaultMessage='Learn more' />
            </NewsItemWrapper>
          )
        })}
      </MenuTooltip>
    </Container>
  )
}

export default WhatsNew
