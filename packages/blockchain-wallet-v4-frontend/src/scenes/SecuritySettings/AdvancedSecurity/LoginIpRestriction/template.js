import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus } from 'components/Setting'

import Setting from './Setting'

const LoginIpRestriction = (props) => {
  const { ipLockOn } = props
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.info.iprestriction.title' defaultMessage='Login IP restriction' />
          <SettingStatus active={ipLockOn}>
            {ipLockOn
              ? <FormattedMessage id='scenes.security.iprestriction.enabled' defaultMessage='Enabled' />
              : <FormattedMessage id='scenes.security.iprestriction.disabled' defaultMessage='Disabled' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.iprestriction.description' defaultMessage='Only allow login from IP address in the whitelist.' />
          <FormattedMessage id='scenes.settings.iprestriction.description2' defaultMessage='If you do not have a static IP address, this may lock you out of your wallet.' />
          <FormattedMessage id='scenes.settings.iprestriction.description3' defaultMessage='If you have verified your email address, you will be notified of any suspicious login attempts.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Setting />
      </SettingComponent>
    </SettingContainer>
  )
}

export default LoginIpRestriction
