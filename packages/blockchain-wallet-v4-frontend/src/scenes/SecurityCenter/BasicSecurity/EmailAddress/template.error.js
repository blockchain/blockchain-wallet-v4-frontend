import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

import {
  SecurityComponent,
  SecurityContainer,
  SecurityDescription,
  SecurityHeader,
  SecuritySummary
} from '../../components'

const EmailAddress = props => {
  const { message } = props

  return (
    <SecurityContainer>
      <SecuritySummary>
        <SecurityHeader>
          <FormattedMessage
            id='scenes.preferences.email.error.title'
            defaultMessage='Email address'
          />
          <Text>{message}</Text>
        </SecurityHeader>
        <SecurityDescription>
          <FormattedMessage
            id='scenes.preferences.email.error.description'
            defaultMessage='Your verified email address is used to send login codes when suspicious or unusual activity is detected,'
          />
          <FormattedMessage
            id='scenes.preferences.email.error.description2'
            defaultMessage='to remind you of your wallet login ID,'
          />
          <FormattedMessage
            id='scenes.preferences.email.error.description3'
            defaultMessage='and to send bitcoin payment alerts when you receive funds.'
          />
        </SecurityDescription>
      </SecuritySummary>
      <SecurityComponent>
        <Text>{message}</Text>
      </SecurityComponent>
    </SecurityContainer>
  )
}

export default EmailAddress
