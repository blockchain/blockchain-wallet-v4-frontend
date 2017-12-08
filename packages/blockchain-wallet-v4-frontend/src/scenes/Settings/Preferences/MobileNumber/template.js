import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary, SettingStatus } from 'components/Setting'
import Settings from './Settings'

const MobileNumber = (props) => {
  const { smsVerified } = props
  const isVerified = smsVerified === 1

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.preferences.mobile.title' defaultMessage='Mobile number' />
          <SettingStatus active={isVerified}>
            { isVerified
              ? <FormattedMessage id='scenes.preferences.mobile.verified' defaultMessage='Verified' />
              : <FormattedMessage id='scenes.preferences.mobile.unverified' defaultMessage='Unverified' />
            }
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.preferences.mobile.description' defaultMessage='Your mobile phone can be used to enable two-factor authentication,' />
          <FormattedMessage id='scenes.preferences.mobile.description' defaultMessage='helping to secure your wallet from unauthorized access,' />
          <FormattedMessage id='scenes.preferences.mobile.description' defaultMessage='and to send bitcoin payment alerts when you receive funds.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings />
      </SettingComponent>
    </SettingContainer>
  )
}

MobileNumber.propTypes = {
  smsVerified: PropTypes.number.isRequired
}

export default MobileNumber
