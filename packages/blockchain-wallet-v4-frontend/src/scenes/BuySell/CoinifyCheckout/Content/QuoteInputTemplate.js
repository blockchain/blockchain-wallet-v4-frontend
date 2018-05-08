import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'
import { SelectBoxCoinifyCurrency, TextBoxDebounced } from 'components/Form'

import { Field, reduxForm } from 'redux-form'

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
  right: 0;
`
const LimitsHelper = styled.div`
  position: absolute;
  display: block;
  height: 15px;
  font-size: 13px;
  top: 42px;
  a {
    color: ${props => props.theme['brand-secondary']};
    cursor: pointer;
  }
`

const getLimitsError = (errorType, limits, symbol) => {
  if (errorType === 'below_min') return `Your limit of ${symbol}${limits.max} is below the minimum allowed amount.`
  if (errorType === 'over_max') return `Enter an amount under your ${symbol}${limits.max.toLocaleString()} limit`
  if (errorType === 'under_min') return `Enter an amount above the ${symbol}${limits.min.toLocaleString()} minimum`
  // if (errorType === 'effective_max') return `Enter an amount less than your balance minus the priority fee (${limits.effectiveMax / 1e8} BTC)`
}

const FiatConvertor = (props) => {
  const { disabled, setMax, limits, checkoutError, defaultCurrency, symbol } = props
  const currency = 'BTC'

  return (
    <form>
      <Wrapper>
        <FiatConvertorInput>
          <Container>
            <Field name='leftVal' component={TextBoxDebounced} disabled={disabled} borderRightNone={1} />
            <Field name='currency' component={SelectBoxCoinifyCurrency} defaultDisplay={defaultCurrency} />
          </Container>
          <ArrowLeft size='16px' name='left-arrow' />
          <ArrowRight size='16px' name='right-arrow' />
          <Container>
            <Field name='rightVal' component={TextBoxDebounced} disabled={disabled} />
            <Unit>{currency}</Unit>
          </Container>
        </FiatConvertorInput>
        {
          checkoutError
            ? <Error size='13px' weight={300} color='error'>
              { getLimitsError(checkoutError, limits, symbol) }
            </Error>
            : <LimitsHelper>
              <FormattedMessage id='buy.quote_input.remaining_buy_limit' defaultMessage='Your remaining buy limit is {max}' values={{ max: <a onClick={() => setMax(limits.max)}>{symbol}{limits.max}</a> }} />
            </LimitsHelper>
        }
      </Wrapper>
    </form>
  )
}

FiatConvertor.propTypes = {
  defaultCurrency: PropTypes.string.isRequired,
  checkoutError: PropTypes.bool,
  symbol: PropTypes.string.isRequired,
  limits: PropTypes.object.isRequired,
  setMax: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

export default reduxForm({ form: 'coinifyCheckout', destroyOnUnmount: false })(FiatConvertor)
