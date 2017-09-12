import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

import Setting from './Setting'

const IPWhitelist = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.whitelist.title' defaultMessage='IP Whitelist' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.whitelist.description' defaultMessage='Allow login without email authentication from the following list of comma-separated IP addresses. Use % as a wildcard.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Setting />
      </SettingComponent>
    </SettingContainer>
  )
}

export default IPWhitelist
