import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { filter, contains, path } from 'ramda'
import { Text } from 'blockchain-info-components'
import ISignThis from 'modals/CoinifyExchangeData/ISignThis'

import OrderHistoryTable from 'components/BuySell/OrderHistoryTable'
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
const isPending = (t) => t.state === 'processing' || t.state === 'awaiting_transfer_in'
const isCompleted = (t) => contains(t.state, ['completed', 'rejected', 'cancelled', 'expired'])

const OrderHistory = (props) => {
  const { showModal, finishTrade, cancelTrade, trades, step, trade, status, cancelTradeId, changeTab } = props

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
        <OrderHistoryContent>
          <Text size='15px' weight={400}>
            <FormattedMessage id='scenes.buysell.coinifycheckout.trades.pending' defaultMessage='Pending Orders' />
          </Text>
          <OrderHistoryTable trades={filter(isPending, trades)} conversion={conversion} handleFinishTrade={trade => finishTrade(trade)} handleDetailsClick={trade => showModal('CoinifyTradeDetails', { trade })} handleTradeCancel={cancelTrade} status={status} cancelTradeId={cancelTradeId} />
        </OrderHistoryContent>
        <OrderHistoryContent>
          <Text size='15px' weight={400}>
            <FormattedMessage id='scenes.buysell.coinifycheckout.trades.completed' defaultMessage='Completed Orders' />
          </Text>
          <OrderHistoryTable trades={filter(isCompleted, trades)} conversion={conversion} handleDetailsClick={trade => showModal('CoinifyTradeDetails', { trade })} />
        </OrderHistoryContent>
      </OrderHistoryWrapper>
    )
  }
}

export default OrderHistory
