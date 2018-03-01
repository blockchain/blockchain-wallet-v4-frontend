import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const selectStyle = status => {
  switch (status) {
    case 'processing': return { color: 'brand-tertiary', italic: true }
    case 'completed': return { color: 'success', italic: false }
    case 'rejected': return { color: 'error', italic: false }
    case 'failed': return { color: 'gray-6', italic: true }
  }
}

// completed, rejected, failed, processing

const renderStatus = status => {
  switch (status) {
    case 'processing': return <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.processing' defaultMessage='Processing' />
    case 'completed': return <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.completed' defaultMessage='Completed' />
    case 'rejected': return <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.rejected' defaultMessage='Rejected' />
    case 'failed': return <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.failed' defaultMessage='Failed' />
    default: return <FormattedMessage id='scenes.buysellorderhistory.list.orderstatus.unknown' defaultMessage='Unknown' />
  }
}

const OrderStatus = props => {
  const { status } = props
  const style = selectStyle(status)

  return (
    <Text size='14px' weight={300} {...style}>
      {renderStatus(status)}
    </Text>
  )
}

export default OrderStatus
