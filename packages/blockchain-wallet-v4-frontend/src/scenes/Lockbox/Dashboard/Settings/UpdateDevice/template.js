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

const UpdateDevice = props => {
  const { onCheckForUpdates, isBrowserSupported } = props

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
        <Button
          nature='empty'
          onClick={onCheckForUpdates}
          disabled={!isBrowserSupported}
        >
          <FormattedMessage
            id='scenes.lockbox.settings.updatedevice.checkforupdate'
            defaultMessage='Check For Updates'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default UpdateDevice
