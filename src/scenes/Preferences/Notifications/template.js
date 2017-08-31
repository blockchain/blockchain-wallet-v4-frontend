import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'
import Setting from './Setting'

const Notifications = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.preferences.notifications.title' defaultMessage='Notifications' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.preferences.notifications.description' defaultMessage='Get notified when you receive bitcoin.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Setting />
      </SettingComponent>
    </SettingContainer>
  )
}

export default Notifications
