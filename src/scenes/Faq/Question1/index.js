import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

const title = (
  <div>
    <FormattedMessage id='scenes.faq.item1.question' defaultMessage='How do I buy bitcoin?' />
  </div>
)

const description = (
  <div>
    <FormattedMessage id='scenes.faq.item1.answer' defaultMessage='It’s simple, secure and seamless.' />
    <NavLink to='/buy-sell'>
      <FormattedMessage id='scenes.faq.item1.clickhere' defaultMessage='Click here to get started' />
    </NavLink>
  </div>
)

export default {
  title, description
}
