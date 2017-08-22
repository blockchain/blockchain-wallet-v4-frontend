import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { TextGroup } from 'blockchain-info-components'

const title = <FormattedMessage id='scenes.faq.item1.question' defaultMessage='How do I buy bitcoin?' />

const description = (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item1.answer' defaultMessage='It’s simple, secure and seamless.' />
    <LinkContainer to='/buy-sell'>
      <FormattedMessage id='scenes.faq.item1.clickhere' defaultMessage='Click here to get started' />
    </LinkContainer>
  </TextGroup>
)

export default { title, description }
