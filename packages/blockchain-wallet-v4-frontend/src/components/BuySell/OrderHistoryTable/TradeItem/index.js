import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Exchange } from 'blockchain-wallet-v4/src'
import { canCancelTrade } from 'services/CoinifyService'
import { equals, prop } from 'ramda'
import moment from 'moment'

import { TableCell, TableRow, Text, Link, Icon, HeartbeatLoader } from 'blockchain-info-components'
import OrderStatus from '../OrderStatus'

const tradeDateHelper = (trade) => moment(prop('createdAt', trade)).local().format('MMMM D YYYY @ h:mm A')

const TradeItem = props => {
  const { conversion, handleClick, handleFinish, handleTradeCancel, trade, status, cancelTradeId, canTrade } = props
  const receiveAmount = trade.isBuy ? trade.receiveAmount : Exchange.displayFiatToFiat({ value: trade.receiveAmount })
  const exchangeAmount = trade.isBuy ? Exchange.displayFiatToFiat({ value: trade.sendAmount / conversion.buy }) : trade.sendAmount / conversion.sell
  const canCancel = (canTrade && trade.isBuy) && canCancelTrade(trade)
  const getOpacity = (trade) => equals(prop('state', trade), 'processing') ? 0.5 : 1

  return (
    <TableRow>
      <TableCell width='15%'>
        <OrderStatus status={trade.state} isBuy={trade.isBuy} />
      </TableCell>
      <TableCell width='15%'>
        {
          trade.state === 'awaiting_transfer_in' && trade.medium === 'card'
            ? <Link size='13px' weight={300} capitalize onClick={() => handleFinish(trade)}>
              <FormattedMessage id='buysell.orderhistory.finishtrade' defaultMessage='Finish Trade' />
            </Link>
            : <Link size='13px' weight={300} capitalize onClick={() => handleClick(trade)}>
              <FormattedMessage id='buysell.orderhistory.list.details' defaultMessage='View details' />
            </Link>
        }
      </TableCell>
      <TableCell width='30%'>
        <Text opacity={getOpacity(trade)} size='13px' weight={300}>{tradeDateHelper(trade)}</Text>
      </TableCell>
      <TableCell width='20%'>
        <Text opacity={getOpacity(trade)} size='13px' weight={300}>{`${exchangeAmount} ${prop('inCurrency', trade)}`}</Text>
      </TableCell>
      <TableCell width='20%'>
        <TableCell width='80%'>
          <Text opacity={getOpacity(trade)} size='13px' weight={300}>{`${receiveAmount} ${prop('outCurrency', trade)}`}</Text>
        </TableCell>
        <TableCell width='20%'>
          {
            canCancel && status && cancelTradeId === trade.id
              ? <HeartbeatLoader color='red' height='15px' width='15px' />
              : canCancel && cancelTradeId !== trade.id
                ? <Icon cursor onClick={() => handleTradeCancel(trade)} name='trash' size='14px' weight={300} color='error' />
                : null
          }
        </TableCell>
      </TableCell>
    </TableRow>
  )
}

TradeItem.propTypes = {
  trade: PropTypes.object.isRequired
}

export default TradeItem
