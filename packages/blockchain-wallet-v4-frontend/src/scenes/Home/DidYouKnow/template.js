import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

import { Icon, Text, TextGroup, Link, Color } from 'blockchain-info-components'

const DidYouKnowWrapper = styled.div`
  & > * { display: inline; }
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 15px;
  margin-top: 15px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-1']};
`

const TitleText = styled(Text)`
  font-size: 20px;
  @media (min-width: 480px) {
    font-size: 24px;
  }
`
const SubtitleText = styled(Text)`
  font-size: 14px;
  @media (min-width: 480px) {
    font-size: 18px;
  }
`
const ContentText = styled(Text)`
  font-size: 12px;
  @media (min-width: 480px) {
    font-size: 14px;
  }
`

const Content = styled.div`
  > * { margin-top: 15px; }
`
const PaddedIcon = styled(Icon)`
  padding: 0 5px 5px 0;
  font-size: 12px;
  @media (min-width: 480px) {
    font-size: 14px;
    padding: 5px;
  }
`
const selectTitle = (number) => {
  switch (number) {
    case 1: return <FormattedMessage id='scenes.home.didyouknow.title1' defaultMessage='Passwords are not shared or stored with us' />
    case 2: return <FormattedMessage id='scenes.home.didyouknow.title2' defaultMessage='How It Works' />
    case 3: return <FormattedMessage id='scenes.home.didyouknow.title3' defaultMessage='Why does my balance keep changing?' />
    case 4: return <FormattedMessage id='scenes.home.didyouknow.title4' defaultMessage='Our Wallet is Open Source' />
    case 5: return <FormattedMessage id='scenes.home.didyouknow.title5' defaultMessage='Set Your Own Fees' />
    case 6: return <FormattedMessage id='scenes.home.didyouknow.title6' defaultMessage='Blockchain Optimizes Your Fees' />
    case 7: return <FormattedMessage id='scenes.home.didyouknow.title7' defaultMessage='Transaction Fees' />
    case 8: return <FormattedMessage id='scenes.home.didyouknow.title8' defaultMessage='Use Your Blockchain Wallet on Mobile' />
    case 9: return <FormattedMessage id='scenes.home.didyouknow.title9' defaultMessage='Top Security Tips' />
    case 10: return <FormattedMessage id='scenes.home.didyouknow.title10' defaultMessage='Your wallet ID cannot be used to send/receive funds' />
    case 11: return <FormattedMessage id='scenes.home.didyouknow.title11' defaultMessage='Report Phishing Sites' />
    case 12: return <FormattedMessage id='scenes.home.didyouknow.title12' defaultMessage='Identifying SSL Protection' />
    case 13: return <FormattedMessage id='scenes.home.didyouknow.title13' defaultMessage="We Can' t Suspend or Lock Your Wallet" />
    case 14: return <FormattedMessage id='scenes.home.didyouknow.title14' defaultMessage='What are phishing scams?' />
    case 15: return <FormattedMessage id='scenes.home.didyouknow.title15' defaultMessage="Scam Warning: Bitcoins Can't Be Doubled" />
    case 16: return <FormattedMessage id='scenes.home.didyouknow.title16' defaultMessage='Get the word out about bitcoin investment scams' />
    case 17: return <FormattedMessage id='scenes.home.didyouknow.title17' defaultMessage='How can I spot an investment scam?' />
    case 18: return <FormattedMessage id='scenes.home.didyouknow.title18' defaultMessage='What are private keys?' />
    case 19: return <FormattedMessage id='scenes.home.didyouknow.title19' defaultMessage='Where are my private keys?' />
    case 20: return <FormattedMessage id='scenes.home.didyouknow.title20' defaultMessage='What makes a password secure?' />
    case 21: return <FormattedMessage id='scenes.home.didyouknow.title22' defaultMessage='How do fees work in my wallet?' />
    case 22: return <FormattedMessage id='scenes.home.didyouknow.title23' defaultMessage='How often do I have to back up my wallet? ' />
    default: return <div />
  }
}

const selectContent = (number) => {
  switch (number) {
    case 1: return (
      <DidYouKnowWrapper>
        <FormattedMessage id='scenes.home.didyouknow.content1.one' defaultMessage='We never see or store your password, which means if you forget it we cannot reset it. Be sure to record your backup recovery phrase to ensure you never lose access to your funds. Find out how by visiting the' />
        <NavLink to='/security-center' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
          <FormattedMessage id='scenes.home.didyouknow.content1.navlink' defaultMessage=' Security Center' />
        </NavLink>
        <FormattedMessage id='scenes.home.didyouknow.content1.two' defaultMessage='.' />
      </DidYouKnowWrapper>)
    case 2: return <FormattedMessage id='scenes.home.didyouknow.content2' defaultMessage='Client side encryption keeps you firmly in control of your funds. Not even we have access. Your wallet is encrypted within your browser before it’s sent to our servers.' />
    case 3: return <FormattedMessage id='scenes.home.didyouknow.content3' defaultMessage='Your bitcoin, ether, and bitcoin cash balances will never change. However, as their exchange rates fluctuate, you will see changes in the local currency estimation of your wallet balance. Simply click the balance to switch between bitcoin, ether, or bitcoin cash and your local currency.' />
    case 4: return (<DidYouKnowWrapper>
      <FormattedMessage id='scenes.home.didyouknow.content4.one' defaultMessage='All the code related to our wallet is open source. Go to our' />
      <Link href='https://github.com/blockchain/blockchain-wallet-v4-frontend/' target='_blank' size='14px' weight={200}>
        <FormattedMessage id='scenes.faq.group.walletfunctionality.answer6.link' defaultMessage='Github repo' />
      </Link>
      <FormattedMessage id='scenes.home.didyouknow.content4.one' defaultMessage='to contribute to the development of our wallet.' />
    </DidYouKnowWrapper>)
    case 5: return <FormattedMessage id='scenes.home.didyouknow.content5' defaultMessage="Want to set your own bitcoin fees? You can! Just click on 'Customize Fee' in the Send screen." />
    case 6: return <FormattedMessage id='scenes.home.didyouknow.content6' defaultMessage='We adjust your fees dynamically depending on network conditions and the size of your transaction.' />
    case 7: return <FormattedMessage id='scenes.home.didyouknow.content7' defaultMessage='Transaction fees are needed for sending any funds, and are collected by their networks of miners. To assure your transaction is confirmed, we automatically include an appropriate fee based on network standards.' />
    case 8: return (<DidYouKnowWrapper>
      <FormattedMessage id='scenes.home.didyouknow.content8.one' defaultMessage='Download our mobile app on your' />
      <Link href='https://play.google.com/store/apps/details?id=piuk.blockchain.android' target='_blank' size='14px' weight={200}>
        <FormattedMessage id='scenes.faq.group.didyouknow.content8.linkone' defaultMessage=' Android ' />
      </Link>
      <FormattedMessage id='scenes.home.didyouknow.content8.two' defaultMessage='or' />
      <Link href='https://itunes.apple.com/us/app/blockchain-bitcoin-wallet/id493253309' target='_blank' size='14px' weight={200}>
        <FormattedMessage id='scenes.home.didyouknow.content8.linktwo' defaultMessage=' iOS ' />
      </Link>
      <FormattedMessage id='scenes.home.didyouknow.content8.three' defaultMessage='device to use your wallet on the go.' />
    </DidYouKnowWrapper>)
    case 9: return <FormattedMessage id='scenes.home.didyouknow.content9' defaultMessage="Keep your wallet safe and secure by visiting the Security Center to record your backup phrase and enabling two-factor authentication. We also recommend using a unique, random password that's at least 16 characters or more." />
    case 10: return <FormattedMessage id='scenes.home.didyouknow.content10' defaultMessage="It's like a username, and you only use it to log in to your wallet. To send /receive bitcoin, ether, or bitcoin cash you need an address.To find your address, click Request, and select a digital asset in the currency dropdown." />
    case 11: return (<DidYouKnowWrapper>
      <FormattedMessage id='scenes.home.didyouknow.content11' defaultMessage='Did you know you can help us take down phishing sites? Report them directly to Google using' />
      <Link href='https://support.google.com/adwords/troubleshooter/4578507' target='_blank' size='14px' weight={200}>
        <FormattedMessage id='scenes.home.didyouknow.content11.link' defaultMessage=' this form' />
      </Link>
      <FormattedMessage id='scenes.home.didyouknow.content11.two' defaultMessage=". Bookmark it so it's always on hand!" />
    </DidYouKnowWrapper>)
    case 12: return <FormattedMessage id='scenes.home.didyouknow.content12' defaultMessage="Did you know you can identify whether a site protects your sensitive information with SSL? Simply look for a green lock in the left of your browser's URL bar." />
    case 13: return (<DidYouKnowWrapper>
      <FormattedMessage id='scenes.home.didyouknow.content13.one' defaultMessage="Beware of emails that say your Blockchain Wallet is suspended or locked. Because we're noncustodial, you're the only one who can manage your funds, keep them secure, and access your wallet. Learn more about this topic" />
      <Link href='https://blockchain.info/wallet/how-it-works' target='_blank' size='14px' weight={200}>
        <FormattedMessage id='scenes.home.didyouknow.content12.link' defaultMessage=' here' />
      </Link>
      <FormattedMessage id='scenes.home.didyouknow.content13.two' defaultMessage='.' />
    </DidYouKnowWrapper>)
    case 14: return (<DidYouKnowWrapper>
      <FormattedMessage id='scenes.home.didyouknow.content14.one' defaultMessage='Phishing scams exist to try and deceive users into providing personal or financial information. Outsmart them by learning about the' />
      <Link href='https://blog.blockchain.com/2017/11/01/scams-social-media-recent-trends-outsmart/' target='_blank' size='14px' weight={200}>
        <FormattedMessage id='scenes.home.didyouknow.content14.link' defaultMessage=' most common tricks ' />
      </Link>
      <FormattedMessage id='scenes.home.didyouknow.content14.two' defaultMessage='used.' />
    </DidYouKnowWrapper>)
    case 15: return <FormattedMessage id='scenes.home.didyouknow.content15' defaultMessage="Like gold, bitcoins can never be doubled or multiplied. This is because the total number of coins and how they can be generated are already built-in to the protocol code. If a company claims they've discovered a magic doubling formula, consider that a sure-fire sign they're a scam." />
    case 16: return <FormattedMessage id='scenes.home.didyouknow.content16' defaultMessage='Blockchain does not offer bitcoin investment opportunities, but scams exist that desperately want you to believe otherwise. If one of these scams sneak their way into your inbox, be sure to do us a solid and grab a screenshot to share with our support team before you delete it.' />
    case 17: return <FormattedMessage id='scenes.home.didyouknow.content17' defaultMessage="Legitimate investing platforms do exist, but their scheming counterparts present some serious red flags: they'll contact you through an unsolicited email and they will guarantee profits. Before investing with any platform, always do your research about the company's reputation, location, and contact details." />
    case 18: return <FormattedMessage id='scenes.home.didyouknow.content18' defaultMessage='Every address has an accompanying private key, which is what indicates ownership or control over funds at that particular address. In other words, whoever has the private key can spend those funds.' />
    case 19: return (<DidYouKnowWrapper>
      <FormattedMessage id='scenes.home.didyouknow.content19.one' defaultMessage='Your Blockchain wallet backup phrase serves as the copy of your private keys. You can find this phrase in your' />
      <NavLink to='/security-center' style={{textDecoration: 'none', color: Color('brand-secondary')}} >
        <FormattedMessage id='scenes.home.didyouknow.content19.navlink' defaultMessage=' Security Center' />
      </NavLink>
      <FormattedMessage id='scenes.home.didyouknow.content19.two' defaultMessage='. It makes backing up a one- time process for all funds except Imported Addresses.' />
    </DidYouKnowWrapper>)
    case 20: return <FormattedMessage id='scenes.home.didyouknow.content20' defaultMessage='Your passwords are considered secure as long as they are 16 characters minimum, unique, and include a diverse range of letters, numbers, and symbols. ' />
    case 21: return <FormattedMessage id='scenes.home.didyouknow.content22' defaultMessage='Our wallet uses a dynamic fee structure. This means that when you send bitcoin, fees adjust based on network conditions & your transaction size.' />
    case 22: return <FormattedMessage id='scenes.home.didyouknow.content23' defaultMessage='You only have to write down your Wallet Backup Phrase *once* to make sure all funds (except Imported Addresses) are backed up. To make sure your imported addresses are backed up too, transfer your funds to your wallet by using Send.' />
    default: return <div />
  }
}

const DidYouKnow = (props) => {
  const { number } = props

  return (
    <Wrapper>
      <TitleText weight={300} color='brand-primary' uppercase>
        <FormattedMessage id='scenes.home.didyouknow.title' defaultMessage='Did you know?' />
      </TitleText>
      <Content>
        <TextGroup inline>
          <PaddedIcon name='user' size='18px' color='brand-primary' />
          <SubtitleText weight={300} color='brand-primary'>
            { selectTitle(number) }
          </SubtitleText>
        </TextGroup>
        <ContentText weight={300}>
          { selectContent(number) }
        </ContentText>
      </Content>
    </Wrapper>
  )
}

DidYouKnow.propTypes = {
  number: PropTypes.number.isRequired
}

DidYouKnow.defaultProps = {
  number: 0
}

export default DidYouKnow
