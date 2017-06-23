import React from 'react'
import { FormattedMessage } from 'react-intl'

const title = (
  <div>
    <FormattedMessage id='scenes.faq.item7.question' defaultMessage='Can Blockchain see or access my funds?' />
  </div>
)

const description = (
  <div>
    <FormattedMessage id='scenes.faq.item7.answer' defaultMessage='We are a noncustodial wallet and do not have access to your bitcoins.
    This means we cannot view your total balance, make payments on your behalf, or prevent you from accessing your wallet.
    With a Blockchain wallet, you retain complete ownership of your bitcoin.' />
  </div>
)

export default {
  title, description
}
