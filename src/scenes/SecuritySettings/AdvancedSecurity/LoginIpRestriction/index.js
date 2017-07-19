import React from 'react'

import { SecondaryButton } from 'components/generic/Button'
import { Text } from 'components/generic/Text'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const LoginIpRestriction = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.info.iprestriction.title' text='Login IP restriction' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.settings.iprestriction.description' text='Only allow login from IP address in the whitelist.' altFont light />
          <Text id='scenes.settings.iprestriction.description2' text='If you do not have a static IP address, this may lock you out of your wallet.' altFont light />
          <Text id='scenes.settings.iprestriction.description3' text='If you have verified your email address, you will be notified of any suspicious login attempts.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SecondaryButton>
          <Text id='scenes.info.iprestriction.enable' text='Enable' small light white />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default LoginIpRestriction
