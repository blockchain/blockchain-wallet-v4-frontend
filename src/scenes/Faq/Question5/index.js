import React from 'react'
import { Text, TextGroup } from 'blockchain-info-components'

const title = <Text id='scenes.faq.item5.question' text='How much does it cost to send bitcoin?' />

const description = (
  <TextGroup>
    <Text id='scenes.faq.item5.answer' text='While our wallet is entirely free to use, the small fee included in your transaction goes to the miners, who help power the flow of transactions on the Bitcoin network.' altFont light />
    <Text id='scenes.faq.item5.answer2' text='To ensure your transactions confirm consistently and reliably, our wallet will automatically include an appropriate fee based on your transaction’s size and the level of network traffic at the time.' altFont light />
    <Text id='scenes.faq.item5.answer3' text='Before you send your transaction, you can view the included fee that we recommend.' altFont light />
    <Text id='scenes.faq.item5.answer4' text='If you wish to specify your own fee, you can do so under Advanced Send.' altFont light />
  </TextGroup>
)

export default { title, description }
