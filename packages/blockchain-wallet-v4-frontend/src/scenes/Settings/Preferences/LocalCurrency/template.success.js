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

const LocalCurrency = props => {
  const { currency } = props

  return (
    <SettingContainer data-e2e='prefsLocalCurrency'>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.preferences.localcurrency.success.title'
            defaultMessage='Local Currency'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.preferences.localcurrency.success.description'
            defaultMessage='Select your local currency.'
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
