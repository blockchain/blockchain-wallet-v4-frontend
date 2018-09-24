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

const ExportXPub = props => {
  const { onClick } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.exportxpub.title'
            defaultMessage='Show xPub'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.exportxpub.description'
            defaultMessage='Reveal the Extended Public Key of your lockbox. (Advanced)'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='empty' onClick={onClick}>
          <FormattedMessage
            id='scenes.lockbox.settings.exportxpub.show'
            defaultMessage='Show xPub'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default ExportXPub
