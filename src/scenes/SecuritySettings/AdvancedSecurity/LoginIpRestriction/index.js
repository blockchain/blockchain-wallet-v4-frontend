import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const LoginIpRestriction = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.info.iprestriction.title' defaultMessage='Login IP restriction' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.iprestriction.description' defaultMessage='Only allow login from IP address in the whitelist.' />
          <FormattedMessage id='scenes.settings.iprestriction.description2' defaultMessage='If you do not have a static IP address, this may lock you out of your wallet.' />
          <FormattedMessage id='scenes.settings.iprestriction.description3' defaultMessage='If you have verified your email address, you will be notified of any suspicious login attempts.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='secondary'>
          <FormattedMessage id='scenes.info.iprestriction.enable' defaultMessage='Enable' />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default LoginIpRestriction
