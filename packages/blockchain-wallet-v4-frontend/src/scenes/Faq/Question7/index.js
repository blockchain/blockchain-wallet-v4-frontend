import React from 'react'
import { FormattedMessage } from 'react-intl'
import { TextGroup } from 'blockchain-info-components'

const title = <FormattedMessage id='scenes.faq.item7.question' defaultMessage='Can Blockchain see or access my funds?' />

const description = (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item7.answer' defaultMessage='We are a noncustodial wallet and do not have access to your bitcoins.' />
    <FormattedMessage id='scenes.faq.item7.answer2' defaultMessage='This means we cannot view your total balance, make payments on your behalf, or prevent you from accessing your wallet.' />
    <FormattedMessage id='scenes.faq.item7.answer3' defaultMessage='With a Blockchain wallet, you retain complete ownership of your bitcoin.' />
  </TextGroup>
)

export default { title, description }
