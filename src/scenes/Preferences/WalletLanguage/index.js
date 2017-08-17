import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

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
        [Languages Dropdown]
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletLanguage
