import React from 'react'

import { SecondaryButton } from 'components/generic/Button'
import { Text } from 'components/generic/Text'
import { Typography } from 'components/generic/Typography'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const AutoLogout = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.preferences.autologout.title' text='Auto logout' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.preferences.autologout.description' text='After a certain period of inactivity, you will be automatically logged out of your wallet.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Typography>10 minutes</Typography>
        <SecondaryButton>
          <Text id='scenes.preferences.autologout.change' text='change' small light white />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default AutoLogout
