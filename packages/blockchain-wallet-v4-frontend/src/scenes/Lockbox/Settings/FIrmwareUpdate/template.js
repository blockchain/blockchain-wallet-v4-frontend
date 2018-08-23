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

const FirmwareUpdate = props => {
  const { onClick } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.firmwareupdate.title'
            defaultMessage='Firmware Update'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.firmwareupdate.description'
            defaultMessage='Version 1.3 includes bug fixes blah blah'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='primary' onClick={onClick}>
          <FormattedMessage
            id='scenes.lockbox.settings.firmwareupdate.update'
            defaultMessage='Update'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default FirmwareUpdate
