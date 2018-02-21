import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus, SettingWrapper } from 'components/Setting'
import { Button } from 'blockchain-info-components'

const LoginIpRestriction = (props) => {
  const { ipLockOn, handleClick } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.securitysettings.advancedsettings.loginiprestriction.title' defaultMessage='Login IP restriction' />
          <SettingStatus active={ipLockOn}>
            {ipLockOn
              ? <FormattedMessage id='scenes.securitysettings.advancedsettings.loginiprestriction.enabled' defaultMessage='Enabled' />
              : <FormattedMessage id='scenes.securitysettings.advancedsettings.loginiprestriction.disabled' defaultMessage='Disabled' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.securitysettings.advancedsettings.loginiprestriction.description' defaultMessage='Only allow login from IP address in the whitelist.' />
          <FormattedMessage id='scenes.securitysettings.advancedsettings.loginiprestriction.description2' defaultMessage='If you do not have a static IP address, this may lock you out of your wallet.' />
          <FormattedMessage id='scenes.securitysettings.advancedsettings.loginiprestriction.description3' defaultMessage='If you have verified your email address, you will be notified of any suspicious login attempts.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SettingWrapper>
          <Button nature='primary' onClick={handleClick}>
            {ipLockOn
              ? <FormattedMessage id='scenes.securitysettings.advancedsettings.loginiprestriction.settings.disable' defaultMessage='Disable' />
              : <FormattedMessage id='scenes.securitysettings.advancedsettings.loginiprestriction.settings.enable' defaultMessage='Enable' />
            }
          </Button>
        </SettingWrapper>
      </SettingComponent>
    </SettingContainer>
  )
}

export default LoginIpRestriction
