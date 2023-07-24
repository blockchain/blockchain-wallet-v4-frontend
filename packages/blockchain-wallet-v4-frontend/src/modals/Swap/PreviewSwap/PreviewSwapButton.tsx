import React from 'react'
import { FormattedMessage } from 'react-intl'

import { RefreshConfig } from '@core/types'
import { Button, HeartbeatLoader } from 'blockchain-info-components'
import { useCountDown } from 'hooks'

export type Props = {
  isSubmitting: boolean
  refreshConfig: RefreshConfig
}

export const PreviewSwapButton = (props: Props) => {
  const { isCompletingSoon } = useCountDown(props.refreshConfig.date, props.refreshConfig.totalMs)

  return (
    <Button
      nature='primary'
      data-e2e='swapBtn'
      type='submit'
      disabled={props.isSubmitting || isCompletingSoon}
      fullwidth
      height='48px'
    >
      {props.isSubmitting || isCompletingSoon ? (
        <HeartbeatLoader height='16px' width='16px' color='white' />
      ) : (
        <FormattedMessage id='buttons.swap_now' defaultMessage='Swap Now' />
      )}
    </Button>
  )
}
