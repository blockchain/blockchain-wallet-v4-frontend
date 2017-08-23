import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Text } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const EmailAddress = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.preferences.email.title' defaultMessage='Email address' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.preferences.email.description' defaultMessage='Your verified email address is used to send login codes when suspicious or unusual activity is detected,' />
          <FormattedMessage id='scenes.preferences.email.description2' defaultMessage='to remind you of your wallet login ID,' />
          <FormattedMessage id='scenes.preferences.email.description3' defaultMessage='and to send bitcoin payment alerts when you receive funds.' />
          <Text size='14px' weight={300} color='mahogany'>
            <FormattedMessage id='scenes.preferences.email.warning' defaultMessage="This will change your wallet's email address, but the email address you signed up to Buy Bitcoin with will remain the same." />
          </Text>
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Text>test@example.com</Text>
        <Button nature='secondary'>
          <FormattedMessage id='scenes.preferences.email.change' defaultMessage='Change' />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default EmailAddress
