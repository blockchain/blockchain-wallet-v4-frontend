import { Button } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import React from 'react'

const DeviceStatus = props => {
  const { deleteDevice, deviceName } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.removedevice.title'
            defaultMessage='Remove Device'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.removedevice.description'
            defaultMessage='Remove {deviceName} from your Blockchain web wallet'
            values={{ deviceName }}
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='sent' onClick={deleteDevice}>
          <FormattedMessage
            id='scenes.lockbox.settings.removedevice.remove'
            defaultMessage='Remove Device'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default DeviceStatus
