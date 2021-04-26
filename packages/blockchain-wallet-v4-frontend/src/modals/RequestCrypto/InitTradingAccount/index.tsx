import React from 'react'
import { FormattedMessage } from 'react-intl'

import IdvIntro from 'components/IdentityVerification/IdvIntro'

import { RequestSteps } from '../types'

const InitTradingAccount: React.FC<Props> = props => {
  return (
    <IdvIntro
      {...props}
      selectedTier={1}
      goBack={() => props.setStep(RequestSteps.COIN_SELECT)}
      subHeaderCopy={
        <FormattedMessage
          id='copy.trading_get_access'
          defaultMessage='Get access to the Trading Account in seconds by completing your profile and getting Silver access.'
        />
      }
      subHeaderTitle={
        <FormattedMessage
          id='copy.trading_verify_email'
          defaultMessage='Verify to use the Trading Account'
        />
      }
      subTitle={
        <FormattedMessage
          id='copy.instantly_fund'
          defaultMessage='Send, Receive and instantly fund your trades using the Trading Account.'
        />
      }
      title={
        <FormattedMessage
          id='copy.trading_account_access'
          defaultMessage='Get Trading Account access'
        />
      }
      resultTitle={
        <FormattedMessage
          id='copy.trading_start'
          defaultMessage='Use the Trading Account'
        />
      }
      resultCopy={
        <FormattedMessage
          id='copy.trade_and_fund'
          defaultMessage='Send, Receive, Buy and Swap cryptocurrencies with your Trading Account.'
        />
      }
    />
  )
}

type Props = {
  handleClose: () => void
  setStep: (step: RequestSteps) => void
}

export default InitTradingAccount
