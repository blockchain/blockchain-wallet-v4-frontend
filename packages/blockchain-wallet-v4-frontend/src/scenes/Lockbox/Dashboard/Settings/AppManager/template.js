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
  const { onInstallClick, isBrowserChrome } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.appmanager.title'
            defaultMessage='Manage Apps'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.appmanager.description'
            defaultMessage='Add, remove and update to the latest versions of the Lockbox applications'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button
          nature='empty'
          onClick={onInstallClick}
          disabled={!isBrowserChrome}
        >
          <FormattedMessage
            id='scenes.lockbox.settings.appmanager.manageapps'
            defaultMessage='Manage Apps'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default ReinstallApps
