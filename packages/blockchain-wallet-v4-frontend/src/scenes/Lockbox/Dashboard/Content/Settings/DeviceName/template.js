import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

import Settings from './Settings/index'

const RenameDevice = props => {
  const { deviceName, deviceId } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.devicename.title'
            defaultMessage='Device Name'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.devicename.description'
            defaultMessage='{deviceName}'
            values={{ deviceName }}
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings deviceId={deviceId} />
      </SettingComponent>
    </SettingContainer>
  )
}

export default RenameDevice
