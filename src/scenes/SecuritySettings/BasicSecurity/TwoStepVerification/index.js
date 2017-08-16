import React from 'react'

import { SecondaryButton, Text } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const TwoStepVerification = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.settings.2fa.title' text='2-step verification' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.settings.2fa.description' text='Protect your wallet from unauthorized access by enabling 2-Step Verification.' altFont light />
          <Text id='scenes.settings.2fa.description2' text='You can choose to use a free app or your mobile phone number to secure your wallet.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <SecondaryButton>
          <Text id='scenes.settings.2fa.enable' text='Enable' small light white capitalize />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default TwoStepVerification
