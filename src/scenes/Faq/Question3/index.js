import React from 'react'
import { FormattedMessage } from 'react-intl'

const title = (
  <div>
    <FormattedMessage id='scenes.faq.item3.question' defaultMessage='What is the difference between a wallet ID and a bitcoin address?' />
  </div>
)

const description = (
  <div>
    <FormattedMessage id='scenes.faq.item3.answer' defaultMessage='A wallet ID is like a username, and it contains numbers, letters, and dashes.
    It is only used to log into your wallet and should be kept private.
    Your wallet ID can be found in the welcome email we sent you when you created your wallet or under Wallet Information in Settings.
    A bitcoin address is what you share with others when you want to receive funds. To generate a new bitcoin address click on Receive.' />
  </div>
)

export default {
  title, description
}
