import React from 'react'

import { SecondaryButton } from 'components/generic/Button'
import { Text } from 'components/generic/Text'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const WalletPassword = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.settings.password.title' text='Wallet password' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.settings.password.description' text='Your password is never shared with our servers, which means we cannot help reset your password if you forget it.' altFont light />
          <Text id='scenes.settings.password.description2' text='Make sure you write down your recovery phrase which can restore access to your wallet in the event of a lost password.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SecondaryButton>
          <Text id='scenes.settings.password.change' text='Change' small light white capitalize />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletPassword
