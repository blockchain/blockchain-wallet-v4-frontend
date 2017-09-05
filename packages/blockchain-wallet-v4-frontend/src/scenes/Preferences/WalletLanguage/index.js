import React from 'react'
import { FormattedMessage } from 'react-intl'
import Settings from './Settings'

import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const WalletLanguage = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.preferences.language.title' defaultMessage='Wallet language' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.preferences.language.description' defaultMessage='Set your preferred language.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletLanguage
