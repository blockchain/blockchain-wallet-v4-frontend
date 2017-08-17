import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const Themes = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.preferences.themes.title' defaultMessage='Themes' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.preferences.themes.description' defaultMessage='Try out different themes for the wallet.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        [Themes Dropdown]
      </SettingComponent>
    </SettingContainer>
  )
}

export default Themes
