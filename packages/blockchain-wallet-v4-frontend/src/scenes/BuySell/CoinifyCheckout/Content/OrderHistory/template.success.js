import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { filter, contains, path, prop } from 'ramda'
import { Text } from 'blockchain-info-components'
import ISignThis from 'modals/CoinifyExchangeData/ISignThis'

import OrderHistoryTable from 'components/BuySell/OrderHistoryTable'
import RecurringOrderHistoryTable from './RecurringOrderHistoryTable'
import EmptyOrderHistoryContainer from 'components/BuySell/EmptyOrderHistory'

const OrderHistoryWrapper = styled.div`
  width: 100%;
  > div:last-child > div:last-child {
    margin-bottom: 0px;
  }
`
const OrderHistoryContent = styled.div`
  > div:first-child {
    margin-bottom: 10px;
  }
  > div:last-child {
    margin-bottom: 20px;
  }
`
const isPending = (t) =>
  contains(prop('state', t), ['processing', 'awaiting_transfer_in']) && !prop('tradeSubscriptionId', t)
const isCompleted = (t) =>
  contains(prop('state', t), ['completed', 'rejected', 'cancelled', 'expired']) && !prop('tradeSubscriptionId', t)
const isPartOfSubscription = (t) => prop('tradeSubscriptionId', t)

const OrderHistory = (props) => {
  const { showModal, finishTrade, cancelTrade, step, status, cancelTradeId,
    trade, changeTab, canTrade, value, onCancelSubscription } = props
  const { trades, subscriptions } = value
  const pendingTrades = filter(isPending, trades)

  if (step === 'isx') {
    return (
      <ISignThis
        iSignThisId={path(['iSignThisID'], trade)}
        options={props.options}
      />
    )
  } else {
    if (!trades.length) {
      return <EmptyOrderHistoryContainer changeTab={changeTab} />
    }
    const conversion = {
      buy: 100,
      sell: 1e8
    }
    return (
      <OrderHistoryWrapper>
        {
          pendingTrades.length > 0 &&
          <OrderHistoryContent>
            <Text size='15px' weight={400}>
              <FormattedMessage id='scenes.buysell.coinifycheckout.trades.pending' defaultMessage='Pending Orders' />
            </Text>
            <OrderHistoryTable
              trades={pendingTrades}
              conversion={conversion}
              handleFinishTrade={trade => finishTrade(trade)}
              handleDetailsClick={trade => showModal('CoinifyTradeDetails', { trade })}
              handleTradeCancel={cancelTrade}
              status={status}
              canTrade={canTrade}
              cancelTradeId={cancelTradeId}
            />
          </OrderHistoryContent>
        }
        {
          subscriptions.length > 0 &&
          <OrderHistoryContent>
            <Text size='15px' weight={400}>
              <FormattedMessage id='scenes.buysell.coinifycheckout.trades.recurring' defaultMessage='Recurring Orders' />
            </Text>
            <RecurringOrderHistoryTable
              subscriptions={subscriptions}
              trades={filter(isPartOfSubscription, trades)}
              conversion={conversion}
              handleFinishTrade={trade => finishTrade(trade)}
              handleDetailsClick={trade => showModal('CoinifyTradeDetails', { trade })}
              handleTradeCancel={cancelTrade}
              status={status}
              canTrade={canTrade}
              cancelTradeId={cancelTradeId}
              handleCancelSubscription={onCancelSubscription}
            />
          </OrderHistoryContent>
        }
        <OrderHistoryContent>
          <Text size='15px' weight={400}>
            <FormattedMessage id='scenes.buysell.coinifycheckout.trades.completed' defaultMessage='Completed Orders' />
          </Text>
          <OrderHistoryTable
            trades={filter(isCompleted, trades)}
            conversion={conversion}
            handleDetailsClick={trade => showModal('CoinifyTradeDetails', { trade })} />
        </OrderHistoryContent>
      </OrderHistoryWrapper>
    )
  }
}

export default OrderHistory
