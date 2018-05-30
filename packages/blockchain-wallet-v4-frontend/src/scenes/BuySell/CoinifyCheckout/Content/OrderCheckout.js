import React, { Fragment } from 'react'
import { Text, Icon, Button, HeartbeatLoader } from 'blockchain-info-components'
import { Wrapper as ExchangeCheckoutWrapper } from '../../ExchangeCheckout'
import { flex, spacing } from 'services/StyleService'
import { FormattedMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'
import { StepTransition } from 'components/Utilities/Stepper'
import QuoteInput from './QuoteInput'
import { MethodContainer } from 'components/BuySell/styled.js'

const OrderCheckout = ({ quoteR, rateQuoteR, account, onFetchQuote, reason, limits, checkoutError,
  type, defaultCurrency, symbol, checkoutBusy, busy, setMax, setMin, increaseLimit, onOrderCheckoutSubmit }) => {
  const quoteInputSpec = {
    method: type, // buy or sell
    input: defaultCurrency,
    output: 'btc'
  }
  const disableInputs = limits.max < limits.min || (reason.indexOf('has_remaining') < 0 && reason) || limits.effectiveMax < limits.min
  const wantToHelper = () => type === 'buy'
    ? <FormattedMessage id='buy.output_method.title.buy' defaultMessage='I want to buy' />
    : <FormattedMessage id='buy.output_method.title.sell' defaultMessage='I want to sell' />

  const submitButtonHelper = () => (
    reason.indexOf('has_remaining') > -1
      ? <StepTransition next Component={Button} onClick={onOrderCheckoutSubmit} style={spacing('mt-45')}
        nature='primary' fullwidth disabled={checkoutBusy || Remote.Loading.is(quoteR) || checkoutError}>
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
      <MethodContainer>
        <Icon name='bitcoin-in-circle-filled' color='bitcoin-orange' size='30px' />
        <div style={{ ...flex('col'), ...spacing('ml-20') }}>
          <Text size='14px' weight={300} uppercase>Bitcoin</Text>
          <Text size='12px' weight={300}>
            {'@ '}
            {rateQuoteR
              .map((quote) => `${symbol}${Math.abs(quote && quote.quoteAmount).toLocaleString()}`)
              .getOrElse(
                <Fragment>
                  <FormattedMessage id='loading' defaultMessage='Loading' />
                  {'...'}
                </Fragment>
              )}
          </Text>
        </div>
      </MethodContainer>
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
                debounce={500}
                spec={quoteInputSpec}
                onFetchQuote={onFetchQuote}
                disabled={disableInputs}
                limits={limits}
                type={type}
                defaultCurrency={defaultCurrency}
                symbol={symbol}
                setMax={setMax}
                setMin={setMin}
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
