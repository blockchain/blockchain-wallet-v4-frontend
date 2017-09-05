import React from 'react'
import { FormattedMessage } from 'react-intl'
import { TextGroup } from 'blockchain-info-components'

const title = <FormattedMessage id='scenes.faq.item4.question' defaultMessage='How do I receive/send bitcoin?' />

const description = (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item4.answer' defaultMessage='To receive bitcoin, the sender needs your bitcoin address.' />
    <FormattedMessage id='scenes.faq.item4.answer2' defaultMessage='Our wallet will automatically generate a new address for each transaction you want to make.' />
    <FormattedMessage id='scenes.faq.item4.answer3' defaultMessage='Click on Receive and copy the address to share with the sender.' />
    <FormattedMessage id='scenes.faq.item4.answer4' defaultMessage='To send bitcoin, click Send, enter the recipient’s bitcoin address in the ‘To’ field and how much you want to send.' />
  </TextGroup>
)

export default { title, description }
