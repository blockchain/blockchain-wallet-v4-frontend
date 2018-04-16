import React from 'react'
import { FormattedMessage } from 'react-intl'

import { FlatLoader } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const MobileNumber = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.preferences.mobile.title' defaultMessage='Mobile Number' />
          <FlatLoader width='50px' height='14px' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.preferences.mobile.description' defaultMessage='Your mobile phone can be used to enable two-factor authentication,' />
          <FormattedMessage id='scenes.preferences.mobile.description' defaultMessage='helping to secure your wallet from unauthorized access,' />
          <FormattedMessage id='scenes.preferences.mobile.description' defaultMessage='and to send bitcoin payment alerts when you receive funds.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <FlatLoader width='50px' height='14px' />
      </SettingComponent>
    </SettingContainer>
  )
}

export default MobileNumber
