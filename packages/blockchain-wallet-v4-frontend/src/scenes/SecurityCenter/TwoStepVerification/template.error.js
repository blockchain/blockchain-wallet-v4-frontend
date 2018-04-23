import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'

import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary } from 'components/Security'

const TwoStepVerification = (props) => {
  const { message } = props

  return (
    <SecurityContainer>
      <SecurityIcon name='lock' enabled={false} />
      <SecuritySummary>
        <SecurityHeader>
          <FormattedMessage id='scenes.security.twostepverification.title' defaultMessage='Two-factor Authentication' />
        </SecurityHeader>
        <SecurityDescription>
          <Text>
            <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Use Google Authenticator, Yubikey, or SMS Codes' />
          </Text>
          <FormattedMessage id='scenes.security.twostepverification.description2' defaultMessage='Two-factor authentication helps to prevent unauthorized access to your wallet by requiring a one-time password for every login attempt. You can disable this here if you’d like to change your phone number or switch the type of two-factor authentication you’re using.' />
        </SecurityDescription>
      </SecuritySummary>
      <SecurityComponent>
        {message}
      </SecurityComponent>
    </SecurityContainer>
  )
}

export default TwoStepVerification
