import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { ModalHeader, ModalBody, Text, Button } from 'blockchain-info-components'
import { OrderDetailsTable, OrderDetailsRow } from 'components/BuySell/OrderDetails'
import { tradeDetails, statusHelper, bodyStatusHelper } from 'services/CoinifyService'
import { spacing } from 'services/StyleService'

const renderDetailsRow = (id, message, value, color) => (
  <OrderDetailsRow>
    <Text size='13px' weight={300}><FormattedMessage id={id} defaultMessage={message} /></Text>
    <Text size='13px' weight={300} color={color}>{value}</Text>
  </OrderDetailsRow>
)
const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`

const Trade = ({ trade, close }) => {
  const headerStatus = statusHelper(trade.state)
  const bodyStatus = bodyStatusHelper(trade.state, trade.isBuy)
  const details = tradeDetails.renderDetails(trade)

  return (
    <Fragment>
      <ModalHeader onClose={close}>
        <Text color={headerStatus.color}>
          { trade.isBuy ? `Buy Order` : 'Sell Order' } {headerStatus.text}
        </Text>
      </ModalHeader>
      <ModalBody>
        <Text size='13px' weight={300}>
          { bodyStatus.text }
        </Text>
        <Text style={spacing('pt-5')} size='13px' weight={300}>
          <FormattedMessage id='order_details.trade_id' defaultMessage={`Your order ID is: CNY-{id}`} values={{ id: trade.id }} />
        </Text>
        <OrderDetailsTable style={spacing('mt-10')}>
          {renderDetailsRow(
            'order_details.amount_to_purchase',
            trade.isBuy ? 'BTC Purchased' : 'BTC Sold',
            details.firstRow
          )}
          {renderDetailsRow(
            'order_details.trading_fee',
            'Trading Fee',
            details.fee
          )}
          {renderDetailsRow(
            'order_details.total_cost',
            trade.isBuy ? 'Total Cost' : 'Total To Be Received',
            details.total,
            'success'
          )}
        </OrderDetailsTable>
        <ButtonRow>
          <Button width='100px' onClick={close} nature='primary'>
            <FormattedMessage id='close' defaultMessage='Close' />
          </Button>
        </ButtonRow>
      </ModalBody>
    </Fragment>
  )
}

export default Trade
