import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Text, Icon, Button } from 'blockchain-info-components'
import { Wrapper as ExchangeCheckoutWrapper } from '../../ExchangeCheckout'
import { flex, spacing } from 'services/StyleService'
import { FormattedMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'
import QuoteInput from './QuoteInput'

const quoteInputSpec = {
  method: 'buy',
  input: 'usd',
  output: 'btc'
}

const MethodContainer = styled.div`
  height: 65px;
  display: flex;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 30px;
  padding-left: 20px;
  border: 1px solid ${props => props.theme['gray-1']};
  border-radius: 3px;
  background-color: ${props => props.theme['white-blue']};
`

const capitalize = (s) => s[0].toUpperCase() + s.slice(1)

const BuyCheckout = ({ quoteR, account, onFetchQuote }) => (
  <ExchangeCheckoutWrapper>
    <Text style={spacing('ml-10')} size='16px' weight={600}>
      <FormattedMessage id='buy.output_method.title' defaultMessage='I want to buy' />
    </Text>
    <MethodContainer>
      <Icon name='bitcoin-in-circle-filled' color='bitcoin-orange' size='30px' />
      <div style={{ ...flex('col'), ...spacing('ml-20') }}>
        <Text size='14px' weight={300} uppercase>Bitcoin</Text>
        <Text size='12px' weight={300}>
          {'@ '}
          {quoteR
            .map((quote) => '$' + quote.rate)
            .getOrElse(
              <Fragment>
                <FormattedMessage id='loading' defaultMessage='Loading' />
                {'...'}
              </Fragment>
            )}
        </Text>
      </div>
    </MethodContainer>
    <Text style={spacing('ml-10')} size='16px' weight={600}>
      <FormattedMessage id='buy.input_method.title' defaultMessage='I will pay with' />
    </Text>
    <MethodContainer>
      <Icon name='bank-filled' size='30px' />
      <div style={{ ...flex('col'), ...spacing('ml-20') }}>
        <Text size='14px' weight={300}>
          {`Plaid ${capitalize(account.accountType)} `}
          <FormattedMessage id='buy.account_ending_with' defaultMessage='ending with' />
          {' ' + account.accountNumber}
        </Text>
        <Text size='12px' weight={300}>
          {account.name}
        </Text>
      </div>
    </MethodContainer>
    <Text style={spacing('ml-10')} size='16px' weight={600}>
      <FormattedMessage id='amount' defaultMessage='Amount' />
    </Text>
    <div style={spacing('mt-15')}>
      <QuoteInput
        quoteR={quoteR}
        initialAmount='250.00'
        debounce={500}
        spec={quoteInputSpec}
        onFetchQuote={onFetchQuote}
      />
    </div>
    <Button style={spacing('mt-45')} nature='primary' fullwidth disabled={!Remote.Success.is(quoteR)}>
      <FormattedMessage id='review_order' defaultMessage='Review Order' />
    </Button>
  </ExchangeCheckoutWrapper>
)

export default BuyCheckout
