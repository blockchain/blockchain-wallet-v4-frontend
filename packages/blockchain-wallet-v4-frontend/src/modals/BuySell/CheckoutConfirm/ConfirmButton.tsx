import React from 'react'
import { FormattedMessage } from 'react-intl'

import { MobilePaymentType, OrderType } from '@core/types'
import { Button, HeartbeatLoader } from 'blockchain-info-components'
import { RefreshConfig } from 'data/types'

import { useCountDown } from '../hooks/useCountDown'

export type Props = {
  isAcceptedTerms: boolean
  isGooglePayReady: boolean
  isSubmitting: boolean
  mobilePaymentMethod?: MobilePaymentType
  orderType: keyof typeof OrderType
  refreshConfig: RefreshConfig
}

export const ConfirmButton = (props: Props) => {
  const { isCompletingSoon } = useCountDown(props.refreshConfig.date, props.refreshConfig.totalMs)

  return (
    <Button
      fullwidth
      nature='primary'
      data-e2e='confirmBSOrder'
      size='16px'
      height='48px'
      type='submit'
      disabled={
        props.isSubmitting ||
        isCompletingSoon ||
        !props.isAcceptedTerms ||
        (props.mobilePaymentMethod === MobilePaymentType.GOOGLE_PAY && !props.isGooglePayReady)
      }
    >
      {props.isSubmitting || isCompletingSoon ? (
        <HeartbeatLoader height='16px' width='16px' color='white' />
      ) : (
        <FormattedMessage
          id='buttons.buy_sell_now'
          defaultMessage='{orderType} Now'
          values={{ orderType: props.orderType === OrderType.BUY ? 'Buy' : 'Sell' }}
        />
      )}
    </Button>
  )
}
