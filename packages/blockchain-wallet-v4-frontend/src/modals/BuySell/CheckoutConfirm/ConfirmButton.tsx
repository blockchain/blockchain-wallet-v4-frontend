import React from 'react'
import { FormattedMessage } from 'react-intl'

import { MobilePaymentType, RefreshConfig } from '@core/types'
import { Button, HeartbeatLoader } from 'blockchain-info-components'
import { useCountDown } from 'hooks'

export type Props = {
  isAcceptedTerms: boolean
  isGooglePayReady: boolean
  isSubmitting: boolean
  mobilePaymentMethod?: MobilePaymentType
  refreshConfig: RefreshConfig
}

export const ConfirmButton = (props: Props) => {
  const { isCompletingSoon } = useCountDown(props.refreshConfig.date, props.refreshConfig.totalMs)

  const showLoading = props.isSubmitting || isCompletingSoon

  const buttonDisabled =
    showLoading ||
    !props.isAcceptedTerms ||
    (props.mobilePaymentMethod === MobilePaymentType.GOOGLE_PAY && !props.isGooglePayReady)

  return (
    <Button
      fullwidth
      nature='primary'
      data-e2e='confirmBSOrder'
      size='16px'
      height='48px'
      type='submit'
      disabled={buttonDisabled}
    >
      {showLoading ? (
        <HeartbeatLoader height='16px' width='16px' color='white' />
      ) : (
        <FormattedMessage id='buttons.buy_now' defaultMessage='Buy Now' />
      )}
    </Button>
  )
}
