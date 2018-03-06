import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

import Settings from './Settings'

const IPWhitelist = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.securitysettings.advancedsettings.ipwhitelist.title' defaultMessage='IP Whitelist' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.securitysettings.advancedsettings.ipwhitelist.description' defaultMessage='Allow login without email authentication from the following list of comma-separated IP addresses. Use % as a wildcard.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

export default IPWhitelist
