import React from 'react'

import { SecondaryButton, Text } from 'blockchain-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const TwoStepVerificationRemember = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.settings.2faremember.title' text='Remember 2-step verification' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.settings.2faremember.description' text='Your browser will be remembered for a short period of time, allowing you to login again without having to re-authenticate.' altFont light />
          <Text id='scenes.settings.2faremember.description2' text='Disable this to require full authentication every time you login. This will not affect your current browser until you delete all cookies.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SecondaryButton>
          <Text id='scenes.settings.2faremember.enable' text='Enable' small light white capitalize />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default TwoStepVerificationRemember
