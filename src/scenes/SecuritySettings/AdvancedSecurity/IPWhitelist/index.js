import React from 'react'

import { SecondaryButton } from 'components/generic/Button'
import { Text } from 'components/generic/Text'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const IPWhitelist = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.settings.whitelist.title' text='IP Whitelist' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.settings.whitelist.description' text='Allow login without email authentication from the following list of comma-separated IP addresses. Use % as a wildcard.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SecondaryButton>
          <Text id='scenes.settings.whitelist.change' text='Change' small light white />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default IPWhitelist
