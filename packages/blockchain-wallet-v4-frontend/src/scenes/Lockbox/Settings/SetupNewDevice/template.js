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

const SetupNewDevice = props => {
  const { onClick } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.setupnewdevice.title'
            defaultMessage='Setup New Device'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.setupnewdevice.description'
            defaultMessage='Get step by step instructions in our setup guide'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='primary' onClick={onClick}>
          <FormattedMessage
            id='scenes.lockbox.settings.setupnewdevice.setup'
            defaultMessage='ICON'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default SetupNewDevice
