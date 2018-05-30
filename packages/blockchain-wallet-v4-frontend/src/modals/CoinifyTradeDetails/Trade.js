import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'
import moment from 'moment'

import { ModalHeader, ModalBody, Text, Button } from 'blockchain-info-components'
import { OrderDetailsTable, OrderDetailsRow } from 'components/BuySell/OrderDetails'
import { tradeDetails, statusHelper, bodyStatusHelper } from 'services/CoinifyService'
import { spacing } from 'services/StyleService'

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`
const StyledOrderDetailsTable = styled(OrderDetailsTable)`
  margin-top: 10px;
  margin-bottom: 10px;
`

const Trade = ({ trade, close }) => {
  const headerStatus = statusHelper(trade.state)
  const bodyStatus = bodyStatusHelper(trade.state, trade.isBuy)
  const details = tradeDetails.renderDetails(trade)
  const date = moment(prop('createdAt', trade)).local().format('MMMM D YYYY @ h:mm A')

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
        <StyledOrderDetailsTable style={spacing('mt-10')}>
          <OrderDetailsRow>
            <Text size='13px' weight={300}><FormattedMessage id='orderdetails.coinifytradeid' defaultMessage='Coinify Trade ID' /></Text>
            <Text size='13px' weight={300}>{prop('id', trade)}</Text>
          </OrderDetailsRow>
          <OrderDetailsRow>
            <Text size='13px' weight={300}><FormattedMessage id='orderdetails.date' defaultMessage='Date Initialized' /></Text>
            <Text size='13px' weight={300}>{date}</Text>
          </OrderDetailsRow>
          <OrderDetailsRow>
            {
              trade.isBuy
                ? <Text size='13px' weight={300}><FormattedMessage id='orderdetails.amounttopurchase' defaultMessage='Bitcoin Purchased' /></Text>
                : <Text size='13px' weight={300}><FormattedMessage id='orderdetails.amounttosell' defaultMessage='Bitcoin Sold' /></Text>
            }
            <Text size='13px' weight={300}>{prop('btcAmount', details)}</Text>
          </OrderDetailsRow>
        </StyledOrderDetailsTable>
        <Text size='13px' weight={300}><FormattedMessage id='orderdetails.payoutdetails' defaultMessage='Payout Details' /></Text>
        <StyledOrderDetailsTable>
          {
            !trade.isBuy &&
            <OrderDetailsRow>
              <Text size='13px' weight={300}><FormattedMessage id='orderdetails.bankaccount' defaultMessage='Bank Account' /></Text>
              <Text size='13px' weight={300}>{prop('bankAccountNumber', trade)}</Text>
            </OrderDetailsRow>
          }
          <OrderDetailsRow>
            {
              trade.isBuy
                ? <Text size='13px' weight={300}><FormattedMessage id='orderdetails.totalcost' defaultMessage='Total Cost' /></Text>
                : <Text size='13px' weight={300}><FormattedMessage id='orderdetails.totaltobereceived' defaultMessage='Total To Be Received' /></Text>
            }
            <Text size='13px' weight={300} color='success'>{prop('total', details)}</Text>
          </OrderDetailsRow>
        </StyledOrderDetailsTable>
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
