import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { flip, prop } from 'ramda'

import { model } from 'data'
import { Text } from 'blockchain-info-components'
import LimitsUpdateLink from './LimitsUpdateLink'
import MaximumAmountLink from './MaximumAmountLink'
import MinimumAmountLink from './MinimumAmountLink'

const {
  NO_ADVICE_ERROR,
  NO_LIMITS_ERROR,
  MINIMUM_NO_LINK_ERROR,
  MAXIMUM_NO_LINK_ERROR,
  MINIMUM_ERROR,
  BALANCE_ERROR,
  DAILY_ERROR,
  WEEKLY_ERROR,
  ANNUAL_ERROR,
  ORDER_ERROR
} = model.components.exchange

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  > * {
    margin-left: 2px;
  }
`

const NoAdviceMessage = () => (
  <Text size='12px' weight={300} color='error'>
    <FormattedMessage
      id='scenes.exchange.exchangeform.error.noadvicemessage'
      defaultMessage='Please enter an amount less than the limit.'
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

const MinimumNoLinkMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.minimumamount'
        defaultMessage='Amount is below mimimum.'
      />
    </Text>
  </Wrapper>
)

const MaximumNoLinkMessage = () => (
  <Wrapper>
    <Text size='12px' weight={300} color='error'>
      <FormattedMessage
        id='scenes.exchange.exchangeform.error.balancelimit'
        defaultMessage='Not enough funds.'
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

export const getErrorMessage = flip(prop)({
  [NO_ADVICE_ERROR]: <NoAdviceMessage />,
  [NO_LIMITS_ERROR]: <NoLimitsMessage />,
  [MINIMUM_NO_LINK_ERROR]: <MinimumNoLinkMessage />,
  [MAXIMUM_NO_LINK_ERROR]: <MaximumNoLinkMessage />,
  [MINIMUM_ERROR]: <MinimumAmountMessage />,
  [BALANCE_ERROR]: <BalanceLimitMessage />,
  [DAILY_ERROR]: <DailyLimitMessage />,
  [WEEKLY_ERROR]: <WeeklyLimitMessage />,
  [ANNUAL_ERROR]: <AnnualLimitMessage />,
  [ORDER_ERROR]: <OrderLimitMessage />
})
