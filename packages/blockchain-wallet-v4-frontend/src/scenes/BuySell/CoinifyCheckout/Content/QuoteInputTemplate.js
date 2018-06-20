import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import { Field, reduxForm } from 'redux-form'
import { equals, prop } from 'ramda'

import { Icon, Link, Text } from 'blockchain-info-components'
import { SelectBoxCoinifyCurrency, NumberBoxDebounced } from 'components/Form'
import { getReasonExplanation } from 'services/CoinifyService'

const Wrapper = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Montserrat', Helvetica, sans-serif;
`
const FiatConvertorInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-bottom: 0px;
`
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const Unit = styled.span`
  padding: 0 15px;
  font-size: 12px;
  font-weight: 300;
  position: absolute;
  color: ${props => props.theme['gray-4']};
`
const ArrowLeft = styled(Icon)`
  margin-left: 10px;
  color: #bbb;
`
const ArrowRight = styled(Icon)`
  margin-left: -10px;
  margin-right: 10px;
  color: #bbb;
`
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
`
const LimitsHelper = styled.div`
  position: absolute;
  display: block;
  height: 15px;
  font-size: 13px;
  top: 42px;
  padding-top: 3px;
  a {
    color: ${props => props.theme['brand-secondary']};
    cursor: pointer;
  }
  span:first-of-type {
    padding-right: 5px;
  }
`

const getLimitsError = (errorType, limits, curr, setMax, setMin, changeTab) => {
  switch (errorType) {
    case 'max_below_min':
      return <FormattedMessage id='buy.quote_input.below_min' defaultMessage='Your limit of {curr}{max} is below the minimum allowed amount.' values={{ curr, max: limits.max }} />
    case 'over_max':
      return <FormattedMessage id='buy.quote_input.over_max' defaultMessage='Enter an amount under your {setMax} limit' values={{ setMax: <a onClick={() => setMax(limits.max)}>{curr}{limits.max}</a> }} />
    case 'under_min':
      return <FormattedMessage id='buy.quote_input.under_min' defaultMessage='Enter an amount above the {setMin} minimum' values={{ setMin: <a onClick={() => setMin(limits.min)}>{curr}{limits.min}</a> }} />
    case 'over_effective_max':
      return <FormattedMessage id='buy.quote_input.over_effective_max' defaultMessage='Enter an amount less than your balance minus the priority fee ({effectiveMax} BTC)' values={{ effectiveMax: limits.effectiveMax / 1e8 }} />
    case 'effective_max_under_min':
      const buyLink = (
        <Link size='13px' weight={300} onClick={() => changeTab('buy')} >
          <FormattedMessage id='buy.quote_input.effective_max_under_min3' defaultMessage='buying' />
        </Link>
      )
      const exchangeLink = (
        <NavLink to='/exchange' style={{ textDecoration: 'none' }}>
          <FormattedMessage id='buy.quote_input.effective_max_under_min5' defaultMessage='exchanging' />
        </NavLink>
      )
      return (
        <div>
          <FormattedMessage id='buy.quote_input.effective_max_under_min1' defaultMessage='Your balance is less than the minimum sell amount minus priority fee {min} BTC. ' values={{ min: limits.min }} />
          <FormattedMessage id='buy.quote_input.effective_max_under_min2' defaultMessage='Fund your wallet by {buyLink} or {exchangeLink} before selling.' values={{ buyLink, exchangeLink }} />
        </div>
      )
  }
}

const FiatConvertor = (props) => {
  const { val, changeTab, disabled, setMax, setMin, limits, checkoutError, defaultCurrency, symbol, increaseLimit, form } = props
  const currency = 'BTC'
  const level = val.level || { name: 1 }
  const kyc = prop('kyc', val)
  const { canTrade, cannotTradeReason, profile } = val
  const { canTradeAfter } = profile
  const isSell = form === 'coinifyCheckoutSell'
  const curr = isSell ? 'BTC' : symbol

  const reasonExplanation = cannotTradeReason && getReasonExplanation(cannotTradeReason, canTradeAfter)

  const getSellLimits = () => {
    let effBal = limits.effectiveMax / 1e8
    let max = Math.min(effBal, limits.max)

    return <FormattedMessage id='sell.quote_input.remaining_sell_limit' defaultMessage='Your remaining sell limit is {max}' values={{ max: <a onClick={() => setMax(max)}>{max} BTC</a> }} />
  }

  const renderErrorsAndLimits = () => {
    if (!canTrade) {
      return (
        <Error size='13px' weight={300} color='error'>
          { reasonExplanation }
        </Error>
      )
    } else if (checkoutError) {
      return (
        <Error size='13px' weight={300} color='error'>
          {getLimitsError(checkoutError, limits, curr, setMax, setMin, changeTab) }
        </Error>
      )
    } else {
      return (
        <LimitsHelper>
          {
            form === 'coinifyCheckoutBuy'
              ? <FormattedMessage id='buy.quote_input.remaining_buy_limit' defaultMessage='Your remaining buy limit is {max}' values={{ max: <a onClick={() => setMax(limits.max)}>{curr}{limits.max}</a> }} />
              : getSellLimits()
          }
          {
            level.name < 2 && !equals(prop('state', kyc), 'reviewing')
              ? <a onClick={() => increaseLimit()}>
                <FormattedMessage id='buysell.quote_input.increase_limits' defaultMessage=' Increase your limit.' />
              </a>
              : null
          }
        </LimitsHelper>
      )
    }
  }

  const inputsDisabled = disabled || !canTrade || equals(checkoutError, 'effective_max_under_min')

  return (
    <Wrapper>
      <FiatConvertorInput>
        <Container>
          <Field name='leftVal' component={NumberBoxDebounced} disabled={inputsDisabled} borderRightNone={1} currency />
          <Field name='currency' component={SelectBoxCoinifyCurrency} defaultDisplay={defaultCurrency} isSell={isSell} />
        </Container>
        <ArrowLeft size='16px' name='left-arrow' />
        <ArrowRight size='16px' name='right-arrow' />
        <Container>
          <Field name='rightVal' component={NumberBoxDebounced} disabled={inputsDisabled} />
          <Unit>{currency}</Unit>
        </Container>
      </FiatConvertorInput>
      { renderErrorsAndLimits() }
    </Wrapper>
  )
}

FiatConvertor.propTypes = {
  defaultCurrency: PropTypes.string.isRequired,
  checkoutError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  symbol: PropTypes.string.isRequired,
  limits: PropTypes.object.isRequired,
  setMax: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

export const QuoteInputTemplateBuy = reduxForm({ form: 'coinifyCheckoutBuy', destroyOnUnmount: false })(FiatConvertor)
export const QuoteInputTemplateSell = reduxForm({ form: 'coinifyCheckoutSell', destroyOnUnmount: false })(FiatConvertor)
