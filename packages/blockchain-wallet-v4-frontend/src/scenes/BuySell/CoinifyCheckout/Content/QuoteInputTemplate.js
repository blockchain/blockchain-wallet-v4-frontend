import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { SelectBoxCoinifyCurrency, TextBoxDebounced } from 'components/Form'
import { Field, reduxForm } from 'redux-form'
import { head } from 'ramda'
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
const ArrowRight = styled(Icon)`
  margin-left: 15px;
  margin-right: 15px;
  color: #5F5F5F;
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

const getLimitsError = (errorType, limits, symbol, setMin) => {
  switch (errorType) {
    case 'below_min': return `Your limit of ${symbol}${limits.max} is below the minimum allowed amount.`
    case 'over_max': return `Enter an amount under your ${symbol}${limits.max.toLocaleString()} limit`
    case 'under_min': return <FormattedMessage id='buy.quote_input.under_min' defaultMessage='Enter an amount above the {setMin} minimum' values={{ setMin: <a onClick={() => setMin(limits.min)}>{symbol}{limits.min.toLocaleString()}</a> }} />
    case 'over_effective_max': return `Enter an amount less than your balance minus the priority fee (${limits.effectiveMax / 1e8} BTC)`
  }
}

const FiatConvertor = (props) => {
  const { val, disabled, setMax, setEffectiveMax, setMin, limits, checkoutError, defaultCurrency, symbol, increaseLimit, form } = props
  const currency = 'BTC'
  const level = val.level || { name: 1 }
  const kyc = val.kycs.length && head(val.kycs)
  const { canTrade, cannotTradeReason, profile } = val
  const { canTradeAfter } = profile

  const reasonExplanation = cannotTradeReason && getReasonExplanation(cannotTradeReason, canTradeAfter)

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
          { getLimitsError(checkoutError, limits, symbol, setMin) }
        </Error>
      )
    } else {
      return (
        <LimitsHelper>
          {
            form === 'coinifyCheckoutBuy'
              ? <FormattedMessage id='buy.quote_input.remaining_buy_limit' defaultMessage='Your remaining buy limit is {max}' values={{ max: <a onClick={() => setMax(limits.max)}>{symbol}{limits.max}</a> }} />
              : <FormattedMessage id='sell.quote_input.remaining_sell_limit' defaultMessage='Your remaining sell limit is {max}' values={{ max: <a onClick={() => setEffectiveMax(limits.effectiveMax)}>{limits.effectiveMax / 1e8} BTC</a> }} />
          }
          {
            level.name < 2 && kyc.state !== 'reviewing'
              ? <FormattedMessage id='buy.quote_input.increase_limits' defaultMessage='{increase}' values={{ increase: <a onClick={() => increaseLimit()}>Increase your limit.</a> }} />
              : null
          }
        </LimitsHelper>
      )
    }
  }

  return (
    <Wrapper>
      <FiatConvertorInput>
        <Container>
          <Field name='leftVal' component={TextBoxDebounced} disabled={disabled || !canTrade} borderRightNone={1} />
          <Field name='currency' component={SelectBoxCoinifyCurrency} defaultDisplay={defaultCurrency} />
        </Container>
        <ArrowRight weight={600} size='22px' name='right-arrow' />
        <Container>
          <Field name='rightVal' component={TextBoxDebounced} disabled={disabled || !canTrade} />
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
