import React from 'react'
import { Text, TextGroup } from 'blockchain-components'

const title = <Text id='scenes.faq.item4.question' text='How do I receive/send bitcoin?' />

const description = (
  <TextGroup>
    <Text id='scenes.faq.item4.answer' text='To receive bitcoin, the sender needs your bitcoin address.' altFont light />
    <Text id='scenes.faq.item4.answer2' text='Our wallet will automatically generate a new address for each transaction you want to make.' altFont light />
    <Text id='scenes.faq.item4.answer3' text='Click on Receive and copy the address to share with the sender.' altFont light />
    <Text id='scenes.faq.item4.answer4' text='To send bitcoin, click Send, enter the recipient’s bitcoin address in the ‘To’ field and how much you want to send.' altFont light />
  </TextGroup>
)

export default { title, description }
