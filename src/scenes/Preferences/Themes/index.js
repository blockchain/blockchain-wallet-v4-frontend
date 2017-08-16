import React from 'react'

import { Text } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const Themes = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.preferences.themes.title' text='Themes' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.preferences.themes.description' text='Try out different themes for the wallet.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        [Themes Dropdown]
      </SettingComponent>
    </SettingContainer>
  )
}

export default Themes
