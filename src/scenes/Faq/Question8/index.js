import React from 'react'
import { Text, TextGroup } from 'components/generic/Text'

const title = <Text id='scenes.faq.item8.question' text='Can Blockchain reset my password?' />

const description = (
  <TextGroup>
    <Text id='scenes.faq.item4.answer' text='At Blockchain, we’re committed to letting customers maintain full control of their funds.' altFont light />
    <Text id='scenes.faq.item4.answer2' text='In that spirit, we never see or store your password, so we can’t reset it for you.' altFont light />
    <Text id='scenes.faq.item4.answer3' text='However, we do provide users a recovery phrase that can be used to restore access to your bitcoins.' altFont light />
    <Text id='scenes.faq.item4.answer4' text='Head over to our Security Center to get yours and make sure you store it somewhere secure and never share it.' altFont light />
  </TextGroup>
)

export default { title, description }
