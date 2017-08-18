import React from 'react'
import { FormattedMessage } from 'react-intl'

import { TextGroup } from 'blockchain-info-components'
import RouterLink from 'components/RouterLink'

const title = <FormattedMessage id='scenes.faq.item1.question' defaultMessage='How do I buy bitcoin?' />

const description = (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item1.answer' defaultMessage='It’s simple, secure and seamless.' />
    <RouterLink to='/buy-sell'>
      <FormattedMessage id='scenes.faq.item1.clickhere' defaultMessage='Click here to get started' />
    </RouterLink>
  </TextGroup>
)

export default { title, description }
