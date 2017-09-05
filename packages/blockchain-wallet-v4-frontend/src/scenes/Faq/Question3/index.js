import React from 'react'
import { FormattedMessage } from 'react-intl'
import { TextGroup } from 'blockchain-info-components'

const title = <FormattedMessage id='scenes.faq.item3.question' defaultMessage='What is the difference between a wallet ID and a bitcoin address?' />

const description = (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item3.answer' defaultMessage='A wallet ID is like a username, and it contains numbers, letters, and dashes.' />
    <FormattedMessage id='scenes.faq.item3.answer2' defaultMessage='It is only used to log into your wallet and should be kept private.' />
    <FormattedMessage id='scenes.faq.item3.answer3' defaultMessage='Your wallet ID can be found in the welcome email we sent you when you created your wallet or under Wallet Information in Settings.' />
    <FormattedMessage id='scenes.faq.item3.answer4' defaultMessage='A bitcoin address is what you share with others when you want to receive funds. To generate a new bitcoin address click on Receive.' />
  </TextGroup>
)

export default { title, description }
