import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingStatus,
  SettingSummary
} from 'components/Setting'

import Settings from './Settings'

const MobileNumber = (props) => {
  const { data } = props
  const { authType, smsNumber, smsVerified } = data
  const isVerified = smsVerified === 1

  return (
    <SettingContainer data-e2e='prefsMobileNumber'>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.preferences.mobile.title'
            defaultMessage='Mobile Number'
          />
          <SettingStatus active={isVerified}>
            {isVerified ? (
              <FormattedMessage
                id='scenes.settings.preferences.mobile.verified'
                defaultMessage='Verified'
              />
            ) : (
              <FormattedMessage
                id='scenes.settings.preferences.mobile.unverified'
                defaultMessage='Unverified'
              />
            )}
          </SettingStatus>
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.settings.preferences.mobile.description1'
            defaultMessage='Your mobile phone can be used to enable two-factor authentication,'
          />
          <FormattedMessage
            id='scenes.settings.preferences.mobile.description2'
            defaultMessage='helping to secure your wallet from unauthorized access,'
          />
          <FormattedMessage
            id='scenes.settings.preferences.mobile.description3'
            defaultMessage='and to send bitcoin payment alerts when you receive funds.'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Settings smsNumber={smsNumber} smsVerified={smsVerified} authType={authType} />
      </SettingComponent>
    </SettingContainer>
  )
}

export default MobileNumber
