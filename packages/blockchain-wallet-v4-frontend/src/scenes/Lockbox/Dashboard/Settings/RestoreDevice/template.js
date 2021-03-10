import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Icon, Link } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

const RestoreLockboxDevice = () => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.restorelockboxdevice.title'
            defaultMessage='Restore Lockbox Device'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.restorelockboxdevice.description'
            defaultMessage='Get step by step instructions to restore your device in our user guide'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Link
          href='https://support.blockchain.com/hc/en-us/articles/360018285872'
          target='_blank'
        >
          <Button nature='empty'>
            <Icon name='open-in-new-tab' size='20px' />
          </Button>
        </Link>
      </SettingComponent>
    </SettingContainer>
  )
}

export default RestoreLockboxDevice
