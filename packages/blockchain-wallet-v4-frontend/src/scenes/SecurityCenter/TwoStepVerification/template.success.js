import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'

import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySummary } from 'components/Security'
import Settings from './Settings'

const TwoStepVerification = (props) => {
  const { authType } = props
  const twoFAEnabled = authType === 1

  return (
    <SecurityContainer>
      <SecurityIcon name='lock' enabled={twoFAEnabled} />
      <SecuritySummary>
        <SecurityHeader>
          <FormattedMessage id='scenes.security.twostepverification.title' defaultMessage='Two-Step Verification' />
        </SecurityHeader>
        <SecurityDescription>
          <Text>
            <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Use Google Authenticator, Yubikey, or SMS Codes' />
          </Text>
          <FormattedMessage id='scenes.security.twostepverification.description2' defaultMessage='Two-Step Verification helps to prevent unauthorized access to your wallet by requiring a one-time password for every login attempt. You can disable this here if you’d like to change your phone number or switch the type of Two-Step Verification you’re using.' />
        </SecurityDescription>
      </SecuritySummary>
      <SecurityComponent>
        <Settings />
      </SecurityComponent>
    </SecurityContainer>
  )
}

TwoStepVerification.propTypes = {
  authType: PropTypes.number.isRequired
}

export default TwoStepVerification
