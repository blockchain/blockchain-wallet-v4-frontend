import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Text, Button, HeartbeatLoader } from 'blockchain-info-components'
import { Wrapper as ExchangeCheckoutWrapper } from '../../../../ExchangeCheckout'
import { spacing } from 'services/StyleService'
import { FormattedMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'
import { StepTransition } from 'components/Utilities/Stepper'
import BitcoinTicker from 'components/BuySell/BitcoinTicker'
import QuoteInput from '../QuoteInput'

const MarginText = styled(Text)`
  margin-left: 10px;
  margin-bottom: 10px;
`
const CheckoutStepTransition = styled(StepTransition)`
  margin-top: 45px;
`

const OrderCheckout = ({ quoteR, rateQuoteR, account, onFetchQuote, reason, limits, defaultCurrency, symbol, checkoutBusy, busy, setMax, increaseLimit }) => {
  const disableInputs = (limits.max < limits.min) ||
    (reason.indexOf('has_remaining') < 0 && reason) ||
    (limits.effectiveMax < limits.min)

  const limitsHelper = (quoteR, limits) => {
    if (quoteR.error) return true
    return quoteR.map(q => {
      if (q.baseCurrency === 'USD') return +q.baseAmount > limits.max || +q.baseAmount < limits.min || +q.quoteAmount > limits.effectiveMax
      if (q.baseCurrency === 'BTC') return Math.abs(q.quoteAmount) > limits.max || Math.abs(q.quoteAmount) < limits.min || +q.baseAmount > limits.effectiveMax
    }).data
  }

  const submitButtonHelper = () => (
    reason.indexOf('has_remaining') > -1 &&
      <CheckoutStepTransition next Component={Button} style={spacing('mt-45')} nature='primary' fullwidth disabled={checkoutBusy || Remote.Loading.is(quoteR) || limitsHelper(quoteR, limits)}>
        {
          Remote.Loading.is(quoteR)
            ? <HeartbeatLoader height='20px' width='20px' color='white' />
            : <FormattedMessage id='continue' defaultMessage='Continue' />
        }
      </CheckoutStepTransition>
  )

  return (
    <ExchangeCheckoutWrapper>
      <MarginText size='16px' weight={600}>
        <FormattedMessage id='buy.output_method.title.buy' defaultMessage='I want to buy' />
      </MarginText>
      <BitcoinTicker rateQuoteR={rateQuoteR} symbol={symbol} />
      {
        reason.indexOf('has_remaining') > -1 &&
          <Fragment>
            <MarginText size='16px' weight={600}>
              <FormattedMessage id='amount' defaultMessage='Amount' />
            </MarginText>
            <QuoteInput
              quoteR={quoteR}
              disabled={disableInputs}
              limits={limits}
              defaultCurrency={defaultCurrency}
              symbol={symbol}
              setMax={setMax}
              increaseLimit={increaseLimit}
            />
          </Fragment>
      }
      { submitButtonHelper() }
    </ExchangeCheckoutWrapper>
  )
}

export default OrderCheckout
