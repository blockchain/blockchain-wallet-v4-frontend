import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecuritySummary } from 'components/Security'
import { FlatLoader } from 'blockchain-info-components'

const EmailAddress = (props) => {
  return (
    <SecurityContainer>
      <SecuritySummary>
        <SecurityHeader>
          <FormattedMessage id='scenes.preferences.email.title' defaultMessage='Email address' />
          <FlatLoader width='50px' height='14px' />
        </SecurityHeader>
        <SecurityDescription>
          <FormattedMessage id='scenes.preferences.email.description' defaultMessage='Your verified email address is used to send login codes when suspicious or unusual activity is detected,' />
          <FormattedMessage id='scenes.preferences.email.description2' defaultMessage='to remind you of your wallet login ID,' />
          <FormattedMessage id='scenes.preferences.email.description3' defaultMessage='and to send bitcoin payment alerts when you receive funds.' />
        </SecurityDescription>
      </SecuritySummary>
      <SecurityComponent>
        <FlatLoader width='50px' height='14px' />
      </SecurityComponent>
    </SecurityContainer>
  )
}

export default EmailAddress
