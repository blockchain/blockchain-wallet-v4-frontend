import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus } from 'components/Setting'
import Settings from './Settings'

const TwoStepVerification = (props) => {
  const { authType } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.title' defaultMessage='2-step verification' />
          <SettingStatus active={authType !== 0}>
            { authType === 0
              ? <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.disabled' defaultMessage='Disabled' />
              : <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.enabled' defaultMessage='Enabled' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.description' defaultMessage='Protect your wallet from unauthorized access by enabling 2-Step Verification.' />
          <FormattedMessage id='scenes.securitysettings.basicsecurity.twostepverification.description2' defaultMessage='You can choose to use a free app or your mobile phone number to secure your wallet.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

TwoStepVerification.propTypes = {
  authType: PropTypes.number.isRequired
}

export default TwoStepVerification
