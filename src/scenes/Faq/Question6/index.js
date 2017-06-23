import React from 'react'
import { FormattedMessage } from 'react-intl'

const title = (
  <div>
    <FormattedMessage id='scenes.faq.item6.question' defaultMessage='How do I know a transaction has been successfully received/sent?' />
  </div>
)

const description = (
  <div>
    <FormattedMessage id='scenes.faq.item6.answer' defaultMessage='Transactions will appear almost instantly in your transaction feed
    which you can find on the left navigation of the wallet. Your transaction is considered complete once it has received 3 network confirmations.
    This typically takes about 30 minutes, but can vary. Until then your transaction will show up as pending. ' />
  </div>
)

export default {
  title, description
}
