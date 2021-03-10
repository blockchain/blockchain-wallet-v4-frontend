import React from 'react'
import { FormattedMessage } from 'react-intl'

import { FlatLoader } from 'blockchain-info-components'

import {
  SecurityComponent,
  SecurityContainer,
  SecurityDescription,
  SecurityHeader,
  SecuritySummary
} from '../../../components'

const EmailAddress = () => {
  return (
    <SecurityContainer>
      <SecuritySummary>
        <SecurityHeader>
          <FormattedMessage
            id='scenes.preferences.loading.email.title'
            defaultMessage='Email address'
          />
          <FlatLoader width='50px' height='14px' />
        </SecurityHeader>
        <SecurityDescription>
          <FormattedMessage
            id='scenes.preferences.loading.email.description'
            defaultMessage='Your verified email address is used to send login codes when suspicious or unusual activity is detected,'
          />
          <FormattedMessage
            id='scenes.preferences.loading.email.description2'
            defaultMessage='to remind you of your wallet login ID,'
          />
          <FormattedMessage
            id='scenes.preferences.loading.email.description3'
            defaultMessage='and to send bitcoin payment alerts when you receive funds.'
          />
        </SecurityDescription>
      </SecuritySummary>
      <SecurityComponent>
        <FlatLoader width='50px' height='14px' />
      </SecurityComponent>
    </SecurityContainer>
  )
}

export default EmailAddress
