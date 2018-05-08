import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Exchange } from 'blockchain-wallet-v4/src'
import { type } from 'ramda'

import { TableCell, TableRow, Text, Link } from 'blockchain-info-components'
import OrderStatus from '../OrderStatus'

const tradeDateHelper = (trade) => type(trade.createdAt) === 'Number' ? new Date(trade.createdAt).toLocaleString() : trade.createdAt.toLocaleString()

const TradeItem = props => {
  const { conversion, handleClick, trade } = props
  const receiveAmount = trade.isBuy ? trade.receiveAmount : Exchange.displayFiatToFiat({ value: trade.receiveAmount })
  const exchangeAmount = trade.isBuy ? Exchange.displayFiatToFiat({ value: trade.sendAmount / conversion }) : trade.sendAmount / conversion

  return (
    <TableRow>
      <TableCell width='15%'>
        <OrderStatus status={trade.state} isBuy={trade.isBuy} />
      </TableCell>
      <TableCell width='15%'>
        <Link size='13px' weight={300} capitalize onClick={() => handleClick(trade)}>
          <FormattedMessage id='scenes.exchangehistory.list.details' defaultMessage='View details' />
        </Link>
      </TableCell>
      <TableCell width='30%'>
        <Text opacity={trade.state === 'processing'} size='13px' weight={300}>{tradeDateHelper(trade)}</Text>
      </TableCell>
      <TableCell width='20%'>
        <Text opacity={trade.state === 'processing'} size='13px' weight={300}>{`${exchangeAmount} ${trade.inCurrency}`}</Text>
      </TableCell>
      <TableCell width='20%'>
        <Text opacity={trade.state === 'processing'} size='13px' weight={300}>{`${receiveAmount} ${trade.outCurrency}`}</Text>
      </TableCell>
    </TableRow>
  )
}

TradeItem.propTypes = {
  trade: PropTypes.object.isRequired
}

export default TradeItem
