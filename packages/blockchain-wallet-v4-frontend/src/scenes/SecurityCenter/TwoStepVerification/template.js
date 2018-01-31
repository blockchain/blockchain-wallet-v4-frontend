import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySection, SecuritySummary } from 'components/Security'
import Settings from './Settings'

const TwoStepVerification = (props) => {
  const { authType } = props

  return (
    <SecurityContainer>
      <SecurityIcon name='lock' />
      <SecuritySummary>
        <SecurityHeader>
          <FormattedMessage id='scenes.security.twostepverification.title' defaultMessage='2-step verification' />
        </SecurityHeader>
        <SecurityDescription>
          <FormattedMessage id='scenes.security.twostepverification.description' defaultMessage='Protect your wallet from unauthorized access by enabling 2-Step Verification.' />
          <FormattedMessage id='scenes.security.twostepverification.description2' defaultMessage='You can choose to use a free app or your mobile phone number to secure your wallet.' />
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
