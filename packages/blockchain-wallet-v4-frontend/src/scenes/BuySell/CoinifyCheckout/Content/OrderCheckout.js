import React, { Fragment } from 'react'
import { Text, Button, HeartbeatLoader } from 'blockchain-info-components'
import { Wrapper as ExchangeCheckoutWrapper } from '../../ExchangeCheckout'
import { spacing } from 'services/StyleService'
import { FormattedMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'
import { StepTransition } from 'components/Utilities/Stepper'
import BitcoinTicker from 'components/BuySell/BitcoinTicker'
import QuoteInput from './QuoteInput'

const OrderCheckout = ({ quoteR, rateQuoteR, account, onFetchQuote, reason, limits, type, defaultCurrency, symbol, checkoutBusy, busy, setMax, increaseLimit }) => {
  const quoteInputSpec = {
    method: 'buy',
    input: defaultCurrency,
    output: 'btc'
  }
  const disableInputs = (limits.max < limits.min) ||
    (reason.indexOf('has_remaining') < 0 && reason) ||
    (limits.effectiveMax < limits.min)
  const wantToHelper = () => type === 'buy' ? <FormattedMessage id='buy.output_method.title.buy' defaultMessage='I want to buy' /> : <FormattedMessage id='buy.output_method.title.sell' defaultMessage='I want to sell' />

  const limitsHelper = (quoteR, limits) => {
    if (quoteR.error) return true
    return quoteR.map(q => {
      if (q.baseCurrency === 'USD') return +q.baseAmount > limits.max || +q.baseAmount < limits.min || +q.quoteAmount > limits.effectiveMax
      if (q.baseCurrency === 'BTC') return Math.abs(q.quoteAmount) > limits.max || Math.abs(q.quoteAmount) < limits.min || +q.baseAmount > limits.effectiveMax
    }).data
  }

  const submitButtonHelper = () => (
    reason.indexOf('has_remaining') > -1
      ? <StepTransition next Component={Button} style={spacing('mt-45')} nature='primary' fullwidth disabled={checkoutBusy || Remote.Loading.is(quoteR) || limitsHelper(quoteR, limits)}>
        {
          Remote.Loading.is(quoteR)
            ? <HeartbeatLoader height='20px' width='20px' color='white' />
            : <FormattedMessage id='continue' defaultMessage='Continue' />
        }
      </StepTransition>
      : null
  )

  return (
    <ExchangeCheckoutWrapper>
      <Text style={spacing('ml-10')} size='16px' weight={600}>
        { wantToHelper() }
      </Text>
      <BitcoinTicker rateQuoteR={rateQuoteR} symbol={symbol} />
      {
        reason.indexOf('has_remaining') > -1
          ? <Fragment>
            <Text style={spacing('ml-10')} size='16px' weight={600}>
              <FormattedMessage id='amount' defaultMessage='Amount' />
            </Text>
            <div style={spacing('mt-10')}>
              <QuoteInput
                quoteR={quoteR}
                initialQuoteId={quoteR.map(quote => quote.id).getOrElse(null)}
                // initialAmount='0.00'
                debounce={500}
                spec={quoteInputSpec}
                onFetchQuote={onFetchQuote}
                disabled={disableInputs}
                limits={limits}
                type={type}
                defaultCurrency={defaultCurrency}
                symbol={symbol}
                setMax={setMax}
                increaseLimit={increaseLimit}
              />
            </div>
          </Fragment>
          : null
      }
      { submitButtonHelper() }
    </ExchangeCheckoutWrapper>
  )
}

export default OrderCheckout
