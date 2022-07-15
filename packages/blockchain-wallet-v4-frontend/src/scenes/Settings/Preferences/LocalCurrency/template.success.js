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

const LocalCurrency = (props) => {
  const { currency } = props

  return (
    <SettingContainer data-e2e='prefsLocalCurrency'>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.preferences.wallet_display_currency.success.title'
            defaultMessage='Wallet Display Currency'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.preferences.wallet_display_currency.success.description'
            defaultMessage='Select your wallet display currency.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings currency={currency} />
      </SettingComponent>
    </SettingContainer>
  )
}

export default LocalCurrency
