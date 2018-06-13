import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { prop, head } from 'ramda'

import { Text, Tooltip } from 'blockchain-info-components'
import { recurringTimeHelper, recurringFee } from 'services/CoinifyService'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'

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
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  div:first-of-type {
    margin-right: 5px;
  }
`

const Recurring = ({ trade, subscription }) => {
  return (
    <RecurringTradeWrapper>
      <HeaderWrapper>
        <Text color='brand-secondary' weight={400} size='14px'>
          <FormattedMessage id='orderdetails.recurring.thisisrecurring' defaultMessage='This is a Recurring Order' />
        </Text>
        <Tooltip>
          <FormattedMessage id='orderdetails.recurring.tooltip' defaultMessage='Recurring orders will be placed automatically on a regular basis from your linked credit card.' />
        </Tooltip>
      </HeaderWrapper>
      <RecurringBox>
        <RecurringRow>
          <RecurringKey>
            <Text color='brand-secondary' weight={300} size='13px'>
              <FormattedMessage id='orderdetails.recurring.amount' defaultMessage='Amount:' />
            </Text>
          </RecurringKey>
          <RecurringValue>
            <Text weight={300} size='13px'>
              {`${Currency.formatFiat(prop('inAmount', trade) / 100)} ${prop('inCurrency', trade)} (+ ${recurringFee(trade)} Payment Fee)`}
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
              {<FormattedMessage id='orderdetails.recurring.frequencybody' defaultMessage='Today and every {value}' values={{ value: recurringTimeHelper(head(subscription)) }} />}
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
  )
}

export default Recurring
