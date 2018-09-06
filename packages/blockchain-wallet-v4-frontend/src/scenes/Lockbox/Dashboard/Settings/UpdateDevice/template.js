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

const UpdateDevice = props => {
  const { onCheckForUpdates } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.updatedevice.title'
            defaultMessage='Firmware Update'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.updatedevice.description'
            defaultMessage='Check for firmware updates for your device'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='primary' onClick={onCheckForUpdates}>
          <FormattedMessage
            id='scenes.lockbox.settings.updatedevice.checkforupdates'
            defaultMessage='Check For Updates'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default UpdateDevice
