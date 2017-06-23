import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

const title = (
  <div>
    <FormattedMessage id='scenes.faq.item2.question' defaultMessage='What do I need to do to keep my wallet safe?' />
  </div>
)

const description = (
  <div>
    <FormattedMessage id='scenes.faq.item2.answer' defaultMessage='Our Security Center can help you keep your wallet secure and ensure that
    you can access your funds even if you lose your password - all in less than 5 minutes.
    A great place to start is to enable 2-Step Verification to help prevent unauthorized access to your wallet and
    write down your Recovery Phrase to make sure you never lose access to your funds.
    We also recommend using a unique, random password that’s at least 16 characters or more.' />
    <NavLink to='/security-center'>
      <FormattedMessage id='scenes.faq.item2.clickhere' defaultMessage='Click here to get started' />
    </NavLink>
  </div>
)

export default {
  title, description
}
