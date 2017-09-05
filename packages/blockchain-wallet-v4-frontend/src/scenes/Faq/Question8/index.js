import React from 'react'
import { FormattedMessage } from 'react-intl'
import { TextGroup } from 'blockchain-info-components'

const title = <FormattedMessage id='scenes.faq.item8.question' defaultMessage='Can Blockchain reset my password?' />

const description = (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item4.answer' defaultMessage='At Blockchain, we’re committed to letting customers maintain full control of their funds.' />
    <FormattedMessage id='scenes.faq.item4.answer2' defaultMessage='In that spirit, we never see or store your password, so we can’t reset it for you.' />
    <FormattedMessage id='scenes.faq.item4.answer3' defaultMessage='However, we do provide users a recovery phrase that can be used to restore access to your bitcoins.' />
    <FormattedMessage id='scenes.faq.item4.answer4' defaultMessage='Head over to our Security Center to get yours and make sure you store it somewhere secure and never share it.' />
  </TextGroup>
)

export default { title, description }
