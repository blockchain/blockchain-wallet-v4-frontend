import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'
import Settings from './Settings'

const Notifications = () => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.preferences.notifications.title' defaultMessage='Notifications' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.preferences.notifications.description' defaultMessage='Get notified when you receive bitcoin.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default Notifications
