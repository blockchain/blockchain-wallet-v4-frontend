import React from 'react'
import { FormattedMessage } from 'react-intl'
import Settings from './Settings'

import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const LocalCurrency = (props) => {
  const { currency } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.preferences.currency.title' defaultMessage='Local currency' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.preferences.currency.description' defaultMessage='Select your local currency.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings currency={currency} />
      </SettingComponent>
    </SettingContainer>
  )
}

export default LocalCurrency
