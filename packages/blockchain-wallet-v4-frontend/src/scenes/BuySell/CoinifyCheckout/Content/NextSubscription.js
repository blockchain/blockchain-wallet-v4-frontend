import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Text, Link } from 'blockchain-info-components'
import { prop, head } from 'ramda'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { recurringTimeHelper, recurringFee } from 'services/CoinifyService'

const NextRecurringWrapper = styled.div`
  background: ${props => props.theme['brand-quaternary']};
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
  div:first-of-type {
    margin-bottom: 20px;
  }
`
const NextRecurringRow = styled.div`
  display: flex;
  flex-direction: row;
  div:first-of-type {
    margin-right: 5px;
  }
`
const LinkContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`

const NextSubscription = ({ subscriptions, trades, manageOrder }) => {
  let matchedTrades = trades.filter(t => prop('tradeSubscriptionId', t) === prop('id', head(subscriptions)))
  let trade = matchedTrades.sort((a, b) => a.createdAt < b.createdAt)
  let nextTrade = head(trade)

  return (
    <NextRecurringWrapper>
      <Text size='14px' weight={300}>
        <FormattedMessage id='scenes.buysell.coinifycheckout.content.nextsubscription.title' defaultMessage='Your Next Recurring Order is Scheduled' />
      </Text>
      <NextRecurringRow>
        <Text size='13px' weight={300}>
          <FormattedMessage id='scenes.buysell.coinifycheckout.content.nextsubscription.amount' defaultMessage='Amount:' />
        </Text>
        <Text weight={200} size='13px'>
          {`${Currency.formatFiat(prop('inAmount', nextTrade) / 100)} ${prop('inCurrency', nextTrade)} (+ ${recurringFee(nextTrade)} Payment Fee)`}
        </Text>
      </NextRecurringRow>
      <NextRecurringRow>
        <Text weight={300} size='13px'>
          <FormattedMessage id='scenes.buysell.coinifycheckout.content.nextsubscription.frequency' defaultMessage='Frequency:' />
        </Text>
        <Text weight={200} size='13px'>
          {<FormattedMessage id='scenes.buysell.coinifycheckout.content.nextsubscription.frequencybody' defaultMessage='This order will happen every {value}' values={{ value: recurringTimeHelper(head(subscriptions)) }} />}
        </Text>
      </NextRecurringRow>
      <LinkContainer>
        <Link weight={300} size='13px' onClick={manageOrder}>
          <FormattedMessage id='scenes.buysell.coinifycheckout.content.nextsubscription.manageorder' defaultMessage='Manage This Order' />
        </Link>
      </LinkContainer>
    </NextRecurringWrapper>
  )
}

export default NextSubscription
