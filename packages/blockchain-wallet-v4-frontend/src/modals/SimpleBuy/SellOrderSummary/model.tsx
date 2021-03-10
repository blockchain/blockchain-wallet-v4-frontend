import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SwapOrderType } from 'blockchain-wallet-v4/src/types'
import {
  ErrorCartridge,
  GreyCartridge,
  OrangeCartridge,
  SuccessCartridge
} from 'components/Cartridge'

export const Status = ({
  sellOrder
}: {
  sellOrder: SwapOrderType | undefined
}) => {
  switch (sellOrder?.state) {
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
    case 'PENDING_EXECUTION':
      return (
        <OrangeCartridge>
          <FormattedMessage id='copy.pending' defaultMessage='Pending' />
        </OrangeCartridge>
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
