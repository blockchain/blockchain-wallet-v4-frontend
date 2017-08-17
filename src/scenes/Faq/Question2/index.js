import React from 'react'
import { FormattedMessage } from 'react-intl'
import { RouterLink, TextGroup } from 'blockchain-info-components'

const title = <FormattedMessage id='scenes.faq.item2.question' defaultMessage='What do I need to do to keep my wallet safe?' />

const description = (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item2.answer' defaultMessage='Our Security Center can help you keep your wallet secure and ensure that you can access your funds even if you lose your password - all in less than 5 minutes.' />
    <FormattedMessage id='scenes.faq.item2.answer2' defaultMessage='A great place to start is to enable 2-Step Verification to help prevent unauthorized access to your wallet and write down your Recovery Phrase to make sure you never lose access to your funds.' />
    <FormattedMessage id='scenes.faq.item2.answer3' defaultMessage='We also recommend using a unique, random password that’s at least 16 characters or more.' />
    <RouterLink to='/security-center'>
      <FormattedMessage id='scenes.faq.item2.answer4' defaultMessage='Click here to get started' />
    </RouterLink>
  </TextGroup>
)

export default { title, description }
