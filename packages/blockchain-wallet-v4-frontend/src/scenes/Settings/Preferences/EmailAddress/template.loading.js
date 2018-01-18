import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'
import { FlatLoader } from 'blockchain-info-components'

const EmailAddress = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.preferences.email.title' defaultMessage='Email address' />
          <FlatLoader width='50px' height='14px' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.preferences.email.description' defaultMessage='Your verified email address is used to send login codes when suspicious or unusual activity is detected,' />
          <FormattedMessage id='scenes.preferences.email.description2' defaultMessage='to remind you of your wallet login ID,' />
          <FormattedMessage id='scenes.preferences.email.description3' defaultMessage='and to send bitcoin payment alerts when you receive funds.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <FlatLoader width='50px' height='14px' />
      </SettingComponent>
    </SettingContainer>
  )
}

export default EmailAddress
