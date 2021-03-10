import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingStatus,
  SettingSummary
} from 'components/Setting'

import Settings from './Settings'

const SecondPasswordWallet = props => {
  const { secondPasswordEnabled } = props
  if (!secondPasswordEnabled) return null
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.security.advanced.secondpassword.title'
            defaultMessage='Second Password'
          />
          <SettingStatus
            active={secondPasswordEnabled}
            data-e2e={`${secondPasswordEnabled}SecondPassword`}
          >
            {secondPasswordEnabled ? (
              <FormattedMessage
                id='scenes.security.advanced.secondpassword.enabled'
                defaultMessage='Enabled'
              />
            ) : (
              <FormattedMessage
                id='scenes.security.advanced.secondpassword.disabled'
                defaultMessage='Disabled'
              />
            )}
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.security.advanced.secondpassword.description'
            defaultMessage='For additional security, you can choose a second password that is asked whenever you want to spend funds.'
          />
          <FormattedMessage
            id='scenes.security.advanced.secondpassword.description2'
            defaultMessage='As with your main password, if you forget your second password, we cannot reset it for you.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default SecondPasswordWallet
