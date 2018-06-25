import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Exchange } from 'blockchain-wallet-v4/src'
import { canCancelTrade } from 'services/CoinifyService'
import { equals, prop } from 'ramda'
import moment from 'moment'
import { TableCell, TableRow, Text, Link, Icon, HeartbeatLoader } from 'blockchain-info-components'
import OrderStatus from '../OrderStatus'

export const OrderHistoryText = styled(Text)`
  font-size: 13px;
  @media (max-width: 480px) {
    font-size: 12px;
  }
`
export const OrderHistoryLink = styled(Link)`
  font-size: 13px;
  @media (max-width: 480px) {
    font-size: 12px;
  }
`

const tradeDateHelper = (trade) => {
  let timeFormat = 'MMMM D YYYY @ h:mm A'
  if (window.outerWidth <= 480) timeFormat = 'DD MMM'
  return moment(prop('createdAt', trade)).local().format(timeFormat)
}

const TradeItem = props => {
  const { conversion, handleClick, handleFinish, handleTradeCancel, trade, status, cancelTradeId } = props
  const receiveAmount = trade.isBuy ? trade.receiveAmount : Exchange.displayFiatToFiat({ value: trade.receiveAmount })
  const exchangeAmount = trade.isBuy ? Exchange.displayFiatToFiat({ value: trade.sendAmount / conversion.buy }) : trade.sendAmount / conversion.sell
  const canCancel = trade.isBuy && canCancelTrade(trade)
  const getOpacity = (trade) => equals(prop('state', trade), 'processing') ? 0.5 : 1

  return (
    <TableRow>
      <TableCell width='15%' mobileWidth='25%'>
        <OrderStatus status={trade.state} isBuy={trade.isBuy} />
      </TableCell>
      <TableCell width='15%' mobileWidth='20%'>
        {
          trade.state === 'awaiting_transfer_in' && trade.medium === 'card'
            ? <OrderHistoryLink weight={300} capitalize onClick={() => handleFinish(trade)}>
              <FormattedMessage id='buysell.orderhistory.finishtrade' defaultMessage='Finish Trade' />
            </OrderHistoryLink>
            : <OrderHistoryLink weight={300} capitalize onClick={() => handleClick(trade)}>
              <FormattedMessage id='buysell.orderhistory.list.details' defaultMessage='View details' />
            </OrderHistoryLink>
        }
      </TableCell>
      <TableCell width='30%' mobileWidth='20%'>
        <OrderHistoryText opacity={getOpacity(trade)} weight={300}>{tradeDateHelper(trade)}</OrderHistoryText>
      </TableCell>
      <TableCell width='20%' hideMobile>
        <OrderHistoryText opacity={getOpacity(trade)} weight={300}>{`${exchangeAmount} ${prop('inCurrency', trade)}`}</OrderHistoryText>
      </TableCell>
      <TableCell width='20%' mobileWidth='35%'>
        <TableCell width='80%'>
          <OrderHistoryText opacity={getOpacity(trade)} weight={300}>{`${receiveAmount} ${prop('outCurrency', trade)}`}</OrderHistoryText>
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
