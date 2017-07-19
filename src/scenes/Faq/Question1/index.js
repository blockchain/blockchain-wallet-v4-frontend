import React from 'react'
import { RouterLink } from 'components/generic/Link'
import { Text, TextGroup } from 'components/generic/Text'

const title = <Text id='scenes.faq.item1.question' text='How do I buy bitcoin?' />

const description = (
  <TextGroup>
    <Text id='scenes.faq.item1.answer' text='It’s simple, secure and seamless.' altFont light />
    <RouterLink to='/buy-sell'>
      <Text id='scenes.faq.item1.clickhere' text='Click here to get started' altFont light cyan />
    </RouterLink>
  </TextGroup>
)

export default { title, description }
