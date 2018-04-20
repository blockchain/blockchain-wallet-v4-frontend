import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'
import Settings from './Settings'

const WalletLanguage = (props) => {
  const { language } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.preferences.language.title' defaultMessage='Wallet Language' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.preferences.language.description' defaultMessage='Set your preferred language.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings language={language} />
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletLanguage
