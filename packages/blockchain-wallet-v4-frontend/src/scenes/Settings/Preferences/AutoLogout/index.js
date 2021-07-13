import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

import Settings from './Settings'

const AutoLogout = () => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.preferences.autologout.title'
            defaultMessage='Auto Logout'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.preferences.autologout.description'
            defaultMessage='After a certain period of inactivity, you will be automatically logged out of your wallet.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default AutoLogout
