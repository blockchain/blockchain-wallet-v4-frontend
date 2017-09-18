import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus } from 'components/Setting'
import Setting from './Setting'

const TwoStepVerificationRemember = (props) => {
  const { authTypeNeverSave } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.2faremember.title' defaultMessage='Remember 2-step verification' />
          <SettingStatus active={authTypeNeverSave === 0}>
            { authTypeNeverSave === 0
              ? <FormattedMessage id='scenes.security.2faremember.enabled' defaultMessage='Enabled' />
              : <FormattedMessage id='scenes.security.2faremember.disabled' defaultMessage='Disabled' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.2faremember.description' defaultMessage='Your browser will be remembered for a short period of time, allowing you to login again without having to re-authenticate.' />
          <FormattedMessage id='scenes.settings.2faremember.description2' defaultMessage='Disable this to require full authentication every time you login. This will not affect your current browser until you delete all cookies.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Setting />
      </SettingComponent>
    </SettingContainer>
  )
}

TwoStepVerificationRemember.propTypes = {
  authTypeNeverSave: PropTypes.number.isRequired
}

export default TwoStepVerificationRemember
