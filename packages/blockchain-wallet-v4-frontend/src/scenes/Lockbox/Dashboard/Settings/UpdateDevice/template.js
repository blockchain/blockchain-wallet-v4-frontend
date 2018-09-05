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
  const { onStartUpdate } = props

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
            defaultMessage='Version 1.3 includes bug fixes blah blah'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='primary' onClick={onStartUpdate}>
          <FormattedMessage
            id='scenes.lockbox.settings.updatedevice.update'
            defaultMessage='Update Device'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default UpdateDevice
