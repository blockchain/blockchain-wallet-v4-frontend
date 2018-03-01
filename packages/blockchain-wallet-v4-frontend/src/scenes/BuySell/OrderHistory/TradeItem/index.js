import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { TableCell, TableRow, Text, Link } from 'blockchain-info-components'
import OrderStatus from '../OrderStatus'

const TradeItem = props => {
  const { conversion, handleClick, trade } = props

  return (
    <TableRow>
      <TableCell width='15%'>
        <OrderStatus status={trade.state} />
      </TableCell>
      <TableCell width='15%'>
        <Link size='14px' weight={300} capitalize onClick={() => handleClick(trade)}>
          <FormattedMessage id='scenes.exchangehistory.list.details' defaultMessage='View details' />
        </Link>
      </TableCell>
      <TableCell width='30%'>
        <Text size='14px' weight={300}>{trade.createdAt.toLocaleString()}</Text>
      </TableCell>
      <TableCell width='20%'>
        <Text size='14px' weight={300}>{`${trade.receiveAmount} ${trade.outCurrency}`}</Text>
      </TableCell>
      <TableCell width='20%'>
        <Text size='14px' weight={300}>{`${trade.sendAmount / conversion} ${trade.inCurrency}`}</Text>
      </TableCell>
    </TableRow>
  )
}

TradeItem.propTypes = {
  trade: PropTypes.object.isRequired
}

export default TradeItem
