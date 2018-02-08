import React from 'react'
import ExchangeCheckout from '../ExchangeCheckout'
import { determineStep } from 'services/SfoxService'
import { FormattedMessage } from 'react-intl'

const ContinueButton = props => {
  const { step } = props

  switch (true) {
    case step === 'verify': return <FormattedMessage id='scenes.buysell.sfoxcheckout.verify.button' defaultMessage='Continue Where You Left Off' />
  }
}

const ContinueMessage = props => {
  const { step } = props

  switch (true) {
    case step === 'verify': return <FormattedMessage id='scenes.buysell.sfoxcheckout.verify.message' defaultMessage='You need to finish verifying your account before you can start trading.' />
  }
}

const Success = props => {
  const { fetchQuote, quote, base, showModal } = props
  const { profile, verificationStatus } = props.value
  const step = determineStep(profile, verificationStatus)

  const onSubmit = (e) => {
    e.preventDefault()
    showModal('SfoxExchangeData', { step })
  }

  return (
    <ExchangeCheckout
      base={base}
      quote={quote}
      onSubmit={onSubmit}
      fetchQuote={fetchQuote}
      continueMsg={<ContinueMessage step={step} />}
      continueButton={<ContinueButton step={step} />}
    />
  )
}

export default Success
