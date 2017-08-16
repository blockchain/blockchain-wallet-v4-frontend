import React from 'react'
import { Text, TextGroup } from 'blockchain-info-components'

const title = <Text id='scenes.faq.item6.question' text='How do I know a transaction has been successfully received/sent?' />

const description = (
  <TextGroup>
    <Text id='scenes.faq.item6.answer' text='Transactions will appear almost instantly in your transaction feed which you can find on the left navigation of the wallet.' altFont light />
    <Text id='scenes.faq.item6.answer2' text='Your transaction is considered complete once it has received 3 network confirmations.' altFont light />
    <Text id='scenes.faq.item6.answer3' text='This typically takes about 30 minutes, but can vary. Until then your transaction will show up as pending.' altFont light />
  </TextGroup>
)

export default { title, description }
