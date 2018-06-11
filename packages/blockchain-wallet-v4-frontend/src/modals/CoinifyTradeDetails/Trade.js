import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { any, equals, prop, head } from 'ramda'
import moment from 'moment'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'

import { ModalHeader, ModalBody, Text, Button } from 'blockchain-info-components'
import { OrderDetailsTable, OrderDetailsRow } from 'components/BuySell/OrderDetails'
import { tradeDetails, statusHelper, bodyStatusHelper, recurringTimeHelper } from 'services/CoinifyService'

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
const RecurringTradeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
`
const RecurringBox = styled.div`
  border: 1px solid ${props => props.theme['brand-tertiary']};
  padding: 8px;
  background: ${props => props.theme['brand-quaternary']};
  margin-top: 5px;
`
const RecurringRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px 8px;
`
const RecurringKey = styled.div`
  width: 20%;
`
const RecurringValue = styled.div`
  width: auto;
`

const Trade = ({ trade, close, status, subscriptions }) => {
  let tradeStatus = (status && status.toLowerCase()) || trade.state
  const headerStatus = statusHelper(tradeStatus)
  const bodyStatus = bodyStatusHelper(tradeStatus, trade.isBuy)
  const details = tradeDetails.renderDetails(trade)
  const date = moment(prop('createdAt', trade)).local().format('MMMM D YYYY @ h:mm A')
  const isPendingSell = any(equals(prop('state', trade)))(['awaiting_transfer_in', 'processing']) && !prop('isBuy', trade)
  const subscription = subscriptions.filter(sub => equals(sub.id, trade.tradeSubscriptionId))

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
        <TableTitle size='13px' weight={400}><FormattedMessage id='orderdetails.payoutdetails' defaultMessage='Order Details' /></TableTitle>
        <StyledOrderDetailsTable>
          <OrderDetailsRow>
            <Text size='13px' weight={300}><FormattedMessage id='orderdetails.coinifytradeid' defaultMessage='Coinify Trade ID' /></Text>
            <Text size='13px' weight={300}>{`CNY-${prop('id', trade)}`}</Text>
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
        <TableTitle size='13px' weight={400}><FormattedMessage id='orderdetails.payoutdetails' defaultMessage='Payout Details' /></TableTitle>
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
        {
          isPendingSell &&
          <Text size='12px' weight={300}>
            <FormattedMessage id='orderdetails.footnote' defaultMessage='*Please note: depending on your bank’s tranfers policies, you will see the funds reflected in your account within 1-2 days from the transfer. ' />
          </Text>
        }
        {
          trade.tradeSubscriptionId
            ? <RecurringTradeWrapper>
              <Text color='brand-secondary' weight={400} size='14px'>
                <FormattedMessage id='orderdetails.thisisrecurring' defaultMessage='This is a Recurring Order' />
              </Text>
              <RecurringBox>
                <RecurringRow>
                  <RecurringKey>
                    <Text color='brand-secondary' weight={300} size='13px'>
                      <FormattedMessage id='orderdetails.recurring.amount' defaultMessage='Amount:' />
                    </Text>
                  </RecurringKey>
                  <RecurringValue>
                    <Text weight={300} size='13px'>
                      { `${Currency.formatFiat(prop('inAmount', trade) / 100)} ${prop('inCurrency', trade)}` }
                    </Text>
                  </RecurringValue>
                </RecurringRow>
                <RecurringRow>
                  <RecurringKey>
                    <Text color='brand-secondary' weight={300} size='13px'>
                      <FormattedMessage id='orderdetails.recurring.frequency' defaultMessage='Frequency:' />
                    </Text>
                  </RecurringKey>
                  <RecurringValue>
                    <Text weight={300} size='13px'>
                      {<FormattedMessage id='orderdetails.recurring.frequencybody' defaultMessage='Today and every {value}' values={{ value: recurringTimeHelper(head(subscription)) }} /> }
                    </Text>
                  </RecurringValue>
                </RecurringRow>
                <RecurringRow>
                  <RecurringKey>
                    <Text color='brand-secondary' weight={300} size='13px'>
                      <FormattedMessage id='orderdetails.recurring.duration' defaultMessage='Duration:' />
                    </Text>
                  </RecurringKey>
                  <RecurringValue>
                    <Text weight={300} size='13px'>
                      {
                        prop('endTime', subscription)
                          ? <FormattedMessage id='orderdetails.recurring.duration.endtime' defaultMessage='This order will repeat until {date}' values={{ date: new Date(prop('endTime', head(subscription))).toDateString() }} />
                          : <FormattedMessage id='orderdetails.recurring.duration.noendtime' defaultMessage='Until you cancel or reach your limit, whichever happens first.' />
                      }
                    </Text>
                  </RecurringValue>
                </RecurringRow>
              </RecurringBox>
            </RecurringTradeWrapper>
            : null
        }
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
