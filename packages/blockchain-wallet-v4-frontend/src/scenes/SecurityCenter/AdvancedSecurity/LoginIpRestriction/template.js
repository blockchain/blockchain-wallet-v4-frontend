import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingStatus,
  SettingSummary,
  SettingWrapper
} from 'components/Setting'

const LoginIpRestriction = props => {
  const { handleClick, ipLockOn } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.securitycenter.advanced.loginiprestriction.title'
            defaultMessage='Login IP Restriction'
          />
          <SettingStatus active={ipLockOn}>
            {ipLockOn ? (
              <FormattedMessage
                id='scenes.securitycenter.advanced.loginiprestriction.enabled'
                defaultMessage='Enabled'
              />
            ) : (
              <FormattedMessage
                id='scenes.securitycenter.advanced.loginiprestriction.disabled'
                defaultMessage='Disabled'
              />
            )}
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.securitycenter.advanced.loginiprestriction.description.part1'
            defaultMessage='Only allow login from IP address in your IP whitelist.'
          />
          <FormattedMessage
            id='scenes.securitycenter.advanced.loginiprestriction.description.part2'
            defaultMessage='If you do not have a static IP address, this may lock you out of your wallet.'
          />
          <FormattedMessage
            id='scenes.securitycenter.advanced.loginiprestriction.description.part3'
            defaultMessage='If you have verified your email address, you will be notified of any suspicious login attempts.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SettingWrapper>
          <Button nature='primary' onClick={handleClick}>
            {ipLockOn ? (
              <FormattedMessage
                id='scenes.securitycenter.advanced.loginiprestriction.disable'
                defaultMessage='Disable'
              />
            ) : (
              <FormattedMessage
                id='scenes.securitycenter.advanced.loginiprestriction.enable'
                defaultMessage='Enable'
              />
            )}
          </Button>
        </SettingWrapper>
      </SettingComponent>
    </SettingContainer>
  )
}

export default LoginIpRestriction
