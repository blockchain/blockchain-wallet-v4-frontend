import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus } from 'components/Setting'

import Settings from './Settings'

const ActivityLogging = (props) => {
  const { activityLoggingEnabled } = props
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.securitysettings.advancedsecurity.activitylogging.title' defaultMessage='Activity logging' />
          <SettingStatus active={activityLoggingEnabled}>
            {activityLoggingEnabled
              ? <FormattedMessage id='scenes.securitysettings.advancedsecurity.activitylogging.enabled' defaultMessage='Enabled' />
              : <FormattedMessage id='scenes.securitysettings.advancedsecurity.activitylogging.disabled' defaultMessage='Disabled' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.securitysettings.advancedsecurity.activitylogging.description' defaultMessage='Record wallet activity and display it in your activity feed.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default ActivityLogging
