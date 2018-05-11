import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const selectStyle = status => {
  switch (status) {
    case 'complete': return { color: 'success', italic: false }
    case 'failed': return { color: 'error', italic: false }
    case 'no_deposits': return { color: 'transferred', italic: false }
    case 'received': return { color: 'transferred', italic: false }
    case 'resolved': return { color: 'green', italic: false }
  }
}

const renderStatus = status => {
  switch (status) {
    case 'complete': return <FormattedMessage id='scenes.exchangehistory.list.orderstatus.complete' defaultMessage='Complete' />
    case 'failed': return <FormattedMessage id='scenes.exchangehistory.list.orderstatus.failed' defaultMessage='Failed' />
    case 'error': return <FormattedMessage id='scenes.exchangehistory.list.orderstatus.error' defaultMessage='Error' />
    case 'no_deposits':
    case 'received': return <FormattedMessage id='scenes.exchangehistory.list.orderstatus.pending' defaultMessage='In progress' />
    case 'resolved': return <FormattedMessage id='scenes.exchangehistory.list.orderstatus.refunded' defaultMessage='Refunded' />
    default: return <FormattedMessage id='scenes.exchangehistory.list.orderstatus.unknown' defaultMessage='Unknown' />
  }
}

const OrderStatus = props => {
  const { status } = props
  const style = selectStyle(status)

  return (
    <Text size='14px' weight={300} capitalize {...style}>
      {renderStatus(status)}
    </Text>
  )
}

export default OrderStatus
