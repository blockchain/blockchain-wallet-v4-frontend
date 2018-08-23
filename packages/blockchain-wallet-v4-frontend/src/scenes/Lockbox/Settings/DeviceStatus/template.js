import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

import { Button } from 'blockchain-info-components'

const DeviceStatus = props => {
  const { onDeleteClicked, deviceName } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.devicestatus.title'
            defaultMessage='Device Status'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.devicestatus.description'
            defaultMessage='{deviceName} is paired to your Blockchain web wallet'
            values={{ deviceName }}
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='primary' onClick={onDeleteClicked}>
          <FormattedMessage
            id='scenes.lockbox.settings.devicestatus.delete'
            defaultMessage='Delete'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default DeviceStatus
