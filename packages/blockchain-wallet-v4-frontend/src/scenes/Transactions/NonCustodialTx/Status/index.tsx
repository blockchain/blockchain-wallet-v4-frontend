import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Status = (props: Props) => (
  <Text size='16px' color='grey800' weight={600} data-e2e='txTypeText'>
    {props.type === 'sent' && (
      <FormattedMessage
        id='scenes.transactions.bitcoin.content.list.listitem.status.sent'
        defaultMessage='Sent {coin}'
        values={{ coin: props.coinTicker }}
      />
    )}
    {props.type === 'received' && (
      <FormattedMessage
        id='scenes.transactions.bitcoin.content.list.listitem.status.received'
        defaultMessage='Received {coin}'
        values={{ coin: props.coinTicker }}
      />
    )}
    {props.type === 'transferred' && (
      <FormattedMessage
        id='scenes.transactions.bitcoin.content.list.listitem.status.transferred'
        defaultMessage='Transferred {coin}'
        values={{ coin: props.coinTicker }}
      />
    )}
  </Text>
)

type Props = {
  coinTicker: string
  type: 'sent' | 'received' | 'transferred'
}

export default Status
