import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus, SettingWrapper } from 'components/Setting'
import { Button } from 'blockchain-info-components'

const ActivityLogging = (props) => {
  const { handleClick, logging } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.securitysettings.advancedsecurity.activitylogging.title' defaultMessage='Activity Logging' />
          <SettingStatus active={logging}>
            {logging
              ? <FormattedMessage id='scenes.securitysettings.advancedsecurity.activitylogging.enabled' defaultMessage='Enabled' />
              : <FormattedMessage id='scenes.securitysettings.advancedsecurity.activitylogging.disabled' defaultMessage='Disabled' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.securitysettings.advancedsecurity.activitylogging.description' defaultMessage='Enable for all your wallet activity to be displayed in your dashboard&apos;s activity feed.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SettingWrapper>
          <Button nature='primary' onClick={handleClick}>
            {logging
              ? <FormattedMessage id='scenes.securitysettings.advancedsecurity.activitylogging.settings.disable' defaultMessage='Disable' />
              : <FormattedMessage id='scenes.securitysettings.advancedsecurity.activitylogging..settings.enable' defaultMessage='Enable' />
            }
          </Button>
        </SettingWrapper>
      </SettingComponent>
    </SettingContainer>
  )
}

export default ActivityLogging
