import React from 'react'

import { SecondaryButton } from 'components/generic/Button'
import { Text } from 'components/generic/Text'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const PasswordStretching = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.settings.passwordstretching.title' text='Password stretching (PBKDF2)' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.settings.passwordstretching.description' text='This increases the difficulty of discovering your password using a brute-force attack but slows down loading and saving your wallet.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SecondaryButton>
          <Text id='scenes.settings.passwordstretching.change' text='Change' small light white />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default PasswordStretching
