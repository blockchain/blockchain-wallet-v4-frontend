import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'

import { model } from 'data'
import { Text } from 'blockchain-info-components'
import LimitsUpdateLink from './LimitsUpdateLink'
import MaximumAmountLink from './MaximumAmountLink'
import MinimumAmountLink from './MinimumAmountLink'
import CheckConfirmationLink from './CheckConfirmationLink'
import { formatAmount } from './template.success'

const {
  NO_LIMITS_ERROR,
  NO_VALUE_ERROR,
  MINIMUM_NO_LINK_ERROR,
  REACHED_DAILY_ERROR,
  REACHED_WEEKLY_ERROR,
  REACHED_ANNUAL_ERROR,
  MINIMUM_ERROR,
  BALANCE_ERROR,
  DAILY_ERROR,
  WEEKLY_ERROR,
  ANNUAL_ERROR,
  LATEST_TX_ERROR,
  LATEST_TX_FETCH_FAILED_ERROR,
  ORDER_ERROR
} = model.components.exchange

const { MIN_ERROR: MIN_RATES_ERROR, MAX_ERROR: MAX_RATES_ERROR } = model.rates

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: center;

  > * {
    margin-left: 2px;
  }
`

const NoAdviceMessage = () => (
  <Text size='12px' weight={300} color='error'>
    <FormattedMessage
      id='scenes.exchange.exchangeform.error.noadvicemessage'
      defaultMessage='Failed to fetch the rates for current amount.'
    />
  </Text>
)

const NoLimitsMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.nolimitsmessage'
        defaultMessage='Failed to get trade limits.'
      />
      &nbsp;
      <LimitsUpdateLink />
    </Text>
  </Wrapper>
)

const MinimumNoLinkMessage = ({ min }) => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      {min ? (
        <FormattedMessage
          id='scenes.exchange.exchangeform.error.balancebelowmin'
          defaultMessage='Insufficient funds. {min} is required for a trade'
          values={{
            min: formatAmount(
              prop('fiat', min),
              prop('symbol', min),
              prop('amount', min)
            )
          }}
        />
      ) : (
        <FormattedMessage
          id='scenes.exchange.exchangeform.error.insufficientfunds'
          defaultMessage='Insufficient funds'
        />
      )}
    </Text>
  </Wrapper>
)

const ReachedDailyLimitMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.dailylimitreached'
        defaultMessage="You've reached your daily trade limit"
      />
    </Text>
  </Wrapper>
)

const ReachedWeeklyLimitMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.weeklylimitreached'
        defaultMessage="You've reached your weekly trade limit"
      />
    </Text>
  </Wrapper>
)

const ReachedAnnualLimitMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.annuallimitreached'
        defaultMessage="You've reached your annual trade limit"
      />
    </Text>
  </Wrapper>
)

const MinimumAmountMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.minimumamount'
        defaultMessage='Amount is below mimimum.'
      />
      &nbsp;
      <MinimumAmountLink />
    </Text>
  </Wrapper>
)

const MaximumAmountMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.maximumamount'
        defaultMessage='Amount is above maximum.'
      />
      &nbsp;
      <MaximumAmountLink />
    </Text>
  </Wrapper>
)

const BalanceLimitMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.balancelimit'
        defaultMessage='Not enough funds.'
      />
      &nbsp;
      <MaximumAmountLink />
    </Text>
  </Wrapper>
)

const DailyLimitMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.dailylimit'
        defaultMessage='Amount exceeds your daily trade limit.'
      />
      &nbsp;
      <MaximumAmountLink />
    </Text>
  </Wrapper>
)

const WeeklyLimitMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.weeklylimit'
        defaultMessage='Amount exceeds your weekly trade limit.'
      />
      &nbsp;
      <MaximumAmountLink />
    </Text>
  </Wrapper>
)

const AnnualLimitMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.annuallimit'
        defaultMessage='Amount exceeds your annual trade limit.'
      />
      &nbsp;
      <MaximumAmountLink />
    </Text>
  </Wrapper>
)

const OrderLimitMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.orderlimit'
        defaultMessage='Amount exceeds single trade limit.'
      />
      &nbsp;
      <MaximumAmountLink />
    </Text>
  </Wrapper>
)

const LatestTxMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.latesttx'
        defaultMessage='Please wait until our previous transaction confirms.'
      />
      &nbsp;
      <CheckConfirmationLink>
        <FormattedMessage
          id='scenes.exchange.exchangeform.refreshlatest'
          defaultMessage='Refresh status.'
        />
      </CheckConfirmationLink>
    </Text>
  </Wrapper>
)

const LatestTxFetchFailedMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.latesttxfetchfailed'
        defaultMessage='Failed to get previous transaction.'
      />
      &nbsp;
      <CheckConfirmationLink>
        <FormattedMessage
          id='scenes.exchange.exchangeform.retry'
          defaultMessage='Retry.'
        />
      </CheckConfirmationLink>
    </Text>
  </Wrapper>
)

export const getErrorMessage = error => {
  if (error === NO_LIMITS_ERROR) return NoLimitsMessage
  if (error === MINIMUM_NO_LINK_ERROR) return MinimumNoLinkMessage
  if (error === REACHED_DAILY_ERROR) return ReachedDailyLimitMessage
  if (error === REACHED_WEEKLY_ERROR) return ReachedWeeklyLimitMessage
  if (error === REACHED_ANNUAL_ERROR) return ReachedAnnualLimitMessage
  if (error === MINIMUM_ERROR) return MinimumAmountMessage
  if (error === MIN_RATES_ERROR) return MinimumAmountMessage
  if (error === MAX_RATES_ERROR) return MaximumAmountMessage
  if (error === BALANCE_ERROR) return BalanceLimitMessage
  if (error === DAILY_ERROR) return DailyLimitMessage
  if (error === WEEKLY_ERROR) return WeeklyLimitMessage
  if (error === ANNUAL_ERROR) return AnnualLimitMessage
  if (error === ORDER_ERROR) return OrderLimitMessage
  if (error === LATEST_TX_ERROR) return LatestTxMessage
  if (error === LATEST_TX_FETCH_FAILED_ERROR) return LatestTxFetchFailedMessage
  if (error === NO_VALUE_ERROR) return () => ''
  return NoAdviceMessage
}
