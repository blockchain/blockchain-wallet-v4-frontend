import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus } from 'components/Setting'

import Setting from './Setting'

const ActivityLogging = (props) => {
  const { activityLoggingEnabled } = props
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.activitylogging.title' defaultMessage='Activity logging' />
          <SettingStatus active={activityLoggingEnabled}>
            {activityLoggingEnabled
              ? <FormattedMessage id='scenes.security.activitylogging.enabled' defaultMessage='Enabled' />
              : <FormattedMessage id='scenes.security.activitylogging.disabled' defaultMessage='Disabled' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.activitylogging.description' defaultMessage='Record wallet activity and display it in your activity feed.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Setting />
      </SettingComponent>
    </SettingContainer>
  )
}

export default ActivityLogging
