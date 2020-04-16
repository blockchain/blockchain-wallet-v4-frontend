import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, SuccessStateType } from '..'
import React from 'react'

type Props = {
  invalid: boolean
  submitting: boolean
} & SuccessStateType &
  LinkDispatchPropsType

const ActionButton: React.FC<Props> = props => {
  switch (props.userData.kycState) {
    case 'EXPIRED':
    case 'REJECTED':
      return (
        <Button
          data-e2e='submitSBAmount'
          height='48px'
          size='16px'
          nature='warning'
          type='submit'
          fullwidth
          disabled
        >
          <FormattedMessage
            id='modals.simplebuy.failed'
            defaultMessage='ID Verification Failed'
          />
        </Button>
      )
    case 'UNDER_REVIEW':
    case 'PENDING':
      return (
        <div>
          <Button
            data-e2e='submitSBAmount'
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
            style={{ textAlign: 'center', marginTop: '24px', display: 'block' }}
            onClick={() => props.profileActions.fetchUser()}
          >
            <FormattedMessage
              id='modals.simplebuy.refresh'
              defaultMessage='Refresh'
            />
          </Link>
        </div>
      )
    case 'NONE':
      return (
        <div>
          <Button
            data-e2e='submitSBAmount'
            height='48px'
            size='16px'
            nature='primary'
            type='submit'
            fullwidth
            disabled={props.invalid || props.submitting}
          >
            {props.submitting ? (
              <HeartbeatLoader height='16px' width='16px' color='white' />
            ) : (
              <FormattedMessage
                id='buttons.continue'
                defaultMessage='Continue'
              />
            )}
          </Button>
          <Text
            color='grey600'
            weight={500}
            size='14px'
            style={{ textAlign: 'center', marginTop: '24px' }}
          >
            <FormattedMessage
              id='modals.simplebuy.setupaccount'
              defaultMessage="Next, we'll set up your account."
            />
          </Text>
        </div>
      )
    case 'VERIFIED':
      return (
        <Button
          data-e2e='submitSBAmount'
          height='48px'
          size='16px'
          nature='primary'
          type='submit'
          fullwidth
          disabled={props.invalid || props.submitting}
        >
          {props.submitting ? (
            <HeartbeatLoader height='16px' width='16px' color='white' />
          ) : (
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          )}
        </Button>
      )
  }
}

export default ActionButton
