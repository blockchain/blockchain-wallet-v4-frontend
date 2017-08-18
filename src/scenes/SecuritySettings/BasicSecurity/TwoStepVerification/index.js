import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const TwoStepVerification = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.2fa.title' defaultMessage='2-step verification' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.2fa.description' defaultMessage='Protect your wallet from unauthorized access by enabling 2-Step Verification.' />
          <FormattedMessage id='scenes.settings.2fa.description2' defaultMessage='You can choose to use a free app or your mobile phone number to secure your wallet.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button type='secondary'>
          <v id='scenes.settings.2fa.enable' defaultMessage='Enable' />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default TwoStepVerification
