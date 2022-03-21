import React from 'react'
import { FormattedMessage } from 'react-intl'

import { OrderType } from '@core/types'
import { Button, HeartbeatLoader, Link } from 'blockchain-info-components'

import { Props as OwnProps, SuccessStateType } from '..'

type Props = {
  invalid: boolean
  isAmountInBounds: boolean
  isDailyLimitExceeded: boolean
  isSufficientEthForErc20: boolean
  submitting: boolean
} & OwnProps &
  SuccessStateType

const ActionButton: React.FC<Props> = (props) => {
  const disabled = props.invalid || props.submitting || !props.isAmountInBounds
  const disableInsufficientEth = props.isSufficientEthForErc20
  const dailyLimitExceeded = props.isDailyLimitExceeded

  switch (props.userData.kycState) {
    case 'EXPIRED':
    case 'REJECTED':
      return (
        <Button
          data-e2e='submitBSAmount'
          height='48px'
          size='16px'
          nature='warning'
          type='submit'
          fullwidth
          disabled
        >
          <FormattedMessage id='modals.simplebuy.failed' defaultMessage='ID Verification Failed' />
        </Button>
      )
    case 'UNDER_REVIEW':
    case 'PENDING':
      return (
        <div>
          <Button
            data-e2e='submitBSAmount'
            height='48px'
            size='16px'
            nature='primary'
            type='submit'
            fullwidth
            disabled
          >
            <FormattedMessage
              id='modals.simplebuy.underreview'
              defaultMessage='ID Verification Pending'
            />
          </Button>
          <Link
            size='14px'
            weight={600}
            style={{ display: 'block', marginTop: '24px', textAlign: 'center' }}
            onClick={() => props.profileActions.fetchUser()}
          >
            <FormattedMessage id='modals.simplebuy.refresh' defaultMessage='Refresh' />
          </Link>
        </div>
      )
    case 'NONE':
      return (
        <div>
          <Button
            data-e2e='submitBSAmount'
            height='48px'
            size='16px'
            nature='primary'
            type='submit'
            fullwidth
            disabled={disabled}
          >
            {props.submitting ? (
              <HeartbeatLoader height='16px' width='16px' color='white' />
            ) : (
              <FormattedMessage id='buttons.next' defaultMessage='Next' />
            )}
          </Button>
        </div>
      )
    case 'VERIFIED':
      return (
        <Button
          data-e2e='submitBSAmount'
          height='48px'
          size='16px'
          nature='primary'
          type='submit'
          fullwidth
          disabled={disabled || disableInsufficientEth || dailyLimitExceeded}
        >
          {props.submitting ? (
            <HeartbeatLoader height='16px' width='16px' color='white' />
          ) : (
            <FormattedMessage
              id='buttons.preview_buysell'
              defaultMessage='Preview {orderType}'
              values={{
                orderType: props.orderType === OrderType.BUY ? 'Buy' : 'Sell'
              }}
            />
          )}
        </Button>
      )
    default:
      return <></>
  }
}

export default ActionButton
