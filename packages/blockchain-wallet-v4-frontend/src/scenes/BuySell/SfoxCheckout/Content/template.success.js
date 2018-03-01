import React from 'react'
import styled from 'styled-components'
import OrderHistory from '../../OrderHistory'
import ExchangeCheckout from '../../ExchangeCheckout'
import { determineStep, determineReason } from 'services/SfoxService'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

const CheckoutWrapper = styled.div`
  width: 50%;
`

const ContinueButton = props => {
  const { step, type } = props

  switch (true) {
    case step === 'verify': return <FormattedMessage id='scenes.buysell.sfoxcheckout.verify.button' defaultMessage='Continue Where You Left Off' />
    case step === 'upload': return <FormattedMessage id='scenes.buysell.sfoxcheckout.upload.button' defaultMessage='Continue Where You Left Off' />
    case step === 'link': return <FormattedMessage id='scenes.buysell.sfoxcheckout.link.button' defaultMessage='Continue Where You Left Off' />
    case step === 'verified' && type === 'buy': return <FormattedMessage id='scenes.buysell.sfoxcheckout.verified.buy_bitcoin_button' defaultMessage='Buy Bitcoin' />
    default: return null
  }
}

const RequiredMsg = props => {
  const { step } = props

  switch (true) {
    case step === 'verify': return <FormattedMessage id='scenes.buysell.sfoxcheckout.verify.message' defaultMessage='You need to finish verifying your account before you can buy and sell.' />
    case step === 'upload': return <FormattedMessage id='scenes.buysell.sfoxcheckout.upload.message' defaultMessage='You need to finish verifying your account before you can buy and sell.' />
    case step === 'link': return <FormattedMessage id='scenes.buysell.sfoxcheckout.link.message' defaultMessage='You need to finish linking your bank account before you can buy and sell.' />
    default: return null
  }
}

const ReasonMsg = props => {
  const { reason, limit } = props
  switch (true) {
    case reason === 'has_remaining_buy_limit': return <FormattedHTMLMessage id='scenes.buysell.sfoxcheckout.buy.remaining_limit' defaultMessage='Your remaining buy limit is <span class="link">{limit} USD.</span>' values={{limit}} />
    default: return <FormattedHTMLMessage id='placeholder' defaultMessage='&nbsp;' />
  }
}

const Success = props => {
  const { fetchQuote, handleTrade, quote, base, errors, showModal, ...rest } = props
  const { accounts, profile, verificationStatus } = props.value
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

  if (type === 'buy') {
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
  } else {
    return (
      <OrderHistory trades={trades} conversion={1e8} />
    )
  }
}

export default Success
