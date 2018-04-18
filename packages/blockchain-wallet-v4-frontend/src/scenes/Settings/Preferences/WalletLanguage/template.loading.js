import React from 'react'
import { FormattedMessage } from 'react-intl'

import { FlatLoader } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const WalletLanguage = (props) => {
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
        <FlatLoader width='50px' height='14px' />
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletLanguage
