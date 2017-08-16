import React from 'react'
import { RouterLink, Text, TextGroup } from 'blockchain-info-components'

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
