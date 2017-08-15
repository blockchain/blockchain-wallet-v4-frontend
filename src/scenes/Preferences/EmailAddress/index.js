import React from 'react'

import { SecondaryButton, Text, Typography } from 'blockchain-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const EmailAddress = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.preferences.email.title' text='Email address' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.preferences.email.description' text='Your verified email address is used to send login codes when suspicious or unusual activity is detected,' altFont light />
          <Text id='scenes.preferences.email.description2' text='to remind you of your wallet login ID,' altFont light />
          <Text id='scenes.preferences.email.description3' text='and to send bitcoin payment alerts when you receive funds.' altFont light />
          <Text id='scenes.preferences.email.warning' text="This will change your wallet's email address, but the email address you signed up to Buy Bitcoin with will remain the same." altFont light red />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Typography>test@example.com</Typography>
        <SecondaryButton>
          <Text id='scenes.preferences.email.change' text='Change' small light white />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default EmailAddress
