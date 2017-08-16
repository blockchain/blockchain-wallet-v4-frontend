import React from 'react'
import { Text, TextGroup } from 'blockchain-info-components'

const title = <Text id='scenes.faq.item7.question' text='Can Blockchain see or access my funds?' />

const description = (
  <TextGroup>
    <Text id='scenes.faq.item7.answer' text='We are a noncustodial wallet and do not have access to your bitcoins.' altFont light />
    <Text id='scenes.faq.item7.answer2' text='This means we cannot view your total balance, make payments on your behalf, or prevent you from accessing your wallet.' altFont light />
    <Text id='scenes.faq.item7.answer3' text='With a Blockchain wallet, you retain complete ownership of your bitcoin.' altFont light />
  </TextGroup>
)

export default { title, description }
