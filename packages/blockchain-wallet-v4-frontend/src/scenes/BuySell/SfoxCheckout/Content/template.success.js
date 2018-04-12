import React from 'react'
import { filter } from 'ramda'
import styled from 'styled-components'
import OrderHistory from '../../OrderHistory'
import { Text, Icon, Button } from 'blockchain-info-components'
import ExchangeCheckout, { Wrapper as ExchangeCheckoutWrapper } from '../../ExchangeCheckout'
import { determineStep, determineReason } from 'services/SfoxService'
import { flex, spacing } from 'services/StyleService'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'

import Fields from 'components/Form/FiatConvertor/template.success'

const CheckoutWrapper = styled.div`
  width: 50%;
`
const OrderHistoryWrapper = styled.div`
  width: 100%;
  > div:last-child > div:last-child {
    margin-bottom: 0px;
  }
`
const OrderHistoryContent = styled.div`
  > div:first-child {
    margin-bottom: 10px;
  }
  > div:last-child {
    margin-bottom: 20px;
  }
`

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

const isPending = (t) => t.state === 'processing'
const isCompleted = (t) => t.state !== 'processing'

const ContinueButton = props => {
  const { step, type } = props

  switch (true) {
    case step === 'verify': return <FormattedMessage id='scenes.buysell.sfoxcheckout.verify.button' defaultMessage='Continue Where You Left Off' />
    case step === 'upload': return <FormattedMessage id='scenes.buysell.sfoxcheckout.upload.button' defaultMessage='Continue Where You Left Off' />
    case step === 'funding': return <FormattedMessage id='scenes.buysell.sfoxcheckout.funding.button' defaultMessage='Continue Where You Left Off' />
    case step === 'verified' && type === 'buy': return <FormattedMessage id='scenes.buysell.sfoxcheckout.verified.buy_bitcoin_button' defaultMessage='Buy Bitcoin' />
    case step === 'verified' && type === 'sell': return <FormattedMessage id='scenes.buysell.sfoxcheckout.verified.sell_bitcoin_button' defaultMessage='Sell Bitcoin' />
    default: return null
  }
}

const RequiredMsg = props => {
  const { step } = props

  switch (true) {
    case step === 'verify': return <FormattedMessage id='scenes.buysell.sfoxcheckout.verify.message' defaultMessage='You need to finish personaling your account before you can buy and sell.' />
    case step === 'upload': return <FormattedMessage id='scenes.buysell.sfoxcheckout.upload.message' defaultMessage='You need to finish personaling your account before you can buy and sell.' />
    case step === 'funding': return <FormattedMessage id='scenes.buysell.sfoxcheckout.funding.message' defaultMessage='You need to finish linking your bank account before you can buy and sell.' />
    default: return null
  }
}

const ReasonMsg = props => {
  const { reason, limit } = props
  switch (true) {
    case reason === 'has_remaining_buy_limit': return <FormattedHTMLMessage id='scenes.buysell.sfoxcheckout.buy.remaining_limit' defaultMessage='Your remaining buy limit is <span class="link">{limit} USD.</span>' values={{limit}} />
    case reason === 'has_remaining_sell_limit': return <FormattedHTMLMessage id='scenes.buysell.sfoxcheckout.sell.remaining_limit' defaultMessage='Your remaining sell limit is <span class="link">{limit} USD.</span>' values={{limit}} />
    default: return <FormattedHTMLMessage id='placeholder' defaultMessage='&nbsp;' />
  }
}

const Success = props => {
  const { fetchQuote, handleTrade, quote, base, errors, showModal, ...rest } = props

  const accounts = Remote.of(props.value.accounts).getOrElse([])
  const profile = Remote.of(props.value.profile).getOrElse({ account: { verification_status: {} }, limits: { buy: 0, sell: 0 } })
  const verificationStatus = Remote.of(props.value.verificationStatus).getOrElse({ level: 'unverified', required_docs: [] })

  const { trades, type } = rest
  const step = determineStep(profile, verificationStatus, accounts)
  const reason = determineReason(type, profile, verificationStatus, accounts)

  const onSubmit = (e) => {
    e.preventDefault()
    step === 'verified' ? handleTrade(quote) : showModal('SfoxExchangeData', { step })
  }

  const limits = {
    buy: {
      min: 10,
      max: profile.limits.buy
    },
    sell: {
      min: 10,
      max: profile.limits.sell
    }
  }

  if (type === 'buy' || !type) {
    return (
      <CheckoutWrapper>
        <ExchangeCheckoutWrapper>
          <Text style={spacing('ml-10')} size='16px' weight={600}>
            <FormattedMessage id='buy.output_method.title' defaultMessage='I want to buy' />
          </Text>
          <MethodContainer>
            <Icon name='bitcoin-in-circle-filled' size='26px' />
            <div style={{ ...flex('col'), ...spacing('ml-20') }}>
              <Text size='14px' weight={300} uppercase>Bitcoin</Text>
              <Text size='12px' weight={300}>@ $6,850.11</Text>
            </div>
          </MethodContainer>
          <Text style={spacing('ml-10')} size='16px' weight={600}>
            <FormattedMessage id='buy.input_method.title' defaultMessage='I will pay with' />
          </Text>
          <MethodContainer>
            <Icon name='bank-filled' size='26px' />
            <div style={{ ...flex('col'), ...spacing('ml-20') }}>
              <Text size='14px' weight={300}>
                {'Plaid Savings '}
                <FormattedMessage id='buy.account_ending_with' defaultMessage='ending with' />
                {' ' + '9806'}
              </Text>
              <Text size='12px' weight={300}>
                {'CitiBank'}
              </Text>
            </div>
          </MethodContainer>
          <Text style={spacing('ml-10')} size='16px' weight={600}>
            <FormattedMessage id='amount' defaultMessage='Amount' />
          </Text>
          <div style={spacing('mt-15')}>
            <Fields
              value={'0.1'}
              fiat={'0.2'}
              data={{
                data: {
                  unit: 'USD',
                  currency: 'BTC'
                }
              }}
              unit='__required__'
              currency='__required__'
              meta={{}}
              handleBlur={() => {}}
              handleCoinChange={() => {}}
              handleFiatChange={() => {}}
              handleFocus={() => {}}
              handleErrorClick={() => {}}
            />
          </div>
          <Button style={spacing('mt-45')} nature='primary' fullwidth>
            <FormattedMessage id='review_order' defaultMessage='Review Order' />
          </Button>
        </ExchangeCheckoutWrapper>
      </CheckoutWrapper>
    )
  } else if (type === 'sell') {
    return (
      <CheckoutWrapper>
        <ExchangeCheckout
          fiatLimits
          base={base}
          quote={quote}
          errors={errors}
          fiat={'USD'}
          crypto={'BTC'}
          accounts={accounts}
          onSubmit={onSubmit}
          fetchQuote={fetchQuote}
          limits={limits[type]}
          showRequiredMsg={step !== 'verified'}
          requiredMsg={<RequiredMsg step={step} type={type} />}
          continueButton={<ContinueButton step={step} type={type} />}
          reasonMsg={<ReasonMsg reason={reason} limit={profile.limits[type]} />}
        />
      </CheckoutWrapper>
    )
  } else if (trades) {
    return (
      <OrderHistoryWrapper>
        <OrderHistoryContent>
          <Text size='16px' weight={500}>
            <FormattedMessage id='scenes.buysell.sfoxcheckout.trades.pending' defaultMessage='Pending Trades' />
          </Text>
          <OrderHistory trades={filter(isPending, trades)} conversion={1e8} />
        </OrderHistoryContent>
        <OrderHistoryContent>
          <Text size='16px' weight={500}>
            <FormattedMessage id='scenes.buysell.sfoxcheckout.trades.completed' defaultMessage='Completed Trades' />
          </Text>
          <OrderHistory trades={filter(isCompleted, trades)} conversion={1e8} />
        </OrderHistoryContent>
      </OrderHistoryWrapper>
    )
  } else {
    return null
  }
}

export default Success
