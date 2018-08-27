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
            defaultMessage='Export xPub'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.exportxpub.description'
            defaultMessage='This copy tells you what this means'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='primary' onClick={onClick}>
          <FormattedMessage
            id='scenes.lockbox.settings.exportxpub.delete'
            defaultMessage='Export'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default ExportXPub
