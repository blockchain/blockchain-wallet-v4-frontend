import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const TwoStepVerificationRemember = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.2faremember.title' defaultMessage='Remember 2-step verification' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.2faremember.description' defaultMessage='Your browser will be remembered for a short period of time, allowing you to login again without having to re-authenticate.' />
          <FormattedMessage id='scenes.settings.2faremember.description2' defaultMessage='Disable this to require full authentication every time you login. This will not affect your current browser until you delete all cookies.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button type='secondary'>
          <FormattedMessage id='scenes.settings.2faremember.enable' defaultMessage='Enable' />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default TwoStepVerificationRemember
