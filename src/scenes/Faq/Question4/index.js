import React from 'react'
import { FormattedMessage } from 'react-intl'

const title = (
  <div>
    <FormattedMessage id='scenes.faq.item4.question' defaultMessage='How do I receive/send bitcoin?' />
  </div>
)

const description = (
  <div>
    <FormattedMessage id='scenes.faq.item4.answer' defaultMessage='To receive bitcoin, the sender needs your bitcoin address.
    Our wallet will automatically generate a new address for each transaction you want to make.
    Click on Receive and copy the address to share with the sender.
    To send bitcoin, click Send, enter the recipient’s bitcoin address in the ‘To’ field and how much you want to send.' />
  </div>
)

export default {
  title, description
}
