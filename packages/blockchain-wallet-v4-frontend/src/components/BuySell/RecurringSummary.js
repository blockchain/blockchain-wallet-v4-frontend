import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text, TooltipHost, Icon } from 'blockchain-info-components'
import {
  reviewOrder,
  recurringTimeHelper,
  recurringFee
} from 'services/CoinifyService'
import media from 'services/ResponsiveService'
import { prop, head } from 'ramda'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'

const RecurringTradeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${props => props.orderReview ? '5px' : '15px'};
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
  ${media.mobile`
    flex-direction: column;
  `};
`
const RecurringKey = styled.div`
  width: 20%;
`
const RecurringValue = styled.div`
  width: 80%;
`
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  div:first-of-type {
    margin-right: 5px;
  }
`
const RecurringWarningText = styled(Text)`
  padding: 10px 8px;
`
const CustomHost = styled(TooltipHost)`
  margin-left: 3px;
`

const RecurringSummary = ({ orderReview, quoteR, trade, subscription }) => {
  return (
    <RecurringTradeWrapper orderReview>
      {
        orderReview
          ? null
          : <HeaderWrapper>
            <Text color='brand-secondary' weight={400} size='14px'>
              <FormattedMessage
                id='orderdetails.recurring.thisisrecurring'
                defaultMessage='This is a Recurring Order'
              />
            </Text>
            <TooltipHost id='recurring.tooltip'>
              <Icon name='question-in-circle' />
            </TooltipHost>
          </HeaderWrapper>
      }
      <RecurringBox>
        {
          orderReview
            ? <RecurringWarningText weight={300} size='13px'>
              <FormattedMessage
                id='orderdetails.recurring.setup'
                defaultMessage='You are about to set up a {frequency} Recurring Order. To cancel a Recurring Order, visit the Order History tab.'
                values={{ frequency: prop('frequency', head(subscription)) }}
              />
            </RecurringWarningText>
            : null
        }
        <RecurringRow>
          <RecurringKey>
            <Text color='brand-secondary' weight={300} size='13px'>
              <FormattedMessage
                id='orderdetails.recurring.amount'
                defaultMessage='Amount:'
              />
            </Text>
          </RecurringKey>
          <RecurringValue>
            {
              orderReview
                ? <Text weight={300} size='13px' flexRow>
                  {quoteR
                    .map(q => reviewOrder.renderRecurringAmount(q))
                    .getOrElse('~')
                  }
                  {
                    orderReview
                      ? <CustomHost id='recurring.tooltip'>
                        <Icon name='question-in-circle' />
                      </CustomHost>
                      : null
                  }
                </Text>
                : <Text weight={300} size='13px'>
                  {`${Currency.formatFiat(prop('inAmount', trade) / 100)} ${prop(
                    'inCurrency',
                    trade
                  )} (+ ${recurringFee(trade)} Payment Fee)`}
                </Text>
            }

          </RecurringValue>
        </RecurringRow>
        <RecurringRow>
          <RecurringKey>
            <Text color='brand-secondary' weight={300} size='13px'>
              <FormattedMessage
                id='orderdetails.recurring.frequency'
                defaultMessage='Frequency:'
              />
            </Text>
          </RecurringKey>
          <RecurringValue>
            <Text weight={300} size='13px'>
              <FormattedMessage
                id='orderdetails.recurring.frequencybody'
                defaultMessage='Today and every {value}'
                values={{ value: recurringTimeHelper(head(subscription)) }}
              />
            </Text>
          </RecurringValue>
        </RecurringRow>
        <RecurringRow>
          <RecurringKey>
            <Text color='brand-secondary' weight={300} size='13px'>
              <FormattedMessage
                id='orderdetails.recurring.duration'
                defaultMessage='Duration:'
              />
            </Text>
          </RecurringKey>
          <RecurringValue>
            <Text weight={300} size='13px'>
              {prop('endTime', head(subscription)) ? (
                <FormattedMessage
                  id='orderdetails.recurring.duration.endtime'
                  defaultMessage='This order will repeat until {date}'
                  values={{
                    date: new Date(
                      prop('endTime', head(subscription))
                    ).toDateString()
                  }}
                />
              ) : (
                <FormattedMessage
                  id='orderdetails.recurring.duration.noendtime'
                  defaultMessage='Until you cancel or reach your limit, whichever happens first.'
                />
              )}
            </Text>
          </RecurringValue>
        </RecurringRow>
      </RecurringBox>
    </RecurringTradeWrapper>
  )
}

export default RecurringSummary
