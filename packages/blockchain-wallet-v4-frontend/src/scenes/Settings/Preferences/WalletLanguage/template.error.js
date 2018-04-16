import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const WalletLanguage = (props) => {
  const { message } = props

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
        <Text>{message}</Text>
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletLanguage
