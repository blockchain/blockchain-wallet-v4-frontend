import React from 'react'
import { FormattedMessage } from 'react-intl'
import { TextGroup } from 'blockchain-info-components'

const title = <FormattedMessage id='scenes.faq.item5.question' defaultMessage='How much does it cost to send bitcoin?' />

const description = (
  <TextGroup>
    <FormattedMessage id='scenes.faq.item5.answer' defaultMessage='While our wallet is entirely free to use, the small fee included in your transaction goes to the miners, who help power the flow of transactions on the Bitcoin network.' />
    <FormattedMessage id='scenes.faq.item5.answer2' defaultMessage='To ensure your transactions confirm consistently and reliably, our wallet will automatically include an appropriate fee based on your transaction’s size and the level of network traffic at the time.' />
    <FormattedMessage id='scenes.faq.item5.answer3' defaultMessage='Before you send your transaction, you can view the included fee that we recommend.' />
    <FormattedMessage id='scenes.faq.item5.answer4' defaultMessage='If you wish to specify your own fee, you can do so under Advanced Send.' />
  </TextGroup>
)

export default { title, description }
