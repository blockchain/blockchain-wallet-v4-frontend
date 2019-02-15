import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { any, equals, prop } from 'ramda'
import moment from 'moment'

import Recurring from './Recurring'
import {
  ModalHeader,
  ModalBody,
  Text,
  Button
} from 'blockchain-info-components'
import {
  OrderDetailsTable,
  OrderDetailsRow
} from 'components/BuySell/OrderDetails'
import {
  tradeDetails,
  statusHelper,
  bodyStatusHelper
} from 'services/CoinifyService'

const TableTitle = styled(Text)`
  padding-top: 10px;
`
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

const Trade = ({ trade, close, status, subscriptions }) => {
  let tradeStatus = (status && status.toLowerCase()) || trade.state
  const headerStatus = statusHelper(tradeStatus)
  const bodyStatus = bodyStatusHelper(tradeStatus, trade.isBuy)
  const details = tradeDetails.renderDetails(trade)
  const date = moment(prop('createdAt', trade))
    .local()
    .format('MMMM D YYYY @ h:mm A')
  const isPendingSell =
    any(equals(prop('state', trade)))(['awaiting_transfer_in', 'processing']) &&
    !prop('isBuy', trade)
  const subscription = subscriptions.filter(sub =>
    equals(sub.id, trade.tradeSubscriptionId)
  )

  return (
    <Fragment>
      <ModalHeader onClose={close}>
        <Text color={headerStatus.color}>
          {trade.isBuy ? `Buy Trade` : 'Sell Trade'} {headerStatus.text}
        </Text>
      </ModalHeader>
      <ModalBody>
        <Text size='13px' weight={300}>
          {bodyStatus.text}
        </Text>
        <TableTitle size='13px' weight={400}>
          <FormattedMessage
            id='coinifytradedetails.orderdetails.orderdetails'
            defaultMessage='Order Details'
          />
        </TableTitle>
        <StyledOrderDetailsTable>
          <OrderDetailsRow>
            <Text size='13px' weight={300}>
              <FormattedMessage
                id='coinifytradedetails.orderdetails.coinifytradeid'
                defaultMessage='Coinify Trade ID'
              />
            </Text>
            <Text size='13px' weight={300}>{`CNY-${prop('id', trade)}`}</Text>
          </OrderDetailsRow>
          <OrderDetailsRow>
            <Text size='13px' weight={300}>
              <FormattedMessage
                id='coinifytradedetails.orderdetails.date'
                defaultMessage='Date Initialized'
              />
            </Text>
            <Text size='13px' weight={300}>
              {date}
            </Text>
          </OrderDetailsRow>
          <OrderDetailsRow>
            {trade.isBuy ? (
              <Text size='13px' weight={300}>
                <FormattedMessage
                  id='coinifytradedetails.orderdetails.amounttopurchase'
                  defaultMessage='Bitcoin Purchased'
                />
              </Text>
            ) : (
              <Text size='13px' weight={300}>
                <FormattedMessage
                  id='coinifytradedetails.orderdetails.amounttosell'
                  defaultMessage='Bitcoin Sold'
                />
              </Text>
            )}
            <Text size='13px' weight={300}>
              {prop('btcAmount', details)}
            </Text>
          </OrderDetailsRow>
        </StyledOrderDetailsTable>
        <TableTitle size='13px' weight={400}>
          <FormattedMessage
            id='coinifytradedetails.orderdetails.payoutdetails'
            defaultMessage='Payout Details'
          />
        </TableTitle>
        <StyledOrderDetailsTable>
          {!trade.isBuy && (
            <OrderDetailsRow>
              <Text size='13px' weight={300}>
                <FormattedMessage
                  id='coinifytradedetails.orderdetails.bankaccount'
                  defaultMessage='Bank Account'
                />
              </Text>
              <Text size='13px' weight={300}>
                {prop('bankAccountNumber', trade)}
              </Text>
            </OrderDetailsRow>
          )}
          <OrderDetailsRow>
            {trade.isBuy ? (
              <Text size='13px' weight={300}>
                <FormattedMessage
                  id='coinifytradedetails.orderdetails.totalcost'
                  defaultMessage='Total Cost'
                />
              </Text>
            ) : (
              <Text size='13px' weight={300}>
                <FormattedMessage
                  id='coinifytradedetails.orderdetails.totaltobereceived'
                  defaultMessage='Total To Be Received'
                />
              </Text>
            )}
            <Text size='13px' weight={300} color='success'>
              {prop('total', details)}
            </Text>
          </OrderDetailsRow>
        </StyledOrderDetailsTable>
        {isPendingSell && (
          <Text size='12px' weight={300}>
            <FormattedMessage
              id='coinifytradedetails.orderdetails.footnote'
              defaultMessage='*Please note: depending on your bank’s tranfers policies, you will see the funds reflected in your account within 1-2 days from the transfer. '
            />
          </Text>
        )}
        {trade.tradeSubscriptionId ? (
          <Recurring trade={trade} subscription={subscription} />
        ) : null}
        <ButtonRow>
          <Button width='100px' onClick={close} nature='primary'>
            <FormattedMessage
              id='modals.coinifytradedetails.trade.close'
              defaultMessage='Close'
            />
          </Button>
        </ButtonRow>
      </ModalBody>
    </Fragment>
  )
}

export default Trade
