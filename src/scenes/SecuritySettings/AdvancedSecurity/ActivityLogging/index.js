import React from 'react'

import { SecondaryButton } from 'components/generic/Button'
import { Text } from 'components/generic/Text'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const ActivityLogging = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.settings.activitylogging.title' text='Activity logging' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.settings.activitylogging.description' text='Record wallet activity and display it in your activity feed.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SecondaryButton>
          <Text id='scenes.settings.activitylogging.enable' text='Enable' small light white />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default ActivityLogging
