import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { equals } from 'ramda'

import { Text, Icon, Button } from 'blockchain-info-components'
import { Wrapper as ExchangeCheckoutWrapper } from '../../ExchangeCheckout'
import { flex, spacing } from 'services/StyleService'
import QuoteInput from './QuoteInput'
import FundingSource from 'components/BuySell/FundingSource'
import { MethodContainer } from 'components/BuySell/styled.js'
import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { Remote } from 'blockchain-wallet-v4/src'

const quoteInputSpec = {
  method: 'buy',
  input: 'usd',
  output: 'btc'
}

const getCryptoMax = (q, max) => {
  if (q.baseCurrency.toLowerCase() === 'btc') return max / ((1 / (Math.abs(q.baseAmount / 1e8))) * Math.abs(q.quoteAmount))
  else return max / ((1 / (Math.abs(q.quoteAmount / 1e8))) * Math.abs(q.baseAmount))
}

const OrderCheckout = ({ quoteR, account, onFetchQuote, reason, finishAccountSetup, limits, type, disableButton, enableButton, buttonStatus }) => {
  const disableInputs = () => {
    if (limits.max < limits.min) return 'max_below_min'
    if (!reason.includes('has_remaining') && reason) return 'no_remaining'
    if (limits.effectiveMax < limits.min) return 'not_enough_funds'
  }

  const isBuy = equals(type, 'buy')

  const wantToHelper = () => isBuy
    ? <FormattedMessage id='buy.sfoxcheckout.outputmethod.title.buy' defaultMessage='I want to buy' />
    : <FormattedMessage id='buy.sfoxcheckout.title.sell' defaultMessage='I want to sell' />
  const payWithHelper = () => isBuy
    ? <FormattedMessage id='buy.sfoxcheckout.inputmethod.title.buywith' defaultMessage='I will pay with' />
    : <FormattedMessage id='buy.sfoxcheckout.outputmethod.title.sellwith' defaultMessage='I will receive funds into' />

  const submitButtonHelper = () => (
    reason.includes('has_remaining')
      ? null
      : <div style={{ ...flex('col'), ...spacing('mt-15') }}>
        <Text size='14px' weight={300}>
          You need to finish setting up your account before you can buy and sell.
        </Text>
        <Button style={spacing('mt-15')} nature='primary' onClick={finishAccountSetup}>
          Continue Where You Left Off
        </Button>
      </div>
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
            {
              Remote.Loading.is(quoteR)
                ? <Fragment>
                  <FormattedMessage id='buy.sfoxcheckout.loading' defaultMessage='Loading' />
                  {'...'}
                </Fragment>
                : quoteR
                  .map(q => {
                    if (q.baseCurrency.toLowerCase() === 'btc') return '$' + Currency.formatFiat((1 / (Math.abs(q.baseAmount / 1e8))) * Math.abs(q.quoteAmount))
                    else return '$' + Currency.formatFiat((1 / (Math.abs(q.quoteAmount / 1e8))) * Math.abs(q.baseAmount))
                  })
                  .getOrElse()
            }
          </Text>
        </div>
      </MethodContainer>
      <Text style={spacing('ml-10')} size='16px' weight={600}>
        { payWithHelper() }
      </Text>
      <MethodContainer>
        <Icon name='bank-filled' size='30px' />
        <FundingSource account={account} />
      </MethodContainer>
      {
        reason.includes('has_remaining')
          ? <Fragment>
            <Text style={spacing('ml-10')} size='16px' weight={600}>
              <FormattedMessage id='buy.sfoxcheckout.amount' defaultMessage='Amount' />
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
                disableButton={disableButton}
                enableButton={enableButton}
                reason={reason}
                cryptoMax={quoteR.map(quote => getCryptoMax(quote, limits.max)).getOrElse()}
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
