import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'

type Props = {
  currentStep: number
  onClick: () => void
}

export const ActionButton = ({ currentStep, onClick }: Props) => {
  switch (currentStep) {
    case 0:
      return (
        <Button
          jumbo
          nature='purple'
          data-e2e='completeProfileButtonVerifyId'
          onClick={onClick}
          fullwidth
        >
          <FormattedMessage
            id='modal.complete_profile.verify_your_id'
            defaultMessage='Verify Your ID'
          />
        </Button>
      )
    case 1:
      return (
        <Button
          jumbo
          nature='primary'
          data-e2e='completeProfileButtonLinkABank'
          onClick={onClick}
          fullwidth
        >
          <FormattedMessage
            id='modal.complete_profile.link_a_payment_method'
            defaultMessage='Link a Payment Method'
          />
        </Button>
      )
    case 2:
    default:
      return (
        <Button
          jumbo
          nature='received'
          data-e2e='completeProfileButtonBuyCrypto'
          onClick={onClick}
          fullwidth
        >
          <FormattedMessage id='buttons.buy_crypto' defaultMessage='Buy Crypto' />
        </Button>
      )
  }
}
