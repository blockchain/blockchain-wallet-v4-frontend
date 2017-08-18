import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

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
        <Button type='secondary'>
          <FormattedMessage id='scenes.settings.whitelist.change' defaultMessage='Change' />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default IPWhitelist
