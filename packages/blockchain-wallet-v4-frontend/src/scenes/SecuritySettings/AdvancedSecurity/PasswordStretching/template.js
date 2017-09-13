import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

import Setting from './Setting'

const PasswordStretching = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.passwordstretching.title' defaultMessage='Password stretching (PBKDF2)' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.passwordstretching.description' defaultMessage='This increases the difficulty of discovering your password using a brute-force attack but slows down loading and saving your wallet.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Setting />
      </SettingComponent>
    </SettingContainer>
  )
}

export default PasswordStretching
