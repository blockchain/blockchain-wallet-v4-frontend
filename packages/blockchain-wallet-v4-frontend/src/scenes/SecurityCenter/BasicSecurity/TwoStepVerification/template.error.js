import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

import {
  SecurityComponent,
  SecurityContainer,
  SecurityDescription,
  SecurityHeader,
  SecurityIcon,
  SecuritySummary
} from '../../components'

const TwoStepVerification = props => {
  const { message } = props

  return (
    <SecurityContainer>
      <SecurityIcon name='lock' enabled={false} />
      <SecuritySummary>
        <SecurityHeader>
          <FormattedMessage
            id='scenes.security.twostepverification.error.title'
            defaultMessage='Two-Step Verification'
          />
        </SecurityHeader>
        <SecurityDescription>
          <Text>
            <FormattedMessage
              id='scenes.security.twostepverification.error.description'
              defaultMessage='Use an Authenticator app, Yubikey, or SMS Codes'
            />
          </Text>
          <FormattedMessage
            id='scenes.security.twostepverification.error.description2'
            defaultMessage='Two-step verification helps to prevent unauthorized access to your wallet by requiring a one-time password for every login attempt. Enable this to further secure your wallet.'
          />
        </SecurityDescription>
      </SecuritySummary>
      <SecurityComponent>{message}</SecurityComponent>
    </SecurityContainer>
  )
}

export default TwoStepVerification
