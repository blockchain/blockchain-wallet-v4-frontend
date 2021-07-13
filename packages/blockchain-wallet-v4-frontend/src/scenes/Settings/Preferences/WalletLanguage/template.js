import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

import Settings from './Settings'

const WalletLanguage = props => {
  const { language } = props

  return (
    <SettingContainer data-e2e='prefsWalletLanguage'>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.preferences.walletlanguage.success.title'
            defaultMessage='Wallet Language'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.preferences.walletlanguage.success.description'
            defaultMessage='Set your preferred language.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings language={language} />
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletLanguage
