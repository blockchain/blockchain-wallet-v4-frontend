import React from 'react'
import { filter } from 'ramda'
import styled from 'styled-components'
import OrderHistory from '../../OrderHistory'
import { Text } from 'blockchain-info-components'
import ExchangeCheckout from '../../ExchangeCheckout'
import { determineStep, determineReason } from 'services/SfoxService'
import { flex, spacing } from 'services/StyleService'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import BuyCheckout from './BuyCheckout'
import { BuyOrderDetails, BuyOrderSubmit } from './BuyReviewOrder'

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
  const { changeBuySellTabStatus, fetchQuote, refreshQuote, submitQuote, handleTrade, quoteR, base, errors, showModal, handleTradeDetailsClick, ...rest } = props
  const quote = quoteR.getOrElse(null)

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
  const finishAccountSetup = () => showModal('SfoxExchangeData', { step })

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
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <BuyCheckout
              quoteR={quoteR}
              account={accounts[0]}
              onFetchQuote={fetchQuote}
              reason={reason}
              finishAccountSetup={finishAccountSetup}
              limits={limits}
            />
          </CheckoutWrapper>
        </StepView>
        <StepView step={1}>
          <div style={flex('row')}>
            <CheckoutWrapper>
              <BuyOrderDetails
                quoteR={quoteR}
                account={accounts[0]}
                onRefreshQuote={refreshQuote}
              />
            </CheckoutWrapper>
            <CheckoutWrapper style={{ ...flex('col'), ...spacing('pa-30') }}>
              <BuyOrderSubmit
                quoteR={quoteR}
                onSubmit={submitQuote}
              />
            </CheckoutWrapper>
          </div>
        </StepView>
      </Stepper>
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
          <OrderHistory trades={filter(isPending, trades)} conversion={1e8} handleDetailsClick={trade => showModal('SfoxTradeDetails', trade)} />
        </OrderHistoryContent>
        <OrderHistoryContent>
          <Text size='16px' weight={500}>
            <FormattedMessage id='scenes.buysell.sfoxcheckout.trades.completed' defaultMessage='Completed Trades' />
          </Text>
          <OrderHistory trades={filter(isCompleted, trades)} conversion={1e8} handleDetailsClick={trade => showModal('SfoxTradeDetails', trade)} />
        </OrderHistoryContent>
      </OrderHistoryWrapper>
    )
  } else {
    return null
  }
}

export default Success
