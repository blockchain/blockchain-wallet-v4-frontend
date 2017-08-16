import React from 'react'
import { RouterLink, Text, TextGroup } from 'blockchain-info-components'

const title = <Text id='scenes.faq.item2.question' text='What do I need to do to keep my wallet safe?' />

const description = (
  <TextGroup>
    <Text id='scenes.faq.item2.answer' text='Our Security Center can help you keep your wallet secure and ensure that you can access your funds even if you lose your password - all in less than 5 minutes.' altFont light />
    <Text id='scenes.faq.item2.answer2' text='A great place to start is to enable 2-Step Verification to help prevent unauthorized access to your wallet and write down your Recovery Phrase to make sure you never lose access to your funds.' altFont light />
    <Text id='scenes.faq.item2.answer3' text='We also recommend using a unique, random password that’s at least 16 characters or more.' altFont light />
    <RouterLink to='/security-center'>
      <Text id='scenes.faq.item2.answer4' text='Click here to get started' altFont light cyan />
    </RouterLink>
  </TextGroup>
)

export default { title, description }
