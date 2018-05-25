import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { ModalHeader, ModalBody, Text, Button } from 'blockchain-info-components'
import { OrderDetailsTable, OrderDetailsRow } from 'components/BuySell/OrderDetails'
import { tradeDetails, statusHelper, bodyStatusHelper } from 'services/CoinifyService'
import { spacing } from 'services/StyleService'

export const ButtonRow = styled.div`
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
          <FormattedMessage id='modals.coinifytradedetails.trade.tradeid' defaultMessage='Your order ID is: CNY-{id}' values={{ id: trade.id }} />
        </Text>
        <OrderDetailsTable style={spacing('mt-10')}>
          <OrderDetailsRow>
            {
              trade.isBuy
                ? <Text size='13px' weight={300}><FormattedMessage id='orderdetails.amounttopurchase' defaultMessage='BTC Purchased' /></Text>
                : <Text size='13px' weight={300}><FormattedMessage id='orderdetails.amounttosell' defaultMessage='BTC Sold' /></Text>
            }
            <Text size='13px' weight={300}>{details.firstRow}</Text>
          </OrderDetailsRow>
          <OrderDetailsRow>
            <Text size='13px' weight={300}><FormattedMessage id='orderdetails.tradingfee' defaultMessage='Trading Fee' /></Text>
            <Text size='13px' weight={300}>{details.fee}</Text>
          </OrderDetailsRow>
          <OrderDetailsRow>
            {
              trade.isBuy
                ? <Text size='13px' weight={300}><FormattedMessage id='orderdetails.totalcost' defaultMessage='Total Cost' /></Text>
                : <Text size='13px' weight={300}><FormattedMessage id='orderdetails.totaltobereceived' defaultMessage='Total To Be Received' /></Text>
            }
            <Text size='13px' weight={300} color='success'>{details.total}</Text>
          </OrderDetailsRow>
        </OrderDetailsTable>
        <ButtonRow>
          <Button width='100px' onClick={close} nature='primary'>
            <FormattedMessage id='modals.coinifytradedetails.trade.close' defaultMessage='Close' />
          </Button>
        </ButtonRow>
      </ModalBody>
    </Fragment>
  )
}

export default Trade
