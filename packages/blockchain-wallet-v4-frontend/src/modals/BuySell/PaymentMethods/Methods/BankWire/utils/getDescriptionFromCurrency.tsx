import React, { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { FiatType } from '@core/types'

export const getDescriptionFromCurrency = (currency: FiatType): ReactNode => {
  switch (currency) {
    case 'EUR':
      return (
        <FormattedMessage
          id='modals.simplebuy.bankwire.eur_description'
          defaultMessage=' Bank fees may apply.'
        />
      )
    case 'GBP':
      return (
        <FormattedMessage
          id='modals.simplebuy.bankwire.gbp_description'
          defaultMessage='Transfers are made through the UK Faster Payments System and usually arrive in seconds.'
        />
      )
    case 'USD':
      return (
        <FormattedMessage
          id='modals.simplebuy.bankwire.description_v'
          defaultMessage='For transferring large amounts. Bank fees may apply.'
        />
      )
    case 'ARS':
      return (
        <FormattedMessage
          id='modals.simplebuy.banktransfer.description_ars'
          defaultMessage='Transfer funds from your bank account to your Blockchain.com Wallet with a bank transfer. Your bank may charge additional fees.'
        />
      )
    default:
      return (
        <FormattedMessage
          id='modals.simplebuy.banktransfer.description'
          defaultMessage='Send funds directly from your bank to your Blockchain.com Account. Once we receive the bank transfer, we’ll complete your purchase.'
        />
      )
  }
}
