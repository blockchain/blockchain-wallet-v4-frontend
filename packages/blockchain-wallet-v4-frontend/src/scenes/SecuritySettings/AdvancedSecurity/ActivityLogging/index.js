import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const ActivityLogging = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.activitylogging.title' defaultMessage='Activity logging' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.activitylogging.description' defaultMessage='Record wallet activity and display it in your activity feed.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='secondary'>
          <FormattedMessage id='scenes.settings.activitylogging.enable' defaultMessage='Enable' />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default ActivityLogging
