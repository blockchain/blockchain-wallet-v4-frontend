import React from 'react'
import { Text, TextGroup } from 'blockchain-components'

const title = <Text id='scenes.faq.item3.question' text='What is the difference between a wallet ID and a bitcoin address?' />

const description = (
  <TextGroup>
    <Text id='scenes.faq.item3.answer' text='A wallet ID is like a username, and it contains numbers, letters, and dashes.' altFont light />
    <Text id='scenes.faq.item3.answer2' text='It is only used to log into your wallet and should be kept private.' altFont light />
    <Text id='scenes.faq.item3.answer3' text='Your wallet ID can be found in the welcome email we sent you when you created your wallet or under Wallet Information in Settings.' altFont light />
    <Text id='scenes.faq.item3.answer4' text='A bitcoin address is what you share with others when you want to receive funds. To generate a new bitcoin address click on Receive.' altFont light />
  </TextGroup>
)

export default { title, description }
