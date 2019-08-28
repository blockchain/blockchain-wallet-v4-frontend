import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Exchange } from 'blockchain-wallet-v4/src'
import { canCancelTrade } from 'services/CoinifyService'
import { prop } from 'ramda'
import moment from 'moment'
import { RecurringTableRow } from '../components'
import {
  TableCell,
  Text,
  Link,
  Icon,
  HeartbeatLoader
} from 'blockchain-info-components'
import OrderStatus from 'components/BuySell/OrderHistoryTable/OrderStatus'
import media from 'services/ResponsiveService'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'

const StatusContainer = styled(TableCell)`
  display: flex;
  flex-basis: 30%;
  ${media.mobile`
    flex-direction: column;
  `};
`

const tradeDateHelper = (trade, isMobile) =>
  moment(prop('createdAt', trade))
    .local()
    .format(isMobile ? 'DD MMM' : 'MMMM D YYYY @ h:mm A')

const RecurringTradeItem = props => {
  const {
    handleClick,
    handleFinish,
    handleTradeCancel,
    trade,
    status,
    cancelTradeId,
    canTrade,
    border,
    padding
  } = props
  const conversion = {
    buy: 100,
    sell: 1e8
  }
  const receiveAmount = trade.isBuy
    ? trade.receiveAmount
    : Exchange.displayFiatToFiat({ value: trade.receiveAmount })
  const exchangeAmount = trade.isBuy
    ? Exchange.displayFiatToFiat({ value: trade.sendAmount / conversion.buy })
    : trade.sendAmount / conversion.sell
  const canCancel = canTrade && trade.isBuy && canCancelTrade(trade)

  return (
    <RecurringTableRow border={border} padding={padding}>
      <StatusContainer>
        <TableCell width='15%'>
          <OrderStatus status={trade.state} isBuy={trade.isBuy} />
        </TableCell>
        <TableCell width='15%'>
          {trade.state === 'awaiting_transfer_in' && trade.medium === 'card' ? (
            <Link
              size='13px'
              weight={400}
              capitalize
              onClick={() => handleFinish(trade)}
            >
              <FormattedMessage
                id='buysell.recurringtrade.orderhistory.finishtrade'
                defaultMessage='Finish Trade'
              />
            </Link>
          ) : (
            <Link
              size='13px'
              weight={400}
              capitalize
              onClick={() => handleClick(trade)}
            >
              <FormattedMessage
                id='buysell.recurringtrade.orderhistory.list.details'
                defaultMessage='View details'
              />
            </Link>
          )}
        </TableCell>
      </StatusContainer>
      <TableCell width='30%' mobileWidth='20%'>
        <MediaContextConsumer>
          {({ mobile }) => (
            <Text
              opacity={trade.state === 'processing'}
              size='13px'
              weight={400}
            >
              {tradeDateHelper(trade, mobile)}
            </Text>
          )}
        </MediaContextConsumer>
      </TableCell>
      <TableCell width='20%' mobileWidth='25%'>
        <Text
          opacity={trade.state === 'processing'}
          size='13px'
          weight={400}
        >{`${exchangeAmount} ${trade.inCurrency}`}</Text>
      </TableCell>
      <TableCell width='20%'>
        <TableCell width='80%'>
          <Text
            opacity={trade.state === 'processing'}
            size='13px'
            weight={400}
          >{`${receiveAmount} ${trade.outCurrency}`}</Text>
        </TableCell>
        <TableCell width='20%'>
          {canCancel && status && cancelTradeId === trade.id ? (
            <HeartbeatLoader color='red' height='15px' width='15px' />
          ) : canCancel && cancelTradeId !== trade.id ? (
            <Icon
              cursor
              onClick={() => handleTradeCancel(trade)}
              name='trash'
              size='14px'
              weight={400}
              color='error'
            />
          ) : null}
        </TableCell>
      </TableCell>
    </RecurringTableRow>
  )
}

RecurringTradeItem.propTypes = {
  trade: PropTypes.object.isRequired
}

export default RecurringTradeItem
