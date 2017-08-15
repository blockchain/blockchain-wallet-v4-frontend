import React from 'react'

import { Text } from 'blockchain-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const LocalCurrency = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.preferences.currency.title' text='Local currency' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.preferences.currency.description' text='Select your local currency.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        [Local Currency Dropdown]
      </SettingComponent>
    </SettingContainer>
  )
}

export default LocalCurrency
