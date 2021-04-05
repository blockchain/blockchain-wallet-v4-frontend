import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingStatus,
  SettingSummary
} from 'components/Setting'

import Settings from './Settings'

const TwoStepVerificationRemember = props => {
  const { authTypeNeverSave } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.securitysettings.basicsecurity.twostepverification.title'
            defaultMessage='Remember Two-Step Verification'
          />
          <SettingStatus active={authTypeNeverSave === 0}>
            {authTypeNeverSave === 0 ? (
              <FormattedMessage
                id='scenes.securitysettings.basicsecurity.twostepverification.enabled'
                defaultMessage='Enabled'
              />
            ) : (
              <FormattedMessage
                id='scenes.securitysettings.basicsecurity.twostepverification.disabled'
                defaultMessage='Disabled'
              />
            )}
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.securitysettings.basicsecurity.twostepverification.description'
            defaultMessage='Your browser will be remembered for a short period of time, allowing you to login again without having to re-authenticate.'
          />
          <FormattedMessage
            id='scenes.securitysettings.basicsecurity.twostepverification.description2'
            defaultMessage='Disable this to require full authentication every time you login. This will not affect your current browser until you delete all cookies.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

TwoStepVerificationRemember.propTypes = {
  authTypeNeverSave: PropTypes.number.isRequired
}

export default TwoStepVerificationRemember
