import React from 'react'

import { Text } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const BitcoinUnit = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.preferences.unit.title' text='Bitcoin unit' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.preferences.unit.description' text='Adjust the precision you would prefer bitcoin values to be displayed in.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        [Bitcoin Unit Dropdown]
      </SettingComponent>
    </SettingContainer>
  )
}

export default BitcoinUnit
