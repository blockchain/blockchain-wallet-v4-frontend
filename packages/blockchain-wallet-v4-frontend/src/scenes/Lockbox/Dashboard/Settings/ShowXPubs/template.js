import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

const ShowXPubs = props => {
  const { onShowXPubs } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.showxpubs.title'
            defaultMessage='Show xPubs'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.showxpubs.description'
            defaultMessage='Display the Extended Public Keys (xPubs) of your device'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='empty' onClick={onShowXPubs}>
          <FormattedMessage
            id='scenes.lockbox.settings.showxpubs.show'
            defaultMessage='Show xPubs'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default ShowXPubs
