import React from 'react'

import { Text } from 'components/generic/Text'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const Notifications = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.preferences.notifications.title' text='Notifications' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.preferences.notifications.description' text='Get notified when you receive bitcoin.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        [Notifications Checkboxes]
      </SettingComponent>
    </SettingContainer>
  )
}

export default Notifications
