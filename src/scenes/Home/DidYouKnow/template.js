import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 15px;
  margin-top: 15px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['bordergrey']};

  & > * { padding: 10px 0; }
`
const PaddedIcon = styled(Icon)`
  padding: 5px;
`
const selectTitle = (number) => {
  switch (number) {
    case 1: return <FormattedMessage id='scenes.home.didyouknow.title1' defaultMessage='Passwords are not shared or stored with us' />
    case 2: return <FormattedMessage id='scenes.home.didyouknow.title2' defaultMessage='How it works' />
    case 3: return <FormattedMessage id='scenes.home.didyouknow.title3' defaultMessage='Why does my balance keep changing?' />
    case 4: return <FormattedMessage id='scenes.home.didyouknow.title4' defaultMessage='Our wallet is open source' />
    case 5: return <FormattedMessage id='scenes.home.didyouknow.title5' defaultMessage='Set your own fees' />
    case 6: return <FormattedMessage id='scenes.home.didyouknow.title6' defaultMessage='Blockchain optimizes your fees' />
    case 7: return <FormattedMessage id='scenes.home.didyouknow.title7' defaultMessage='Transaction fees' />
    case 8: return <FormattedMessage id='scenes.home.didyouknow.title8' defaultMessage='Use your Blockchain Wallet on mobile' />
    case 9: return <FormattedMessage id='scenes.home.didyouknow.title9' defaultMessage='Top security tips' />
    case 10: return <FormattedMessage id='scenes.home.didyouknow.title10' defaultMessage='Your wallet ID cannot be used to send/receive bitcoin' />
    case 11: return <FormattedMessage id='scenes.home.didyouknow.title11' defaultMessage='Report phishing sites' />
    case 12: return <FormattedMessage id='scenes.home.didyouknow.title12' defaultMessage='Identifying SSL protection' />
    case 13: return <FormattedMessage id='scenes.home.didyouknow.title13' defaultMessage="We can' t suspend or lock your wallet" />
    case 14: return <FormattedMessage id='scenes.home.didyouknow.title14' defaultMessage='What are phishing scams?' />
    case 15: return <FormattedMessage id='scenes.home.didyouknow.title15' defaultMessage="Scam warning: bitcoins can't be doubled" />
    case 16: return <FormattedMessage id='scenes.home.didyouknow.title16' defaultMessage='Get the word out about bitcoin investment scams' />
    case 17: return <FormattedMessage id='scenes.home.didyouknow.title17' defaultMessage='How can I spot an investment scam?' />
    case 18: return <FormattedMessage id='scenes.home.didyouknow.title18' defaultMessage='What are private keys?' />
    case 19: return <FormattedMessage id='scenes.home.didyouknow.title19' defaultMessage='Where are my private keys?' />
    case 20: return <FormattedMessage id='scenes.home.didyouknow.title20' defaultMessage='What makes a password secure?' />
    case 21: return <FormattedMessage id='scenes.home.didyouknow.title21' defaultMessage='Can I customize my transaction fee?' />
    case 22: return <FormattedMessage id='scenes.home.didyouknow.title22' defaultMessage='How do fees work in my wallet?' />
    case 23: return <FormattedMessage id='scenes.home.didyouknow.title23' defaultMessage='How often do I have to back up my wallet? ' />
    default: return <div />
  }
}

const selectContent = (number) => {
  switch (number) {
    case 1: return <FormattedMessage id='scenes.home.didyouknow.content1' defaultMessage='We never see or store your password, which means if you forget it we cannot reset it. Be sure to record your backup recovery phrase to ensure you never lose access to your funds. Find out how by visiting the security center.' />
    case 2: return <FormattedMessage id='scenes.home.didyouknow.content2' defaultMessage='Client side encryption keeps you firmly in control of your funds. Not even we have access. Your wallet is encrypted within your browser before it’s sent to our servers.' />
    case 3: return <FormattedMessage id='scenes.home.didyouknow.content3' defaultMessage='Your bitcoin and ether balances will never change. However, as their exchange rates fluctuate, you will see changes in the local currency estimation of your wallet balance. Simply click the balance to switch between bitcoin or ether and your local currency.' />
    case 4: return <FormattedMessage id='scenes.home.didyouknow.content4' defaultMessage='All the code related to our wallet is open source. Go to our Github repo to contribute to the development of our wallet.' />
    case 5: return <FormattedMessage id='scenes.home.didyouknow.content5' defaultMessage='Want to set your own bitcoin fees? You can! Just click on Customize Fee in the Send screen.' />
    case 6: return <FormattedMessage id='scenes.home.didyouknow.content6' defaultMessage='We adjust your fees dynamically depending on network conditions and the size of your transaction.' />
    case 7: return <FormattedMessage id='scenes.home.didyouknow.content7' defaultMessage='Transaction fees are needed for sending bitcoin and ether, and are collected by their networks of miners. To assure your transaction is confirmed, we automatically include an appropriate fee based on network standards.' />
    case 8: return <FormattedMessage id='scenes.home.didyouknow.content8' defaultMessage='Download our mobile app on your Android or iOS device to use your wallet on the go.' />
    case 9: return <FormattedMessage id='scenes.home.didyouknow.content9' defaultMessage="Keep your wallet safe and secure by visiting the security center to record your backup phrase and enabling 2-step Verification. We also recommend using a unique, random password that' s at least 16 characters or more!" />
    case 10: return <FormattedMessage id='scenes.home.didyouknow.content10' defaultMessage="It' s like a username, and you only use it to log in to your wallet. To send /receive bitcoin or ether you need an address.To find your bitcoin or ether address, click Request." />
    case 11: return <FormattedMessage id='scenes.home.didyouknow.content11' defaultMessage="Did you know you can help us take down phishing sites? Report them directly to Google using [this form]. Bookmark it so it' s always on hand!" />
    case 12: return <FormattedMessage id='scenes.home.didyouknow.content12' defaultMessage="Did you know you can identify whether a site protects your sensitive information with SSL? Simply look for a green lock in the left of your browser's URL bar." />
    case 13: return <FormattedMessage id='scenes.home.didyouknow.content13' defaultMessage="Beware of emails that say your Blockchain Wallet is suspended or locked. Because we're noncustodial, you're the only one who can manage your funds, keep them secure, and access your wallet. Learn more about this topic [here]." />
    case 14: return <FormattedMessage id='scenes.home.didyouknow.content14' defaultMessage='Phishing scams exist to try and deceive users into providing personal or financial information. Outsmart them by learning about the [most common tricks] used.' />
    case 15: return <FormattedMessage id='scenes.home.didyouknow.content15' defaultMessage="Like gold, bitcoins can never be doubled or multiplied. This is because the total number of coins and how they can be generated are already built-in to the protocol code. If a company claims they've discovered a magic doubling formula, consider that a sure-fire sign they're a scam." />
    case 16: return <FormattedMessage id='scenes.home.didyouknow.content16' defaultMessage='Blockchain does not offer bitcoin investment opportunities, but scams exist that desperately want you to believe otherwise. If one of these scams sneak their way into your inbox, be sure to do us a solid and grab a screenshot to share with our support team before you delete it.' />
    case 17: return <FormattedMessage id='scenes.home.didyouknow.content17' defaultMessage="Legitimate investing platforms do exist, but their scheming counterparts present some serious red flags: they' ll contact you through an unsolicited email, and they'll guarantee profits. Before investing with any platform, always do your research about the company's reptuation, location, and contact details." />
    case 18: return <FormattedMessage id='scenes.home.didyouknow.content18' defaultMessage='Every bitcoin address has an accompanying private key, which is what indicates ownership or control over funds at that particular address. In other words, who ever has the private key can spend those bitcoins. ' />
    case 19: return <FormattedMessage id='scenes.home.didyouknow.content19' defaultMessage="Your Blockchain wallet recovery phrase serves as the copy of your private keys. It' s also called your backup (or seed) and makes backing up a one- time process for all funds except Imported Addresses." />
    case 20: return <FormattedMessage id='scenes.home.didyouknow.content20' defaultMessage='Your passwords are considered secure as long as they are 16 characters minimum, unique, and include a diverse range of letters, numbers, and symbols. ' />
    case 21: return <FormattedMessage id='scenes.home.didyouknow.content21' defaultMessage='Advanced Send allows you to customize your bitcoin transaction fee. We recommend this feature for experienced users only.' />
    case 22: return <FormattedMessage id='scenes.home.didyouknow.content22' defaultMessage='Our wallet uses a dynamic fee structure. This means that when you send bitcoin, fees adjust based on network conditions & your transaction size.' />
    case 23: return <FormattedMessage id='scenes.home.didyouknow.content23' defaultMessage='You only have to write down your Wallet Recovery Phrase *once* to make sure all funds (except Imported Addresses) are backed up.' />
    default: return <div />
  }
}

const DidYouKnow = (props) => {
  const { number } = props

  return (
    <Wrapper>
      <Text size='24px' weight={300} color='blue' uppercase>
        <FormattedMessage id='scenes.home.didyouknow.title' defaultMessage='Did you know?' />
      </Text>
      <TextGroup inline>
        <PaddedIcon name='user' size='18px' color='blue' />
        <Text size='18px' weight={300} color='blue'>
          { selectTitle(number) }
        </Text>
      </TextGroup>
      <Text size='14px' weight={300}>
        { selectContent(number) }
      </Text>
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
