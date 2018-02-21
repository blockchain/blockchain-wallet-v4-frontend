import React from 'react'
import ExchangeCheckout from '../ExchangeCheckout'
import { determineStep, determineReason } from 'services/SfoxService'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

const ContinueButton = props => {
  const { step, type } = props

  switch (true) {
    case step === 'verify': return <FormattedMessage id='scenes.buysell.sfoxcheckout.verify.button' defaultMessage='Continue Where You Left Off' />
    case step === 'verified' && type === 'buy': return <FormattedMessage id='scenes.buysell.sfoxcheckout.verified.buy_bitcoin_button' defaultMessage='Buy Bitcoin' />
    default: return null
  }
}

const RequiredMsg = props => {
  const { step } = props

  switch (true) {
    case step === 'verify': return <FormattedMessage id='scenes.buysell.sfoxcheckout.verify.message' defaultMessage='You need to finish verifying your account before you can start trading.' />
    default: return null
  }
}

const ReasonMsg = props => {
  const { reason, limit } = props

  switch (true) {
    case reason === 'has_remaining_buy_limit': return <FormattedHTMLMessage id='scenes.buysell.sfoxcheckout.buy.remaining_limit' defaultMessage='Your remaining buy limit is <span class="link">{limit} USD.</span>' values={{limit}} />
  }
}

const Success = props => {
  const { fetchQuote, quote, base, showModal } = props
  const { accounts, profile, verificationStatus } = props.value
  const type = 'buy'
  const step = determineStep(profile, verificationStatus)
  const reason = determineReason(type, profile, verificationStatus, accounts)

  const onSubmit = (e) => {
    e.preventDefault()
    showModal('SfoxExchangeData', { step })
  }

  return (
    <ExchangeCheckout
      fiatLimits
      base={base}
      quote={quote}
      fiat={'USD'}
      crypto={'BTC'}
      accounts={accounts}
      onSubmit={onSubmit}
      fetchQuote={fetchQuote}
      limit={profile.limits[type]}
      showReasonMsg={reason}
      showContinueMsg={step !== 'verified'}
      requiredMsg={<RequiredMsg step={step} type={type} />}
      continueButton={<ContinueButton step={step} type={type} />}
      reasonMsg={<ReasonMsg reason={reason} limit={profile.limits[type]} />}
    />
  )
}

export default Success
