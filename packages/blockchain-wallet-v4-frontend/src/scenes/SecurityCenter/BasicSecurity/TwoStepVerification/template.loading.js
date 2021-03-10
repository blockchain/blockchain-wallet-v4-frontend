import React from 'react'
import { FormattedMessage } from 'react-intl'

import { FlatLoader, Text } from 'blockchain-info-components'

import {
  SecurityComponent,
  SecurityContainer,
  SecurityDescription,
  SecurityHeader,
  SecurityIcon,
  SecuritySummary
} from '../../components'

const TwoStepVerification = () => {
  return (
    <SecurityContainer>
      <SecurityIcon name='lock' enabled={false} />
      <SecuritySummary>
        <SecurityHeader>
          <FormattedMessage
            id='scenes.security.twostepverification.loading.title'
            defaultMessage='Two-Step Verification'
          />
        </SecurityHeader>
        <SecurityDescription>
          <Text>
            <FormattedMessage
              id='scenes.security.twostepverification.loading.description'
              defaultMessage='Use an Authenticator app, Yubikey, or SMS Codes'
            />
          </Text>
          <FormattedMessage
            id='scenes.security.twostepverification.loading.description2'
            defaultMessage='Two-step verification helps to prevent unauthorized access to your wallet by requiring a one-time password for every login attempt. Enable this to further secure your wallet.'
          />
        </SecurityDescription>
      </SecuritySummary>
      <SecurityComponent>
        <FlatLoader />
      </SecurityComponent>
    </SecurityContainer>
  )
}

export default TwoStepVerification
