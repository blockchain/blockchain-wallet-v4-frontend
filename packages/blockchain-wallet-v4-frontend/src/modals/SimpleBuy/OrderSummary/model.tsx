import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SBOrderType } from 'blockchain-wallet-v4/src/types'
import {
  ErrorCartridge,
  GreyCartridge,
  SuccessCartridge
} from 'components/Cartridge'

export const Status = ({ order }: { order: SBOrderType }) => {
  switch (order.state) {
    case 'PENDING_CONFIRMATION':
    case 'PENDING_DEPOSIT':
      return (
        <GreyCartridge>
          <FormattedMessage
            id='modals.simplebuy.waitingondepo'
            defaultMessage='Waiting on Funds'
          />
        </GreyCartridge>
      )
    case 'CANCELED':
      return (
        <ErrorCartridge>
          <FormattedMessage
            id='modals.simplebuy.canceled'
            defaultMessage='Trade Canceled'
          />
        </ErrorCartridge>
      )
    case 'EXPIRED':
    case 'FAILED':
      return (
        <ErrorCartridge>
          <FormattedMessage
            id='modals.simplebuy.error'
            defaultMessage='Trade Failed'
          />
        </ErrorCartridge>
      )
    case 'FINISHED':
      return (
        <SuccessCartridge>
          <FormattedMessage
            id='modals.simplebuy.success'
            defaultMessage='Trade Complete'
          />
        </SuccessCartridge>
      )
    default:
      return (
        <GreyCartridge>
          <FormattedMessage
            id='modals.simplebuy.unknown'
            defaultMessage='Unknown Status'
          />
        </GreyCartridge>
      )
  }
}
