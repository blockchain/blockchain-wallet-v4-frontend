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

const AddDevice = props => {
  const { onClick, isBrowserChrome } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.adddevice.title'
            defaultMessage='Setup New Device'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.adddevice.desc'
            defaultMessage='Add another Lockbox device to your wallet'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='empty' onClick={onClick} disabled={!isBrowserChrome}>
          <FormattedMessage
            id='scenes.lockbox.settings.adddevice.add'
            defaultMessage='Add Device'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default AddDevice
