import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import { Link, Text } from 'blockchain-info-components'
import styled from 'styled-components'
import media from 'services/ResponsiveService'
import { equals, prop } from 'ramda'

const Error = styled(Text)`
  position: absolute;
  display: block;
  font-size: 13px;
  height: 15px;
  top: 42px;
  padding-top: 3px;
  left: 0px;
  a {
    color: ${props => props.theme['brand-secondary']};
    cursor: pointer;
  }
  ${media.mobile`
    top: 100px;
  `};
`
const LimitsHelper = styled.div`
  position: absolute;
  display: block;
  height: 15px;
  font-size: 13px;
  top: 42px;
  padding-top: 2px;
  a {
    color: ${props => props.theme['brand-secondary']};
    cursor: pointer;
  }
  span:first-of-type {
    padding-right: 5px;
  }
  ${media.mobile`
    top: 100px;
  `};
`
const LimitsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const getLimitsError = (errorType, limits, curr, setMax, setMin, changeTab) => {
  switch (errorType) {
    case 'max_below_min':
      return (
        <FormattedMessage
          id='buy.quote_input.below_min'
          defaultMessage='Your limit of {curr}{max} is below the minimum allowed amount.'
          values={{ curr, max: limits.max }}
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
                {curr}
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
                {curr}
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
        <Link size='13px' weight={300} onClick={() => changeTab('buy')}>
          <FormattedMessage
            id='buy.quote_input.effective_max_under_min3'
            defaultMessage='buying'
          />
        </Link>
      )
      const exchangeLink = (
        <NavLink to='/exchange' style={{ textDecoration: 'none' }}>
          <FormattedMessage
            id='buy.quote_input.effective_max_under_min5'
            defaultMessage='exchanging'
          />
        </NavLink>
      )
      return (
        <div>
          <FormattedMessage
            id='buy.quote_input.effective_max_under_min1'
            defaultMessage='Your balance is less than the minimum sell amount minus priority fee {min} BTC. '
            values={{ min: limits.min }}
          />
          <FormattedMessage
            id='buy.quote_input.effective_max_under_min2'
            defaultMessage='Fund your wallet by {buyLink} or {exchangeLink} before selling.'
            values={{ buyLink, exchangeLink }}
          />
        </div>
      )
  }
}

const LimitsAndErrorText = ({
  isSell,
  canTrade,
  reasonExplanation,
  checkoutError,
  limits,
  curr,
  setMax,
  setMin,
  changeTab,
  level,
  increaseLimit,
  kyc,
  kycPending,
  kycNotFinished
}) => {
  const getSellLimits = () => {
    let effBal = limits.effectiveMax / 1e8
    let max = Math.min(effBal, limits.max)

    return (
      <FormattedMessage
        id='sell.quote_input.remaining_sell_limit'
        defaultMessage='Your remaining sell limit is {max}'
        values={{ max: <a onClick={() => setMax(max)}>{max} BTC</a> }}
      />
    )
  }

  if (!isSell && !canTrade) {
    return (
      <Error size='13px' weight={300} color='error'>
        {reasonExplanation}
      </Error>
    )
  } else if (checkoutError) {
    return (
      <Error size='13px' weight={300} color='error'>
        {getLimitsError(
          checkoutError,
          limits,
          curr,
          setMax,
          setMin,
          changeTab
        )}
      </Error>
    )
  } else {
    return (
      <LimitsHelper>
        {isSell ? (
          getSellLimits()
        ) : equals(prop('name', level), '1') ? (
          <FormattedMessage
            id='buy.quote_input.remaining_buy_limit'
            defaultMessage='Your remaining buy limit is {max}'
            values={{
              max: (
                <a onClick={() => setMax(limits.max)}>
                  {curr}
                  {limits.max}
                </a>
              )
            }}
          />
        ) : (
          <LimitsWrapper size='12px' weight={300}>
            <FormattedMessage
              id='buy.quote_input.remaining_card_buy_limit'
              defaultMessage='Your remaining card buy limit is {cardMax}'
              values={{
                cardMax: (
                  <a onClick={() => setMax(limits.cardMax)}>
                    {curr}
                    {limits.cardMax}
                  </a>
                )
              }}
            />
            <FormattedMessage
              id='buy.quote_input.remaining_bank_buy_limit'
              defaultMessage='Your remaining bank buy limit is {bankMax}'
              values={{
                bankMax: (
                  <a onClick={() => setMax(limits.bankMax)}>
                    {curr}
                    {limits.bankMax}
                  </a>
                )
              }}
            />
          </LimitsWrapper>
        )}
        {
          kycNotFinished && !kycPending && level < 2
            ? <a onClick={() => increaseLimit()}>
              <FormattedMessage
                id='buysell.quote_input.increase_limits'
                defaultMessage=' Increase your limit.'
              />
            </a>
            : null
        }
      </LimitsHelper>
    )
  }
}

export default LimitsAndErrorText
