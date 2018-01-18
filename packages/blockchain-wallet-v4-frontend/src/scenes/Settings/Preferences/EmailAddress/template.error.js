import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const EmailAddress = (props) => {
  const { message } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.preferences.email.title' defaultMessage='Email address' />
          <Text>{message}</Text>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.preferences.email.description' defaultMessage='Your verified email address is used to send login codes when suspicious or unusual activity is detected,' />
          <FormattedMessage id='scenes.preferences.email.description2' defaultMessage='to remind you of your wallet login ID,' />
          <FormattedMessage id='scenes.preferences.email.description3' defaultMessage='and to send bitcoin payment alerts when you receive funds.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Text>{message}</Text>
      </SettingComponent>
    </SettingContainer>
  )
}

export default EmailAddress
