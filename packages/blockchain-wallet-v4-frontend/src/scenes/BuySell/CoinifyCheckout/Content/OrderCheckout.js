import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Text, Icon, Button, HeartbeatLoader } from 'blockchain-info-components'
import { flex, spacing } from 'services/StyleService'
import { FormattedMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'
import { StepTransition } from 'components/Utilities/Stepper'
import QuoteInput from './QuoteInput'
import { MethodContainer } from 'components/BuySell/styled'
import {
  checkoutButtonLimitsHelper,
  getRateFromQuote
} from 'services/CoinifyService'

const Wrapper = styled.div`
  padding: 30px;
  border: 1px solid ${props => props.theme['gray-1']};
`

const OrderCheckout = ({
  changeTab,
  quoteR,
  account,
  onFetchQuote,
  reason,
  limits,
  checkoutError,
  type,
  defaultCurrency,
  symbol,
  checkoutBusy,
  busy,
  setMax,
  setMin,
  increaseLimit,
  onOrderCheckoutSubmit
}) => {
  const quoteInputSpec = {
    method: type, // buy or sell
    input: defaultCurrency,
    output: 'btc'
  }
  const disableInputs =
    limits.max < limits.min ||
    (reason.indexOf('has_remaining') < 0 && reason) ||
    limits.effectiveMax < limits.min
  const wantToHelper = () =>
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

  const limitsHelper = (quoteR, limits) => {
    if (quoteR.error) return true
    return checkoutButtonLimitsHelper(quoteR, limits, type)
  }

  const rateHelper = () =>
    quoteR.map(getRateFromQuote).getOrElse(
      <Fragment>
        <FormattedMessage
          id='scenes.buysell.coinifycheckout.content.ordercheckout.loading'
          defaultMessage='Loading'
        />
        {'...'}
      </Fragment>
    )

  const submitButtonHelper = () =>
    reason.indexOf('has_remaining') > -1 ? (
      <StepTransition
        next
        Component={Button}
        onClick={onOrderCheckoutSubmit}
        style={spacing('mt-45')}
        nature='primary'
        fullwidth
        disabled={
          checkoutBusy ||
          Remote.Loading.is(quoteR) ||
          checkoutError ||
          limitsHelper(quoteR, limits)
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

  return (
    <Wrapper>
      <Text style={spacing('ml-10')} size='16px' weight={600}>
        {wantToHelper()}
      </Text>
      <MethodContainer>
        <Icon name='btc-circle' color='btc' size='30px' />
        <div style={{ ...flex('col'), ...spacing('ml-20') }}>
          <Text size='14px' weight={300} uppercase>
            Bitcoin
          </Text>
          <Text size='12px' weight={300}>
            {'@ '}
            {rateHelper()}
          </Text>
        </div>
      </MethodContainer>
      {reason.indexOf('has_remaining') > -1 ? (
        <Fragment>
          <Text style={spacing('ml-10')} size='16px' weight={600}>
            <FormattedMessage
              id='scenes.buysell.coinifycheckout.content.ordercheckout.amount'
              defaultMessage='Amount'
            />
          </Text>
          <div style={spacing('mt-10')}>
            <QuoteInput
              changeTab={changeTab}
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
      ) : null}
      {submitButtonHelper()}
    </Wrapper>
  )
}

export default OrderCheckout
