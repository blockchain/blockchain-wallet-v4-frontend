import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { TableCell, TableRow, Text, Link } from 'blockchain-info-components'
import OrderStatus from './OrderStatus'

const TradeItem = props => {
  const { trade, handleClick } = props
  const { status, date, sourceCoin, targetCoin, quote } = trade
  const { depositAmount, withdrawalAmount, deposit } = quote

  return (
    <TableRow>
      <TableCell width='15%'>
        <OrderStatus status={status} />
      </TableCell>
      <TableCell width='15%'>
        <Link size='14px' weight={300} capitalize onClick={() => handleClick(deposit)}>
          <FormattedMessage id='scenes.exchangehistory.list.tradeitem' defaultMessage='View details' />
        </Link>
      </TableCell>
      <TableCell width='30%'>
        <Text size='14px' weight={300}>{date}</Text>
      </TableCell>
      <TableCell width='20%'>
        <Text size='14px' weight={300}>{`${depositAmount} ${sourceCoin}`}</Text>
      </TableCell>
      <TableCell width='20%'>
        <Text size='14px' weight={300}>{`${withdrawalAmount} ${targetCoin}`}</Text>
      </TableCell>
    </TableRow>
  )
}

TradeItem.propTypes = {
  trade: PropTypes.object.isRequired
}

export default TradeItem
