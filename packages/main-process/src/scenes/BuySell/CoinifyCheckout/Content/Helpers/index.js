import React, { Fragment } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import {
  checkoutButtonLimitsHelper,
  getRateFromQuote,
  currencySymbolMap
} from 'services/CoinifyService'
import { HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { SubmitButton } from 'components/BuySell/styled'
import { Remote } from 'blockchain-wallet-v4/src'
import { StepTransition } from 'components/Utilities/Stepper'
import media from 'services/ResponsiveService'

const Error = styled(Text)`
  display: block;
  font-size: 13px;
  a {
    color: ${props => props.theme['brand-secondary']};
    cursor: pointer;
  }
  ${media.mobile`
    top: 100px;
  `};
`

export const getLimitsError = (
  errorType,
  limits,
  curr,
  setMax,
  setMin,
  changeTab
) => {
  switch (errorType) {
    case 'max_below_min':
      return (
        <FormattedMessage
          id='buy.quote_input.below_min'
          defaultMessage='Your limit of {curr}{max} is below the minimum allowed amount.'
          values={{ curr: currencySymbolMap[curr], max: limits.max }}
        />
      )
    case 'over_max':
      return (
        <FormattedMessage
          id='buy.quote_input.over_max'
          defaultMessage='Enter an amount under your {setMax} limit'
          values={{
            setMax: (
              <a onClick={() => setMax(limits.max)}>
                {currencySymbolMap[curr]}
                {limits.max}
              </a>
            )
          }}
        />
      )
    case 'under_min':
      return (
        <FormattedMessage
          id='buy.quote_input.under_min'
          defaultMessage='Enter an amount above the {setMin} minimum'
          values={{
            setMin: (
              <a onClick={() => setMin(limits.min)}>
                {currencySymbolMap[curr]}
                {limits.min}
              </a>
            )
          }}
        />
      )
    case 'over_effective_max':
      return (
        <FormattedMessage
          id='buy.quote_input.over_effective_max'
          defaultMessage='Enter an amount less than your balance minus the priority fee ({effectiveMax} BTC)'
          values={{ effectiveMax: limits.effectiveMax / 1e8 }}
        />
      )
    case 'effective_max_under_min':
      const buyLink = (
        <Link size='13px' weight={400} onClick={() => changeTab('buy')}>
          <FormattedMessage
            id='buy.quote_input.effective_max_under_min3'
            defaultMessage='buying'
          />
        </Link>
      )
      const exchangeLink = (
        <NavLink to='/swap' style={{ textDecoration: 'none' }}>
          <FormattedMessage
            id='buy.quote_input.effective_max_under_min5swap'
            defaultMessage='swapping'
          />
        </NavLink>
      )
      return (
        <div>
          <FormattedMessage
            id='buy.quote_input.sell_effective_max_under_min1'
            defaultMessage="You don't have enough funds to sell the minimum amount, {min} BTC."
            values={{ min: limits.min }}
          />{' '}
          <FormattedMessage
            id='buy.quote_input.sell_effective_max_under_min2'
            defaultMessage='Add funds by {buyLink} or {exchangeLink}.'
            values={{ buyLink, exchangeLink }}
          />
        </div>
      )
  }
}

const limitsHelper = (quoteR, limits, type) => {
  if (quoteR.error) return true
  return checkoutButtonLimitsHelper(quoteR, limits, type)
}

export const submitButtonHelper = (
  checkoutError,
  limits,
  defaultCurrency,
  setMax,
  setMin,
  changeTab,
  canTrade,
  reasonExplanation,
  reason,
  onOrderCheckoutSubmit,
  verified,
  checkoutBusy,
  quoteR,
  type
) => {
  if (checkoutError)
    return (
      <Error>
        {getLimitsError(
          checkoutError,
          limits,
          defaultCurrency,
          setMax,
          setMin,
          changeTab
        )}
      </Error>
    )

  if (!canTrade) {
    return (
      <Error size='13px' weight={400} color='error'>
        {reasonExplanation}
      </Error>
    )
  }

  return reason.indexOf('has_remaining') > -1 ? (
    <StepTransition
      next
      Component={SubmitButton}
      onClick={onOrderCheckoutSubmit}
      nature='primary'
      fullwidth
      disabled={
        !verified ||
        checkoutBusy ||
        Remote.Loading.is(quoteR) ||
        checkoutError ||
        limitsHelper(quoteR, limits, type)
      }
    >
      {Remote.Loading.is(quoteR) ? (
        <HeartbeatLoader height='20px' width='20px' color='white' />
      ) : (
        <FormattedMessage
          id='scenes.buysell.coinifycheckout.content.ordercheckout.continue'
          defaultMessage='Continue'
        />
      )}
    </StepTransition>
  ) : null
}

export const wantToHelper = type =>
  type === 'buy' ? (
    <FormattedMessage
      id='buy.output_method.title.buy'
      defaultMessage='I want to buy'
    />
  ) : (
    <FormattedMessage
      id='buy.output_method.title.sell'
      defaultMessage='I want to sell'
    />
  )

export const rateHelper = quoteR =>
  quoteR.map(getRateFromQuote).getOrElse(
    <Fragment>
      <FormattedMessage
        id='scenes.buysell.coinifycheckout.content.ordercheckout.loading'
        defaultMessage='Loading'
      />
      {'...'}
    </Fragment>
  )
