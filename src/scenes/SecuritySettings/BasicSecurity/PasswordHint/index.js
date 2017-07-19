import React from 'react'

import { SecondaryButton } from 'components/generic/Button'
import { Text } from 'components/generic/Text'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const PasswordHint = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.settings.passwordhint.title' text='Password hint' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.settings.passwordhint.description' text='Your Blockchain Wallet never communicates your password to our servers.' altFont light />
          <Text id='scenes.settings.passwordhint.description2' text='This means we have no idea what your password is and we cannot reset it if you forget it.' altFont light />
          <Text id='scenes.settings.passwordhint.description3' text='Create a memorable password hint that we can send to your verified email address in case you forget your password.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SecondaryButton>
          <Text id='scenes.settings.passwordhint.change' text='Change' small light white />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default PasswordHint
