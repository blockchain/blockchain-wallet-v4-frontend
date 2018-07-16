import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

import Settings from './Settings'

const PasswordStretching = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.securitysettings.advancedsettings.passwordstretching.title' defaultMessage='Password Stretching (PBKDF2)' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.securitysettings.advancedsettings.passwordstretching.description' defaultMessage='This increases the difficulty of discovering your password using a brute-force attack but slows down loading and saving your wallet.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default PasswordStretching
