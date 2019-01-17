import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Status = props => (
  <Text
    size='14px'
    weight={500}
    color={props.type}
    style={{ marginBottom: '5px' }}
    data-e2e='transactionListItemStatus'
  >
    {props.type === 'sent' && (
      <FormattedMessage
        id='scenes.transactions.bitcoin.content.list.listitem.status.sent'
        defaultMessage='Sent {coin}'
        values={{ coin: props.coin }}
      />
    )}
    {props.type === 'received' && (
      <FormattedMessage
        id='scenes.transactions.bitcoin.content.list.listitem.status.received'
        defaultMessage='Received {coin}'
        values={{ coin: props.coin }}
      />
    )}
    {props.type === 'transferred' && (
      <FormattedMessage
        id='scenes.transactions.bitcoin.content.list.listitem.status.transferred'
        defaultMessage='Transferred {coin}'
        values={{ coin: props.coin }}
      />
    )}
  </Text>
)

Status.propTypes = {
  type: PropTypes.string.isRequired
}

export default Status
