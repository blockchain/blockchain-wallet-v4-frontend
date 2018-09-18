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

const ReinstallApps = props => {
  const { onInstallClick } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.installapps.title'
            defaultMessage='Install Apps'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.installapps.description'
            defaultMessage='Install the latest versions of the Bitcoin, Bitcoin Cash and Ethereum apps'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='empty' onClick={onInstallClick}>
          <FormattedMessage
            id='scenes.lockbox.settings.installapps.install'
            defaultMessage='install'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default ReinstallApps
