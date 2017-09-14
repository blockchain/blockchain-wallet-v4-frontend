import React from 'react'
import { FormattedMessage } from 'react-intl'

import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus } from 'components/Setting'
import Setting from './Setting'

const TwoStepVerification = (props) => {
  const { isTwoStepVerificationEnabled } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.2fa.title' defaultMessage='2-step verification' />
          <SettingStatus active={isTwoStepVerificationEnabled}>
            { isTwoStepVerificationEnabled
              ? <FormattedMessage id='scenes.security.2fa.enabled' defaultMessage='Enabled' />
              : <FormattedMessage id='scenes.security.2fa.disabled' defaultMessage='Disabled' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.2fa.description' defaultMessage='Protect your wallet from unauthorized access by enabling 2-Step Verification.' />
          <FormattedMessage id='scenes.settings.2fa.description2' defaultMessage='You can choose to use a free app or your mobile phone number to secure your wallet.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Setting />
      </SettingComponent>
    </SettingContainer>
  )
}

export default TwoStepVerification
