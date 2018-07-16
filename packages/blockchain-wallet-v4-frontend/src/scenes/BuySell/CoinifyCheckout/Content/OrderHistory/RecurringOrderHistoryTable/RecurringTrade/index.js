import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Exchange } from 'blockchain-wallet-v4/src'
import { canCancelTrade } from 'services/CoinifyService'
import { prop } from 'ramda'
import moment from 'moment'
import { RecurringTableRow } from '../components'

import { TableCell, Text, Link, Icon, HeartbeatLoader } from 'blockchain-info-components'
import OrderStatus from 'components/BuySell/OrderHistoryTable/OrderStatus'

const tradeDateHelper = (trade) => moment(prop('createdAt', trade)).local().format('MMMM D YYYY @ h:mm A')

const RecurringTradeItem = props => {
  const { conversion, handleClick, handleFinish, handleTradeCancel, trade, status, cancelTradeId, canTrade, border, padding } = props
  const receiveAmount = trade.isBuy ? trade.receiveAmount : Exchange.displayFiatToFiat({ value: trade.receiveAmount })
  const exchangeAmount = trade.isBuy ? Exchange.displayFiatToFiat({ value: trade.sendAmount / conversion.buy }) : trade.sendAmount / conversion.sell
  const canCancel = (canTrade && trade.isBuy) && canCancelTrade(trade)

  return (
    <RecurringTableRow border={border} padding={padding}>
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
        <Text opacity={trade.state === 'processing'} size='13px' weight={300}>{tradeDateHelper(trade)}</Text>
      </TableCell>
      <TableCell width='20%'>
        <Text opacity={trade.state === 'processing'} size='13px' weight={300}>{`${exchangeAmount} ${trade.inCurrency}`}</Text>
      </TableCell>
      <TableCell width='20%'>
        <TableCell width='80%'>
          <Text opacity={trade.state === 'processing'} size='13px' weight={300}>{`${receiveAmount} ${trade.outCurrency}`}</Text>
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
    </RecurringTableRow>
  )
}

RecurringTradeItem.propTypes = {
  trade: PropTypes.object.isRequired
}

export default RecurringTradeItem
