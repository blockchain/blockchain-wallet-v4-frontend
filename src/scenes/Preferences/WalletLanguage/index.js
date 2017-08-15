import React from 'react'

import { Text } from 'blockchain-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const WalletLanguage = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.preferences.language.title' text='Wallet language' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.preferences.language.description' text='Set your preferred language.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        [Languages Dropdown]
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletLanguage
