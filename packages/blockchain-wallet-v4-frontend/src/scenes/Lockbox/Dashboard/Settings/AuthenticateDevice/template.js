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

const AuthenticateDevice = props => {
  const { isBrowserChrome, onStartCheck } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.authenticate.title'
            defaultMessage='Authenticate Device'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.authenticate.description'
            defaultMessage='Ensure your device is genuine, and not fraudulent or counterfeit'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button
          nature='empty'
          onClick={onStartCheck}
          disabled={!isBrowserChrome}
        >
          <FormattedMessage
            id='scenes.lockbox.settings.authenticate.start'
            defaultMessage='Authenticate'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default AuthenticateDevice
