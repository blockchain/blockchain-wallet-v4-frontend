import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

import { Button, Icon } from 'blockchain-info-components'

const AddDevice = props => {
  const { onClick } = props

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
            id='scenes.lockbox.settings.adddevice.description'
            defaultMessage='Get step by step instructions in our setup guide'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='empty' onClick={onClick}>
          <Icon name='open-in-new-tab' size='20px' />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default AddDevice
